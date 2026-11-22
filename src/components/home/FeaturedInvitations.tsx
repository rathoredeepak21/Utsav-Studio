'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { Template } from '@/types/template';
import { Button } from '@/components/common/Button';
import { ArrowRight, Sparkles, FireExtinguisher as Fire } from 'lucide-react';

export function FeaturedInvitations() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'wedding' | 'birthday' | 'video' | 'other'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTemplates = SAMPLE_TEMPLATES.filter((t) => {
    if (activeFilter === 'all') return t.isTrending || t.isPopular;
    if (activeFilter === 'video') return t.type === 'video';
    return t.category === activeFilter;
  }).slice(0, 6);

  const handleOpenPreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 bg-ivory-100/60 border-b border-gold-200/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-800 border border-gold-300/70 mb-3 tracking-wider uppercase">
              Trending Celebrations • ट्रेंडिंग निमंत्रण
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-royal-950 tracking-tight">
              Featured Invitation Designs
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

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {[
            { id: 'all', label: 'All Featured', hindi: 'सभी ट्रेंडिंग' },
            { id: 'wedding', label: 'Royal Vivah', hindi: 'विवाह' },
            { id: 'birthday', label: 'Birthdays', hindi: 'जन्मदिन' },
            { id: 'video', label: 'Video Reels', hindi: 'वीडियो रील' },
            { id: 'other', label: 'Puja & Housewarming', hindi: 'गृह प्रवेश व पूजा' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-royal-800 text-white shadow-sm font-semibold'
                  : 'bg-white text-stone-700 hover:bg-ivory-200 border border-gold-200'
              }`}
            >
              {tab.label} <span className="font-hindi opacity-90">({tab.hindi})</span>
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((template, idx) => (
            <TemplateCard
              key={template.id}
              template={template}
              priority={idx < 3}
              onPreview={handleOpenPreview}
            />
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

          <Button href="/card-editor" variant="gold" size="lg" className="whitespace-nowrap shadow-gold-glow">
            <Sparkles className="w-4 h-4 mr-2" />
            Open Free Blank Editor
          </Button>
        </div>

        {/* Preview Modal */}
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </section>
  );
}
