'use client';

import React from 'react';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { Languages } from 'lucide-react';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center space-x-1 bg-ivory-200/80 p-1 rounded-full border border-gold-300/40 text-xs font-medium">
      <div className="pl-1.5 pr-0.5 text-stone-500">
        <Languages className="w-3.5 h-3.5" />
      </div>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 rounded-full transition-all ${
          language === 'en'
            ? 'bg-royal-800 text-white shadow-sm font-semibold'
            : 'text-stone-700 hover:text-royal-800'
        }`}
        aria-label="English language"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2 py-0.5 rounded-full font-hindi transition-all ${
          language === 'hi'
            ? 'bg-royal-800 text-white shadow-sm font-bold'
            : 'text-stone-700 hover:text-royal-800'
        }`}
        aria-label="Hindi language"
      >
        हिंदी
      </button>
    </div>
  );
}
