'use client';

import React, { useRef } from 'react';
import { useVideoEditorStore } from '@/lib/store/useVideoEditorStore';
import {
  Play,
  Pause,
  Plus,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  Music,
  SlidersHorizontal,
  ChevronRight,
  Volume2,
} from 'lucide-react';

export function VideoEditorBottomTimeline() {
  const {
    scenes,
    activeSceneId,
    setActiveSceneId,
    addScene,
    duplicateScene,
    deleteScene,
    updateSceneDuration,
    audioTrack,
    isPlaying,
    currentTime,
    togglePlay,
    seek,
    getTotalDuration,
    setActiveSidebarTab,
  } = useVideoEditorStore();

  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const totalDuration = getTotalDuration();

  // Handle timeline scrubbing on click or drag
  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = timelineTrackRef.current;
    if (!track || totalDuration <= 0) return;

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    seek(progress * totalDuration);
  };

  // Playhead percentage for gold needle
  const playheadPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-44 sm:h-48 bg-stone-950 border-t border-stone-800 flex flex-col text-xs text-stone-200 select-none z-20 shrink-0">
      {/* 1. Timeline Header Bar */}
      <div className="h-9 px-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/60 shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
            <span className="text-[11px] font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <span className="text-stone-600">|</span>

          {/* Timecode */}
          <div className="font-mono text-[11px] text-stone-300">
            <span className="text-gold-400 font-bold">{currentTime.toFixed(1)}s</span>
            <span className="text-stone-500"> / {totalDuration.toFixed(1)}s</span>
          </div>
        </div>

        {/* Right timeline actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addScene()}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-royal-950 border border-gold-500/40 text-gold-300 hover:text-gold-200 hover:bg-royal-900 transition-colors text-[11px]"
          >
            <Plus className="w-3 h-3" />
            <span>Add Scene</span>
          </button>
        </div>
      </div>

      {/* 2. Main Timeline Scrubber Area */}
      <div
        ref={timelineTrackRef}
        onClick={handleTimelineScrub}
        className="flex-1 relative overflow-x-auto overflow-y-hidden p-3 flex flex-col justify-between cursor-pointer"
      >
        {/* Playhead Needle */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none transition-none flex flex-col items-center"
          style={{ left: `${playheadPercent}%` }}
        >
          {/* Needle Head */}
          <div className="w-3 h-3 bg-gold-400 rotate-45 -translate-y-1 shadow-md" />
          {/* Needle Line */}
          <div className="w-0.5 flex-1 bg-gold-400 shadow-gold-glow" />
        </div>

        {/* Scene Blocks Track */}
        <div className="flex items-center space-x-2 h-20 relative">
          {scenes.map((scene, idx) => {
            const isActive = scene.id === activeSceneId;
            const durationWeight = (scene.duration / totalDuration) * 100;

            return (
              <React.Fragment key={scene.id}>
                {/* Scene Card */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSceneId(scene.id);
                  }}
                  style={{ minWidth: '150px', flex: `${scene.duration} 0 auto` }}
                  className={`h-full rounded-xl border relative p-2 flex flex-col justify-between transition-all group overflow-hidden ${
                    isActive
                      ? 'border-gold-400 bg-stone-900/90 shadow-gold-glow/20 ring-1 ring-gold-400/50'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
                  }`}
                >
                  {/* Scene Title & Index */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] text-white truncate max-w-[120px]">
                      {idx + 1}. {scene.name}
                    </span>
                    <span className="text-[10px] font-mono text-gold-400 bg-stone-950/80 px-1.5 py-0.5 rounded border border-stone-800">
                      {scene.duration.toFixed(1)}s
                    </span>
                  </div>

                  {/* Scene Elements Count & Duration Quick Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-500">
                      {scene.elements.length} layer{scene.elements.length === 1 ? '' : 's'}
                    </span>

                    <div className="flex items-center space-x-1">
                      {/* Decrease Duration */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSceneDuration(scene.id, scene.duration - 0.5);
                        }}
                        disabled={scene.duration <= 1.0}
                        className="w-4 h-4 rounded bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center text-[10px] disabled:opacity-30"
                        title="Reduce duration (-0.5s)"
                      >
                        -
                      </button>
                      {/* Increase Duration */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSceneDuration(scene.id, scene.duration + 0.5);
                        }}
                        disabled={scene.duration >= 20.0}
                        className="w-4 h-4 rounded bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center text-[10px] disabled:opacity-30"
                        title="Increase duration (+0.5s)"
                      >
                        +
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateScene(scene.id);
                        }}
                        className="p-1 rounded text-stone-400 hover:text-gold-400 hover:bg-stone-800 transition-colors"
                        title="Duplicate Scene"
                      >
                        <Copy className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      {scenes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteScene(scene.id);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                          title="Delete Scene"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transition Badge between scenes */}
                {idx < scenes.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSceneId(scenes[idx + 1].id);
                      setActiveSidebarTab('transitions');
                    }}
                    className="shrink-0 px-2 py-1 rounded bg-stone-900 border border-stone-800 hover:border-gold-500/50 text-[10px] text-stone-400 hover:text-gold-300 transition-colors flex items-center gap-1 shadow-xs"
                    title={`Transition to next scene: ${scenes[idx + 1].transition?.type || 'crossfade'} (${scenes[idx + 1].transition?.duration || 0.6}s)`}
                  >
                    <Sparkles className="w-2.5 h-2.5 text-gold-400" />
                    <span className="capitalize">{scenes[idx + 1].transition?.type || 'crossfade'}</span>
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 3. Audio Track Strip */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActiveSidebarTab('music');
          }}
          className="h-8 mt-2 rounded-lg bg-royal-950/40 border border-amber-900/40 px-3 flex items-center justify-between text-[11px] hover:border-gold-500/50 transition-colors cursor-pointer group"
          title="Click to edit Background Music & Audio Track"
        >
          <div className="flex items-center space-x-2">
            <Music className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-gold-300 font-medium truncate max-w-[200px] sm:max-w-[360px]">
              {audioTrack ? audioTrack.title : 'No Audio Track Selected'}
            </span>
            {audioTrack?.isSynth && (
              <span className="text-[9px] bg-royal-950 text-gold-400 border border-gold-500/30 px-1.5 rounded">
                Sacred Synth
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-stone-400 group-hover:text-gold-300 transition-colors">
            {audioTrack && (
              <span className="flex items-center gap-1 text-[10px]">
                <Volume2 className="w-3 h-3 text-gold-400" />
                {Math.round((audioTrack.volume || 0.85) * 100)}%
              </span>
            )}
            <span className="text-[10px] underline">Audio Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
