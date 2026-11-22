'use client';

import React, { useRef, useState, useEffect } from 'react';
import { TemplateDefinition, TextElement, DecorativeElement, ImagePlaceholder } from '@/types/template';
import { DecorativeSVG } from './DecorativeSVGs';
import { Video, Music, Camera } from 'lucide-react';

interface TemplateRendererProps {
  template: TemplateDefinition;
  language?: 'en' | 'hi';
  scale?: number; // Optional explicit scale override
  isInteractive?: boolean;
  className?: string;
  onElementClick?: (elementId: string) => void;
}

export function TemplateRenderer({
  template,
  language,
  scale: forcedScale,
  isInteractive = false,
  className = '',
  onElementClick,
}: TemplateRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedScale, setComputedScale] = useState<number>(0.25);

  const activeLanguage = language || template.defaultLanguage || 'hi';

  // Responsive scale calculation based on 1080x1920 reference canvas
  useEffect(() => {
    if (forcedScale) {
      setComputedScale(forcedScale);
      return;
    }

    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setComputedScale(width / 1080);
        }
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [forcedScale]);

  // Compute background styling
  const getBackgroundStyle = (): React.CSSProperties => {
    const bg = template.background;
    if (bg.type === 'solid') {
      return { backgroundColor: bg.color || '#FAF6EE' };
    }
    if (bg.type === 'gradient' && bg.gradient) {
      const { type, from, via, to, angle = 180 } = bg.gradient;
      if (type === 'radial') {
        return {
          background: `radial-gradient(circle at 50% 35%, ${from} 0%, ${via ? via + ' 60%,' : ''} ${to} 100%)`,
        };
      }
      return {
        background: `linear-gradient(${angle}deg, ${from} 0%, ${via ? via + ' 50%,' : ''} ${to} 100%)`,
      };
    }
    return { backgroundColor: bg.color || '#FAF6EE' };
  };

  // Font family helper
  const getFontFamily = (family: TextElement['fontFamily']) => {
    switch (family) {
      case 'display':
        return 'var(--font-rozha), var(--font-cinzel), serif';
      case 'hindi':
        return 'var(--font-rozha), var(--font-noto-devanagari), sans-serif';
      case 'cursive':
        return 'var(--font-great-vibes), cursive';
      case 'sans':
        return 'var(--font-plus-jakarta), system-ui, sans-serif';
      case 'serif':
      default:
        return 'var(--font-cinzel), Georgia, serif';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[9/16] w-full overflow-hidden select-none ${className}`}
    >
      {/* 1080x1920 Standard Scaled Canvas Stage */}
      <div
        style={{
          width: 1080,
          height: 1920,
          transform: `scale(${computedScale})`,
          transformOrigin: 'top left',
          ...getBackgroundStyle(),
        }}
        className="absolute top-0 left-0 overflow-hidden"
      >
        {/* Background Pattern Overlay */}
        {template.background.pattern && template.background.pattern !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: template.background.patternOpacity ?? 0.08,
              backgroundImage:
                template.background.pattern === 'mandala'
                  ? 'radial-gradient(circle at center, #D4AF37 1px, transparent 1px)'
                  : template.background.pattern === 'dots'
                  ? 'radial-gradient(#D4AF37 1.5px, transparent 1.5px)'
                  : 'radial-gradient(#FAF6EE 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        )}

        {/* Video Mode: Subtle Animated Floating Petals (if card is video format) */}
        {template.type === 'video' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="absolute left-[15%] w-6 h-6 bg-amber-400/70 rounded-tl-full rounded-br-full animate-petal-1" />
            <div className="absolute left-[70%] w-7 h-7 bg-rose-500/60 rounded-tr-full rounded-bl-full animate-petal-2" />
            <div className="absolute left-[40%] w-5 h-5 bg-yellow-300/70 rounded-tl-full rounded-br-full animate-petal-3" />
            <div className="absolute left-[85%] w-6 h-6 bg-pink-400/60 rounded-tr-full rounded-bl-full animate-petal-4" />
          </div>
        )}

        {/* Decorative Elements Layer */}
        {template.decorations.map((deco) => {
          return (
            <div
              key={deco.id}
              style={{
                position: 'absolute',
                left: deco.x,
                top: deco.y,
                width: deco.width,
                height: deco.height,
                opacity: deco.opacity ?? 1,
                transform: deco.rotation ? `rotate(${deco.rotation}deg)` : undefined,
                zIndex: deco.zIndex ?? 10,
              }}
              className="pointer-events-none"
            >
              <DecorativeSVG
                type={deco.type}
                color={deco.color}
                secondaryColor={deco.secondaryColor}
              />
            </div>
          );
        })}

        {/* Image Placeholders Layer (Photos/Frames) */}
        {template.placeholders.map((ph) => {
          const isCircle = ph.shape === 'circle';
          const isArch = ph.shape === 'arch';
          return (
            <div
              key={ph.id}
              style={{
                position: 'absolute',
                left: ph.x,
                top: ph.y,
                width: ph.width,
                height: ph.height,
                zIndex: ph.zIndex ?? 15,
                borderColor: ph.borderColor || '#D4AF37',
                borderWidth: ph.borderWidth || 4,
              }}
              onClick={() => onElementClick?.(ph.id)}
              className={`bg-royal-950/20 backdrop-blur-xs flex flex-col items-center justify-center border-dashed text-gold-300 overflow-hidden shadow-lg ${
                isCircle ? 'rounded-full' : isArch ? 'rounded-t-[200px] rounded-b-2xl' : 'rounded-2xl'
              } ${isInteractive ? 'cursor-pointer hover:border-solid hover:bg-gold-500/10' : ''}`}
            >
              <Camera className="w-16 h-16 opacity-75 mb-2 text-gold-300" />
              <span className="text-xl font-bold uppercase tracking-wider text-center px-4 font-sans drop-shadow">
                {ph.role === 'couple_photo'
                  ? 'Couple Photo'
                  : ph.role === 'baby_photo'
                  ? 'Baby Photo'
                  : 'Add Photo'}
              </span>
              <span className="text-sm opacity-70 mt-1 font-hindi">अपनी फोटो जोड़ें</span>
            </div>
          );
        })}

        {/* Text Elements Layer */}
        {template.texts.map((txt) => {
          const displayContent =
            activeLanguage === 'hi' && txt.contentHindi ? txt.contentHindi : txt.content;

          return (
            <div
              key={txt.id}
              style={{
                position: 'absolute',
                left: txt.x,
                top: txt.y,
                width: txt.width,
                height: txt.height,
                fontSize: `${txt.fontSize}px`,
                fontFamily: getFontFamily(txt.fontFamily),
                color: txt.color,
                textAlign: txt.align,
                letterSpacing: txt.letterSpacing ? `${txt.letterSpacing}px` : undefined,
                lineHeight: txt.lineHeight ?? 1.25,
                fontWeight: txt.fontWeight || 'normal',
                textTransform: txt.textTransform || 'none',
                textShadow: txt.textShadow || '0 2px 8px rgba(0,0,0,0.4)',
                zIndex: txt.zIndex ?? 25,
              }}
              onClick={() => onElementClick?.(txt.id)}
              className={`leading-tight transition-opacity ${
                isInteractive ? 'cursor-pointer hover:opacity-80' : ''
              }`}
            >
              {displayContent}
            </div>
          );
        })}

        {/* Video Reel HUD Overlay for Video Templates */}
        {template.type === 'video' && (
          <div className="absolute top-8 left-8 right-8 z-30 flex items-center justify-between text-white pointer-events-none">
            <span className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-lg font-bold border border-gold-400/40 flex items-center gap-2 text-gold-300">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              REEL (9:16)
            </span>
            <span className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-base font-semibold border border-gold-400/40 flex items-center gap-2 text-gold-200">
              <Music className="w-4 h-4 text-gold-400" />
              {template.previewConfig.musicTrack || 'Shehnai Melody'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
