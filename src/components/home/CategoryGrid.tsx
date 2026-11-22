'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { EVENT_CATEGORIES } from '@/lib/constants/categories';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { ArrowRight } from 'lucide-react';

export function CategoryGrid() {
  const { language } = useLanguageStore();

  return (
    <section className="py-20 bg-ivory-50 border-b border-gold-200/40">
      <Container>
        <SectionHeading
          badge="Celebration Gallery"
          badgeHindi="समारोह श्रेणियां"
          title="Designed for Every Auspicious Moment"
          titleHindi="हर मंगल अवसर के लिए ख़ास निमंत्रण"
          subtitle="Explore specially curated digital invitation templates made with Indian traditions, modern colors, and devotional elegance."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENT_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative bg-white rounded-3xl overflow-hidden border border-gold-200/70 shadow-card-warm hover:shadow-gold-glow/50 transition-all duration-300 flex flex-col"
            >
              {/* Category Image Header */}
              <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-950/80 via-royal-950/20 to-transparent" />

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="font-serif text-2xl font-bold tracking-tight drop-shadow-sm">
                    {category.name}
                  </h3>
                  <p className="font-hindi text-gold-300 text-sm mt-0.5">
                    {category.nameHindi}
                  </p>
                </div>
              </div>

              {/* Category Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    {language === 'hi' ? category.descriptionHindi : category.description}
                  </p>

                  {/* Subcategories tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {category.popularSubcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-[11px] font-medium bg-ivory-200 text-royal-900 px-2.5 py-1 rounded-full border border-ivory-300"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-sm font-semibold text-magenta-700 group-hover:text-royal-900 transition-colors">
                  <span>
                    {language === 'hi' ? 'डिज़ाइन देखें' : 'Explore Designs'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-magenta-50 group-hover:bg-gold-100 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
