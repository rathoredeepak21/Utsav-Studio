'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useVideoEditorStore } from '@/lib/store/useVideoEditorStore';
import { getTemplateById } from '@/lib/repositories/templateRepository';
import { getVideoProjectById } from '@/lib/storage/db';
import { VideoEditorTopToolbar } from '@/components/video-editor/toolbar/VideoEditorTopToolbar';
import { VideoEditorLeftSidebar } from '@/components/video-editor/sidebar/VideoEditorLeftSidebar';
import { VideoPreviewCanvas } from '@/components/video-editor/center/VideoPreviewCanvas';
import { VideoEditorRightSidebar } from '@/components/video-editor/properties/VideoEditorRightSidebar';
import { VideoEditorBottomTimeline } from '@/components/video-editor/timeline/VideoEditorBottomTimeline';
import { VideoExportModal } from '@/components/video-editor/modals/VideoExportModal';
import { VideoPreviewModal } from '@/components/video-editor/modals/VideoPreviewModal';
import { Button } from '@/components/common/Button';
import { AlertCircle, Film, ArrowLeft, Plus } from 'lucide-react';

function VideoEditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const projectIdParam = searchParams.get('project');

  const {
    initBlankProject,
    loadTemplate,
    loadProject,
    togglePlay,
    undo,
    redo,
    saveProject,
    deleteElement,
    selectedElementId,
    selectElement,
    scenes,
  } = useVideoEditorStore();

  const [isLoading, setIsLoading] = useState(true);
  const [templateNotFound, setTemplateNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      setIsLoading(true);
      setTemplateNotFound(false);

      if (projectIdParam) {
        // Try restoring project from IndexedDB
        const savedProject = await getVideoProjectById(projectIdParam);
        if (savedProject && isMounted) {
          loadProject(savedProject);
          setIsLoading(false);
          return;
        }
      }

      if (templateId) {
        // Try loading template
        const template = await getTemplateById(templateId);
        if (template && isMounted) {
          loadTemplate(template);
          setIsLoading(false);
          return;
        } else if (isMounted) {
          setTemplateNotFound(true);
          setIsLoading(false);
          return;
        }
      }

      // Default: Initialize blank project
      if (isMounted) {
        initBlankProject('9:16');
        setIsLoading(false);
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, [templateId, projectIdParam]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept shortcuts when typing in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveProject();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          deleteElement(selectedElementId);
        }
      } else if (e.key === 'Escape') {
        selectElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, undo, redo, saveProject, deleteElement, selectedElementId, selectElement]);

  // Template Not Found Screen
  if (templateNotFound) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 p-8 rounded-3xl border border-stone-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Video Template Not Found
          </h2>
          <p className="font-hindi text-gold-400 text-sm mb-3">
            वीडियो निमंत्रण टेम्पलेट नहीं मिला
          </p>
          <p className="text-stone-400 text-xs leading-relaxed mb-6">
            We could not find the template with ID{' '}
            <code className="text-gold-400 bg-stone-900 px-2 py-0.5 rounded font-mono">
              {templateId}
            </code>
            . You can explore other video templates or start with a blank canvas.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              href="/templates?type=video"
              variant="gold"
              size="md"
              className="justify-center shadow-gold-glow"
            >
              Explore Video Templates
            </Button>
            <Button
              onClick={() => {
                setTemplateNotFound(false);
                initBlankProject('9:16');
              }}
              variant="outline"
              size="md"
              className="justify-center text-white border-stone-700 hover:bg-stone-800"
            >
              Start Blank Video Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || scenes.length === 0) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-gold-400/30 border-t-gold-400 animate-spin" />
        <p className="font-serif text-gold-400 text-sm tracking-wide">
          Loading Utsav Studio Video Editor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col h-screen overflow-hidden select-none">
      {/* 1. Top Toolbar */}
      <VideoEditorTopToolbar />

      {/* 2. Main Middle Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Scenes, Templates, Text, Uploads, Motifs, Music, Transitions) */}
        <VideoEditorLeftSidebar />

        {/* Center Video Preview Canvas */}
        <VideoPreviewCanvas />

        {/* Right Sidebar (Properties of Element / Scene) */}
        <div className="hidden lg:flex">
          <VideoEditorRightSidebar />
        </div>
      </div>

      {/* 3. Bottom Multi-Track Timeline */}
      <VideoEditorBottomTimeline />

      {/* 4. Export Video Modal */}
      <VideoExportModal />

      {/* 5. Fullscreen Cinematic Preview Modal */}
      <VideoPreviewModal />
    </div>
  );
}

export default function VideoEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
          <p className="font-serif text-gold-400 text-lg">Loading Video Editor...</p>
        </div>
      }
    >
      <VideoEditorContent />
    </Suspense>
  );
}
