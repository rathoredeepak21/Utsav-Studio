import { AudioTrackConfig } from '@/types/videoEditor';

let sharedAudioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let currentGainNode: GainNode | null = null;
let audioBufferCache = new Map<string, AudioBuffer>();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

/**
 * Generate synthetic Indian ceremonial sacred audio buffer (Tanpura/Shehnai chord harmony with temple bell)
 */
export function generateCeremonialSynthBuffer(
  preset: AudioTrackConfig['synthPreset'] = 'shehnai_sitar',
  duration = 20,
  sampleRate = 44100
): AudioBuffer {
  const ctx = getAudioContext() || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const numFrames = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(2, numFrames, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Fundamental frequencies for sacred Ragas (Sa-Pa drone: C#3 = 138.59Hz, G#3 = 207.65Hz, C#4 = 277.18Hz)
  let f1 = 138.59; // Sa
  let f2 = 207.65; // Pa
  let f3 = 277.18; // Sa octave
  let f4 = 370.0;  // Ma / Sitar note

  if (preset === 'royal_dhol') {
    f1 = 110.0;
    f2 = 164.81;
    f3 = 220.0;
    f4 = 329.63;
  } else if (preset === 'sacred_flute') {
    f1 = 293.66; // D4
    f2 = 440.0;  // A4
    f3 = 587.33; // D5
    f4 = 659.25; // E5
  } else if (preset === 'celebration') {
    f1 = 261.63; // C4
    f2 = 329.63; // E4
    f3 = 392.0;  // G4
    f4 = 523.25; // C5
  }

  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;

    // Harmonic Tanpura slow undulating drone
    const lfo1 = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.25 * t);
    const lfo2 = 0.5 + 0.5 * Math.cos(2 * Math.PI * 0.35 * t);

    // Warm harmonics
    const osc1 = Math.sin(2 * Math.PI * f1 * t) * 0.35 * lfo1;
    const osc2 = Math.sin(2 * Math.PI * f2 * t) * 0.25 * lfo2;
    const osc3 = Math.sin(2 * Math.PI * f3 * t) * 0.15;
    const osc4 = Math.sin(2 * Math.PI * f4 * t) * 0.1 * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.5 * t));

    // Subtle ceremonial temple chime every 4 seconds
    const chimePeriod = 4.0;
    const chimeTime = t % chimePeriod;
    let chime = 0;
    if (chimeTime < 1.5) {
      const chimeDecay = Math.exp(-chimeTime * 3.5);
      chime = (Math.sin(2 * Math.PI * 1108 * chimeTime) + 0.4 * Math.sin(2 * Math.PI * 2216 * chimeTime)) * chimeDecay * 0.18;
    }

    const sample = (osc1 + osc2 + osc3 + osc4 + chime) * 0.6;

    // Slight stereo widening
    left[i] = sample * (0.9 + 0.1 * Math.sin(2 * Math.PI * 0.1 * t));
    right[i] = sample * (0.9 + 0.1 * Math.cos(2 * Math.PI * 0.1 * t));
  }

  return buffer;
}

/**
 * Decode an uploaded audio file (Blob / ArrayBuffer) into an AudioBuffer
 */
export async function decodeAudioBlob(blob: Blob): Promise<AudioBuffer> {
  const ctx = getAudioContext();
  if (!ctx) throw new Error('AudioContext not available');
  const arrayBuffer = await blob.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
}

/**
 * Get or render audio buffer for a given AudioTrackConfig
 */
export async function getAudioTrackBuffer(
  config: AudioTrackConfig,
  totalDuration: number
): Promise<AudioBuffer> {
  const cacheKey = `${config.id}-${config.isSynth ? config.synthPreset : config.src}-${totalDuration}`;
  if (audioBufferCache.has(cacheKey)) {
    return audioBufferCache.get(cacheKey)!;
  }

  let buffer: AudioBuffer;

  if (config.isSynth || config.src === 'synth') {
    buffer = generateCeremonialSynthBuffer(config.synthPreset, Math.max(10, totalDuration + 2));
  } else {
    // If it's a blob url or web url
    const resp = await fetch(config.src);
    const blob = await resp.blob();
    buffer = await decodeAudioBlob(blob);
  }

  audioBufferCache.set(cacheKey, buffer);
  return buffer;
}

/**
 * Stop live playback
 */
export function stopAudioPlayback() {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
      currentSourceNode.disconnect();
    } catch {
      // Ignore if already stopped
    }
    currentSourceNode = null;
  }
}

/**
 * Start synchronized live audio playback from specific timeline seconds
 */
export async function startAudioPlayback(
  config: AudioTrackConfig | null,
  currentTime: number,
  totalDuration: number
) {
  stopAudioPlayback();
  if (!config || config.isMuted || config.volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const buffer = await getAudioTrackBuffer(config, totalDuration);
    if (!buffer) return;

    // Calculate offset inside the audio buffer
    const trackStart = config.startTime || 0;
    if (currentTime < trackStart) {
      // Audio hasn't started yet
      return;
    }

    const elapsedInTrack = currentTime - trackStart;
    const bufferOffset = (config.trimStart || 0) + elapsedInTrack;

    if (bufferOffset >= buffer.duration) {
      // Past audio duration
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.value = config.volume;

    source.connect(gain);
    gain.connect(ctx.destination);

    currentSourceNode = source;
    currentGainNode = gain;

    source.start(0, bufferOffset);
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Set current audio playback volume
 */
export function setAudioPlaybackVolume(volume: number) {
  if (currentGainNode) {
    currentGainNode.gain.value = Math.max(0, Math.min(1, volume));
  }
}
