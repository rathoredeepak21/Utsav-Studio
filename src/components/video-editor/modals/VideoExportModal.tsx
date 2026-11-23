'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useVideoEditorStore } from '@/lib/store/useVideoEditorStore';
import {
  exportVideoProject,
  checkExportCapabilitiesAsync,
  checkExportCapabilities,
  ExportCapabilities,
  ExportProgress,
  CancelToken,
} from '@/lib/video/videoExporter';
import { VideoExportOptions } from '@/types/videoEditor';
import {
  X,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Loader2,
  Film,
  Music,
} from 'lucide-react';

export function VideoExportModal() {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    projectId,
    projectTitle,
    templateId,
    category,
    aspectRatio,
    dimensions,
    fps,
    scenes,
    audioTrack,
  } = useVideoEditorStore();

  const [capabilities, setCapabilities] = useState<ExportCapabilities | null>(null);
  const [resolution, setResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [quality, setQuality] = useState<'high' | 'medium' | 'fast'>('high');

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [exportedResult, setExportedResult] = useState<{
    url: string;
    filename: string;
    sizeMb: string;
    format: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cancelTokenRef = useRef<CancelToken>({ isCancelled: false });

  useEffect(() => {
    if (isExportModalOpen) {
      checkExportCapabilitiesAsync().then((caps) => {
        setCapabilities(caps);
        setFormat(caps.recommendedFormat);
      });
      setExportedResult(null);
      setErrorMessage(null);
      setProgress(null);
      setIsExporting(false);
    }
  }, [isExportModalOpen]);

  if (!isExportModalOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setExportedResult(null);
    cancelTokenRef.current = { isCancelled: false };

    const project = {
      id: projectId,
      title: projectTitle,
      templateId,
      category: category as any,
      aspectRatio,
      dimensions,
      fps: fps || 30,
      scenes,
      audio: audioTrack,
      lastModified: Date.now(),
      createdAt: Date.now(),
    };

    const options: VideoExportOptions = {
      resolution,
      format,
      fps: 30,
      quality,
    };

    try {
      const result = await exportVideoProject(
        project,
        options,
        (p) => setProgress(p),
        cancelTokenRef.current
      );

      const url = URL.createObjectURL(result.blob);
      const sizeMb = (result.blob.size / (1024 * 1024)).toFixed(1);

      setExportedResult({
        url,
        filename: result.filename,
        sizeMb,
        format: result.format.toUpperCase(),
      });
    } catch (err: any) {
      if (err.message !== 'Export cancelled') {
        console.error('Video export error:', err);
        setErrorMessage(err.message || 'Video export encountered an error.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCancelExport = () => {
    cancelTokenRef.current.isCancelled = true;
    setIsExporting(false);
    setProgress(null);
  };

  const handleClose = () => {
    if (isExporting) {
      cancelTokenRef.current.isCancelled = true;
    }
    if (exportedResult?.url) {
      URL.revokeObjectURL(exportedResult.url);
    }
    setIsExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Ornate Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-gold-400 to-amber-600" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-royal-950 border border-gold-500/40 text-gold-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Export Video Invitation</h3>
              <p className="text-[11px] text-stone-400">100% Client-Side In-Browser Rendering</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-4">
          {/* Capabilities Banner */}
          {capabilities && (
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3 flex items-start space-x-3 text-xs">
              <Cpu className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-stone-200">
                  {capabilities.supportsWebCodecs
                    ? 'Hardware-Accelerated WebCodecs Active'
                    : 'Standard MediaRecorder Fallback Active'}
                </span>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  {capabilities.supportsWebCodecs
                    ? 'Your browser supports native frame-by-frame MP4 H.264 rendering with zero server uploads.'
                    : 'Your browser will encode high-quality WebM/MP4 video directly on device.'}
                </p>
              </div>
            </div>
          )}

          {/* Export Settings (when not exporting and no result) */}
          {!isExporting && !exportedResult && (
            <div className="space-y-4 text-xs">
              {/* Resolution selection */}
              <div>
                <label className="text-stone-300 font-semibold block mb-2">Export Resolution</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1080p', label: '1080p Full HD', desc: 'Best Clarity' },
                    { id: '720p', label: '720p HD', desc: 'Balanced' },
                    { id: '480p', label: '480p Fast', desc: 'Quick Share' },
                  ].map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setResolution(res.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        resolution === res.id
                          ? 'border-gold-400 bg-royal-950/60 text-gold-300 font-bold shadow-xs'
                          : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="block">{res.label}</span>
                      <span className="text-[10px] text-stone-500 font-normal">{res.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-stone-300 font-semibold block mb-2">Video Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormat('mp4')}
                    disabled={!capabilities?.supportsMp4}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      format === 'mp4'
                        ? 'border-gold-400 bg-royal-950/60 text-gold-300 font-bold shadow-xs'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                    } disabled:opacity-40`}
                  >
                    <span className="block">MP4 (H.264)</span>
                    <span className="text-[10px] text-stone-500 font-normal">
                      Universal for WhatsApp & Reels
                    </span>
                  </button>

                  <button
                    onClick={() => setFormat('webm')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      format === 'webm'
                        ? 'border-gold-400 bg-royal-950/60 text-gold-300 font-bold shadow-xs'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="block">WebM</span>
                    <span className="text-[10px] text-stone-500 font-normal">
                      Compact & Web-Optimized
                    </span>
                  </button>
                </div>
              </div>

              {/* Audio Track Status Indicator */}
              <div className="bg-royal-950/40 border border-gold-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate mr-2">
                  <Music className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-stone-300 truncate">
                    Music: <strong className="text-gold-300">{audioTrack && !audioTrack.isMuted ? audioTrack.title : 'Muted / No Audio'}</strong>
                  </span>
                </div>
                {audioTrack && !audioTrack.isMuted ? (
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 shrink-0">
                    Audio Included ({Math.round((audioTrack.volume ?? 0.85) * 100)}%)
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400 font-mono bg-stone-900 px-2 py-0.5 rounded shrink-0">
                    Silent Video
                  </span>
                )}
              </div>

              {/* Free Promise badge */}
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 pt-1">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Free Forever • Zero Forced Watermark • 1080p Enabled</span>
              </div>
            </div>
          )}

          {/* Active Exporting Progress */}
          {isExporting && (
            <div className="py-6 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-royal-950 border border-gold-500/40 text-gold-400 flex items-center justify-center mx-auto shadow-gold-glow animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-white">Rendering Video...</h4>
                <p className="text-xs text-gold-400 font-mono mt-1">
                  {progress?.statusText || 'Rendering frames deterministically...'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
                <div
                  className="bg-gradient-to-r from-amber-500 via-gold-400 to-amber-600 h-full transition-all duration-200"
                  style={{ width: `${progress?.percent || 2}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span>{progress?.percent || 2}% completed</span>
                <span>
                  Frame {progress?.currentFrame || 0} / {progress?.totalFrames || 0}
                </span>
              </div>

              <button
                onClick={handleCancelExport}
                className="mt-2 px-4 py-1.5 rounded-lg border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-900 text-xs transition-colors"
              >
                Cancel Export
              </button>
            </div>
          )}

          {/* Export Completed State */}
          {exportedResult && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-white">Video Ready to Download!</h4>
                <p className="text-xs text-stone-300 mt-1">
                  {exportedResult.format} • {resolution.toUpperCase()} • {exportedResult.sizeMb} MB
                </p>
                <p className="text-[11px] text-emerald-400 mt-0.5">
                  Rendered with zero watermarks on your device.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={exportedResult.url}
                  download={exportedResult.filename}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-gold-500 to-amber-600 text-stone-950 font-bold text-sm shadow-gold-glow flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {exportedResult.format}</span>
                </a>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer (Initial state) */}
        {!isExporting && !exportedResult && (
          <div className="pt-4 border-t border-stone-800 flex items-center justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartExport}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 via-gold-500 to-amber-600 text-stone-950 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Render & Download</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
