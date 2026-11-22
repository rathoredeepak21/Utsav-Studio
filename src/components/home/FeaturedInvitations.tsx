'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { Button } from '@/components/common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FeaturedInvitations() {
  const featured = SAMPLE_TEMPLATES.slice(0, 6);

  return (
    <section className="py-20 bg-ivory-100/60 border-b border-gold-200/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-800 border border-gold-300/70 mb-3 tracking-wider uppercase">
              Trending Celebrations • ट्रेंडिंग निमंत्रण
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-royal-950 tracking-tight">
              Popular Invitation Designs
            </h2>
            <p className="font-hindi text-magenta-700 text-xl mt-1">
              लोगों द्वारा सबसे ज़्यादा पसंद किए गए कार्ड और वीडियो
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button href="/templates" variant="outline" size="md">
              View All 100+ Templates
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((template, idx) => (
            <TemplateCard key={template.id} template={template} priority={idx < 3} />
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-royal-900 via-royal-800 to-magenta-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-royal-glow/20 border border-gold-500/40">
          <div>
            <h3 className="font-serif text-2xl font-bold text-gold-300">
              Want to create a custom invitation from scratch?
            </h3>
            <p className="font-hindi text-ivory-100 text-sm mt-1">
              बिना किसी टेम्पलेट के अपनी पसंद के फ़ॉन्ट और बैकग्राउंड से शुरुआत करें।
            </p>
          </div>

          <Button href="/card-editor" variant="gold" size="lg" className="whitespace-nowrap">
            <Sparkles className="w-4 h-4 mr-2" />
            Open Free Blank Editor
          </Button>
        </div>
      </Container>
    </section>
  );
}
