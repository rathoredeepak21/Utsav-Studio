'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVideoEditorStore } from '@/lib/store/useVideoEditorStore';
import { VideoAspectRatio } from '@/types/videoEditor';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Save,
  CheckCircle,
  Loader2,
  Play,
  Download,
  Smartphone,
  Monitor,
  Square,
  Sparkles,
} from 'lucide-react';

export function VideoEditorTopToolbar() {
  const {
    projectTitle,
    setProjectTitle,
    aspectRatio,
    setAspectRatio,
    undo,
    redo,
    past,
    future,
    saveStatus,
    saveProject,
    setIsPreviewModalOpen,
    setIsExportModalOpen,
    play,
  } = useVideoEditorStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectTitle);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      setProjectTitle(titleInput.trim());
    } else {
      setTitleInput(projectTitle);
    }
  };

  return (
    <header className="h-14 bg-stone-950 border-b border-stone-800 px-3 sm:px-4 flex items-center justify-between text-stone-200 select-none z-30 shrink-0">
      {/* Left: Back & Project Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <Link
          href="/templates?type=video"
          className="flex items-center space-x-1.5 text-xs text-stone-400 hover:text-gold-400 transition-colors p-1.5 rounded-lg hover:bg-stone-900 shrink-0"
          title="Back to Templates"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline font-medium">Templates</span>
        </Link>

        <div className="h-4 w-px bg-stone-800 shrink-0" />

        {/* Project Title */}
        <div className="min-w-0 flex items-center">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleInput(projectTitle);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="bg-stone-900 border border-gold-500/60 rounded px-2 py-0.5 text-xs text-white focus:outline-none max-w-[200px] sm:max-w-[280px]"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(projectTitle);
                setIsEditingTitle(true);
              }}
              className="text-xs sm:text-sm font-medium text-white hover:text-gold-300 truncate max-w-[140px] sm:max-w-[240px] md:max-w-[320px] text-left px-1.5 py-0.5 rounded hover:bg-stone-900 transition-colors"
              title="Click to rename video project"
            >
              {projectTitle}
            </button>
          )}
        </div>
      </div>

      {/* Center: Aspect Ratio & Undo/Redo */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Aspect Ratio Switcher */}
        <div className="hidden sm:flex items-center bg-stone-900 p-0.5 rounded-lg border border-stone-800 text-[11px]">
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
              aspectRatio === '9:16'
                ? 'bg-royal-950 text-gold-300 font-semibold border border-gold-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Portrait Reel (9:16 - 1080x1920)"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden lg:inline">9:16 Reel</span>
          </button>
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
              aspectRatio === '16:9'
                ? 'bg-royal-950 text-gold-300 font-semibold border border-gold-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Landscape Video (16:9 - 1920x1080)"
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden lg:inline">16:9 Video</span>
          </button>
          <button
            onClick={() => setAspectRatio('1:1')}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
              aspectRatio === '1:1'
                ? 'bg-royal-950 text-gold-300 font-semibold border border-gold-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Square Post (1:1 - 1080x1080)"
          >
            <Square className="w-3 h-3" />
            <span className="hidden lg:inline">1:1 Square</span>
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 bg-stone-900 p-0.5 rounded-lg border border-stone-800">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="p-1.5 rounded text-stone-300 hover:text-white disabled:opacity-30 disabled:hover:text-stone-300 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-1.5 rounded text-stone-300 hover:text-white disabled:opacity-30 disabled:hover:text-stone-300 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Save Status, Preview & Export */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Save Status Pill */}
        <button
          onClick={saveProject}
          disabled={saveStatus === 'saving'}
          className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] border border-stone-800 bg-stone-900 text-stone-400 hover:text-white transition-colors"
          title="Save to browser IndexedDB (Ctrl+S)"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="w-3 h-3 text-gold-400 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300">Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3 h-3 text-gold-400" />
              <span className="text-stone-300">Save</span>
            </>
          )}
        </button>

        {/* Fullscreen Preview */}
        <button
          onClick={() => {
            play();
            setIsPreviewModalOpen(true);
          }}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-900 border border-stone-700 text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
          title="Fullscreen Clean Preview"
        >
          <Play className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
          <span className="hidden md:inline">Preview</span>
        </button>

        {/* Export Video Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 via-gold-500 to-amber-600 text-stone-950 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  );
}
