import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Template } from '@/types/template';
import { Badge } from '@/components/common/Badge';
import { Sparkles, Video, FileImage, ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  priority?: boolean;
}

export function TemplateCard({ template, priority = false }: TemplateCardProps) {
  const editorUrl =
    template.type === 'video'
      ? `/video-editor?template=${template.id}`
      : `/card-editor?template=${template.id}`;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gold-200/60 shadow-card-warm hover:shadow-gold-glow/40 transition-all duration-300 flex flex-col">
      {/* Visual Preview Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-ivory-100">
        <Image
          src={template.previewImage}
          alt={template.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-royal-950/80 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <Badge variant="gold" className="bg-gold-500/90 text-royal-950 font-bold border-none shadow-sm">
            100% FREE
          </Badge>

          <div className="flex items-center gap-1.5">
            {template.type === 'video' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-royal-900/90 text-white backdrop-blur-sm border border-royal-700">
                <Video className="w-3 h-3 mr-1 text-gold-400" />
                Video Reel
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-royal-900/90 text-white backdrop-blur-sm border border-royal-700">
                <FileImage className="w-3 h-3 mr-1 text-gold-400" />
                Card
              </span>
            )}
          </div>
        </div>

        {/* Quick Customize Button on Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-royal-950/40 backdrop-blur-[2px] z-20">
          <Link
            href={editorUrl}
            className="px-5 py-2.5 rounded-full bg-gold-400 text-royal-950 font-bold text-sm shadow-lg hover:bg-gold-300 transform scale-95 group-hover:scale-100 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Customize Design
          </Link>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
          <p className="text-xs uppercase tracking-wider text-gold-300 font-semibold mb-0.5">
            {template.category}
          </p>
          <h3 className="font-serif text-lg font-bold leading-snug drop-shadow-sm line-clamp-1">
            {template.title}
          </h3>
          {template.titleHindi && (
            <p className="font-hindi text-xs text-gold-200 font-normal line-clamp-1">
              {template.titleHindi}
            </p>
          )}
        </div>
      </div>

      {/* Card Details Footer */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-3">
          {template.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1 text-stone-500">
            {template.languageSupport.includes('hi') && (
              <span className="bg-ivory-200 px-1.5 py-0.5 rounded text-[11px] font-hindi text-royal-900">
                हिंदी
              </span>
            )}
            {template.languageSupport.includes('en') && (
              <span className="bg-ivory-200 px-1.5 py-0.5 rounded text-[11px] text-royal-900 font-medium">
                English
              </span>
            )}
          </div>

          <Link
            href={editorUrl}
            className="inline-flex items-center text-magenta-700 hover:text-royal-900 font-semibold group/link"
          >
            <span>Edit Now</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
