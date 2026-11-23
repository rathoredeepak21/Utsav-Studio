import { AudioTrackConfig } from '@/types/videoEditor';
import { getAudioTrackById } from '@/lib/storage/db';

// Singleton AudioContext for browser preview playback
let sharedAudioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let currentGainNode: GainNode | null = null;
let playbackGeneration = 0; // Guard against async race conditions

// Active in-memory decoded AudioBuffer cache
const decodedBuffers = new Map<string, AudioBuffer>();

/**
 * Returns or initializes the shared AudioContext.
 * Automatically handles browser user-gesture / autoplay unlock.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Generate synthetic ceremonial Indian ambient harmony (Sa-Pa drone & temple bells)
 * Used ONLY when user explicitly chooses a ceremonial synth preset.
 */
export function generateCeremonialSynthBuffer(
  preset: AudioTrackConfig['synthPreset'] = 'shehnai_sitar',
  duration = 20,
  sampleRate = 44100
): AudioBuffer {
  const ctx =
    getAudioContext() ||
    new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const numFrames = Math.floor(sampleRate * Math.max(5, duration));
  const buffer = ctx.createBuffer(2, numFrames, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let f1 = 138.59; // Sa (C#3)
  let f2 = 207.65; // Pa (G#3)
  let f3 = 277.18; // Sa octave (C#4)
  let f4 = 370.0;  // Ma / Sitar note

  if (preset === 'royal_dhol') {
    f1 = 110.0;
    f2 = 164.81;
    f3 = 220.0;
    f4 = 329.63;
  } else if (preset === 'sacred_flute') {
    f1 = 293.66;
    f2 = 440.0;
    f3 = 587.33;
    f4 = 659.25;
  } else if (preset === 'celebration') {
    f1 = 261.63;
    f2 = 329.63;
    f3 = 392.0;
    f4 = 523.25;
  }

  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;
    const lfo1 = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.25 * t);
    const lfo2 = 0.5 + 0.5 * Math.cos(2 * Math.PI * 0.35 * t);

    const osc1 = Math.sin(2 * Math.PI * f1 * t) * 0.32 * lfo1;
    const osc2 = Math.sin(2 * Math.PI * f2 * t) * 0.22 * lfo2;
    const osc3 = Math.sin(2 * Math.PI * f3 * t) * 0.14;
    const osc4 = Math.sin(2 * Math.PI * f4 * t) * 0.08;

    // Temple chime every 4 seconds
    const chimePeriod = 4.0;
    const chimeTime = t % chimePeriod;
    let chime = 0;
    if (chimeTime < 1.5) {
      const decay = Math.exp(-chimeTime * 3.5);
      chime =
        (Math.sin(2 * Math.PI * 1108 * chimeTime) +
          0.35 * Math.sin(2 * Math.PI * 2216 * chimeTime)) *
        decay *
        0.15;
    }

    const sample = (osc1 + osc2 + osc3 + osc4 + chime) * 0.6;
    left[i] = sample * (0.9 + 0.1 * Math.sin(2 * Math.PI * 0.1 * t));
    right[i] = sample * (0.9 + 0.1 * Math.cos(2 * Math.PI * 0.1 * t));
  }

  return buffer;
}

/**
 * Decode an audio Blob or File directly into an AudioBuffer.
 * Handles MP3, WAV, AAC, M4A, OGG using native browser AudioContext.
 */
export async function decodeAudioBlob(blob: Blob): Promise<AudioBuffer> {
  const ctx = getAudioContext();
  if (!ctx) throw new Error('AudioContext is not supported on this platform');
  const arrayBuffer = await blob.arrayBuffer();
  // decodeAudioData consumes the arrayBuffer
  return ctx.decodeAudioData(arrayBuffer);
}

/**
 * Cache an AudioBuffer directly (e.g. right after user uploads a song)
 */
export function cacheAudioBuffer(key: string, buffer: AudioBuffer) {
  decodedBuffers.set(key, buffer);
}

/**
 * Remove an AudioBuffer from cache
 */
export function evictAudioBuffer(key: string) {
  decodedBuffers.delete(key);
}

/**
 * Loads and decodes the exact AudioBuffer for the given AudioTrackConfig.
 * Checks memory cache -> IndexedDB blob -> URL fetch -> Synth preset.
 */
