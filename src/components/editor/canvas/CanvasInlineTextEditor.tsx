'use client';

import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { TextCanvasElement } from '@/types/editor';

interface CanvasInlineTextEditorProps {
  stageRef: React.RefObject<any>;
}

export function CanvasInlineTextEditor({ stageRef }: CanvasInlineTextEditorProps) {
  const { elements, editingTextId, updateElement, setEditingTextId, zoom } = useEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeElement = elements.find(
    (el) => el.id === editingTextId && el.type === 'text'
  ) as TextCanvasElement | undefined;

  useEffect(() => {
    if (activeElement && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [activeElement?.id]);

  if (!activeElement || !stageRef.current) return null;

  const stage = stageRef.current;
  const containerRect = stage.container().getBoundingClientRect();

  // Position relative to stage container
  const left = containerRect.left + (activeElement.x * zoom);
  const top = containerRect.top + (activeElement.y * zoom);
  const width = Math.max(120, activeElement.width * zoom);
  const minHeight = Math.max(40, activeElement.fontSize * (activeElement.lineHeight || 1.25) * zoom * 1.5);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setEditingTextId(null);
    }
  };

  return (
    <div
      className="fixed z-50 pointer-events-auto"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        transform: `rotate(${activeElement.rotation || 0}deg)`,
        transformOrigin: 'top left',
      }}
    >
      <textarea
        ref={textareaRef}
        value={activeElement.text}
        onChange={(e) => {
          updateElement(activeElement.id, { text: e.target.value }, true);
        }}
        onBlur={() => {
          setEditingTextId(null);
        }}
        onKeyDown={handleKeyDown}
        className="w-full bg-black/70 border-2 border-gold-400 rounded-lg p-2 text-white shadow-2xl outline-none resize-none overflow-hidden"
        style={{
          fontFamily: activeElement.fontFamily || 'Noto Sans Devanagari',
          fontSize: `${activeElement.fontSize * zoom}px`,
          lineHeight: activeElement.lineHeight || 1.25,
          textAlign: activeElement.align || 'center',
          fontWeight: activeElement.fontStyle?.includes('bold') ? 'bold' : 'normal',
          fontStyle: activeElement.fontStyle?.includes('italic') ? 'italic' : 'normal',
          color: activeElement.fill || '#FFFFFF',
          minHeight: `${minHeight}px`,
        }}
      />
      <div className="text-[10px] bg-royal-950/90 text-gold-300 px-2 py-0.5 rounded shadow mt-1 inline-block border border-gold-400/40">
        Press Escape or click outside to finish editing
      </div>
    </div>
  );
}
