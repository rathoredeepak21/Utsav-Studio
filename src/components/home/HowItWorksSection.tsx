'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import {
  LayoutTemplate,
  Edit3,
  Sparkles,
  Share2,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Select a Template',
    titleHindi: 'मनपसंद टेम्पलेट चुनें',
    description:
      'Choose from hundreds of traditional Indian and modern celebration designs across weddings, birthdays, anniversaries, and pujas.',
    icon: <LayoutTemplate className="w-6 h-6 text-gold-600" />,
  },
  {
    step: '02',
    title: 'Personalize Details',
    titleHindi: 'नाम व तारीख दर्ज करें',
    description:
      'Easily customize names, dates, times, and venue addresses. Type in Hindi, English, or insert auspicious Sanskrit shlokas.',
    icon: <Edit3 className="w-6 h-6 text-magenta-700" />,
  },
  {
    step: '03',
    title: 'Add Photos & Motifs',
    titleHindi: 'तस्वीरें व मांगलिक चिन्ह जोड़ें',
    description:
      'Upload family portraits or couple photos. Decorate with golden Kalash, Sacred Lotus, Swastik, and ornamental borders.',
    icon: <Sparkles className="w-6 h-6 text-gold-600" />,
  },
  {
    step: '04',
    title: 'Instant Download & Share',
    titleHindi: 'तुरंत डाउनलोड करें व भेजें',
    description:
      'Export high-resolution 1080x1920 HD cards or MP4 video reels. 100% free with zero watermark, ready for WhatsApp Status.',
    icon: <Share2 className="w-6 h-6 text-emerald-600" />,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-ivory-100/60 border-b border-gold-200/50">
      <Container>
        <SectionHeading
          badge="Simple 4-Step Process"
          badgeHindi="आसान प्रक्रिया"
          title="How Utsav Studio Works"
          titleHindi="मात्र 3 मिनट में तैयार करें सुंदर निमंत्रण"
          subtitle="No design experience needed. No sign-up or software installation required."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {STEPS.map((item, index) => (
            <div
              key={item.step}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-gold-200/80 shadow-card-warm relative flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200/60 flex items-center justify-center shadow-xs">
                    {item.icon}
                  </div>
                  <span className="font-serif text-3xl font-bold text-stone-200 group-hover:text-gold-400 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-royal-950 mb-1">
                  {item.title}
                </h3>

                <p className="font-hindi text-magenta-700 text-xs font-semibold mb-3">
                  {item.titleHindi}
                </p>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs text-stone-500 font-medium">
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>Zero login friction</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Button href="/card-editor" variant="gold" size="lg" className="shadow-gold-glow">
            <Sparkles className="w-4 h-4 mr-2" />
            Start Creating in Your Browser (शुरू करें)
          </Button>
        </div>
      </Container>
    </section>
  );
}
