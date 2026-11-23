'use client';

import React, { useEffect } from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { Button } from '@/components/common/Button';
import { X, Download, Sparkles } from 'lucide-react';

interface EditorPreviewModalProps {
  onExport: (format: 'png' | 'jpg' | 'pdf') => void;
}

export function EditorPreviewModal({ onExport }: EditorPreviewModalProps) {
  const { isPreviewOpen, setIsPreviewOpen, projectTitle, background, dimensions, elements } =
    useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPreviewOpen(false);
    };
    if (isPreviewOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen, setIsPreviewOpen]);

  if (!isPreviewOpen) return null;

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between max-w-4xl mx-auto bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-2xl px-4 py-2.5 shadow-2xl">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-md">
            {projectTitle} (Clean Preview)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => onExport('png')}
            variant="gold"
            size="sm"
            className="text-xs font-bold shadow-gold-glow"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download PNG
          </Button>

          <button
            onClick={() => setIsPreviewOpen(false)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="Close Preview (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scaled Preview Frame */}
      <div
        className="relative shadow-2xl rounded-2xl overflow-hidden border-4 border-gold-400/90 my-auto"
        style={{
          width: '360px',
          height: `${(360 / dimensions.width) * dimensions.height}px`,
          backgroundColor: background.color || '#FAF6EE',
          background:
            background.type === 'gradient' && background.gradient
              ? `linear-gradient(${background.gradient.angle || 180}deg, ${background.gradient.from}, ${background.gradient.to})`
              : background.color,
        }}
      >
        {/* Render elements proportionally scaled */}
        {sortedElements.map((el) => {
          const scale = 360 / dimensions.width;
          const left = el.x * scale;
          const top = el.y * scale;
          const w = el.width * scale;
          const h = el.height * scale;

          if (el.type === 'text') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${w}px`,
                  fontSize: `${el.fontSize * scale}px`,
                  fontFamily: el.fontFamily,
                  color: el.fill,
                  textAlign: el.align,
                  lineHeight: el.lineHeight || 1.25,
                  fontWeight: el.fontStyle?.includes('bold') ? 'bold' : 'normal',
                  fontStyle: el.fontStyle?.includes('italic') ? 'italic' : 'normal',
                  transform: `rotate(${el.rotation || 0}deg)`,
                  transformOrigin: 'top left',
                  opacity: el.opacity ?? 1,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {el.text}
              </div>
            );
          }

          if (el.type === 'image' || el.type === 'sticker') {
            const src = el.type === 'image' ? el.src : el.svgDataUri;
            if (!src) return null;
            return (
              <img
                key={el.id}
                src={src}
                alt=""
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${w}px`,
                  height: `${h}px`,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  transformOrigin: 'top left',
                  opacity: el.opacity ?? 1,
                  objectFit: 'contain',
                }}
              />
            );
          }

          if (el.type === 'shape') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${w}px`,
                  height: `${h}px`,
                  backgroundColor: el.fill,
                  border: el.strokeWidth ? `${el.strokeWidth * scale}px solid ${el.stroke}` : undefined,
                  borderRadius: el.shapeType === 'circle' ? '50%' : `${(el.cornerRadius || 0) * scale}px`,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  transformOrigin: 'top left',
                  opacity: el.opacity ?? 1,
                }}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
