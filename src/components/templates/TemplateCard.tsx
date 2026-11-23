'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TemplateDefinition } from '@/types/template';
import { TemplateRenderer } from './engine/TemplateRenderer';
import { VideoCardMotionPreview } from './VideoCardMotionPreview';
import { Badge } from '@/components/common/Badge';
import { Sparkles, Video, FileImage, ArrowRight, Eye, Heart } from 'lucide-react';
import { isFavorite, toggleFavorite } from '@/lib/utils/favorites';

interface TemplateCardProps {
  template: TemplateDefinition;
  priority?: boolean;
  onPreview?: (template: TemplateDefinition) => void;
}

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const [favorite, setFavorite] = useState<boolean>(false);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);

  useEffect(() => {
    setFavorite(isFavorite(template.id));

    const handleUpdate = () => {
      setFavorite(isFavorite(template.id));
    };

    window.addEventListener('utsav_favorites_updated', handleUpdate);
    return () => window.removeEventListener('utsav_favorites_updated', handleUpdate);
  }, [template.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
    <div 
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-gold-200/70 shadow-card-warm hover:shadow-gold-glow/50 transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      {/* Visual Live Template Preview Container */}
      <div 
        onClick={() => onPreview?.(template)}
        className="relative aspect-[9/16] w-full overflow-hidden bg-stone-900 cursor-pointer select-none"
      >
        {/* Dynamic Renderer: Video Motion Canvas for Videos, Card Renderer for Cards */}
        <div className="absolute inset-0 w-full h-full pointer-events-none group-hover:scale-[1.01] transition-transform duration-500 ease-out">
          {template.type === 'video' ? (
            <VideoCardMotionPreview template={template} isHovered={isCardHovered} />
          ) : (
            <TemplateRenderer template={template} />
          )}
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
          <Badge variant="gold" className="bg-gold-400 text-royal-950 font-bold border-none shadow-md text-[11px] pointer-events-auto">
            100% FREE
          </Badge>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {template.type === 'video' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-royal-950/85 text-white backdrop-blur-md border border-royal-700/80 shadow-sm">
                <Video className="w-3 h-3 mr-1 text-gold-400" />
                Video Reel
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-royal-950/85 text-white backdrop-blur-md border border-royal-700/80 shadow-sm">
                <FileImage className="w-3 h-3 mr-1 text-gold-400" />
                Card
              </span>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              type="button"
              className={`p-1.5 rounded-full backdrop-blur-md border shadow-sm transition-transform active:scale-90 ${
                favorite
                  ? 'bg-rose-600/90 border-rose-500 text-white'
                  : 'bg-royal-950/70 border-white/20 text-white/80 hover:text-white hover:bg-royal-950/90'
              }`}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-royal-950/60 backdrop-blur-[2px] z-30 p-4">
          <Link
            href={editorUrl}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[200px] py-2.5 px-4 rounded-full bg-gold-400 text-royal-950 font-bold text-xs sm:text-sm shadow-xl hover:bg-gold-300 transform scale-95 group-hover:scale-100 transition-all flex items-center justify-center gap-1.5 text-center"
          >
            {template.type === 'video' ? (
              <>
                <Video className="w-4 h-4 text-royal-950" />
                Customize Video
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-royal-950" />
                Customize Card
              </>
            )}
          </Link>

          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template);
              }}
              type="button"
              className="w-full max-w-[200px] py-2 px-4 rounded-full bg-white/90 hover:bg-white text-royal-950 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-magenta-700" />
              Quick Preview
            </button>
          )}
        </div>
      </div>

      {/* Card Details & Metadata */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider text-magenta-700 font-semibold">
              {template.category}
            </span>
            <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
              {template.theme}
            </span>
          </div>

          <h3 className="font-serif text-base sm:text-lg font-bold text-royal-950 line-clamp-1 group-hover:text-magenta-800 transition-colors">
            {displayName}
          </h3>
          {displayHindi && (
            <p className="font-hindi text-xs text-gold-700 font-medium line-clamp-1 mt-0.5">
              {displayHindi}
            </p>
          )}

          <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mt-2 mb-3">
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
        </div>

        {/* Footer Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs mt-auto">
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
