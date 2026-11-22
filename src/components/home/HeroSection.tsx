'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import {
  Sparkles,
  ShieldCheck,
  Download,
  PlusCircle,
  Video,
  FileImage,
  Play,
  Pause,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export function HeroSection() {
  const { language } = useLanguageStore();
  const [activePreview, setActivePreview] = useState<'card' | 'video'>('card');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-utsav-pattern">
      {/* Radial Glow Underlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-mandala-radial pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subheading, CTAs & Value Props */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Festive Pill */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-100 via-amber-50 to-gold-100 px-4 py-1.5 rounded-full border border-gold-300 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
              <span className="text-xs font-bold text-royal-950 tracking-wide uppercase">
                {language === 'hi'
                  ? '100% मुफ़्त डिजिटल निमंत्रण पत्र • कोई वॉटरमार्क नहीं'
                  : '100% Free Forever • Zero Watermark • No Sign-up'}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-royal-950 tracking-tight leading-[1.15] mb-4">
              Har Khushi Ka <br className="hidden sm:inline" />
              <span className="royal-gradient-text">Digital Nimantaran</span>
            </h1>

            {/* Hindi Tagline */}
            <p className="font-hindi text-xl sm:text-2xl text-magenta-700 font-semibold mb-5">
              शादी, जन्मदिन और हर पावन उत्सव के लिए भव्य डिजिटल कार्ड व वीडियो बनाएं।
            </p>

            {/* Subtitle */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-light">
              Craft royal Indian wedding invitations, animated video reels, birthday invites, and sacred ceremonies in minutes. Zero sign-up friction, no forced watermark, and 100% browser-only privacy.
            </p>

            {/* Prominent CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button
                href="/card-editor"
                variant="gold"
                size="lg"
                className="w-full sm:w-auto shadow-gold-glow text-base font-bold"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'निमंत्रण बनाएं' : 'Create Invitation'}
              </Button>

              <Button
                href="/templates"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2 text-gold-600" />
                {language === 'hi' ? 'टेम्पलेट्स देखें' : 'Explore Templates'}
              </Button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gold-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex flex-col">
                <div className="flex items-center text-xs font-bold text-royal-950">
                  <ShieldCheck className="w-4 h-4 mr-1 text-gold-600 shrink-0" />
                  No Watermark
                </div>
                <span className="text-[11px] text-stone-500 font-hindi mt-0.5">साफ़ व सुंदर डाउनलोड</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center text-xs font-bold text-royal-950">
                  <Download className="w-4 h-4 mr-1 text-gold-600 shrink-0" />
                  Instant Save
                </div>
                <span className="text-[11px] text-stone-500 font-hindi mt-0.5">बिना किसी लॉगिन के</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center text-xs font-bold text-royal-950">
                  <Sparkles className="w-4 h-4 mr-1 text-gold-600 shrink-0" />
                  Hindi Fonts
                </div>
                <span className="text-[11px] text-stone-500 font-hindi mt-0.5">देवनागरी और श्लोक</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card vs Video Preview Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Format Preview Toggle Tabs */}
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex p-1 rounded-full bg-white border border-gold-300 shadow-md">
                <button
                  onClick={() => {
                    setActivePreview('card');
                    setIsVideoPlaying(false);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activePreview === 'card'
                      ? 'bg-royal-800 text-white shadow-sm'
                      : 'text-stone-600 hover:text-royal-900'
                  }`}
                >
                  <FileImage className="w-3.5 h-3.5" />
                  Invitation Card
                </button>
                <button
                  onClick={() => setActivePreview('video')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activePreview === 'video'
                      ? 'bg-royal-800 text-white shadow-sm'
                      : 'text-stone-600 hover:text-royal-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  Video Reel
                </button>
              </div>
            </div>

            {/* Showcase Stage */}
            <div className="relative mx-auto max-w-xs sm:max-w-sm">
              {/* Outer Decorative Gold Frame */}
              <div className="p-3 bg-gradient-to-tr from-gold-400 via-amber-200 to-gold-500 rounded-3xl shadow-royal-glow/40">
                {activePreview === 'card' ? (
                  // CARD PREVIEW
                  <div className="relative aspect-[9/15] rounded-2xl overflow-hidden bg-royal-950 border-2 border-gold-300">
                    <Image
                      src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                      alt="Royal Indian Wedding Card Preview"
                      fill
                      priority
                      className="object-cover opacity-90"
                    />

                    {/* Shahi Decorative Overlay Card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/45 to-transparent flex flex-col justify-between p-6 text-white text-center">
                      <div>
                        <DecorativeMotif type="lotus" className="mx-auto mb-2 text-gold-400" />
                        <span className="font-hindi text-gold-300 text-xs tracking-widest uppercase block">
                          || श्री गणेशाय नमः ||
                        </span>
                        <div className="h-0.5 w-16 bg-gold-400/60 mx-auto my-2" />
                        <p className="text-[11px] uppercase tracking-widest text-gold-200 font-semibold">
                          Shubh Vivah
                        </p>
                      </div>

                      <div className="my-auto py-2">
                        <p className="text-[11px] text-stone-300 font-light italic">
                          Cordially invite you to celebrate
                        </p>
                        <h2 className="font-serif text-2xl font-bold text-gold-200 mt-1">
                          Aarav & Ananya
                        </h2>
                        <p className="font-hindi text-xs text-rose-200 mt-1">
                          मंगल परिणय संस्कार
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gold-500/30">
                        <p className="text-xs text-stone-200 font-medium">
                          24 DECEMBER 2026 • JAIPUR PALACE
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[11px]">
                          <span className="text-gold-300 font-medium">✨ WhatsApp Ready</span>
                          <span className="bg-magenta-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                            100% Free
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // VIDEO REEL PREVIEW
                  <div className="relative aspect-[9/15] rounded-2xl overflow-hidden bg-royal-950 border-2 border-gold-300 flex flex-col justify-between p-6 text-white text-center">
                    <Image
                      src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
                      alt="Animated Video Invitation Reel"
                      fill
                      className={`object-cover transition-transform duration-1000 ${
                        isVideoPlaying ? 'scale-110 opacity-70' : 'opacity-60'
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/40 to-transparent" />

                    <div className="relative z-10 flex justify-between items-center text-xs">
                      <span className="bg-royal-900/90 border border-royal-700 px-2 py-0.5 rounded-full text-gold-300 text-[10px]">
                        🎵 Shehnai & Sitar Harmony
                      </span>
                      <span className="bg-rose-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        HD 1080p
                      </span>
                    </div>

                    <div className="relative z-10 my-auto space-y-2">
                      <span className="font-hindi text-gold-300 text-xs tracking-widest block">
                        || शुभ परिणय ||
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white drop-shadow">
                        Rohan & Meera
                      </h3>
                      <p className="text-xs text-rose-200">
                        Wedding Reel Invitation
                      </p>

                      {/* Play / Pause Interactive Trigger */}
                      <div className="pt-2">
                        <button
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="w-12 h-12 rounded-full bg-gold-400 text-royal-950 mx-auto flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                          aria-label={isVideoPlaying ? 'Pause video preview' : 'Play video preview'}
                        >
                          {isVideoPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </button>
                        <p className="text-[10px] text-stone-300 mt-2">
                          {isVideoPlaying ? 'Simulating in-browser video playback...' : 'Click to preview motion & music'}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-gold-500/30 text-xs flex justify-between items-center">
                      <span className="text-stone-300 text-[11px]">In-Browser Render</span>
                      <span className="text-gold-300 font-bold">Zero Server Upload</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Bottom Left Badge */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white py-2 px-3.5 rounded-2xl shadow-lg border border-gold-300 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-magenta-50 flex items-center justify-center text-magenta-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-royal-950">WhatsApp & Reels</p>
                  <p className="text-[10px] text-stone-500">9:16 Vertical HD</p>
                </div>
              </div>

              {/* Floating Top Right Badge */}
              <div className="absolute -top-3 -right-3 sm:-right-4 bg-white py-2 px-3.5 rounded-2xl shadow-lg border border-gold-300 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-gold-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-royal-950">Zero Watermark</p>
                  <p className="text-[10px] text-stone-500 font-hindi">हमेशा मुफ़्त</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
