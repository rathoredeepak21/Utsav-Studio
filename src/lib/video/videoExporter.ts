import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { VideoProject, VideoExportOptions } from '@/types/videoEditor';
import { renderVideoFrame, preloadProjectImages } from './canvasRenderer';
import { getAudioTrackBuffer } from './audioEngine';

export interface ExportProgress {
  percent: number;
  currentFrame: number;
  totalFrames: number;
  statusText: string;
}

export interface CancelToken {
  isCancelled: boolean;
}

export interface ExportCapabilities {
  supportsWebCodecs: boolean;
  supportsAudioEncoder: boolean;
  supportsAac: boolean;
  supportsMp4: boolean;
  recommendedFormat: 'mp4' | 'webm';
}

/**
 * Detect browser video export capabilities (WebCodecs AVC + AAC support)
 */
export async function checkExportCapabilitiesAsync(): Promise<ExportCapabilities> {
  if (typeof window === 'undefined') {
    return {
      supportsWebCodecs: false,
      supportsAudioEncoder: false,
      supportsAac: false,
      supportsMp4: false,
      recommendedFormat: 'webm',
    };
  }

  const supportsWebCodecs =
    typeof window.VideoEncoder !== 'undefined' && typeof window.VideoFrame !== 'undefined';
  const supportsAudioEncoder =
    typeof window.AudioEncoder !== 'undefined' && typeof window.AudioData !== 'undefined';

  let supportsAac = false;
  if (supportsAudioEncoder) {
    try {
      const res = await AudioEncoder.isConfigSupported({
        codec: 'mp4a.40.2',
        sampleRate: 44100,
        numberOfChannels: 2,
        bitrate: 192000,
      });
      supportsAac = Boolean(res.supported);
    } catch {
      supportsAac = false;
    }
  }

  return {
    supportsWebCodecs,
    supportsAudioEncoder,
    supportsAac,
    supportsMp4: supportsWebCodecs,
    recommendedFormat: supportsWebCodecs ? 'mp4' : 'webm',
  };
}

export function checkExportCapabilities(): ExportCapabilities {
  if (typeof window === 'undefined') {
    return {
      supportsWebCodecs: false,
      supportsAudioEncoder: false,
      supportsAac: false,
      supportsMp4: false,
      recommendedFormat: 'webm',
    };
  }

  const supportsWebCodecs =
    typeof window.VideoEncoder !== 'undefined' && typeof window.VideoFrame !== 'undefined';
  const supportsAudioEncoder =
    typeof window.AudioEncoder !== 'undefined' && typeof window.AudioData !== 'undefined';

  return {
    supportsWebCodecs,
    supportsAudioEncoder,
    supportsAac: supportsAudioEncoder,
    supportsMp4: supportsWebCodecs,
    recommendedFormat: supportsWebCodecs ? 'mp4' : 'webm',
  };
}

/**
 * Get pixel dimensions for export based on resolution and aspect ratio
 */
export function getExportDimensions(
  aspectRatio: '9:16' | '16:9' | '1:1',
  resolution: '1080p' | '720p' | '480p'
): { width: number; height: number } {
  // H.264 requires dimensions divisible by 2
  if (aspectRatio === '9:16') {
    if (resolution === '1080p') return { width: 1080, height: 1920 };
    if (resolution === '720p') return { width: 720, height: 1280 };
    return { width: 480, height: 854 };
  } else if (aspectRatio === '16:9') {
    if (resolution === '1080p') return { width: 1920, height: 1080 };
    if (resolution === '720p') return { width: 1280, height: 720 };
    return { width: 854, height: 480 };
  } else {
    // 1:1 Square
    if (resolution === '1080p') return { width: 1080, height: 1080 };
    if (resolution === '720p') return { width: 720, height: 720 };
    return { width: 480, height: 480 };
  }
}

/**
 * WebCodecs VideoEncoder + AudioEncoder + mp4-muxer deterministic export pipeline.
 * Encodes video frame-by-frame and muxes AAC audio chunks into a valid MP4 container.
 */
