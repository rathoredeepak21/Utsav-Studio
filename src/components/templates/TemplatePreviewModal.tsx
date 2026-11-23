'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TemplateDefinition } from '@/types/template';
import { TemplateRenderer } from './engine/TemplateRenderer';
import { VideoCardMotionPreview } from './VideoCardMotionPreview';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import {
  X,
  Sparkles,
  Video,
  FileImage,
  Languages,
  CheckCircle,
  Heart,
  Palette,
  Maximize2,
} from 'lucide-react';
import { isFavorite, toggleFavorite } from '@/lib/utils/favorites';

interface TemplatePreviewModalProps {
  template: TemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) {
  const [favorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (template) {
      setFavorite(isFavorite(template.id));
    }
    const handleUpdate = () => {
      if (template) {
        setFavorite(isFavorite(template.id));
      }
    };
    window.addEventListener('utsav_favorites_updated', handleUpdate);
    return () => window.removeEventListener('utsav_favorites_updated', handleUpdate);
  }, [template]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const handleToggleFavorite = () => {
    const updated = toggleFavorite(template.id);
    setFavorite(updated);
  };

  const editorUrl =
    template.type === 'video'
      ? `/video-editor?template=${template.id}`
      : `/card-editor?template=${template.id}`;

  const displayName = template.name || template.title || 'Utsav Invitation';
  const displayHindi = template.nameHindi || template.titleHindi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-royal-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-gold-300 overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-royal-950 shadow-md transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Visual Preview Container: Real JSON-Driven Template Renderer or Motion Video Preview */}
        <div className="md:w-1/2 bg-stone-950 relative min-h-[380px] md:min-h-[560px] flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-400/80 bg-stone-900">
            {template.type === 'video' ? (
              <VideoCardMotionPreview template={template} isHovered={true} showControls={true} />
            ) : (
              <TemplateRenderer template={template} />
            )}

            {/* Top Badge */}
            <div className="absolute top-3 left-3 z-30 pointer-events-none">
              <Badge variant="gold" className="font-bold shadow-md bg-gold-400 text-royal-950 text-xs">
                {template.type === 'video' ? 'VIDEO REEL' : '100% FREE'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Details & Action Panel */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-ivory-50/50">
          <div>
            {/* Top Badges & Favorite */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="capitalize px-3 py-1 rounded-full text-xs font-semibold bg-magenta-50 text-magenta-800 border border-magenta-200">
                  {template.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-royal-50 text-royal-800 border border-royal-200 flex items-center gap-1">
                  {template.type === 'video' ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-gold-600" />
                      Video Reel
                    </>
                  ) : (
                    <>
                      <FileImage className="w-3.5 h-3.5 text-gold-600" />
                      Card Invitation
                    </>
                  )}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  No Watermark
                </span>
              </div>

              {/* Heart Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                type="button"
                className={`p-2 rounded-full border shadow-sm transition-all active:scale-90 ${
                  favorite
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-stone-200 text-stone-400 hover:text-rose-500'
                }`}
                title={favorite ? 'Saved in favorites' : 'Add to favorites'}
                aria-label="Toggle favorite"
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-royal-950">
              {displayName}
            </h3>
            {displayHindi && (
              <p className="font-hindi text-magenta-700 text-lg font-medium mt-1">
                {displayHindi}
              </p>
            )}

            <DecorativeMotif type="flourish" className="my-3 justify-start" />

            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              {template.description}
            </p>

            {/* Template Specs */}
            <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-gold-200/80 mb-5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Theme Style:</span>
                <span className="font-semibold text-royal-950">{template.theme}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Canvas Resolution:</span>
                <span className="font-semibold text-royal-950">
                  9:16 Vertical HD ({template.dimensions.width}×{template.dimensions.height}px)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Languages:</span>
                <span className="font-semibold text-royal-950 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-gold-600" />
                  {template.languageSupport.map((l) => (l === 'hi' ? 'हिंदी (Hindi)' : 'English')).join(' • ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Color Palette:</span>
                <div className="flex items-center gap-1.5">
                  {template.colorScheme.map((color, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-stone-300 shadow-xs"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              {template.type === 'video' && template.previewConfig.musicTrack && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Music Track:</span>
                  <span className="font-semibold text-royal-950 truncate max-w-[200px]">
                    🎵 {template.previewConfig.musicTrack}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-ivory-200 text-royal-900 px-2.5 py-1 rounded-full border border-ivory-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="space-y-3 pt-3 border-t border-gold-200">
            <Button
              href={editorUrl}
              variant="gold"
              size="lg"
              className="w-full shadow-gold-glow justify-center text-base font-bold"
              onClick={onClose}
            >
              {template.type === 'video' ? (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Customize Video in Editor (निःशुल्क वीडियो बनाएं)
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Customize Card in Editor (निःशुल्क कार्ड बनाएं)
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                100% Free Forever • No Watermark
              </span>
              <Link
                href={template.type === 'video' ? '/video-editor' : '/card-editor'}
                className="text-royal-900 hover:text-magenta-700 underline font-semibold"
                onClick={onClose}
              >
                {template.type === 'video' ? 'Or Blank Video Project' : 'Or Blank Canvas'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
