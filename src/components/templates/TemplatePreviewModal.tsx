'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Template } from '@/types/template';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import {
  X,
  Sparkles,
  ShieldCheck,
  Video,
  FileImage,
  Languages,
  Maximize2,
  CheckCircle,
} from 'lucide-react';

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) {
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

  const editorUrl =
    template.type === 'video'
      ? `/video-editor?template=${template.id}`
      : `/card-editor?template=${template.id}`;

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
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-royal-950 shadow-md transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Visual Preview Container */}
        <div className="md:w-1/2 bg-ivory-100 relative min-h-[360px] md:min-h-[540px] flex items-center justify-center p-4">
          <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-400">
            <Image
              src={template.previewImage}
              alt={template.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-royal-950/80 via-transparent to-black/20" />

            <div className="absolute top-3 left-3">
              <Badge variant="gold" className="font-bold shadow-md bg-gold-400 text-royal-950">
                100% FREE
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white text-center">
              <p className="text-[11px] font-hindi text-gold-300">
                {template.titleHindi || '|| श्री गणेशाय नमः ||'}
              </p>
              <p className="font-serif text-base font-bold drop-shadow">
                {template.title}
              </p>
              <p className="text-[10px] text-stone-200 tracking-wider uppercase mt-0.5">
                1080 × 1920 HD Ready
              </p>
            </div>
          </div>
        </div>

        {/* Right Details & Action Panel */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-ivory-50/50">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
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

            {/* Title */}
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-royal-950">
              {template.title}
            </h3>
            {template.titleHindi && (
              <p className="font-hindi text-magenta-700 text-lg font-medium mt-1">
                {template.titleHindi}
              </p>
            )}

            <DecorativeMotif type="flourish" className="my-3 justify-start" />

            <p className="text-stone-600 text-sm leading-relaxed mb-5">
              {template.description}
            </p>

            {/* Template Specs */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-gold-200/80 mb-6 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Format & Size:</span>
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
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
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
          <div className="space-y-3 pt-4 border-t border-gold-200">
            <Button
              href={editorUrl}
              variant="gold"
              size="lg"
              className="w-full shadow-gold-glow justify-center text-base"
              onClick={onClose}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Customize This Template (शुरू करें)
            </Button>

            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                100% Free Forever
              </span>
              <Link
                href="/card-editor"
                className="text-royal-900 hover:text-magenta-700 underline font-semibold"
                onClick={onClose}
              >
                Or Start Blank Canvas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
