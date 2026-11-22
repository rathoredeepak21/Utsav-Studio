'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { siteConfig } from '@/lib/constants/siteConfig';
import {
  UserCheck,
  ShieldCheck,
  Gift,
  Lock,
  Languages,
  Smartphone,
} from 'lucide-react';

const iconsMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-7 h-7 text-gold-600" />,
  ShieldCheck: <ShieldCheck className="w-7 h-7 text-gold-600" />,
  Gift: <Gift className="w-7 h-7 text-gold-600" />,
  Lock: <Lock className="w-7 h-7 text-gold-600" />,
  Languages: <Languages className="w-7 h-7 text-gold-600" />,
};

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-ivory-50">
      <Container>
        <SectionHeading
          badge="The Utsav Promise"
          badgeHindi="हमारा संकल्प"
          title="Why Families Across India Choose Utsav Studio"
          titleHindi="उत्सव स्टूडियो ही क्यों चुनें?"
          subtitle="We believe celebrations are meant to be shared freely, without extortionate fees, mandatory logins, or tacky forced watermarks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.freeFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-3xl border border-gold-200/80 shadow-card-warm hover:border-gold-400 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                {iconsMap[feature.icon] || <ShieldCheck className="w-7 h-7 text-gold-600" />}
              </div>

              <h3 className="font-serif text-xl font-bold text-royal-950 mb-1">
                {feature.title}
              </h3>
              <p className="font-hindi text-magenta-700 text-sm font-medium mb-3">
                {feature.titleHindi}
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

          {/* Bonus 6th feature: Mobile WhatsApp Ready */}
          <div className="bg-white p-8 rounded-3xl border border-gold-200/80 shadow-card-warm hover:border-gold-400 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <Smartphone className="w-7 h-7 text-gold-600" />
            </div>

            <h3 className="font-serif text-xl font-bold text-royal-950 mb-1">
              WhatsApp & Instagram Ready
            </h3>
            <p className="font-hindi text-magenta-700 text-sm font-medium mb-3">
              व्हाट्सएप और इंस्टाग्राम पर तुरंत शेयर करें
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              Perfect vertical (9:16) format designed specifically for WhatsApp Status, direct family chats, and Instagram reels.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
