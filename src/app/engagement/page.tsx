import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/common/Container';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { Gem, Sparkles, PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Engagement & Roka Invitation Card Maker | Utsav Studio',
  description:
    'Celebrate the promise of forever with graceful Roka ceremony, Ring ceremony, and Engagement invitation cards and videos.',
};

export default function EngagementPage() {
  const engagementTemplates = SAMPLE_TEMPLATES.filter((t) => t.category === 'engagement');

  return (
    <div className="py-12 bg-ivory-50 min-h-screen">
      <Container>
        {/* Engagement Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-amber-950 via-royal-900 to-rose-950 text-white p-8 sm:p-14 overflow-hidden shadow-royal-glow/30 border border-gold-500/40 mb-14 text-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <DecorativeMotif type="flourish" className="w-64 h-64 text-gold-400" />
          </div>

          <span className="inline-flex items-center space-x-1.5 bg-gold-400/20 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-gold-400/40 mb-4">
            <Gem className="w-3.5 h-3.5 text-gold-400" />
            <span>Roka & Sagai Collection • सगाई एवं रोका</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3">
            Engagement & Ring Ceremony Invitations
          </h1>

          <p className="font-hindi text-xl sm:text-2xl text-gold-300 font-normal mb-6">
            दो दिलों के मिलन और रिश्ते की शुभ शुरुआत का पावन निमंत्रण
          </p>

          <p className="text-stone-300 text-base max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Announce your upcoming wedding journey with exquisite Roka, Ring Ceremony, and intimate cocktail celebration invites.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/card-editor?category=engagement" variant="gold" size="lg">
              <PlusCircle className="w-4 h-4 mr-2" />
              Design Engagement Card
            </Button>
            <Button href="/video-editor?category=engagement" variant="outline" size="lg" className="border-gold-300 text-gold-200 hover:bg-gold-500/10">
              <Sparkles className="w-4 h-4 mr-2" />
              Make Engagement Video
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {engagementTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </Container>
    </div>
  );
}
