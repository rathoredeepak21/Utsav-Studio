import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-ivory-50 px-4 py-20 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl pointer-events-none" />

      <Container className="max-w-xl text-center relative z-10">
        <DecorativeMotif type="lotus" className="mx-auto mb-6" />

        <span className="text-gold-600 font-serif font-bold text-6xl sm:text-8xl block tracking-tighter">
          404
        </span>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-royal-950 mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="font-hindi text-xl text-magenta-700 font-medium mb-4">
          यह पृष्ठ उपलब्ध नहीं है
        </p>

        <p className="text-stone-600 text-base max-w-md mx-auto mb-8 leading-relaxed">
          The celebration page you are looking for might have been moved or does not exist. Let&apos;s guide you back to our festive collections!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="gold" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button href="/templates" variant="outline" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore Templates
          </Button>
        </div>
      </Container>
    </div>
  );
}
