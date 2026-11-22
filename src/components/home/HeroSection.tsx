'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { Sparkles, ShieldCheck, Download, PlusCircle, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const { language } = useLanguageStore();

  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-utsav-pattern">
      {/* Radial Glow Underlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-mandala-radial pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading and Core Value Props */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Festive Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-100 to-amber-50 px-4 py-1.5 rounded-full border border-gold-300 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
              <span className="text-xs font-bold text-royal-950 tracking-wide uppercase">
                {language === 'hi' ? '100% मुफ़्त डिजिटल निमंत्रण पत्र' : '100% Free Forever • Zero Watermark'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-royal-950 tracking-tight leading-[1.15] mb-4">
              Har Khushi Ka <br className="hidden sm:inline" />
              <span className="royal-gradient-text">Digital Nimantaran</span>
            </h1>

            {/* Hindi Sub-heading */}
            <p className="font-hindi text-xl sm:text-2xl text-magenta-700 font-semibold mb-5">
              शादी, जन्मदिन और हर उत्सव के लिए खूबसूरत डिजिटल कार्ड व वीडियो बनाएं।
            </p>

            {/* Description */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-light">
              Craft royal Indian wedding invitations, animated video reels, birthday cards, and auspicious ceremony invites in minutes. No sign-up required, zero watermarks, and full privacy.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button href="/templates" variant="gold" size="lg" className="w-full sm:w-auto shadow-gold-glow">
                <Sparkles className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'टेम्पलेट्स देखें' : 'Explore Free Templates'}
              </Button>
              <Button href="/card-editor" variant="outline" size="lg" className="w-full sm:w-auto">
                <PlusCircle className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'खाली कैनवास से शुरू करें' : 'Start Blank Canvas'}
              </Button>
            </div>

            {/* Key Trust Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gold-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex flex-col">
                <div className="flex items-center text-xs font-bold text-royal-950">
                  <ShieldCheck className="w-4 h-4 mr-1 text-gold-600" />
                  No Watermark
                </div>
                <span className="text-[11px] text-stone-500 font-hindi mt-0.5">साफ़ व सुंदर डाउनलोड</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center text-xs font-bold text-royal-950">
                  <Download className="w-4 h-4 mr-1 text-gold-600" />
                  Instant Save
                </div>
                <span className="text-[11px] text-stone-500 font-hindi mt-0.5">बिना किसी लॉगिन के</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center text-xs font-bold text-royal-950">
                  <Sparkles className="w-4 h-4 mr-1 text-gold-600" />
                  Hindi Fonts
                </div>
                <span className="text-[11px] text-stone-500 font-hindi mt-0.5">देवनागरी और श्लोक</span>
              </div>
            </div>
          </div>

          {/* Right Column: Festive Visual Showpiece */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Outer Decorative Gold Border */}
              <div className="p-3 bg-gradient-to-tr from-gold-400 via-amber-200 to-gold-500 rounded-3xl shadow-royal-glow/40">
                <div className="relative aspect-[9/14] rounded-2xl overflow-hidden bg-royal-950">
                  <Image
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                    alt="Royal Indian Wedding Invitation Preview"
                    fill
                    priority
                    className="object-cover opacity-90"
                  />

                  {/* Shahi Decorative Overlay Card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/40 to-transparent flex flex-col justify-end p-6 text-white text-center">
                    <DecorativeMotif type="lotus" className="mx-auto mb-2 text-gold-400" />
                    <span className="font-hindi text-gold-300 text-sm tracking-widest uppercase">
                      || श्री गणेशाय नमः ||
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-gold-200 mt-1">
                      Aarav & Ananya
                    </h3>
                    <p className="font-hindi text-base text-rose-200 mt-1">
                      शुभ विवाह निमंत्रण
                    </p>
                    <p className="text-xs text-stone-300 tracking-wider mt-2">
                      24 DECEMBER 2026 • JAIPUR PALACE
                    </p>

                    <div className="mt-4 pt-4 border-t border-gold-500/30 flex items-center justify-between text-xs">
                      <span className="text-gold-300 font-medium">✨ WhatsApp Ready</span>
                      <span className="bg-magenta-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        100% Free
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge Left */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white py-2 px-3.5 rounded-2xl shadow-lg border border-gold-300 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-magenta-50 flex items-center justify-center text-magenta-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-royal-950">Video Reels</p>
                  <p className="text-[10px] text-stone-500">Music & Animations</p>
                </div>
              </div>

              {/* Floating Badge Right */}
              <div className="absolute -top-3 -right-3 sm:-right-4 bg-white py-2 px-3.5 rounded-2xl shadow-lg border border-gold-300 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-gold-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-royal-950">Zero Watermark</p>
                  <p className="text-[10px] text-stone-500 font-hindi">पूरी तरह मुफ़्त</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
