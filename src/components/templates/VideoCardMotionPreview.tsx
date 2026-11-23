'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { TemplateDefinition } from '@/types/template';
import { VideoProject } from '@/types/videoEditor';
import { convertTemplateToVideoProject } from '@/lib/video/templateToVideoConverter';
import { renderVideoFrame } from '@/lib/video/canvasRenderer';
import { Play, Pause, Sparkles } from 'lucide-react';

interface VideoCardMotionPreviewProps {
  template: TemplateDefinition;
  isHovered?: boolean;
  className?: string;
  showControls?: boolean;
}

export function VideoCardMotionPreview({
  template,
  isHovered = false,
  className = '',
  showControls = false,
}: VideoCardMotionPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Convert template to native project once
  const project: VideoProject = useMemo(() => {
    return convertTemplateToVideoProject(template);
  }, [template]);

  const totalDuration = useMemo(() => {
    return project.scenes.reduce((sum, s) => sum + s.duration, 0) || 12;
  }, [project]);

  // Handle play/pause state based on hover or manual toggle
  useEffect(() => {
    if (isHovered) {
      setIsPlaying(true);
    } else if (!showControls) {
      setIsPlaying(false);
      // Reset to initial scene snapshot
      currentTimeRef.current = 1.0; // Show well-developed state of scene 1
      setProgress(1.0 / totalDuration);
      renderStaticSnapshot();
    }
  }, [isHovered, showControls, totalDuration]);

  // Static snapshot renderer
  const renderStaticSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderVideoFrame(ctx, project, currentTimeRef.current || 1.2, {
      width: canvas.width,
      height: canvas.height,
    });
  };

  // Initial mount render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use responsive internal canvas resolution (540x960 for sharp rendering in gallery cards)
    canvas.width = 540;
    canvas.height = 960;

    currentTimeRef.current = 1.2;
    renderStaticSnapshot();
  }, [project]);

  // Animation Loop when playing
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      currentTimeRef.current += Math.min(0.1, delta);
      if (currentTimeRef.current > totalDuration) {
        currentTimeRef.current = 0; // Seamless loop
      }

      setProgress(currentTimeRef.current / totalDuration);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderVideoFrame(ctx, project, currentTimeRef.current, {
            width: canvas.width,
            height: canvas.height,
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, project, totalDuration]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-stone-950 flex items-center justify-center ${className}`}>
      {/* Motion Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Floating Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-20">
        <div
          className="h-full bg-gradient-to-r from-gold-400 via-amber-300 to-rose-400 transition-all duration-75"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      {/* Reel Motion Indicator Badge */}
      <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-royal-950/80 text-gold-300 backdrop-blur-md border border-gold-400/30 shadow-sm">
          <Sparkles className="w-2.5 h-2.5 animate-pulse text-gold-400" />
          {isPlaying ? 'Playing Reel' : 'Hover to Play'}
        </span>
      </div>

      {/* Optional Manual Play/Pause Control Button */}
      {showControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying((prev) => !prev);
          }}
          type="button"
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors z-20 group"
        >
          <div className="w-12 h-12 rounded-full bg-gold-400/90 text-royal-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </div>
        </button>
      )}
    </div>
  );
}
