'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';

export function FreePromiseBanner() {
  const { language } = useLanguageStore();

  return (
    <section className="py-16 bg-gradient-to-br from-royal-950 via-royal-900 to-magenta-950 text-white relative overflow-hidden border-y-2 border-gold-500/30">
      {/* Decorative Lotus Underlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none transform translate-x-1/4 scale-150">
        <DecorativeMotif type="lotus" className="w-96 h-96 text-gold-400" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center space-x-2 bg-gold-400/20 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-gold-400/40 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Utsav Free Promise</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Digital Invitations Should Be a Joy, Not an Expense.
          </h2>

          <p className="font-hindi text-xl sm:text-2xl text-gold-300 font-medium mb-6">
            खुशियां बांटने पर कोई शुल्क नहीं! हमारी हर सुविधा हमेशा मुफ़्त रहेगी।
          </p>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-light">
            Unlike other platforms that lure you in only to demand payments when you try to export or slap huge watermarks across your sacred cards, Utsav Studio will never charge you for core invitation creation.
          </p>

          {/* Comparison Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
            <div className="bg-royal-900/60 p-4 rounded-2xl border border-emerald-500/30 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-white">Always Free & Clean</p>
                <p className="text-xs text-stone-300 font-hindi mt-0.5">बिना किसी छिपे शुल्क या वॉटरमार्क के हाई-डेफिनिशन एक्सपोर्ट।</p>
              </div>
            </div>

            <div className="bg-royal-900/60 p-4 rounded-2xl border border-emerald-500/30 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-white">Browser-Only Privacy</p>
                <p className="text-xs text-stone-300 font-hindi mt-0.5">आपकी तस्वीरें और प्रोजेक्ट आपके मोबाइल/कंप्यूटर में सुरक्षित रहते हैं।</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/templates" variant="gold" size="lg" className="w-full sm:w-auto">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Creating Now (शुरू करें)
            </Button>
            <Button href="/about" variant="ghost" size="lg" className="text-gold-300 hover:text-white w-full sm:w-auto">
              Read Our Mission Story
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
