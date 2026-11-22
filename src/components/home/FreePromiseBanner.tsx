'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { Sparkles, Check, X, ShieldCheck } from 'lucide-react';

export function FreePromiseBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-royal-950 via-royal-900 to-magenta-950 text-white relative overflow-hidden border-y-2 border-gold-500/30">
      {/* Decorative Lotus Underlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none transform translate-x-1/4 scale-150">
        <DecorativeMotif type="lotus" className="w-96 h-96 text-gold-400" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="inline-flex items-center space-x-2 bg-gold-400/20 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-gold-400/40 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>The Utsav Free Promise</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Digital Invitations Should Be a Joy, Not an Expense.
          </h2>

          <p className="font-hindi text-xl sm:text-2xl text-gold-300 font-medium mb-5">
            खुशियां बांटने पर कोई शुल्क नहीं! हमारी हर सुविधा हमेशा 100% मुफ़्त रहेगी।
          </p>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Unlike other platforms that lure you in only to demand payment when you try to export or slap huge watermarks across your sacred cards, Utsav Studio will never charge you for core invitation creation.
          </p>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="max-w-3xl mx-auto bg-royal-900/80 rounded-3xl border border-gold-500/40 overflow-hidden shadow-2xl mb-12">
          <div className="grid grid-cols-12 bg-royal-950/90 text-xs font-bold uppercase tracking-wider p-4 border-b border-royal-800 text-stone-300">
            <div className="col-span-5 sm:col-span-6">Features & Guarantee</div>
            <div className="col-span-4 sm:col-span-3 text-center text-gold-300">Utsav Studio</div>
            <div className="col-span-3 sm:col-span-3 text-center text-stone-400">Other Websites</div>
          </div>

          <div className="divide-y divide-royal-800 text-xs sm:text-sm">
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-5 sm:col-span-6 font-medium text-white">Watermark on Download</div>
              <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                Zero Watermark
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-rose-400 flex items-center justify-center gap-1">
                <X className="w-4 h-4" />
                Forced Logo
              </div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-5 sm:col-span-6 font-medium text-white">Export Cost</div>
              <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                100% Free Forever
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-rose-400 flex items-center justify-center gap-1">
                <X className="w-4 h-4" />
                ₹499 - ₹1,999
              </div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-5 sm:col-span-6 font-medium text-white">Account / Sign-up Required</div>
              <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                No Sign-up (Instant)
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-rose-400 flex items-center justify-center gap-1">
                <X className="w-4 h-4" />
                Mandatory OTP
              </div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-5 sm:col-span-6 font-medium text-white">User Family Photos Privacy</div>
              <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                Device-Only (Safe)
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-stone-400 flex items-center justify-center gap-1">
                <X className="w-4 h-4" />
                Uploaded to Server
              </div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-5 sm:col-span-6 font-medium text-white">Hindi & Sanskrit Unicode Fonts</div>
              <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                Full First-Class
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-stone-400 flex items-center justify-center gap-1">
                <X className="w-4 h-4" />
                Limited / Broken
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/templates" variant="gold" size="lg" className="w-full sm:w-auto shadow-gold-glow">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore Free Templates
          </Button>
          <Button href="/about" variant="ghost" size="lg" className="text-gold-300 hover:text-white w-full sm:w-auto">
            Read Our Full Manifesto
          </Button>
        </div>
      </Container>
    </section>
  );
}