export async function getAudioTrackBuffer(
  config: AudioTrackConfig,
  totalDuration: number
): Promise<AudioBuffer> {
  // 1. Check in-memory decoded buffer cache
  if (decodedBuffers.has(config.id)) {
    return decodedBuffers.get(config.id)!;
  }

  // 2. Synthetic ceremonial preset
  if (config.isSynth || config.src === 'synth') {
    const synthBuf = generateCeremonialSynthBuffer(
      config.synthPreset,
      Math.max(10, totalDuration + 2)
    );
    decodedBuffers.set(config.id, synthBuf);
    return synthBuf;
  }

  // 3. User uploaded file: Attempt reading blob from IndexedDB first
  if (config.blobId || config.id) {
    try {
      const stored = await getAudioTrackById(config.blobId || config.id);
      if (stored && stored.blob) {
        const decoded = await decodeAudioBlob(stored.blob);
        decodedBuffers.set(config.id, decoded);
        return decoded;
      }
    } catch (e) {
      console.warn('IndexedDB audio lookup error:', e);
    }
  }

  // 4. Fetch from src URL (blob: or http: or local path)
  if (config.src && config.src.startsWith('blob:')) {
    const resp = await fetch(config.src);
    const blob = await resp.blob();
    const decoded = await decodeAudioBlob(blob);
    decodedBuffers.set(config.id, decoded);
    return decoded;
  }

  // 5. Fallback fetch
  const resp = await fetch(config.src);
  const blob = await resp.blob();
  const decoded = await decodeAudioBlob(blob);
  decodedBuffers.set(config.id, decoded);
  return decoded;
}

/**
 * Completely stop any current audio preview playback and disconnect nodes.
 */
export function stopAudioPlayback() {
  playbackGeneration++; // Invalidate any pending in-flight start operations
  if (currentSourceNode) {
    try {
      currentSourceNode.stop(0);
      currentSourceNode.disconnect();
    } catch {
      // Ignore if node was already stopped
    }
    currentSourceNode = null;
  }
  if (currentGainNode) {
    try {
      currentGainNode.disconnect();
    } catch {
      // Ignore
    }
    currentGainNode = null;
  }
}

/**
 * Start synchronized audio preview playback from specific timeline seconds.
 * Strictly uses the exact AudioTrackConfig provided; prevents overlapping nodes.
 */
export async function startAudioPlayback(
  config: AudioTrackConfig | null,
  currentTime: number,
  totalDuration: number
) {
  // Always stop previous source first
  stopAudioPlayback();

  if (!config || config.isMuted || config.volume <= 0) {
    return;
  }

  const thisGeneration = playbackGeneration;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const buffer = await getAudioTrackBuffer(config, totalDuration);

    // If another play/stop was requested while decoding, abort immediately
    if (thisGeneration !== playbackGeneration) {
      return;
    }

    if (!buffer) return;

    // Calculate start offset inside the audio buffer
    const trackStart = config.startTime || 0;
    if (currentTime < trackStart) {
      return;
    }

    const elapsedInTrack = currentTime - trackStart;
    const bufferOffset = (config.trimStart || 0) + elapsedInTrack;

    if (bufferOffset >= buffer.duration) {
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    const targetVolume = Math.max(0, Math.min(1, config.volume));

    // Handle fade-in
    if (config.fadeInDuration && config.fadeInDuration > 0 && elapsedInTrack < config.fadeInDuration) {
      const remainingFade = config.fadeInDuration - elapsedInTrack;
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + remainingFade);
    } else {
      gain.gain.setValueAtTime(targetVolume, ctx.currentTime);
    }

    source.connect(gain);
    gain.connect(ctx.destination);

    currentSourceNode = source;
    currentGainNode = gain;

    source.onended = () => {
      if (currentSourceNode === source) {
        currentSourceNode = null;
        currentGainNode = null;
      }
    };

    source.start(0, bufferOffset);
  } catch (err) {
    console.error('Failed to start audio playback for uploaded song:', err);
  }
}

/**
 * Update playback volume dynamically without restarting source
 */
export function setAudioPlaybackVolume(volume: number) {
  if (currentGainNode && sharedAudioCtx) {
    const clamped = Math.max(0, Math.min(1, volume));
    currentGainNode.gain.setValueAtTime(clamped, sharedAudioCtx.currentTime);
  }
}
