'use client';

import React, { useRef } from 'react';
import {
  Rect as KRect,
  Circle as KCircle,
  Star as KStar,
  Path as KPath,
  Line as KLine,
} from 'react-konva';
import Konva from 'konva';
import { ShapeCanvasElement } from '@/types/editor';
import { useEditorStore } from '@/lib/store/useEditorStore';

interface KonvaShapeElementProps {
  element: ShapeCanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  onDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

export function KonvaShapeElement({
  element,
  isSelected,
  onSelect,
  onDragMove,
  onDragEnd,
}: KonvaShapeElementProps) {
  const shapeRef = useRef<any>(null);
  const { updateElement } = useEditorStore();

  const commonProps = {
    ref: shapeRef,
    id: element.id,
    name: element.id,
    x: element.x,
    y: element.y,
    rotation: element.rotation || 0,
    opacity: element.opacity ?? 1,
    visible: element.isVisible !== false,
    draggable: !element.isLocked,
    fill: element.fill || '#D4AF37',
    stroke: element.stroke || undefined,
    strokeWidth: element.strokeWidth || 0,
    onClick: (e: any) => {
      e.cancelBubble = true;
      onSelect(e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey);
    },
    onTap: (e: any) => {
      e.cancelBubble = true;
      onSelect(false);
    },
    onDragMove,
    onDragEnd: (e: any) => {
      if (onDragEnd) onDragEnd(e);
      updateElement(element.id, {
        x: Math.round(e.target.x()),
        y: Math.round(e.target.y()),
      });
    },
    onTransformEnd: () => {
      const node = shapeRef.current;
      if (!node) return;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      updateElement(element.id, {
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        width: Math.max(10, Math.round(node.width() * scaleX)),
        height: Math.max(10, Math.round(node.height() * scaleY)),
        rotation: Math.round(node.rotation()),
      });
    },
  };

  if (element.shapeType === 'circle') {
    const radius = Math.min(element.width, element.height) / 2;
    return <KCircle {...commonProps} radius={radius} offsetX={-radius} offsetY={-radius} />;
  }

  if (element.shapeType === 'star') {
    const outerRadius = Math.min(element.width, element.height) / 2;
    const innerRadius = outerRadius * 0.45;
    return (
      <KStar
        {...commonProps}
        numPoints={5}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        offsetX={-outerRadius}
        offsetY={-outerRadius}
      />
    );
  }

  if (element.shapeType === 'heart') {
    // Standard SVG Heart path normalized to 100x100
    const heartSvg = 'M 50,30 A 20,20 0,0,0 10,50 C 10,75 50,95 50,95 C 50,95 90,75 90,50 A 20,20 0,0,0 50,30 Z';
    const scaleX = element.width / 100;
    const scaleY = element.height / 100;
    return <KPath {...commonProps} data={heartSvg} scaleX={scaleX} scaleY={scaleY} />;
  }

  if (element.shapeType === 'line') {
    return (
      <KLine
        {...commonProps}
        points={[0, 0, element.width, 0]}
        stroke={element.fill || element.stroke || '#D4AF37'}
        strokeWidth={element.strokeWidth || 3}
      />
    );
  }

  // Default: Rectangle
  return (
    <KRect
      {...commonProps}
      width={element.width}
      height={element.height}
      cornerRadius={element.cornerRadius || 0}
    />
  );
}
