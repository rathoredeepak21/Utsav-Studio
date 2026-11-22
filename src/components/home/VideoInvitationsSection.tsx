'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import {
  Video,
  Music,
  Cpu,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export function VideoInvitationsSection() {
  const videoTemplates = SAMPLE_TEMPLATES.filter((t) => t.type === 'video').slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-br from-royal-950 via-royal-900 to-magenta-950 text-white relative overflow-hidden border-b border-gold-500/30">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-magenta-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-gold-400/20 text-gold-300 border border-gold-400/40 mb-3 tracking-wider uppercase">
              <Video className="w-3.5 h-3.5 text-gold-400" />
              <span>Animated Video Invitations • वीडियो रील निमंत्रण</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Cinematic Video Reels for Modern Celebrations
            </h2>

            <p className="font-hindi text-gold-300 text-xl font-medium mt-1">
              शहनाई, संगीत और एनिमेटेड फूलों के साथ वीडियो निमंत्रण
            </p>

            <p className="text-stone-300 text-base mt-3 max-w-2xl leading-relaxed font-light">
              Make your invitation come alive with motion graphics, personalized family photos, musical backgrounds, and vertical 9:16 reels designed for WhatsApp Status and Instagram.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end gap-3">
            <Button href="/video-editor" variant="gold" size="md">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Make Free Video Reel
            </Button>
          </div>
        </div>

        {/* Privacy & In-Browser Engine Highlight Banner */}
        <div className="mb-12 p-6 rounded-3xl bg-royal-900/60 border border-gold-500/30 backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white mb-0.5">In-Browser Rendering Engine</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Videos are compiled inside your device using Canvas & WebCodecs. No long rendering queues.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white mb-0.5">100% Private Media</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Your family photos are never sent to external cloud servers or stored online without permission.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white mb-0.5">Festive Indian Melodies</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Pre-licensed auspicious shehnai, classical sitar, dhol beats, and romantic melodies included.
              </p>
            </div>
          </div>
        </div>

        {/* Video Templates Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videoTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/templates?type=video"
            className="inline-flex items-center text-sm font-semibold text-gold-400 hover:text-white transition-colors"
          >
            <span>Explore All Animated Video Reel Templates</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