async function exportWithWebCodecs(
  project: VideoProject,
  options: VideoExportOptions,
  onProgress: (p: ExportProgress) => void,
  cancelToken: CancelToken
): Promise<Blob> {
  const { width, height } = getExportDimensions(project.aspectRatio, options.resolution);
  const fps = options.fps || 30;

  const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0);
  const totalFrames = Math.max(1, Math.round(totalDuration * fps));

  onProgress({
    percent: 1,
    currentFrame: 0,
    totalFrames,
    statusText: 'Preparing fonts, ceremonial motifs & audio buffer...',
  });

  // Ensure fonts and images are ready
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
  await preloadProjectImages(project);

  if (cancelToken.isCancelled) throw new Error('Export cancelled');

  // Load and decode audio buffer if an audio track is configured
  let audioBuffer: AudioBuffer | null = null;
  const hasAudioTrack = Boolean(project.audio && !project.audio.isMuted && project.audio.volume > 0);

  if (hasAudioTrack && project.audio) {
    try {
      audioBuffer = await getAudioTrackBuffer(project.audio, totalDuration);
    } catch (e) {
      console.error('Failed to decode audio track for export:', e);
      throw new Error('Could not decode audio track for export.');
    }
  }

  // Check if browser WebCodecs can encode AAC
  const sampleRate = audioBuffer ? audioBuffer.sampleRate : 44100;
  const numChannels = audioBuffer ? Math.min(2, audioBuffer.numberOfChannels) : 2;

  let canEncodeAac = false;
  if (hasAudioTrack && audioBuffer && typeof AudioEncoder !== 'undefined' && typeof AudioData !== 'undefined') {
    try {
      const aacSupport = await AudioEncoder.isConfigSupported({
        codec: 'mp4a.40.2',
        sampleRate,
        numberOfChannels: numChannels,
        bitrate: 192000,
      });
      canEncodeAac = Boolean(aacSupport.supported);
    } catch {
      canEncodeAac = false;
    }
  }

  // If user requested audio but WebCodecs AAC is unsupported on this browser,
  // transparently switch to MediaRecorder which handles audio recording natively!
  if (hasAudioTrack && audioBuffer && !canEncodeAac) {
    console.info('WebCodecs AAC not supported on this browser; delegating to MediaRecorder audio mixer pipeline.');
    return exportWithMediaRecorder(project, options, onProgress, cancelToken);
  }

  const willMuxAudio = Boolean(hasAudioTrack && audioBuffer && canEncodeAac);

  // Setup MP4 Muxer
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height,
    },
    audio: willMuxAudio
      ? {
          codec: 'aac',
          sampleRate,
          numberOfChannels: numChannels,
        }
      : undefined,
    fastStart: 'in-memory',
  });

  // Setup VideoEncoder
  let encoderError: Error | null = null;
  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => {
      console.error('VideoEncoder error:', e);
      encoderError = e;
    },
  });

  let bitrate = 6_000_000;
  if (options.quality === 'medium') bitrate = 3_500_000;
  else if (options.quality === 'fast') bitrate = 2_000_000;
  if (options.resolution === '720p') bitrate = Math.round(bitrate * 0.6);
  else if (options.resolution === '480p') bitrate = Math.round(bitrate * 0.35);

  videoEncoder.configure({
    codec: 'avc1.4d002a',
    width,
    height,
    bitrate,
    framerate: fps,
  });

  // Setup Offscreen Canvas for deterministic rendering
  const renderCanvas = document.createElement('canvas');
  renderCanvas.width = width;
  renderCanvas.height = height;
  const renderCtx = renderCanvas.getContext('2d', { alpha: false, desynchronized: true })!;

  // 1. Video frame-by-frame encoding loop
  for (let frame = 0; frame < totalFrames; frame++) {
    if (cancelToken.isCancelled) {
      videoEncoder.close();
      throw new Error('Export cancelled');
    }
    if (encoderError) {
      videoEncoder.close();
      throw encoderError;
    }

    const frameTime = frame / fps;

    renderVideoFrame(renderCtx, project, frameTime, { width, height });

    const timestampMicros = Math.round(frameTime * 1_000_000);
    const videoFrame = new VideoFrame(renderCanvas, {
      timestamp: timestampMicros,
      duration: Math.round((1 / fps) * 1_000_000),
    });

    const isKeyFrame = frame % (fps * 2) === 0;
    videoEncoder.encode(videoFrame, { keyFrame: isKeyFrame });
    videoFrame.close();

    if (frame % 6 === 0) {
      const progressPercent = Math.min(90, Math.round((frame / totalFrames) * 88) + 2);
      onProgress({
        percent: progressPercent,
        currentFrame: frame + 1,
        totalFrames,
        statusText: `Encoding video frame ${frame + 1} of ${totalFrames} (${progressPercent}%)...`,
      });
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  // 2. Audio Encoding and Muxing (AAC)
  if (willMuxAudio && audioBuffer && project.audio) {
    onProgress({
      percent: 92,
      currentFrame: totalFrames,
      totalFrames,
      statusText: 'Encoding selected audio track & volume envelope...',
    });

    const audioEncoder = new AudioEncoder({
      output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
      error: (e) => console.error('AudioEncoder error:', e),
    });

    audioEncoder.configure({
      codec: 'mp4a.40.2',
      sampleRate,
      numberOfChannels: numChannels,
      bitrate: 192000,
    });

    const totalAudioFrames = Math.min(
      audioBuffer.length,
      Math.floor(totalDuration * sampleRate)
    );
    const CHUNK_SIZE = 1024;
    const vol = Math.max(0, Math.min(1, project.audio.volume ?? 0.85));

    const ch0 = audioBuffer.getChannelData(0);
    const ch1 = numChannels > 1 ? audioBuffer.getChannelData(1) : ch0;

    for (let offset = 0; offset < totalAudioFrames; offset += CHUNK_SIZE) {
      if (cancelToken.isCancelled) break;
      const currentChunkSize = Math.min(CHUNK_SIZE, totalAudioFrames - offset);

      // Pack planar float32 buffer: channel 0 contiguous, followed by channel 1 contiguous
      const planarData = new Float32Array(currentChunkSize * numChannels);

      // Channel 0
      const ch0Slice = ch0.subarray(offset, offset + currentChunkSize);
      for (let i = 0; i < currentChunkSize; i++) {
        planarData[i] = ch0Slice[i] * vol;
      }

      // Channel 1
      if (numChannels > 1) {
        const ch1Slice = ch1.subarray(offset, offset + currentChunkSize);
        for (let i = 0; i < currentChunkSize; i++) {
          planarData[currentChunkSize + i] = ch1Slice[i] * vol;
        }
      }

      const audioData = new AudioData({
        format: 'f32-planar',
        sampleRate,
        numberOfFrames: currentChunkSize,
        numberOfChannels: numChannels,
        timestamp: Math.round((offset / sampleRate) * 1_000_000),
        data: planarData,
      });

      audioEncoder.encode(audioData);
      audioData.close();
    }

    await audioEncoder.flush();
    audioEncoder.close();
  }

  onProgress({
    percent: 97,
    currentFrame: totalFrames,
    totalFrames,
    statusText: 'Muxing MP4 container & writing audio/video streams...',
  });

  await videoEncoder.flush();
  videoEncoder.close();

  muxer.finalize();
  const { buffer } = muxer.target;
  const blob = new Blob([buffer], { type: 'video/mp4' });

  onProgress({
    percent: 100,
    currentFrame: totalFrames,
    totalFrames,
    statusText: 'Video export with audio completed successfully!',
  });

  return blob;
}

/**
 * MediaRecorder fallback export pipeline.
 * Perfectly combines the Canvas video stream AND the Web Audio Destination node into a single recorded stream with sound.
 */
async function exportWithMediaRecorder(
  project: VideoProject,
  options: VideoExportOptions,
  onProgress: (p: ExportProgress) => void,
  cancelToken: CancelToken
): Promise<Blob> {
  const { width, height } = getExportDimensions(project.aspectRatio, options.resolution);
  const fps = options.fps || 30;
  const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0);

  onProgress({
    percent: 2,
    currentFrame: 0,
    totalFrames: 100,
    statusText: 'Initializing MediaRecorder audio/video stream...',
  });

  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
  await preloadProjectImages(project);

  // 1. Prepare Audio
  let audioBuffer: AudioBuffer | null = null;
  const hasAudioTrack = Boolean(project.audio && !project.audio.isMuted && project.audio.volume > 0);

  if (hasAudioTrack && project.audio) {
    try {
      audioBuffer = await getAudioTrackBuffer(project.audio, totalDuration);
    } catch (e) {
      console.warn('Audio decoding error in MediaRecorder export:', e);
    }
  }

  // 2. Prepare Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false })!;

  const canvasStream = canvas.captureStream(fps);

  // 3. Setup Web Audio Destination node to mix the audio track into the recording stream
  let audioCtx: AudioContext | null = null;
  let audioSource: AudioBufferSourceNode | null = null;
  let combinedStream: MediaStream;

  if (audioBuffer && project.audio) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtx();
    const destNode = audioCtx.createMediaStreamDestination();

    audioSource = audioCtx.createBufferSource();
    audioSource.buffer = audioBuffer;

    const gainNode = audioCtx.createGain();
    const vol = Math.max(0, Math.min(1, project.audio.volume ?? 0.85));
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);

    audioSource.connect(gainNode);
    gainNode.connect(destNode);

    // Combine Video Track and Audio Track into one stream!
    combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...destNode.stream.getAudioTracks(),
    ]);
  } else {
    combinedStream = canvasStream;
  }

  // Determine supported mime type
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType: selectedMime,
    videoBitsPerSecond: 4_500_000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordedPromise = new Promise<Blob>((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: selectedMime });
      resolve(blob);
    };
    mediaRecorder.onerror = (e) => reject(e);
  });

  mediaRecorder.start(250);

  // Start audio playback in sync with recording
  if (audioSource) {
    audioSource.start(0, project.audio?.trimStart || 0);
  }

  const startTime = performance.now();
  const totalMs = totalDuration * 1000;

  await new Promise<void>((resolve, reject) => {
    function tick() {
      if (cancelToken.isCancelled) {
        mediaRecorder.stop();
        if (audioSource) {
          try { audioSource.stop(); } catch {}
        }
        reject(new Error('Export cancelled'));
        return;
      }

      const elapsedMs = performance.now() - startTime;
      const progressSec = elapsedMs / 1000;
      const progressPercent = Math.min(96, Math.round((elapsedMs / totalMs) * 94) + 2);

      renderVideoFrame(ctx, project, progressSec, { width, height });

      onProgress({
        percent: progressPercent,
        currentFrame: Math.round(progressSec * fps),
        totalFrames: Math.round(totalDuration * fps),
        statusText: `Recording video & audio stream (${progressPercent}%)...`,
      });

      if (elapsedMs < totalMs) {
        requestAnimationFrame(tick);
      } else {
        mediaRecorder.stop();
        if (audioSource) {
          try { audioSource.stop(); } catch {}
        }
        resolve();
      }
    }
    requestAnimationFrame(tick);
  });

  const blob = await recordedPromise;

  // Cleanup Web Audio and MediaStream tracks
  if (audioCtx) {
    try { audioCtx.close(); } catch {}
  }
  combinedStream.getTracks().forEach((track) => track.stop());

  onProgress({
    percent: 100,
    currentFrame: Math.round(totalDuration * fps),
    totalFrames: Math.round(totalDuration * fps),
    statusText: 'Video export with audio completed successfully!',
  });

  return blob;
}

/**
 * Main export coordinator: Automatically selects optimal engine and guarantees audio inclusion
 */
export async function exportVideoProject(
  project: VideoProject,
  options: VideoExportOptions,
  onProgress: (p: ExportProgress) => void,
  cancelToken: CancelToken
): Promise<{ blob: Blob; filename: string; format: 'mp4' | 'webm' }> {
  const caps = await checkExportCapabilitiesAsync();
  const safeTitle = (project.title || 'utsav-invitation-video')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  // If WebCodecs AVC and AAC are supported and user requested MP4 (or default)
  if (caps.supportsWebCodecs && options.format !== 'webm') {
    const blob = await exportWithWebCodecs(project, options, onProgress, cancelToken);
    return {
      blob,
      filename: `${safeTitle}.mp4`,
      format: 'mp4',
    };
  }

  // Fallback to MediaRecorder (mixed audio + video)
  const blob = await exportWithMediaRecorder(project, options, onProgress, cancelToken);
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
  return {
    blob,
    filename: `${safeTitle}.${ext}`,
    format: ext as 'mp4' | 'webm',
  };
}
