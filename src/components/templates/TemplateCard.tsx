'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Template } from '@/types/template';
import { Badge } from '@/components/common/Badge';
import { Sparkles, Video, FileImage, ArrowRight, Eye } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  priority?: boolean;
  onPreview?: (template: Template) => void;
}

export function TemplateCard({ template, priority = false, onPreview }: TemplateCardProps) {
  const editorUrl =
    template.type === 'video'
      ? `/video-editor?template=${template.id}`
      : `/card-editor?template=${template.id}`;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gold-200/70 shadow-card-warm hover:shadow-gold-glow/50 transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Visual Preview Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-ivory-100 cursor-pointer">
        <Image
          src={template.previewImage}
          alt={template.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onClick={() => onPreview?.(template)}
        />

        {/* Gradient Overlay */}
        <div 
          onClick={() => onPreview?.(template)}
          className="absolute inset-0 bg-gradient-to-t from-royal-950/85 via-royal-950/20 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity" 
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <Badge variant="gold" className="bg-gold-500 text-royal-950 font-bold border-none shadow-md">
            100% FREE
          </Badge>

          <div className="flex items-center gap-1.5">
            {template.type === 'video' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-royal-900/90 text-white backdrop-blur-md border border-royal-700 shadow-sm">
                <Video className="w-3.5 h-3.5 mr-1 text-gold-400" />
                Video Reel
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-royal-900/90 text-white backdrop-blur-md border border-royal-700 shadow-sm">
                <FileImage className="w-3.5 h-3.5 mr-1 text-gold-400" />
                Card
              </span>
            )}
          </div>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-royal-950/50 backdrop-blur-[2px] z-20 p-4">
          <Link
            href={editorUrl}
            className="w-full max-w-[200px] py-2.5 px-4 rounded-full bg-gold-400 text-royal-950 font-bold text-xs sm:text-sm shadow-xl hover:bg-gold-300 transform scale-95 group-hover:scale-100 transition-all flex items-center justify-center gap-1.5 text-center"
          >
            <Sparkles className="w-4 h-4 text-royal-950" />
            Customize Design
          </Link>

          {onPreview && (
            <button
              onClick={() => onPreview(template)}
              type="button"
              className="w-full max-w-[200px] py-2 px-4 rounded-full bg-white/90 hover:bg-white text-royal-950 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-magenta-700" />
              Quick Preview
            </button>
          )}
        </div>

        {/* Bottom Title on Image */}
        <div 
          onClick={() => onPreview?.(template)}
          className="absolute bottom-3 left-4 right-4 z-10 text-white"
        >
          <p className="text-[11px] uppercase tracking-wider text-gold-300 font-semibold mb-0.5">
            {template.category}
          </p>
          <h3 className="font-serif text-lg font-bold leading-snug drop-shadow-md line-clamp-1">
            {template.title}
          </h3>
          {template.titleHindi && (
            <p className="font-hindi text-xs text-gold-200 font-normal line-clamp-1 mt-0.5">
              {template.titleHindi}
            </p>
          )}
        </div>
      </div>

      {/* Card Details Footer */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-3">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-ivory-100 text-stone-600 px-2 py-0.5 rounded-md border border-ivory-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1 text-stone-500">
            {template.languageSupport.includes('hi') && (
              <span className="bg-ivory-200 px-2 py-0.5 rounded text-[11px] font-hindi text-royal-900 font-semibold">
                हिंदी
              </span>
            )}
            {template.languageSupport.includes('en') && (
              <span className="bg-ivory-200 px-2 py-0.5 rounded text-[11px] text-royal-900 font-medium">
                English
              </span>
            )}
          </div>

          <Link
            href={editorUrl}
            className="inline-flex items-center text-magenta-700 hover:text-royal-900 font-bold group/link"
          >
            <span>Customize</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
