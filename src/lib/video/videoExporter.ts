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
  supportsMp4: boolean;
  recommendedFormat: 'mp4' | 'webm';
}

/**
 * Detect browser video export capabilities
 */
export function checkExportCapabilities(): ExportCapabilities {
  if (typeof window === 'undefined') {
    return {
      supportsWebCodecs: false,
      supportsAudioEncoder: false,
      supportsMp4: false,
      recommendedFormat: 'webm',
    };
  }

  const supportsWebCodecs = typeof window.VideoEncoder !== 'undefined' && typeof window.VideoFrame !== 'undefined';
  const supportsAudioEncoder = typeof window.AudioEncoder !== 'undefined' && typeof window.AudioData !== 'undefined';

  return {
    supportsWebCodecs,
    supportsAudioEncoder,
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
  // Ensure dimensions are even numbers (H.264 requirement: divisible by 2)
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
 * WebCodecs + mp4-muxer deterministic frame-by-frame export pipeline
 */
async function exportWithWebCodecs(
  project: VideoProject,
  options: VideoExportOptions,
  onProgress: (p: ExportProgress) => void,
  cancelToken: CancelToken
): Promise<Blob> {
  const { width, height } = getExportDimensions(project.aspectRatio, options.resolution);
  const fps = options.fps || 30;

  // Calculate total duration from scenes
  const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0);
  const totalFrames = Math.max(1, Math.round(totalDuration * fps));

  onProgress({
    percent: 1,
    currentFrame: 0,
    totalFrames,
    statusText: 'Preparing fonts, ceremonial motifs & assets...',
  });

  // Ensure fonts and images are preloaded
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
  await preloadProjectImages(project);

  if (cancelToken.isCancelled) throw new Error('Export cancelled');

  // Prepare audio if configured and AudioEncoder is supported
  const caps = checkExportCapabilities();
  let audioBuffer: AudioBuffer | null = null;
  const includeAudio = Boolean(project.audio && !project.audio.isMuted && caps.supportsAudioEncoder);

  if (project.audio && !project.audio.isMuted) {
    try {
      audioBuffer = await getAudioTrackBuffer(project.audio, totalDuration);
    } catch (e) {
      console.warn('Could not decode audio track for export, continuing with video only:', e);
    }
  }

  // Setup MP4 Muxer
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height,
    },
    audio: includeAudio && audioBuffer ? {
      codec: 'aac',
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: Math.min(2, audioBuffer.numberOfChannels),
    } : undefined,
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

  // Bitrates based on quality
  let bitrate = 6_000_000; // 6 Mbps
  if (options.quality === 'medium') bitrate = 3_500_000;
  else if (options.quality === 'fast') bitrate = 2_000_000;
  if (options.resolution === '720p') bitrate = Math.round(bitrate * 0.6);
  else if (options.resolution === '480p') bitrate = Math.round(bitrate * 0.35);

  videoEncoder.configure({
    codec: 'avc1.4d002a', // Main Profile Level 4.2
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

  // Frame-by-Frame encoding loop
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

    // Render exact frame deterministically
    renderVideoFrame(renderCtx, project, frameTime, { width, height });

    // Create VideoFrame with microsecond timestamp
    const timestampMicros = Math.round(frameTime * 1_000_000);
    const videoFrame = new VideoFrame(renderCanvas, {
      timestamp: timestampMicros,
      duration: Math.round((1 / fps) * 1_000_000),
    });

    const isKeyFrame = frame % (fps * 2) === 0;
    videoEncoder.encode(videoFrame, { keyFrame: isKeyFrame });
    videoFrame.close();

    // Prevent main thread congestion
    if (frame % 6 === 0) {
      const progressPercent = Math.min(95, Math.round((frame / totalFrames) * 92) + 2);
      onProgress({
        percent: progressPercent,
        currentFrame: frame + 1,
        totalFrames,
        statusText: `Encoding frame ${frame + 1} of ${totalFrames} (${progressPercent}%)...`,
      });
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  // Audio Encoding if supported
  if (includeAudio && audioBuffer) {
    onProgress({
      percent: 94,
      currentFrame: totalFrames,
      totalFrames,
      statusText: 'Encoding ceremonial audio track...',
    });

    try {
      const audioEncoder = new AudioEncoder({
        output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
        error: (e) => console.error('AudioEncoder error:', e),
      });

      audioEncoder.configure({
        codec: 'mp4a.40.2', // AAC-LC
        sampleRate: audioBuffer.sampleRate,
        numberOfChannels: Math.min(2, audioBuffer.numberOfChannels),
        bitrate: 192_000,
      });

      const sampleRate = audioBuffer.sampleRate;
      const totalAudioFrames = Math.min(
        audioBuffer.length,
        Math.floor(totalDuration * sampleRate)
      );
      const CHUNK_SIZE = 1024;

      for (let offset = 0; offset < totalAudioFrames; offset += CHUNK_SIZE) {
        if (cancelToken.isCancelled) break;
        const currentChunkSize = Math.min(CHUNK_SIZE, totalAudioFrames - offset);
        const audioData = new AudioData({
          format: 'f32-planar',
          sampleRate,
          numberOfFrames: currentChunkSize,
          numberOfChannels: Math.min(2, audioBuffer.numberOfChannels),
          timestamp: Math.round((offset / sampleRate) * 1_000_000),
          data: audioBuffer.getChannelData(0).subarray(offset, offset + currentChunkSize),
        });

        audioEncoder.encode(audioData);
        audioData.close();
      }

      await audioEncoder.flush();
      audioEncoder.close();
    } catch (audioErr) {
      console.warn('Audio encoding skipped due to browser limitations:', audioErr);
    }
  }

  onProgress({
    percent: 97,
    currentFrame: totalFrames,
    totalFrames,
    statusText: 'Muxing MP4 container & finalizing video...',
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
    statusText: 'Video export completed successfully!',
  });

  return blob;
}

/**
 * MediaRecorder fallback export pipeline (produces WebM or supported MP4)
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
    statusText: 'Initializing MediaRecorder fallback stream...',
  });

  // Ensure fonts and images are ready
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
  await preloadProjectImages(project);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false })!;

  const stream = canvas.captureStream(fps);

  // Determine supported mime type
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: selectedMime,
    videoBitsPerSecond: 4_000_000,
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

  const startTime = performance.now();
  const totalMs = totalDuration * 1000;

  await new Promise<void>((resolve, reject) => {
    function tick() {
      if (cancelToken.isCancelled) {
        mediaRecorder.stop();
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
        statusText: `Recording video (${progressPercent}%)...`,
      });

      if (elapsedMs < totalMs) {
        requestAnimationFrame(tick);
      } else {
        mediaRecorder.stop();
        resolve();
      }
    }
    requestAnimationFrame(tick);
  });

  const blob = await recordedPromise;

  onProgress({
    percent: 100,
    currentFrame: Math.round(totalDuration * fps),
    totalFrames: Math.round(totalDuration * fps),
    statusText: 'Video export completed successfully!',
  });

  return blob;
}

/**
 * Main export coordinator: Automatically selects optimal engine
 */
export async function exportVideoProject(
  project: VideoProject,
  options: VideoExportOptions,
  onProgress: (p: ExportProgress) => void,
  cancelToken: CancelToken
): Promise<{ blob: Blob; filename: string; format: 'mp4' | 'webm' }> {
  const caps = checkExportCapabilities();
  const safeTitle = (project.title || 'utsav-invitation-video')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  // If WebCodecs is supported and user opted for MP4 (or default)
  if (caps.supportsWebCodecs && options.format !== 'webm') {
    const blob = await exportWithWebCodecs(project, options, onProgress, cancelToken);
    return {
      blob,
      filename: `${safeTitle}.mp4`,
      format: 'mp4',
    };
  }

  // Fallback to MediaRecorder
  const blob = await exportWithMediaRecorder(project, options, onProgress, cancelToken);
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
  return {
    blob,
    filename: `${safeTitle}.${ext}`,
    format: ext as 'mp4' | 'webm',
  };
}
