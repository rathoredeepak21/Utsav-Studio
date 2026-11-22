import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { Button } from '@/components/common/Button';
import { siteConfig } from '@/lib/constants/siteConfig';
import { Heart, Sparkles, ShieldCheck, Lock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Utsav Studio - Har Khushi Ka Digital Nimantaran',
  description:
    'Learn about the vision behind Utsav Studio: India’s completely free digital invitation platform built for genuine celebration, zero watermarks, and complete privacy.',
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-ivory-50 min-h-screen">
      <Container className="max-w-4xl">
        <SectionHeading
          badge="Our Mission & Story"
          badgeHindi="हमारी कहानी और संकल्प"
          title="Har Khushi Ka Digital Nimantaran"
          titleHindi="हर उत्सव, हर परिवार के लिए मुफ़्त"
          subtitle="Why we founded Utsav Studio to revolutionize how Indian families announce life’s greatest milestones."
        />

        {/* Story Intro */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold-200/80 shadow-card-warm space-y-6 text-stone-700 leading-relaxed text-base sm:text-lg font-light">
          <p>
            In Indian culture, an invitation is not just a card — it is an offering of affection, respect, and auspicious goodwill (<span className="font-hindi font-medium text-magenta-700">स्नेह निमंत्रण</span>). Whether it is placing the first wedding card at the feet of Lord Ganesha or inviting friends for a child&apos;s first birthday, these moments are sacred.
          </p>

          <p>
            Yet, when families search online to design an invitation card or video, they are constantly met with deceptive paywalls, exorbitant subscription charges, and ugly watermarks stamped right across their family announcements.
          </p>

          <div className="p-6 rounded-2xl bg-gold-50 border border-gold-300/80 font-normal text-royal-950 space-y-2">
            <h3 className="font-serif text-lg font-bold">
              Our Uncompromising Commitment:
            </h3>
            <p className="text-sm font-hindi leading-relaxed text-stone-800">
              उत्सव स्टूडियो का निर्माण इसी उद्देश्य से किया गया है कि किसी भी परिवार को अपनी खुशियां साझा करने के लिए मजबूरन शुल्क न देना पड़े। हमारा हर टेम्पलेट, हर फ़ॉन्ट और हर एक्सपोर्ट हमेशा 100% मुफ़्त रहेगा।
            </p>
          </div>

          <h3 className="font-serif text-2xl font-bold text-royal-950 pt-4">
            The 5 Pillars of Utsav Studio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-ivory-100/70 border border-gold-200">
              <h4 className="font-bold text-royal-950 text-base mb-1">1. Zero Signup Barrier</h4>
              <p className="text-xs text-stone-600">No passwords, phone numbers, or OTPs. Open and create instantly.</p>
            </div>
            <div className="p-4 rounded-xl bg-ivory-100/70 border border-gold-200">
              <h4 className="font-bold text-royal-950 text-base mb-1">2. Zero Watermark</h4>
              <p className="text-xs text-stone-600">Your sacred cards and videos remain clean and pristine.</p>
            </div>
            <div className="p-4 rounded-xl bg-ivory-100/70 border border-gold-200">
              <h4 className="font-bold text-royal-950 text-base mb-1">3. Device-Only Privacy</h4>
              <p className="text-xs text-stone-600">Your family photos stay in your browser. We never harvest your media.</p>
            </div>
            <div className="p-4 rounded-xl bg-ivory-100/70 border border-gold-200">
              <h4 className="font-bold text-royal-950 text-base mb-1">4. Rich Unicode Hindi</h4>
              <p className="text-xs text-stone-600">First-class typography for Sanskrit shlokas and Devanagari calligraphy.</p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <Button href="/templates" variant="gold" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore Free Templates
          </Button>
        </div>
      </Container>
    </div>
  );
}
