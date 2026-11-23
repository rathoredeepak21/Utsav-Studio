'use client';

import React from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { TextCanvasElement, ShapeCanvasElement, StickerCanvasElement, ImageCanvasElement } from '@/types/editor';
import { getMotifDataUri } from '@/lib/editor/motifSvgHelper';
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  BringToFront,
  SendToBack,
  ArrowUp,
  ArrowDown,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Sliders,
  Palette,
  Type,
  Square,
  Sparkles,
  Layers,
} from 'lucide-react';

export function EditorRightSidebar() {
  const {
    elements,
    selectedElementIds,
    updateElement,
    duplicateElement,
    removeElement,
    toggleLock,
    reorderElement,
    dimensions,
    setDimensions,
    background,
    setBackground,
  } = useEditorStore();

  const selectedElement = elements.find((el) => selectedElementIds.includes(el.id));

  // If no element selected, render Canvas settings
  if (!selectedElement) {
    return (
      <aside className="w-64 sm:w-72 bg-stone-950 border-l border-stone-800 p-4 flex flex-col space-y-5 overflow-y-auto text-xs text-stone-200 select-none">
        <div className="pb-3 border-b border-stone-800 flex items-center justify-between">
          <span className="font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-gold-400" />
            Canvas Settings
          </span>
          <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full font-mono">
            {dimensions.width}×{dimensions.height}
          </span>
        </div>

        {/* Dimension Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-stone-400 block">Aspect Ratio & Format</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { preset: 'portrait' as const, label: 'Portrait', size: '1080×1920' },
              { preset: 'landscape' as const, label: 'Landscape', size: '1920×1080' },
              { preset: 'square' as const, label: 'Square', size: '1080×1080' },
            ].map((p) => (
              <button
                key={p.preset}
                onClick={() => {
                  if (p.preset === 'portrait') setDimensions(1080, 1920, 'portrait');
                  if (p.preset === 'landscape') setDimensions(1920, 1080, 'landscape');
                  if (p.preset === 'square') setDimensions(1080, 1080, 'square');
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  dimensions.preset === p.preset
                    ? 'border-gold-400 bg-royal-950 text-gold-300 font-bold'
                    : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                }`}
              >
                <div className="text-xs">{p.label}</div>
                <div className="text-[9px] opacity-70">{p.size}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Background Color */}
        <div className="space-y-2 pt-2 border-t border-stone-800">
          <label className="text-[11px] font-semibold text-stone-400 block">Background Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={background.color || '#FAF6EE'}
              onChange={(e) => setBackground({ color: e.target.value })}
              className="w-9 h-9 rounded-lg border border-stone-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={background.color || '#FAF6EE'}
              onChange={(e) => setBackground({ color: e.target.value })}
              className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono"
            />
          </div>
        </div>

        {/* Summary Info */}
        <div className="pt-2 border-t border-stone-800 space-y-1.5 text-[11px] text-stone-400">
          <div className="flex justify-between">
            <span>Total Elements:</span>
            <span className="text-white font-semibold">{elements.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Resolution:</span>
            <span className="text-gold-400 font-mono">1080 × 1920 HD</span>
          </div>
          <div className="flex justify-between">
            <span>Privacy Mode:</span>
            <span className="text-emerald-400 font-medium">100% Client-Side</span>
          </div>
        </div>

        <p className="text-[10px] text-stone-500 leading-relaxed pt-3 border-t border-stone-800 text-center">
          Click any text, photo, or motif on the canvas to inspect and edit its properties.
        </p>
      </aside>
    );
  }

  // Element is selected: Render Element Inspector
  const isText = selectedElement.type === 'text';
  const isShape = selectedElement.type === 'shape';
  const isSticker = selectedElement.type === 'sticker';
  const isImage = selectedElement.type === 'image';

  const textEl = isText ? (selectedElement as TextCanvasElement) : null;
  const shapeEl = isShape ? (selectedElement as ShapeCanvasElement) : null;
  const stickerEl = isSticker ? (selectedElement as StickerCanvasElement) : null;

  return (
    <aside className="w-64 sm:w-72 bg-stone-950 border-l border-stone-800 p-4 flex flex-col space-y-4 overflow-y-auto text-xs text-stone-200 select-none">
      {/* Top Header: Element Name and Quick Actions */}
      <div className="pb-3 border-b border-stone-800 flex items-center justify-between">
        <div className="truncate mr-2">
          <p className="font-bold text-white text-xs truncate">{selectedElement.name}</p>
          <p className="text-[10px] text-gold-400 uppercase tracking-wider">{selectedElement.type}</p>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => toggleLock(selectedElement.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              selectedElement.isLocked
                ? 'bg-amber-950 border-amber-600 text-amber-400'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
            }`}
            title={selectedElement.isLocked ? 'Unlock Element' : 'Lock Element'}
          >
            {selectedElement.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => duplicateElement(selectedElement.id)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-colors"
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => removeElement(selectedElement.id)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-red-400 transition-colors"
            title="Delete (Delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TEXT SPECIFIC CONTROLS */}
      {isText && textEl && (
        <div className="space-y-3 pb-3 border-b border-stone-800">
          <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-wider block">
            Typography
          </span>

          {/* Font Family */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-1">Font Family</label>
            <select
              value={textEl.fontFamily || 'Noto Sans Devanagari'}
              onChange={(e) => updateElement(textEl.id, { fontFamily: e.target.value })}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="Cinzel">Cinzel (Royal Serif)</option>
              <option value="Rozha One">Rozha One (Traditional Hindi/Devanagari)</option>
              <option value="Noto Sans Devanagari">Noto Sans Devanagari (Clean Hindi)</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
              <option value="Great Vibes">Great Vibes (Calligraphy Cursive)</option>
              <option value="Georgia">Georgia (Classic Book Serif)</option>
            </select>
          </div>

          {/* Font Size & Color */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Size (px)</label>
              <input
                type="number"
                min={10}
                max={200}
                value={textEl.fontSize}
                onChange={(e) => updateElement(textEl.id, { fontSize: Number(e.target.value) })}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Text Color</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={textEl.fill || '#FFFFFF'}
                  onChange={(e) => updateElement(textEl.id, { fill: e.target.value })}
                  className="w-8 h-8 rounded border border-stone-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={textEl.fill || '#FFFFFF'}
                  onChange={(e) => updateElement(textEl.id, { fill: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-[11px] text-white uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Style & Alignment */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg p-0.5">
              <button
                onClick={() => {
                  const isBold = textEl.fontStyle?.includes('bold');
                  updateElement(textEl.id, { fontStyle: isBold ? 'normal' : 'bold' });
                }}
                className={`p-1.5 rounded ${textEl.fontStyle?.includes('bold') ? 'bg-gold-500 text-royal-950 font-bold' : 'text-stone-400 hover:text-white'}`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const isItalic = textEl.fontStyle?.includes('italic');
                  updateElement(textEl.id, { fontStyle: isItalic ? 'normal' : 'italic' });
                }}
                className={`p-1.5 rounded ${textEl.fontStyle?.includes('italic') ? 'bg-gold-500 text-royal-950 font-bold' : 'text-stone-400 hover:text-white'}`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg p-0.5">
              <button
                onClick={() => updateElement(textEl.id, { align: 'left' })}
                className={`p-1.5 rounded ${textEl.align === 'left' ? 'bg-royal-800 text-gold-300 font-bold' : 'text-stone-400 hover:text-white'}`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateElement(textEl.id, { align: 'center' })}
                className={`p-1.5 rounded ${textEl.align === 'center' ? 'bg-royal-800 text-gold-300 font-bold' : 'text-stone-400 hover:text-white'}`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateElement(textEl.id, { align: 'right' })}
                className={`p-1.5 rounded ${textEl.align === 'right' ? 'bg-royal-800 text-gold-300 font-bold' : 'text-stone-400 hover:text-white'}`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHAPE SPECIFIC CONTROLS */}
      {isShape && shapeEl && (
        <div className="space-y-3 pb-3 border-b border-stone-800">
          <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-wider block">
            Shape Fill & Stroke
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Fill Color</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={shapeEl.fill || '#D4AF37'}
                  onChange={(e) => updateElement(shapeEl.id, { fill: e.target.value })}
                  className="w-8 h-8 rounded border border-stone-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={shapeEl.fill || '#D4AF37'}
                  onChange={(e) => updateElement(shapeEl.id, { fill: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-[11px] text-white uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Stroke Width</label>
              <input
                type="number"
                min={0}
                max={40}
                value={shapeEl.strokeWidth || 0}
                onChange={(e) => updateElement(shapeEl.id, { strokeWidth: Number(e.target.value) })}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* STICKER / MOTIF SPECIFIC CONTROLS */}
      {isSticker && stickerEl && (
        <div className="space-y-3 pb-3 border-b border-stone-800">
          <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-wider block">
            Motif Colors
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Primary Color</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={stickerEl.color || '#D4AF37'}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    const uri = getMotifDataUri(stickerEl.stickerType, newColor, stickerEl.secondaryColor);
                    updateElement(stickerEl.id, { color: newColor, svgDataUri: uri });
                  }}
                  className="w-8 h-8 rounded border border-stone-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={stickerEl.color || '#D4AF37'}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    const uri = getMotifDataUri(stickerEl.stickerType, newColor, stickerEl.secondaryColor);
                    updateElement(stickerEl.id, { color: newColor, svgDataUri: uri });
                  }}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-[11px] text-white uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Secondary Accent</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={stickerEl.secondaryColor || '#BE185D'}
                  onChange={(e) => {
                    const newSec = e.target.value;
                    const uri = getMotifDataUri(stickerEl.stickerType, stickerEl.color, newSec);
                    updateElement(stickerEl.id, { secondaryColor: newSec, svgDataUri: uri });
                  }}
                  className="w-8 h-8 rounded border border-stone-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={stickerEl.secondaryColor || '#BE185D'}
                  onChange={(e) => {
                    const newSec = e.target.value;
                    const uri = getMotifDataUri(stickerEl.stickerType, stickerEl.color, newSec);
                    updateElement(stickerEl.id, { secondaryColor: newSec, svgDataUri: uri });
                  }}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-[11px] text-white uppercase font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POSITION & DIMENSIONS */}
      <div className="space-y-2.5 pb-3 border-b border-stone-800">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
          Position & Size
        </span>

        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div>
            <label className="text-[10px] text-stone-500 font-sans block">X</label>
            <input
              type="number"
              value={selectedElement.x}
              onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
              className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-stone-500 font-sans block">Y</label>
            <input
              type="number"
              value={selectedElement.y}
              onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
              className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-stone-500 font-sans block">Width</label>
            <input
              type="number"
              value={selectedElement.width}
              onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
              className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-stone-500 font-sans block">Height</label>
            <input
              type="number"
              value={selectedElement.height}
              onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
              className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-white"
            />
          </div>
        </div>
      </div>

      {/* ROTATION & OPACITY */}
      <div className="space-y-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-stone-400">Rotation</span>
            <span className="font-mono text-gold-400">{Math.round(selectedElement.rotation || 0)}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={selectedElement.rotation || 0}
            onChange={(e) => updateElement(selectedElement.id, { rotation: Number(e.target.value) })}
            className="w-full accent-gold-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-stone-400">Opacity</span>
            <span className="font-mono text-gold-400">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round((selectedElement.opacity ?? 1) * 100)}
            onChange={(e) => updateElement(selectedElement.id, { opacity: Number(e.target.value) / 100 })}
            className="w-full accent-gold-400"
          />
        </div>
      </div>

      {/* LAYER ORDERING */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
          Layer Arrangement
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => reorderElement(selectedElement.id, 'front')}
            className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg flex items-center justify-center gap-1.5 text-[11px] transition-colors"
          >
            <BringToFront className="w-3.5 h-3.5 text-gold-400" />
            <span>To Front</span>
          </button>
          <button
            onClick={() => reorderElement(selectedElement.id, 'forward')}
            className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg flex items-center justify-center gap-1.5 text-[11px] transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 text-stone-300" />
            <span>Forward</span>
          </button>
          <button
            onClick={() => reorderElement(selectedElement.id, 'backward')}
            className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg flex items-center justify-center gap-1.5 text-[11px] transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5 text-stone-300" />
            <span>Backward</span>
          </button>
          <button
            onClick={() => reorderElement(selectedElement.id, 'back')}
            className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg flex items-center justify-center gap-1.5 text-[11px] transition-colors"
          >
            <SendToBack className="w-3.5 h-3.5 text-gold-400" />
            <span>To Back</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
