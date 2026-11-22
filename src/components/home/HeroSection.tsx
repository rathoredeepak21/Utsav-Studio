'use client';

import React, { useState } from 'react';
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
  Languages,
  CheckCircle,
} from 'lucide-react';

export function HeroSection() {
  const { language } = useLanguageStore();
  const [activePreview, setActivePreview] = useState<'video' | 'card'>('video');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden bg-utsav-pattern">
      {/* Radial Glow Underlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-mandala-radial pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Subheading, CTAs & Value Props */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Festive Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-100 via-amber-50 to-gold-100 px-4 py-1.5 rounded-full border border-gold-300 shadow-xs mb-5">
              <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
              <span className="text-xs font-bold text-royal-950 tracking-wider uppercase">
                {language === 'hi'
                  ? '100% मुफ़्त डिजिटल निमंत्रण पत्र • कोई वॉटरमार्क नहीं'
                  : '100% Free Forever • Zero Watermark • No Sign-up'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-royal-950 tracking-tight leading-[1.12] mb-4">
              Har Khushi Ka <br className="hidden sm:inline" />
              <span className="royal-gradient-text">Digital Nimantaran</span>
            </h1>

            {/* Improved Hindi Tagline with Natural Line Breaks */}
            <p className="font-hindi text-xl sm:text-2xl text-magenta-700 font-semibold leading-relaxed mb-5 max-w-xl mx-auto lg:mx-0">
              शादी, जन्मदिन और हर पावन उत्सव के लिए <br className="hidden sm:inline" />
              भव्य डिजिटल कार्ड व वीडियो बनाएं।
            </p>

            {/* Subtitle */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-light">
              Craft royal Indian wedding invitations, animated video reels, birthday cards, and sacred ceremony invites in minutes. Zero sign-up friction, no forced watermark, and 100% browser-only privacy.
            </p>

            {/* Symmetrical Refined CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link
                href="/card-editor"
                className="w-full sm:w-auto h-13 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-royal-950 font-bold text-base shadow-gold-glow/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-gold-200/60"
              >
                <PlusCircle className="w-5 h-5 text-royal-950" />
                <span>{language === 'hi' ? 'निमंत्रण बनाएं' : 'Create Invitation'}</span>
              </Link>

              <Link
                href="/templates"
                className="w-full sm:w-auto h-13 px-8 py-3.5 rounded-full bg-white hover:bg-ivory-100 text-royal-950 font-bold text-base border-2 border-gold-400 hover:border-gold-500 shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-gold-600" />
                <span>{language === 'hi' ? 'टेम्पलेट्स देखें' : 'Explore Templates'}</span>
              </Link>
            </div>

            {/* Key Trust Guarantees */}
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
                  <Languages className="w-4 h-4 mr-1 text-gold-600 shrink-0" />
                  Hindi Fonts
                </div>
                <span className="text-[11px] text-stone-500 font-hindi mt-0.5">देवनागरी और श्लोक</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visually Rich Indian Invitation Showcase */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Format Preview Toggle Tabs */}
            <div className="inline-flex p-1 rounded-full bg-white/95 border border-gold-300 shadow-md mb-4 z-20">
              <button
                onClick={() => {
                  setActivePreview('video');
                  setIsVideoPlaying(true);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activePreview === 'video'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-600 hover:text-royal-950'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-gold-400" />
                Video Reel
              </button>
              <button
                onClick={() => {
                  setActivePreview('card');
                  setIsVideoPlaying(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activePreview === 'card'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-600 hover:text-royal-950'
                }`}
              >
                <FileImage className="w-3.5 h-3.5 text-gold-400" />
                Invitation Card
              </button>
            </div>

            {/* Outer Ceremonial Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
              {/* Outer Golden Glow Border Container */}
              <div className="p-2 sm:p-2.5 rounded-[28px] bg-gradient-to-tr from-gold-500 via-amber-200 to-gold-400 shadow-2xl shadow-royal-950/20">
                {activePreview === 'video' ? (
                  /* ==============================================================
                     1. VISUALLY RICH ANIMATED VIDEO INVITATION REEL
                     ============================================================== */
                  <div className="relative aspect-[9/16] rounded-[22px] overflow-hidden bg-gradient-to-b from-[#2E052B] via-[#1F031E] to-[#120112] text-white flex flex-col justify-between p-5 border-2 border-gold-400/80 shadow-inner select-none">
                    {/* Subtle Mandala Watermark in Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <div className="w-72 h-72 border border-gold-300 rounded-full animate-spin-slow" />
                    </div>

                    {/* Subtle Falling Rose & Marigold Petals Animation */}
                    {isVideoPlaying && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                        {/* Petal 1: Marigold golden drop */}
                        <div className="absolute left-[15%] w-3 h-3 bg-amber-400/75 rounded-tl-full rounded-br-full animate-petal-1 shadow-sm" />
                        {/* Petal 2: Crimson rose drop */}
                        <div className="absolute left-[70%] w-3.5 h-3.5 bg-rose-500/70 rounded-tr-full rounded-bl-full animate-petal-2 shadow-sm" />
                        {/* Petal 3: Small gold sparkle */}
                        <div className="absolute left-[40%] w-2.5 h-2.5 bg-yellow-300/80 rounded-tl-full rounded-br-full animate-petal-3 shadow-sm" />
                        {/* Petal 4: Soft rose petal */}
                        <div className="absolute left-[85%] w-3 h-3 bg-pink-400/70 rounded-tr-full rounded-bl-full animate-petal-4 shadow-sm" />
                      </div>
                    )}

                    {/* Top Status & Audio Bar */}
                    <div className="relative z-30 flex items-center justify-between text-xs">
                      {/* Live Reel Indicator */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-royal-950/80 border border-gold-400/40 text-[10px] text-gold-300 font-bold backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        REEL PREVIEW
                      </span>

                      {/* Shehnai Audio with Animated Equalizer Bars */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-royal-950/80 border border-gold-400/40 text-[10px] text-gold-200 backdrop-blur-md">
                        <span className="text-gold-400">🎵</span>
                        <span className="font-hindi text-[11px]">शहनाई धुन</span>
                        <div className="flex items-end gap-0.5 h-3 ml-0.5">
                          <span className={`w-0.5 bg-gold-400 rounded-full ${isVideoPlaying ? 'animate-audio-1' : 'h-1'}`} />
                          <span className={`w-0.5 bg-gold-400 rounded-full ${isVideoPlaying ? 'animate-audio-2' : 'h-2.5'}`} />
                          <span className={`w-0.5 bg-gold-400 rounded-full ${isVideoPlaying ? 'animate-audio-3' : 'h-1.5'}`} />
                          <span className={`w-0.5 bg-gold-400 rounded-full ${isVideoPlaying ? 'animate-audio-4' : 'h-2'}`} />
                        </div>
                      </div>
                    </div>

                    {/* Main Ceremonial Wedding Invitation Body */}
                    <div className="relative z-30 my-auto text-center px-1">
                      {/* Decorative Toran & Marigold Garland Art */}
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold-400" />
                        <span className="text-xs">🌺 🌼 🌺 🌼 🌺</span>
                        <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold-400" />
                      </div>

                      {/* Sacred Ganesha Motif & Shloka */}
                      <div className="inline-flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-royal-950 font-serif font-black text-sm shadow-md mb-1 border border-gold-200">
                          ॐ
                        </div>
                        <p className="font-hindi text-gold-300 text-xs sm:text-sm font-bold tracking-widest drop-shadow-sm">
                          || श्री गणेशाय नमः ||
                        </p>
                      </div>

                      {/* Shubh Vivah Tag */}
                      <div className="my-2">
                        <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-magenta-700/80 text-gold-200 border border-gold-400/40 uppercase tracking-widest font-hindi">
                          शुभ विवाह निमंत्रण
                        </span>
                      </div>

                      {/* Invitation Header Line */}
                      <p className="text-[11px] text-stone-300 font-light italic mb-1">
                        Together with their families
                      </p>

                      {/* Grand Couple Names - High Contrast Golden Foliage */}
                      <div className="py-1">
                        <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold-300 to-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                          Rohan & Meera
                        </h2>
                        <p className="font-hindi text-rose-300 text-xs mt-0.5 drop-shadow">
                          संग परिणय सूत्र में बंधने जा रहे हैं
                        </p>
                      </div>

                      {/* Decorative Golden Divider */}
                      <div className="flex items-center justify-center my-2 text-gold-400">
                        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-400" />
                        <span className="mx-2 text-[10px]">✨ 卐 ✨</span>
                        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-400" />
                      </div>

                      {/* Event Date & Venue */}
                      <div className="bg-royal-950/70 rounded-xl p-2.5 border border-gold-500/30 backdrop-blur-xs text-xs space-y-0.5">
                        <p className="text-gold-200 font-bold tracking-wide">
                          Sunday, 24th December 2026
                        </p>
                        <p className="text-stone-300 text-[11px] font-light">
                          The Grand Heritage Palace, Jaipur
                        </p>
                      </div>
                    </div>

                    {/* Bottom Reel Player Timeline & Actions */}
                    <div className="relative z-30 pt-2 border-t border-gold-500/30">
                      {/* Playback Controls & Interactive Button */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                            className="w-8 h-8 rounded-full bg-gold-400 text-royal-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                            aria-label={isVideoPlaying ? 'Pause animation' : 'Play animation'}
                          >
                            {isVideoPlaying ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 ml-0.5" />
                            )}
                          </button>
                          <span className="text-[10px] text-stone-300 font-mono">
                            {isVideoPlaying ? '0:08 / 0:25' : 'Paused'}
                          </span>
                        </div>

                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-600/40 px-2 py-0.5 rounded-full">
                          100% Free • No Watermark
                        </span>
                      </div>

                      {/* Timeline Bar */}
                      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`bg-gradient-to-r from-gold-500 to-amber-300 h-full rounded-full transition-all duration-1000 ${
                            isVideoPlaying ? 'w-[45%]' : 'w-[20%]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ==============================================================
                     2. VISUALLY RICH TRADITIONAL PRINT/WHATSAPP CARD PREVIEW
                     ============================================================== */
                  <div className="relative aspect-[9/16] rounded-[22px] overflow-hidden bg-[#FFFDF9] text-stone-900 flex flex-col justify-between p-5 border-2 border-gold-400 shadow-inner select-none">
                    {/* Intricate Golden Arch & Border Frame */}
                    <div className="absolute inset-2 border border-gold-400/80 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-3 border-2 border-gold-500/40 rounded-xl pointer-events-none" />

                    {/* Corner Flourishes */}
                    <div className="absolute top-4 left-4 text-gold-500 text-xs">╔</div>
                    <div className="absolute top-4 right-4 text-gold-500 text-xs">╗</div>
                    <div className="absolute bottom-4 left-4 text-gold-500 text-xs">╚</div>
                    <div className="absolute bottom-4 right-4 text-gold-500 text-xs">╝</div>

                    {/* Card Top: Mangal Shloka & Kalash */}
                    <div className="relative z-10 text-center pt-2">
                      <div className="flex justify-center mb-1">
                        <DecorativeMotif type="lotus" className="w-10 h-7 text-gold-600" />
                      </div>
                      <p className="font-hindi text-xs sm:text-sm font-extrabold text-royal-950 tracking-wide">
                        || श्री गणेशाय नमः ||
                      </p>
                      <p className="text-[10px] font-hindi text-stone-600 italic mt-0.5">
                        वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ
                      </p>
                      <div className="h-[1px] w-20 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent my-2" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-magenta-800 bg-magenta-50 px-2.5 py-0.5 rounded-full border border-magenta-200">
                        Shubh Vivah Nimantaran
                      </span>
                    </div>

                    {/* Card Middle: Couple Details & Family Inviting */}
                    <div className="relative z-10 my-auto text-center px-2">
                      <p className="text-[11px] text-stone-600 font-light italic mb-1">
                        Mr. & Mrs. Sharma cordially invite you to the wedding of
                      </p>

                      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-royal-950 tracking-tight my-1">
                        Aarav & Ananya
                      </h2>

                      <p className="text-[11px] text-magenta-700 font-hindi font-medium">
                        के पावन विवाह संस्कार में आपकी गरिमामयी उपस्थिति सादर प्रार्थनीय है
                      </p>
                    </div>

                    {/* Card Bottom: Ceremony Date & Venue */}
                    <div className="relative z-10 pt-2 border-t border-gold-300 text-center text-xs">
                      <p className="font-bold text-royal-950 text-xs">
                        Sunday, 24th December 2026
                      </p>
                      <p className="text-[11px] text-stone-600 font-light">
                        The Royal Palace, Jaipur, Rajasthan
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                        <span className="text-emerald-700 font-semibold">✨ WhatsApp Status 9:16</span>
                        <span className="text-gold-700 font-bold">100% Free HD</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Bottom Left Badge */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white py-2 px-3.5 rounded-2xl shadow-lg border border-gold-300 flex items-center space-x-2.5 z-30">
                <div className="w-8 h-8 rounded-full bg-magenta-50 flex items-center justify-center text-magenta-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-royal-950">WhatsApp & Reels</p>
                  <p className="text-[10px] text-stone-500">9:16 Vertical HD</p>
                </div>
              </div>

              {/* Floating Top Right Badge */}
              <div className="absolute -top-3 -right-3 sm:-right-4 bg-white py-2 px-3.5 rounded-2xl shadow-lg border border-gold-300 flex items-center space-x-2.5 z-30">
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
