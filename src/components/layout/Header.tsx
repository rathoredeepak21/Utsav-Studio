'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { LanguageSwitch } from './LanguageSwitch';
import { siteConfig } from '@/lib/constants/siteConfig';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { Menu, X, Sparkles, FolderHeart } from 'lucide-react';

const DESKTOP_NAV_LINKS = [
  { name: 'Wedding', href: '/wedding', hindi: 'विवाह' },
  { name: 'Birthday', href: '/birthday', hindi: 'जन्मदिन' },
  { name: 'Engagement', href: '/engagement', hindi: 'सगाई' },
  { name: 'Anniversary', href: '/anniversary', hindi: 'सालगिरह' },
  { name: 'Other Events', href: '/other-events', hindi: 'अन्य उत्सव' },
  { name: 'Templates', href: '/templates', hindi: 'टेम्पलेट्स' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguageStore();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory-50/95 backdrop-blur-md border-b border-gold-200/60 shadow-sm">
      {/* Top Auspicious Free Announcement Bar */}
      <div className="bg-gradient-to-r from-royal-950 via-royal-900 to-magenta-950 text-gold-200 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2 border-b border-gold-500/20">
        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
        <span>
          {language === 'hi'
            ? '100% मुफ़्त डिजिटल निमंत्रण पत्र • बिना लॉगिन • बिना वॉटरमार्क'
            : '100% Free Digital Invitations • No Sign-up Required • No Watermark'}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
      </div>

      <Container>
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo - Fixed Dimensions & Protected Against Clipping */}
          <Link
            href="/"
            className="flex items-center space-x-3 shrink-0 group focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-royal-900 via-royal-800 to-magenta-900 flex items-center justify-center shadow-md border-2 border-gold-400/80 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-gold-300 font-serif text-2xl font-bold leading-none select-none">
                उ
              </span>
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <span className="font-serif text-2xl font-extrabold tracking-tight text-royal-950 group-hover:text-magenta-800 transition-colors leading-none whitespace-nowrap">
                Utsav <span className="text-gold-600">Studio</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-stone-500 font-semibold font-hindi leading-tight whitespace-nowrap mt-1">
                {language === 'hi' ? siteConfig.taglineHindi : siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Balanced Spacing */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {DESKTOP_NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'text-magenta-700 bg-magenta-50/80 shadow-xs'
                      : 'text-stone-700 hover:text-royal-900 hover:bg-ivory-200/60'
                  }`}
                >
                  {language === 'hi' ? link.hindi : link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions & Tools */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            <LanguageSwitch />

            {/* My Saved Projects Access */}
            <Link
              href="/my-projects"
              className={`p-2.5 rounded-full transition-colors relative text-stone-600 hover:text-royal-900 hover:bg-ivory-200/70 border border-transparent hover:border-gold-300/40 ${
                isActive('/my-projects') ? 'bg-magenta-50 text-magenta-700' : ''
              }`}
              title="My Saved Projects (मेरे प्रोजेक्ट्स)"
              aria-label="My Saved Projects"
            >
              <FolderHeart className="w-5 h-5" />
            </Link>

            {/* Prominent Create CTA Button */}
            <Button
              href="/templates"
              variant="gold"
              size="sm"
              className="shadow-sm font-bold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {language === 'hi' ? 'कार्ड बनाएं' : 'Create Invite'}
            </Button>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center space-x-2 lg:hidden shrink-0">
            <LanguageSwitch />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-royal-900 hover:bg-ivory-200 focus:outline-none border border-gold-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory-50 border-b border-gold-300 shadow-xl px-5 pt-4 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                pathname === '/'
                  ? 'text-magenta-700 bg-magenta-50 font-bold'
                  : 'text-stone-700 hover:text-royal-900 hover:bg-ivory-200/50'
              }`}
            >
              {language === 'hi' ? 'होम (Home)' : 'Home'}
            </Link>

            {siteConfig.navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-magenta-700 bg-magenta-50 font-bold'
                    : 'text-stone-700 hover:text-royal-900 hover:bg-ivory-200/50'
                }`}
              >
                {language === 'hi' ? link.hindi : link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-gold-200 flex flex-col space-y-2.5">
              <Button
                href="/templates"
                variant="gold"
                size="md"
                className="w-full justify-center shadow-gold-glow font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'मुफ़्त निमंत्रण बनाएं' : 'Create Free Invite'}
              </Button>

              <Button
                href="/my-projects"
                variant="outline"
                size="md"
                className="w-full justify-center font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FolderHeart className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'मेरे सहेजे गए प्रोजेक्ट्स' : 'My Saved Projects'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
