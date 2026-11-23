'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useVideoEditorStore } from '@/lib/store/useVideoEditorStore';
import { renderVideoFrame, preloadProjectImages } from '@/lib/video/canvasRenderer';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react';

export function VideoPreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    projectId,
    projectTitle,
    templateId,
    category,
    aspectRatio,
    dimensions,
    fps,
    scenes,
    activeSceneId,
    selectedElementId,
    audioTrack,
    isPlaying,
    currentTime,
    play,
    pause,
    togglePlay,
    seek,
    getTotalDuration,
    getActiveScene,
    selectElement,
    updateAudioVolume,
    setIsPreviewModalOpen,
  } = useVideoEditorStore();

  const totalDuration = getTotalDuration();
  const activeScene = getActiveScene();

  const lastFrameTimeRef = useRef<number>(performance.now());
  const animFrameIdRef = useRef<number | null>(null);

  // Preload images once project changes
  useEffect(() => {
    preloadProjectImages({
      id: projectId,
      title: projectTitle,
      templateId,
      category: category as any,
      aspectRatio,
      dimensions,
      fps,
      scenes,
      audio: audioTrack,
      lastModified: Date.now(),
      createdAt: Date.now(),
    });
  }, [projectId, scenes]);

  // Main playback animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    lastFrameTimeRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      const nextTime = currentTime + dt;
      if (nextTime >= totalDuration) {
        seek(0);
      } else {
        seek(nextTime);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, currentTime, totalDuration, seek]);

  // Deterministic canvas render on every currentTime or scenes change
  const renderCurrent = useCallback(() => {
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
      fps,
      scenes,
      audio: audioTrack,
      lastModified: Date.now(),
      createdAt: Date.now(),
    };

    renderVideoFrame(ctx, project, currentTime, {
      width: dimensions.width,
      height: dimensions.height,
    });
  }, [projectId, projectTitle, templateId, category, aspectRatio, dimensions, fps, scenes, audioTrack, currentTime]);

  useEffect(() => {
    renderCurrent();
  }, [renderCurrent]);

  // Calculate container aspect ratio CSS classes
  const aspectClass =
    aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[calc(100vh-270px)]'
      : aspectRatio === '16:9'
      ? 'aspect-[16/9] max-w-full max-h-[calc(100vh-270px)]'
      : 'aspect-square max-h-[calc(100vh-270px)]';

  // Format time (00:04.2)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  // Canvas element selection on click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !activeScene) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = dimensions.width / rect.width;
    const scaleY = dimensions.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check hit test from top zIndex down
    const sorted = [...activeScene.elements].sort((a, b) => b.zIndex - a.zIndex);
    const hit = sorted.find(
      (el) =>
        clickX >= el.x &&
        clickX <= el.x + el.width &&
        clickY >= el.y &&
        clickY <= el.y + el.height
    );

    if (hit) {
      selectElement(hit.id);
    } else {
      selectElement(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-stone-900/90 flex flex-col items-center justify-center p-3 sm:p-5 relative select-none overflow-hidden"
    >
      {/* Active Scene & Format Badge */}
      <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
        <span className="text-[11px] font-medium bg-stone-950/80 border border-stone-800 text-gold-400 px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>{activeScene?.name || 'Scene 1'}</span>
        </span>
        <span className="text-[10px] bg-stone-950/80 border border-stone-800 text-stone-400 px-2 py-1 rounded-full backdrop-blur-xs font-mono">
          {aspectRatio} • {dimensions.width}×{dimensions.height}
        </span>
      </div>

      {/* Fullscreen clean preview button */}
      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={() => {
            play();
            setIsPreviewModalOpen(true);
          }}
          className="p-2 rounded-full bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors backdrop-blur-xs"
          title="Fullscreen Cinematic Preview"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Canvas Viewport Container */}
      <div className={`relative ${aspectClass} rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-black flex items-center justify-center group`}>
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Hover / Inactive Center Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gold-500/90 hover:bg-gold-400 text-stone-950 flex items-center justify-center shadow-gold-glow hover:scale-105 active:scale-95 transition-all z-20"
            title="Play Video (Space)"
          >
            <Play className="w-8 h-8 fill-stone-950 translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Floating Canvas Playback Bar */}
      <div className="mt-3 flex items-center space-x-4 bg-stone-950/90 border border-stone-800/80 backdrop-blur-md px-4 py-1.5 rounded-full z-10 shadow-lg">
        {/* Play / Pause Toggle */}
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-stone-950 transition-colors"
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 translate-x-0.5" />}
        </button>

        {/* Restart */}
        <button
          onClick={() => seek(0)}
          className="p-1.5 rounded-full text-stone-400 hover:text-white transition-colors"
          title="Restart Video"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Time Display */}
        <div className="text-xs font-mono text-stone-300 flex items-center space-x-1">
          <span className="text-gold-400 font-semibold">{formatTime(currentTime)}</span>
          <span className="text-stone-600">/</span>
          <span className="text-stone-400">{formatTime(totalDuration)}</span>
        </div>

        {/* Quick Audio Mute Toggle */}
        {audioTrack && (
          <button
            onClick={() => updateAudioVolume(audioTrack.isMuted || audioTrack.volume === 0 ? 0.85 : 0)}
            className="p-1.5 text-stone-400 hover:text-gold-400 transition-colors"
            title={audioTrack.volume === 0 ? 'Unmute Audio' : 'Mute Audio'}
          >
            {audioTrack.volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
