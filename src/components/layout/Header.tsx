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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguageStore();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory-50/95 backdrop-blur-md border-b border-gold-200/50 shadow-sm">
      {/* Top Auspicious Free Announcement Bar */}
      <div className="bg-gradient-to-r from-royal-900 via-royal-800 to-magenta-900 text-gold-200 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
        <span>
          {language === 'hi'
            ? '100% मुफ़्त डिजिटल निमंत्रण पत्र • बिना लॉगिन • बिना वॉटरमार्क'
            : '100% Free Digital Invitations • No Sign-up Required • No Watermark'}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
      </div>

      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-royal-800 to-magenta-800 flex items-center justify-center shadow-royal-glow/40 border border-gold-400/60 group-hover:scale-105 transition-transform">
              <span className="text-gold-400 font-serif text-2xl font-bold">उ</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-royal-950 group-hover:text-magenta-800 transition-colors">
                Utsav <span className="text-gold-600">Studio</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-stone-500 font-medium font-hindi">
                {language === 'hi' ? siteConfig.taglineHindi : siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {siteConfig.navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-magenta-700 bg-magenta-50/80 font-semibold'
                      : 'text-stone-700 hover:text-royal-800 hover:bg-ivory-200/50'
                  }`}
                >
                  {language === 'hi' ? link.hindi : link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & Switchers */}
          <div className="hidden sm:flex items-center space-x-3">
            <LanguageSwitch />
            
            <Link
              href="/my-projects"
              className="p-2 text-stone-600 hover:text-royal-800 hover:bg-ivory-200/60 rounded-full transition-colors relative"
              title="My Projects"
              aria-label="My Projects"
            >
              <FolderHeart className="w-5 h-5" />
            </Link>

            <Button
              href="/templates"
              variant="gold"
              size="sm"
              className="shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              {language === 'hi' ? 'कार्ड बनाएं' : 'Create Invite'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageSwitch />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-royal-900 hover:bg-ivory-200 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Nav Flyout */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory-50 border-b border-gold-200/70 shadow-lg px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-magenta-700 bg-magenta-50 font-semibold'
                    : 'text-stone-700 hover:text-royal-900 hover:bg-ivory-200/50'
                }`}
              >
                {language === 'hi' ? link.hindi : link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gold-200/50 flex flex-col space-y-2.5">
              <Button
                href="/templates"
                variant="gold"
                size="md"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'मुफ़्त निमंत्रण बनाएं' : 'Create Free Invite'}
              </Button>
              <Button
                href="/my-projects"
                variant="outline"
                size="md"
                className="w-full justify-center"
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
