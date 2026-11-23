'use client';

import React from 'react';
import { useVideoEditorStore } from '@/lib/store/useVideoEditorStore';
import {
  TextVideoElement,
  ImageVideoElement,
  StickerVideoElement,
  ShapeVideoElement,
  AnimationType,
  AnimationEasing,
} from '@/types/videoEditor';
import {
  Sparkles,
  Sliders,
  Type,
  Trash2,
  Copy,
  Clock,
  Layers,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

const ANIMATION_TYPES: { value: AnimationType; label: string }[] = [
  { value: 'none', label: 'None (Static)' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'fade-out', label: 'Fade Out' },
  { value: 'slide-left', label: 'Slide Left (Enter Right)' },
  { value: 'slide-right', label: 'Slide Right (Enter Left)' },
  { value: 'slide-up', label: 'Slide Up (Rise)' },
  { value: 'zoom-in', label: 'Zoom In (Scale Up)' },
  { value: 'zoom-out', label: 'Zoom Out (Scale Down)' },
  { value: 'rotate', label: 'Rotate In' },
  { value: 'typewriter', label: 'Typewriter (Letter by Letter)' },
];

const EASING_OPTIONS: { value: AnimationEasing; label: string }[] = [
  { value: 'ease-out', label: 'Ease Out (Natural Deceleration)' },
  { value: 'ease-in', label: 'Ease In (Accelerate)' },
  { value: 'ease-in-out', label: 'Ease In-Out (Smooth)' },
  { value: 'linear', label: 'Linear (Constant Speed)' },
  { value: 'bounce', label: 'Bounce (Playful)' },
];

export function VideoEditorRightSidebar() {
  const {
    getActiveScene,
    getSelectedElement,
    updateElement,
    deleteElement,
    duplicateElement,
    updateSceneDuration,
    updateScene,
    selectElement,
  } = useVideoEditorStore();

  const activeScene = getActiveScene();
  const selectedElement = getSelectedElement();

  // If no element is selected: Show Scene Inspector
  if (!selectedElement || !activeScene) {
    if (!activeScene) return null;

    return (
      <aside className="w-72 bg-stone-950 border-l border-stone-800 p-4 flex flex-col space-y-4 overflow-y-auto text-xs text-stone-200 select-none shrink-0">
        <div className="border-b border-stone-800 pb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 block mb-0.5">
            Scene Inspector
          </span>
          <h3 className="font-serif text-sm font-bold text-white">{activeScene.name}</h3>
        </div>

        {/* Scene Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-stone-300 font-medium">Scene Duration</span>
            <span className="font-mono text-gold-400 font-semibold">{activeScene.duration.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="15.0"
            step="0.5"
            value={activeScene.duration}
            onChange={(e) => updateSceneDuration(activeScene.id, parseFloat(e.target.value))}
            className="w-full accent-gold-400"
          />
        </div>

        {/* Scene Background Color */}
        <div className="space-y-2 pt-2 border-t border-stone-800">
          <span className="text-stone-300 font-medium block">Background Pattern Opacity</span>
          <input
            type="range"
            min="0"
            max="0.25"
            step="0.02"
            value={activeScene.background.patternOpacity ?? 0.08}
            onChange={(e) =>
              updateScene(activeScene.id, {
                background: {
                  ...activeScene.background,
                  patternOpacity: parseFloat(e.target.value),
                },
              })
            }
            className="w-full accent-gold-400"
          />
        </div>

        {/* Layers in this Scene */}
        <div className="space-y-2 pt-2 border-t border-stone-800">
          <span className="text-stone-300 font-medium block">Layers in Scene ({activeScene.elements.length})</span>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {activeScene.elements.map((el) => (
              <div
                key={el.id}
                onClick={() => selectElement(el.id)}
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-gold-400 cursor-pointer flex items-center justify-between transition-colors"
              >
                <span className="truncate max-w-[150px] font-medium text-white">{el.name}</span>
                <span className="text-[10px] text-gold-400 uppercase font-mono">{el.type}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  // Element is selected: Show Element Inspector
  const isText = selectedElement.type === 'text';
  const isImage = selectedElement.type === 'image';
  const isSticker = selectedElement.type === 'sticker';
  const textEl = isText ? (selectedElement as TextVideoElement) : null;
  const imageEl = isImage ? (selectedElement as ImageVideoElement) : null;
  const stickerEl = isSticker ? (selectedElement as StickerVideoElement) : null;

  const anim = selectedElement.animation || {
    type: 'fade-in',
    startTime: 0.2,
    duration: 0.8,
    easing: 'ease-out',
  };

  return (
    <aside className="w-72 sm:w-80 bg-stone-950 border-l border-stone-800 p-4 flex flex-col space-y-4 overflow-y-auto text-xs text-stone-200 select-none shrink-0">
      {/* Top Header */}
      <div className="border-b border-stone-800 pb-2 flex items-center justify-between">
        <div className="truncate mr-2">
          <p className="font-bold text-white text-xs truncate">{selectedElement.name}</p>
          <span className="text-[10px] text-gold-400 uppercase font-mono">{selectedElement.type}</span>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => duplicateElement(selectedElement.id)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white"
            title="Duplicate Element"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-rose-400"
            title="Delete Element"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TEXT PROPERTIES */}
      {isText && textEl && (
        <div className="space-y-3 pb-3 border-b border-stone-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 block">
            Text & Typography
          </span>

          {/* Text Content */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-1">Text Content</label>
            <textarea
              value={textEl.text}
              onChange={(e) => updateElement(textEl.id, { text: e.target.value })}
              rows={3}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-400 font-hindi"
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-1">Font Family</label>
            <select
              value={textEl.fontFamily || 'Noto Sans Devanagari'}
              onChange={(e) => updateElement(textEl.id, { fontFamily: e.target.value })}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="Cinzel">Cinzel (Royal Serif)</option>
              <option value="Rozha One">Rozha One (Traditional Hindi)</option>
              <option value="Noto Sans Devanagari">Noto Sans Devanagari (Clean Hindi)</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-stone-400">Font Size</span>
              <span className="font-mono text-gold-400">{textEl.fontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="110"
              value={textEl.fontSize}
              onChange={(e) => updateElement(textEl.id, { fontSize: parseInt(e.target.value) })}
              className="w-full accent-gold-400"
            />
          </div>

          {/* Text Color */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-1">Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={textEl.fill || '#FFFFFF'}
                onChange={(e) => updateElement(textEl.id, { fill: e.target.value })}
                className="w-7 h-7 rounded border border-stone-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-xs uppercase">{textEl.fill || '#FFFFFF'}</span>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PROPERTIES */}
      {isImage && imageEl && (
        <div className="space-y-3 pb-3 border-b border-stone-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 block">
            Image Framing
          </span>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-stone-400">Corner Radius</span>
              <span className="font-mono text-gold-400">{imageEl.borderRadius || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              value={imageEl.borderRadius || 0}
              onChange={(e) => updateElement(imageEl.id, { borderRadius: parseInt(e.target.value) })}
              className="w-full accent-gold-400"
            />
          </div>
        </div>
      )}

      {/* ANIMATION ENGINE CONFIGURATION (DETERMINISTIC) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Animation Engine</span>
          </span>
        </div>

        {/* Animation Preset Type */}
        <div>
          <label className="text-[10px] text-stone-400 block mb-1">Animation Effect</label>
          <select
            value={anim.type}
            onChange={(e) =>
              updateElement(selectedElement.id, {
                animation: {
                  ...anim,
                  type: e.target.value as AnimationType,
                },
              })
            }
            className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            {ANIMATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time / Delay */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-stone-400">Start Delay (in Scene)</span>
            <span className="font-mono text-gold-400">{(anim.startTime || 0).toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(1, activeScene.duration - 0.5)}
            step="0.1"
            value={anim.startTime || 0}
            onChange={(e) =>
              updateElement(selectedElement.id, {
                animation: {
                  ...anim,
                  startTime: parseFloat(e.target.value),
                },
              })
            }
            className="w-full accent-gold-400"
          />
        </div>

        {/* Animation Duration */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-stone-400">Animation Duration</span>
            <span className="font-mono text-gold-400">{(anim.duration || 0.8).toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={anim.duration || 0.8}
            onChange={(e) =>
              updateElement(selectedElement.id, {
                animation: {
                  ...anim,
                  duration: parseFloat(e.target.value),
                },
              })
            }
            className="w-full accent-gold-400"
          />
        </div>

        {/* Easing Function */}
        <div>
          <label className="text-[10px] text-stone-400 block mb-1">Easing Curve</label>
          <select
            value={anim.easing || 'ease-out'}
            onChange={(e) =>
              updateElement(selectedElement.id, {
                animation: {
                  ...anim,
                  easing: e.target.value as AnimationEasing,
                },
              })
            }
            className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            {EASING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
