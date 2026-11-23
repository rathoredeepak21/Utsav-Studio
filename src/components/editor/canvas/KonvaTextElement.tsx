'use client';

import React, { useRef, useEffect } from 'react';
import { Text as KText } from 'react-konva';
import Konva from 'konva';
import { TextCanvasElement } from '@/types/editor';
import { useEditorStore } from '@/lib/store/useEditorStore';

interface KonvaTextElementProps {
  element: TextCanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  onDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

export function KonvaTextElement({
  element,
  isSelected,
  onSelect,
  onDragMove,
  onDragEnd,
}: KonvaTextElementProps) {
  const shapeRef = useRef<Konva.Text>(null);
  const { updateElement, setEditingTextId, editingTextId } = useEditorStore();

  const isEditingThis = editingTextId === element.id;

  return (
    <KText
      ref={shapeRef}
      id={element.id}
      name={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily || 'Noto Sans Devanagari'}
      fill={element.fill || '#FFFFFF'}
      align={element.align || 'center'}
      fontStyle={element.fontStyle || 'normal'}
      lineHeight={element.lineHeight || 1.25}
      letterSpacing={element.letterSpacing || 0}
      rotation={element.rotation || 0}
      opacity={isEditingThis ? 0 : element.opacity ?? 1}
      visible={element.isVisible !== false}
      draggable={!element.isLocked && !isEditingThis}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect(false);
      }}
      onDblClick={(e) => {
        e.cancelBubble = true;
        if (!element.isLocked) {
          setEditingTextId(element.id);
        }
      }}
      onDblTap={(e) => {
        e.cancelBubble = true;
        if (!element.isLocked) {
          setEditingTextId(element.id);
        }
      }}
      onDragMove={onDragMove}
      onDragEnd={(e) => {
        if (onDragEnd) onDragEnd(e);
        updateElement(element.id, {
          x: Math.round(e.target.x()),
          y: Math.round(e.target.y()),
        });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        updateElement(element.id, {
          x: Math.round(node.x()),
          y: Math.round(node.y()),
          width: Math.max(30, Math.round(node.width() * scaleX)),
          fontSize: Math.max(10, Math.round(node.fontSize() * scaleY)),
          rotation: Math.round(node.rotation()),
        });
      }}
    />
  );
}
