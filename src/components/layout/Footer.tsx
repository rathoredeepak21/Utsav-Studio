'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { siteConfig } from '@/lib/constants/siteConfig';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { Heart, Sparkles, ShieldCheck, Lock } from 'lucide-react';

export function Footer() {
  const { language } = useLanguageStore();

  return (
    <footer className="bg-royal-950 text-stone-300 pt-16 pb-12 border-t-2 border-gold-500/40 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gold-500/5 blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-royal-800/80">
          {/* Brand Vision Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-magenta-700 to-royal-800 flex items-center justify-center border border-gold-400">
                <span className="text-gold-300 font-serif text-xl font-bold">उ</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-ivory-50">
                Utsav <span className="text-gold-400">Studio</span>
              </span>
            </Link>

            <p className="text-gold-300 font-hindi text-sm font-medium">
              {siteConfig.taglineHindi} — Har Khushi Ka Digital Nimantaran
            </p>

            <p className="text-stone-400 text-sm leading-relaxed max-w-md">
              Utsav Studio is India&apos;s proud 100% free digital invitation platform. Celebrate life&apos;s most cherished milestones — weddings, birthdays, engagements, and festivities — without paywalls, sign-ups, or watermarks.
            </p>

            {/* Core Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs">
              <span className="inline-flex items-center text-gold-300 bg-royal-900/80 px-2.5 py-1 rounded-md border border-gold-500/30">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gold-400" />
                Zero Watermark Ever
              </span>
              <span className="inline-flex items-center text-gold-300 bg-royal-900/80 px-2.5 py-1 rounded-md border border-gold-500/30">
                <Lock className="w-3.5 h-3.5 mr-1 text-gold-400" />
                100% Client Privacy
              </span>
            </div>
          </div>

          {/* Celebrations Links */}
          <div>
            <h3 className="font-serif text-gold-300 text-base font-semibold tracking-wider uppercase mb-4">
              {language === 'hi' ? 'समारोह व उत्सव' : 'Invitations'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.invitations.map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-gold-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creation Tools */}
          <div>
            <h3 className="font-serif text-gold-300 text-base font-semibold tracking-wider uppercase mb-4">
              {language === 'hi' ? 'टूल एवं गैलरी' : 'Design Tools'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.tools.map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-gold-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h3 className="font-serif text-gold-300 text-base font-semibold tracking-wider uppercase mb-4">
              {language === 'hi' ? 'मंच एवं सहायता' : 'About & Trust'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-gold-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} Utsav Studio. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-gold-400/90 font-hindi">हर खुशी का डिजिटल निमंत्रण</span>
          </div>

          <div className="flex items-center space-x-1 text-stone-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-magenta-500 fill-magenta-500" />
            <span>for Indian Celebrations</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
