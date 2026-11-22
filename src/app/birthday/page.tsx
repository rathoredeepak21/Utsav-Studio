import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/common/Container';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { Cake, Sparkles, PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Birthday Invitation Card & Video Maker | Utsav Studio',
  description:
    'Design cheerful birthday cards and video invitations for kids, teens, and milestone birthdays. Completely free with Hindi & English fonts.',
};

const BIRTHDAY_MILESTONES = [
  'All Birthdays',
  '1st Birthday Special (पहला जन्मदिन)',
  'Kids Theme & Cartoons',
  'Sweet 16 & 18th Milestone',
  'Golden 50th & 60th Jubilee',
];

export default function BirthdayPage() {
  const birthdayTemplates = SAMPLE_TEMPLATES.filter((t) => t.category === 'birthday');

  return (
    <div className="py-12 bg-ivory-50 min-h-screen">
      <Container>
        {/* Birthday Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-purple-950 via-royal-900 to-indigo-950 text-white p-8 sm:p-14 overflow-hidden shadow-royal-glow/30 border border-gold-500/40 mb-14 text-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <DecorativeMotif type="mandala" className="w-64 h-64 text-gold-400" />
          </div>

          <span className="inline-flex items-center space-x-1.5 bg-gold-400/20 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-gold-400/40 mb-4">
            <Cake className="w-3.5 h-3.5 text-gold-400" />
            <span>Birthday Celebrations • जन्मदिन आमंत्रण</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3">
            Joyful Birthday Invitations & Reels
          </h1>

          <p className="font-hindi text-xl sm:text-2xl text-gold-300 font-normal mb-6">
            हंसी, खुशियों और केक के इस खास दिन के लिए रंग-बिरंगे निमंत्रण
          </p>

          <p className="text-stone-300 text-base max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Create memorable birthday cards, animated party invitations, and WhatsApp status invites for kids, teenagers, and family elders.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/card-editor?category=birthday" variant="gold" size="lg">
              <PlusCircle className="w-4 h-4 mr-2" />
              Design Birthday Card
            </Button>
            <Button href="/video-editor?category=birthday" variant="outline" size="lg" className="border-gold-300 text-gold-200 hover:bg-gold-500/10">
              <Sparkles className="w-4 h-4 mr-2" />
              Make Birthday Video
            </Button>
          </div>
        </div>

        {/* Milestone Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {BIRTHDAY_MILESTONES.map((stone, idx) => (
            <span
              key={stone}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                idx === 0
                  ? 'bg-royal-800 text-white font-semibold'
                  : 'bg-white text-stone-700 hover:bg-ivory-200 border border-gold-200'
              }`}
            >
              {stone}
            </span>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {birthdayTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </Container>
    </div>
  );
}
