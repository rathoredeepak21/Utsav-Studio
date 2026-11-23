'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { getTemplateById } from '@/lib/repositories/templateRepository';
import { EditorTopToolbar } from '@/components/editor/toolbar/EditorTopToolbar';
import { EditorLeftSidebar } from '@/components/editor/sidebar/EditorLeftSidebar';
import { EditorRightSidebar } from '@/components/editor/properties/EditorRightSidebar';
import { EditorPreviewModal } from '@/components/editor/modals/EditorPreviewModal';
import { exportCanvas } from '@/lib/editor/exportHelper';
import { KonvaStageWrapperHandle } from '@/components/editor/canvas/KonvaStageWrapper';
import { Button } from '@/components/common/Button';
import { AlertCircle, Sparkles, CheckCircle } from 'lucide-react';

// Dynamically import KonvaStageWrapper to avoid SSR canvas errors
const KonvaStageWrapper = dynamic(
  () => import('@/components/editor/canvas/KonvaStageWrapper').then((m) => m.KonvaStageWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-stone-500 font-serif">
        <p>Loading Canva Studio Engine...</p>
      </div>
    ),
  }
);

function CardEditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');

  const {
    loadTemplate,
    initBlankProject,
    undo,
    redo,
    removeSelectedElements,
    duplicateElement,
    selectedElementIds,
    clearSelection,
    saveProject,
    projectTitle,
  } = useEditorStore();

  const [hasCheckedTemplate, setHasCheckedTemplate] = useState(false);
  const [templateNotFound, setTemplateNotFound] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const stageHandleRef = useRef<KonvaStageWrapperHandle>(null);

  // Load template or initialize blank project
  useEffect(() => {
    if (templateId) {
      getTemplateById(templateId).then((t) => {
        if (t) {
          loadTemplate(t);
          setTemplateNotFound(false);
        } else {
          setTemplateNotFound(true);
        }
        setHasCheckedTemplate(true);
      });
    } else {
      initBlankProject('portrait');
      setHasCheckedTemplate(true);
      setTemplateNotFound(false);
    }
  }, [templateId]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+D, Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedElementIds.length > 0) {
          duplicateElement(selectedElementIds[0]);
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveProject();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeSelectedElements();
      } else if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, removeSelectedElements, duplicateElement, selectedElementIds, clearSelection, saveProject]);

  // Handle Export (PNG, JPG, PDF)
  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    const stage = stageHandleRef.current?.getStage();
    if (!stage) {
      alert('Canvas stage is not ready for export.');
      return;
    }

    setIsExporting(true);
    clearSelection(); // Deselect to avoid selection transformer box in exported file

    try {
      await exportCanvas(stage, {
        format,
        filename: projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || 'utsav-invitation',
      });
      setExportSuccessMessage(
        `Your invitation was exported as high-resolution ${format.toUpperCase()} successfully with 0 watermark!`
      );
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Graceful Error Boundary: Template Not Found
  if (hasCheckedTemplate && templateNotFound) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 p-8 rounded-3xl border border-stone-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Template Not Found
          </h2>
          <p className="font-hindi text-gold-400 text-sm mb-3">
            मांगलिक निमंत्रण टेम्पलेट नहीं मिला
          </p>
          <p className="text-stone-400 text-xs leading-relaxed mb-6">
            We could not find the template with ID <code className="text-gold-400 bg-stone-900 px-2 py-0.5 rounded font-mono">{templateId}</code>.
          </p>
          <div className="flex flex-col gap-3">
            <Button href="/templates" variant="gold" size="md" className="justify-center shadow-gold-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Browse Template Gallery
            </Button>
            <Button href="/card-editor" variant="outline" size="md" className="justify-center text-white border-stone-700 hover:bg-stone-800">
              Start Blank Canvas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col h-screen overflow-hidden">
      {/* 1. Top Toolbar */}
      <EditorTopToolbar onExport={handleExport} isExporting={isExporting} />

      {/* 2. Success Banner */}
      {exportSuccessMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/80 px-4 py-2 text-xs text-emerald-300 flex items-center justify-center gap-2 z-40 transition-all">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Tools */}
        <EditorLeftSidebar />

        {/* Center Canvas Stage Viewport */}
        <main className="flex-1 bg-stone-900 overflow-auto flex items-center justify-center relative p-4 sm:p-8">
          <KonvaStageWrapper ref={stageHandleRef} />
        </main>

        {/* Right Properties Panel */}
        <div className="hidden lg:flex">
          <EditorRightSidebar />
        </div>
      </div>

      {/* 4. Fullscreen Clean Preview Modal */}
      <EditorPreviewModal onExport={handleExport} />
    </div>
  );
}

export default function CardEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center">
          <p className="font-serif text-gold-400 text-lg">Loading Utsav Studio Editor...</p>
        </div>
      }
    >
      <CardEditorContent />
    </Suspense>
  );
}
