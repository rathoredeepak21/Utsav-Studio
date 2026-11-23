'use client';

import React, { useRef, useEffect } from 'react';
import { useVideoEditorStore } from '@/lib/store/useVideoEditorStore';
import { renderVideoFrame } from '@/lib/video/canvasRenderer';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
} from 'lucide-react';

export function VideoPreviewModal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    isPreviewModalOpen,
    setIsPreviewModalOpen,
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
    isPlaying,
    currentTime,
    play,
    pause,
    togglePlay,
    seek,
    getTotalDuration,
  } = useVideoEditorStore();

  const totalDuration = getTotalDuration();

  // Render on canvas whenever currentTime or scenes update
  useEffect(() => {
    if (!isPreviewModalOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    renderVideoFrame(ctx, project, currentTime, {
      width: dimensions.width,
      height: dimensions.height,
    });
  }, [isPreviewModalOpen, projectId, projectTitle, templateId, category, aspectRatio, dimensions, fps, scenes, audioTrack, currentTime]);

  if (!isPreviewModalOpen) return null;

  const aspectClass =
    aspectRatio === '9:16'
      ? 'aspect-[9/16] h-[78vh]'
      : aspectRatio === '16:9'
      ? 'aspect-[16/9] w-[75vw] max-h-[78vh]'
      : 'aspect-square h-[75vh]';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const playheadPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 select-none">
      {/* Top Header */}
      <div className="w-full max-w-5xl flex items-center justify-between text-white z-10">
        <div>
          <h2 className="font-serif text-lg font-bold text-gold-300">{projectTitle}</h2>
          <p className="text-xs text-stone-400">Cinematic Fullscreen Preview</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsPreviewModalOpen(false);
              setIsExportModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-gold-500 to-amber-600 text-stone-950 font-bold text-xs shadow-gold-glow hover:brightness-110 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Export Video</span>
          </button>

          <button
            onClick={() => {
              pause();
              setIsPreviewModalOpen(false);
            }}
            className="p-2 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Video Viewport */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <div className={`relative ${aspectClass} rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/40 bg-black flex items-center justify-center`}>
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gold-500/90 hover:bg-gold-400 text-stone-950 flex items-center justify-center shadow-gold-glow hover:scale-105 active:scale-95 transition-all z-20"
            >
              <Play className="w-8 h-8 fill-stone-950 translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Floating Scrubber Bar */}
      <div className="w-full max-w-xl bg-stone-950/90 border border-stone-800/80 rounded-2xl p-3 flex flex-col space-y-2 backdrop-blur-md z-10 shadow-2xl">
        {/* Scrubber Progress Track */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = Math.max(0, Math.min(1, clickX / rect.width));
            seek(progress * totalDuration);
          }}
          className="w-full h-2 bg-stone-900 rounded-full cursor-pointer relative overflow-hidden group"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-gold-400 to-amber-600 transition-none"
            style={{ width: `${playheadPercent}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-xs text-stone-300 pt-1">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-stone-950 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 translate-x-0.5" />}
            </button>
            <button
              onClick={() => seek(0)}
              className="p-1 rounded text-stone-400 hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="font-mono text-xs">
            <span className="text-gold-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-stone-500"> / </span>
            <span className="text-stone-400">{formatTime(totalDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
