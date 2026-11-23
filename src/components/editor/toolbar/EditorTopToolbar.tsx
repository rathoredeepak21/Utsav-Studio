'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { exportCanvas } from '@/lib/editor/exportHelper';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  Download,
  Eye,
  FileImage,
  FileText,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface EditorTopToolbarProps {
  onExport: (format: 'png' | 'jpg' | 'pdf') => void;
  isExporting: boolean;
}

export function EditorTopToolbar({ onExport, isExporting }: EditorTopToolbarProps) {
  const {
    projectTitle,
    setProjectTitle,
    dimensions,
    setDimensions,
    zoom,
    setZoom,
    undo,
    redo,
    past,
    future,
    saveStatus,
    saveProject,
    setIsPreviewOpen,
  } = useEditorStore();

  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isDimensionsDropdownOpen, setIsDimensionsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsExportDropdownOpen(false);
        setIsDimensionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return (
    <header className="h-14 bg-stone-950 border-b border-stone-800 px-3 sm:px-4 flex items-center justify-between gap-2 z-40 select-none text-stone-200">
      {/* Left: Navigation & Project Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <Link
          href="/templates"
          className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-800"
          title="Back to Templates Gallery"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Project Title Input */}
        <div className="flex items-center space-x-1.5">
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="bg-transparent hover:bg-stone-900 focus:bg-stone-900 border border-transparent hover:border-stone-700 focus:border-gold-400 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-semibold text-white focus:outline-none transition-colors max-w-[140px] sm:max-w-xs truncate"
            title="Click to rename project"
          />
        </div>

        {/* Dimension Preset Badge / Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsDimensionsDropdownOpen(!isDimensionsDropdownOpen)}
            className="flex items-center space-x-1.5 text-xs bg-stone-900 hover:bg-stone-800 border border-stone-800 px-2.5 py-1 rounded-lg text-stone-300 transition-colors"
          >
            <span className="font-mono text-gold-400">
              {dimensions.width} × {dimensions.height}
            </span>
            <span className="text-[10px] text-stone-500 uppercase">({dimensions.preset})</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isDimensionsDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-48 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  setDimensions(1080, 1920, 'portrait');
                  setIsDimensionsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  dimensions.preset === 'portrait' ? 'bg-royal-800 text-gold-300 font-semibold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>Portrait (9:16)</span>
                <span className="font-mono text-[11px] opacity-70">1080×1920</span>
              </button>
              <button
                onClick={() => {
                  setDimensions(1920, 1080, 'landscape');
                  setIsDimensionsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  dimensions.preset === 'landscape' ? 'bg-royal-800 text-gold-300 font-semibold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>Landscape (16:9)</span>
                <span className="font-mono text-[11px] opacity-70">1920×1080</span>
              </button>
              <button
                onClick={() => {
                  setDimensions(1080, 1080, 'square');
                  setIsDimensionsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  dimensions.preset === 'square' ? 'bg-royal-800 text-gold-300 font-semibold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>Square (1:1)</span>
                <span className="font-mono text-[11px] opacity-70">1080×1080</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Undo / Redo & Zoom Controls */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Undo & Redo */}
        <div className="flex items-center bg-stone-900 rounded-lg border border-stone-800 p-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo ? 'text-stone-200 hover:bg-stone-800 hover:text-white' : 'text-stone-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo ? 'text-stone-200 hover:bg-stone-800 hover:text-white' : 'text-stone-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center bg-stone-900 rounded-lg border border-stone-800 p-0.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.15, z - 0.05))}
            className="p-1.5 text-stone-300 hover:bg-stone-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs text-gold-400 px-2 min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.05))}
            className="p-1.5 text-stone-300 hover:bg-stone-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(0.35)}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors text-[10px]"
            title="Fit to Screen"
          >
            Fit
          </button>
        </div>
      </div>

      {/* Right: Preview, Save Status & Export */}
      <div className="flex items-center space-x-2 shrink-0" ref={dropdownRef}>
        {/* Preview Button */}
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs flex items-center gap-1 transition-colors"
          title="Fullscreen Preview"
        >
          <Eye className="w-4 h-4 text-gold-400" />
          <span className="hidden md:inline">Preview</span>
        </button>

        {/* Save Status & Manual Save */}
        <button
          onClick={saveProject}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            saveStatus === 'saved'
              ? 'bg-stone-900 border-stone-800 text-emerald-400 hover:border-emerald-700'
              : saveStatus === 'saving'
              ? 'bg-stone-900 border-gold-800 text-gold-400'
              : 'bg-stone-900 border-amber-800 text-amber-300 hover:bg-stone-800'
          }`}
          title="Save project locally in IndexedDB"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">
            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <Button
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            variant="gold"
            size="sm"
            disabled={isExporting}
            className="shadow-gold-glow font-bold text-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>{isExporting ? 'Exporting...' : 'Download Free'}</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </Button>

          {isExportDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-stone-950 border-2 border-gold-400/80 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gold-300 uppercase tracking-wider border-b border-stone-800 flex items-center justify-between">
                <span>Select Format</span>
                <span className="text-emerald-400">100% Free</span>
              </div>

              <button
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onExport('png');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-stone-900 transition-colors flex items-start space-x-3 text-stone-200"
              >
                <div className="p-2 rounded-lg bg-gold-400/10 text-gold-400 shrink-0">
                  <FileImage className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Download PNG
                    <span className="text-[10px] bg-gold-500/20 text-gold-400 px-1.5 rounded">HD</span>
                  </div>
                  <div className="text-[11px] text-stone-400 leading-snug">
                    Best for crystal clear printing & WhatsApp sharing
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onExport('jpg');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-stone-900 transition-colors flex items-start space-x-3 text-stone-200"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <FileImage className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Download JPG
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">Web</span>
                  </div>
                  <div className="text-[11px] text-stone-400 leading-snug">
                    Lightweight image optimized for fast messaging
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onExport('pdf');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-stone-900 transition-colors flex items-start space-x-3 text-stone-200"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Download PDF
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 rounded">Print</span>
                  </div>
                  <div className="text-[11px] text-stone-400 leading-snug">
                    Standard document ready for commercial printing
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
