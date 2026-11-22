import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/common/Container';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { Home, Sparkles, PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Griha Pravesh, Baby Shower & Puja Invitation Maker | Utsav Studio',
  description:
    'Free digital invitation cards for Griha Pravesh (Housewarming), Godh Bharai (Baby Shower), Naamkaran, Mundan, and Religious Ceremonies.',
};

const TRADITIONAL_EVENTS = [
  'All Auspicious Events',
  'Griha Pravesh (गृह प्रवेश)',
  'Baby Shower / Godh Bharai (गोद भराई)',
  'Naamkaran & Mundan (नामकरण / मुंडन)',
  'Satyanarayan Puja & Bhajan Sandhya',
  'Mata Ki Chowki & Jagran',
];

export default function OtherEventsPage() {
  const otherTemplates = SAMPLE_TEMPLATES.filter((t) => t.category === 'other');

  return (
    <div className="py-12 bg-ivory-50 min-h-screen">
      <Container>
        {/* Festive Traditional Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-teal-950 via-royal-950 to-emerald-950 text-white p-8 sm:p-14 overflow-hidden shadow-royal-glow/30 border border-gold-500/40 mb-14 text-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <DecorativeMotif type="lotus" className="w-64 h-64 text-gold-400" />
          </div>

          <span className="inline-flex items-center space-x-1.5 bg-gold-400/20 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-gold-400/40 mb-4">
            <Home className="w-3.5 h-3.5 text-gold-400" />
            <span>Auspicious Celebrations • शुभ उत्सव</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3">
            Griha Pravesh, Baby Shower & Puja Invites
          </h1>

          <p className="font-hindi text-xl sm:text-2xl text-gold-300 font-normal mb-6">
            गृह प्रवेश, गोद भराई, नामकरण एवं धार्मिक अनुष्ठानों के लिए पावन निमंत्रण
          </p>

          <p className="text-stone-300 text-base max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Invite family and dear friends with traditional Kalash, Toran, and Diya motifs for your housewarming, welcoming a newborn, or spiritual gatherings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/card-editor?category=other" variant="gold" size="lg">
              <PlusCircle className="w-4 h-4 mr-2" />
              Design Ceremonial Card
            </Button>
            <Button href="/video-editor?category=other" variant="outline" size="lg" className="border-gold-300 text-gold-200 hover:bg-gold-500/10">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Video Invite
            </Button>
          </div>
        </div>

        {/* Traditional Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {TRADITIONAL_EVENTS.map((event, idx) => (
            <span
              key={event}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                idx === 0
                  ? 'bg-royal-800 text-white font-semibold'
                  : 'bg-white text-stone-700 hover:bg-ivory-200 border border-gold-200'
              }`}
            >
              {event}
            </span>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {otherTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </Container>
    </div>
  );
}
