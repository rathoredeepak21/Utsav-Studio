'use client';

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Transformer, Line } from 'react-konva';
import Konva from 'konva';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { KonvaTextElement } from './KonvaTextElement';
import { KonvaImageElement } from './KonvaImageElement';
import { KonvaStickerElement } from './KonvaStickerElement';
import { KonvaShapeElement } from './KonvaShapeElement';
import { CanvasInlineTextEditor } from './CanvasInlineTextEditor';

interface Guideline {
  type: 'x' | 'y';
  pos: number;
}

export interface KonvaStageWrapperHandle {
  getStage: () => Konva.Stage | null;
}

export const KonvaStageWrapper = forwardRef<KonvaStageWrapperHandle>((props, ref) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const {
    dimensions,
    background,
    elements,
    selectedElementIds,
    selectElement,
    clearSelection,
    zoom,
    setZoom,
  } = useEditorStore();

  const [guidelines, setGuidelines] = useState<Guideline[]>([]);

  useImperativeHandle(ref, () => ({
    getStage: () => stageRef.current,
  }));

  // Update Transformer nodes whenever selectedElementIds or elements change
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    const stage = stageRef.current;
    const selectedNodes: Konva.Node[] = [];

    selectedElementIds.forEach((id) => {
      const node = stage.findOne(`#${id}`);
      if (node) {
        selectedNodes.push(node);
      }
    });

    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedElementIds, elements]);

  // Deselect on clicking empty area
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage() || e.target.name() === 'canvas-background') {
      clearSelection();
    }
  };

  // Alignment snapping logic
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const box = node.getClientRect();
    const stageWidth = dimensions.width;
    const stageHeight = dimensions.height;

    const centerX = node.x() + (node.width() ? node.width() / 2 : 0);
    const centerY = node.y() + (node.height() ? node.height() / 2 : 0);

    const SNAP_THRESHOLD = 12;
    const activeGuides: Guideline[] = [];

    // Snap to horizontal center
    if (Math.abs(centerX - stageWidth / 2) < SNAP_THRESHOLD) {
      node.x(stageWidth / 2 - (node.width() ? node.width() / 2 : 0));
      activeGuides.push({ type: 'x', pos: stageWidth / 2 });
    }

    // Snap to vertical center
    if (Math.abs(centerY - stageHeight / 2) < SNAP_THRESHOLD) {
      node.y(stageHeight / 2 - (node.height() ? node.height() / 2 : 0));
      activeGuides.push({ type: 'y', pos: stageHeight / 2 });
    }

    setGuidelines(activeGuides);
  };

  const handleDragEnd = () => {
    setGuidelines([]);
  };

  // Sort elements by zIndex
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  // Background Fill Calculation
  const renderBackground = () => {
    if (background.type === 'solid' || !background.gradient) {
      return (
        <Rect
          name="canvas-background"
          x={0}
          y={0}
          width={dimensions.width}
          height={dimensions.height}
          fill={background.color || '#FAF6EE'}
          listening={true}
        />
      );
    }

    const { from, via, to } = background.gradient;
    return (
      <Rect
        name="canvas-background"
        x={0}
        y={0}
        width={dimensions.width}
        height={dimensions.height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: dimensions.height }}
        fillLinearGradientColorStops={
          via
            ? [0, from, 0.5, via, 1, to]
            : [0, from, 1, to]
        }
        listening={true}
      />
    );
  };

  return (
    <div className="relative select-none flex items-center justify-center p-4">
      {/* Visual Canvas Drop Shadow Container */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-400/90 transition-shadow duration-300"
        style={{
          width: `${dimensions.width * zoom}px`,
          height: `${dimensions.height * zoom}px`,
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.25)',
        }}
      >
        <Stage
          ref={stageRef}
          width={dimensions.width * zoom}
          height={dimensions.height * zoom}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          {/* Layer 1: Background */}
          <Layer listening={true}>
            {renderBackground()}
          </Layer>

          {/* Layer 2: Canvas Elements */}
          <Layer listening={true}>
            {sortedElements.map((el) => {
              const isSelected = selectedElementIds.includes(el.id);
              if (el.type === 'text') {
                return (
                  <KonvaTextElement
                    key={el.id}
                    element={el}
                    isSelected={isSelected}
                    onSelect={(multi) => selectElement(el.id, multi)}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  />
                );
              }
              if (el.type === 'image') {
                return (
                  <KonvaImageElement
                    key={el.id}
                    element={el}
                    isSelected={isSelected}
                    onSelect={(multi) => selectElement(el.id, multi)}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  />
                );
              }
              if (el.type === 'sticker') {
                return (
                  <KonvaStickerElement
                    key={el.id}
                    element={el}
                    isSelected={isSelected}
                    onSelect={(multi) => selectElement(el.id, multi)}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  />
                );
              }
              if (el.type === 'shape') {
                return (
                  <KonvaShapeElement
                    key={el.id}
                    element={el}
                    isSelected={isSelected}
                    onSelect={(multi) => selectElement(el.id, multi)}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  />
                );
              }
              return null;
            })}
          </Layer>

          {/* Layer 3: Guidelines & Transformer */}
          <Layer listening={true}>
            {/* Alignment Guides */}
            {guidelines.map((guide, i) => {
              if (guide.type === 'x') {
                return (
                  <Line
                    key={i}
                    points={[guide.pos, 0, guide.pos, dimensions.height]}
                    stroke="#D4AF37"
                    strokeWidth={2}
                    dash={[10, 6]}
                  />
                );
              }
              return (
                <Line
                  key={i}
                  points={[0, guide.pos, dimensions.width, guide.pos]}
                  stroke="#D4AF37"
                  strokeWidth={2}
                  dash={[10, 6]}
                />
              );
            })}

            {/* Selection Bounding Transformer */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Minimum size constraint
                if (Math.abs(newBox.width) < 15 || Math.abs(newBox.height) < 15) {
                  return oldBox;
                }
                return newBox;
              }}
              borderStroke="#D4AF37"
              borderStrokeWidth={2}
              anchorStroke="#D4AF37"
              anchorFill="#FFFFFF"
              anchorSize={10}
              anchorCornerRadius={2}
              rotateAnchorOffset={24}
              enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
                'middle-left',
                'middle-right',
                'top-center',
                'bottom-center',
              ]}
            />
          </Layer>
        </Stage>
      </div>

      {/* Floating Inline Text Editor for double-clicked text */}
      <CanvasInlineTextEditor stageRef={stageRef} />
    </div>
  );
});

KonvaStageWrapper.displayName = 'KonvaStageWrapper';
