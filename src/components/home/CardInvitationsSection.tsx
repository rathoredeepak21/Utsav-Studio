'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { SectionHeading } from '@/components/common/SectionHeading';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import {
  FileImage,
  Sparkles,
  Download,
  Languages,
  CheckCircle,
  ArrowRight,
  Printer,
  Smartphone,
} from 'lucide-react';

export function CardInvitationsSection() {
  const cardTemplates = SAMPLE_TEMPLATES.filter((t) => t.type === 'card').slice(0, 3);

  return (
    <section className="py-20 bg-ivory-50 border-b border-gold-200/50 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-magenta-50 text-magenta-800 border border-magenta-200 mb-3 tracking-wider uppercase">
              <FileImage className="w-3.5 h-3.5 text-magenta-600" />
              <span>Digital Card Invitations • डिजिटल निमंत्रण पत्र</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-royal-950 tracking-tight">
              Auspicious Cards for Print & WhatsApp
            </h2>

            <p className="font-hindi text-magenta-700 text-xl font-medium mt-1">
              शाही राजस्थानी, फ्लोरल और देवनागरी फॉन्ट्स से सजे निमंत्रण कार्ड
            </p>

            <p className="text-stone-600 text-base mt-3 max-w-2xl leading-relaxed font-light">
              Create single-page or multi-ceremony invitation cards. Easily insert sacred Sanskrit shlokas, custom couple names, venue maps, and family blessings with zero watermark.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end gap-3">
            <Button href="/templates?type=card" variant="gold" size="md">
              Browse All Card Templates
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white border border-gold-200/80 shadow-xs flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-magenta-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-royal-950">9:16 WhatsApp Size</p>
              <p className="text-[11px] text-stone-500 font-hindi">स्टेटस व चैट के लिए</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gold-200/80 shadow-xs flex items-center space-x-3">
            <Languages className="w-5 h-5 text-gold-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-royal-950">Hindi & Shlokas</p>
              <p className="text-[11px] text-stone-500 font-hindi">रोजा, यात्रा और देवनागरी</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gold-200/80 shadow-xs flex items-center space-x-3">
            <Download className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-royal-950">Ultra HD Export</p>
              <p className="text-[11px] text-stone-500 font-hindi">क्रिस्टल क्लियर प्रिंट</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gold-200/80 shadow-xs flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-royal-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-royal-950">Zero Watermark</p>
              <p className="text-[11px] text-stone-500 font-hindi">100% निःशुल्क</p>
            </div>
          </div>
        </div>

        {/* Templates Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cardTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </Container>
    </section>
  );
}
