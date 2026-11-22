import React from 'react';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-ivory-50 px-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gold-200 border-t-royal-800 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-gold-600 font-bold text-lg">उ</span>
        </div>
      </div>
      <p className="mt-6 font-serif text-royal-950 text-lg font-semibold tracking-wide">
        Utsav Studio
      </p>
      <p className="text-stone-500 font-hindi text-sm mt-1">
        तैयार हो रहा है... कृपया प्रतीक्षा करें
      </p>
      <DecorativeMotif className="mt-4 opacity-70" />
    </div>
  );
}
