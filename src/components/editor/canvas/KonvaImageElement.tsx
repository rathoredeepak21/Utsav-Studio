'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Image as KImage, Rect as KRect, Group as KGroup } from 'react-konva';
import Konva from 'konva';
import { ImageCanvasElement } from '@/types/editor';
import { useEditorStore } from '@/lib/store/useEditorStore';

interface KonvaImageElementProps {
  element: ImageCanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  onDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

export function KonvaImageElement({
  element,
  isSelected,
  onSelect,
  onDragMove,
  onDragEnd,
}: KonvaImageElementProps) {
  const shapeRef = useRef<Konva.Image>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const { updateElement } = useEditorStore();

  useEffect(() => {
    if (!element.src) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = element.src;
    img.onload = () => {
      setImageObj(img);
    };
  }, [element.src]);

  return (
    <KImage
      ref={shapeRef}
      id={element.id}
      name={element.id}
      image={imageObj || undefined}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation || 0}
      opacity={element.opacity ?? 1}
      visible={element.isVisible !== false}
      draggable={!element.isLocked}
      cornerRadius={element.borderRadius || 0}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect(false);
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
          width: Math.max(20, Math.round(node.width() * scaleX)),
          height: Math.max(20, Math.round(node.height() * scaleY)),
          rotation: Math.round(node.rotation()),
        });
      }}
    />
  );
}
