import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Ethics | Utsav Studio',
  description:
    'Our strict zero-harvesting privacy policy. How Utsav Studio safeguards your family photos, videos, and invitations completely inside your browser.',
};

export default function PrivacyPage() {
  return (
    <div className="py-16 bg-ivory-50 min-h-screen">
      <Container className="max-w-4xl">
        <SectionHeading
          badge="Privacy First"
          badgeHindi="गोपनीयता नीति"
          title="Your Privacy is Sacred to Us"
          titleHindi="आपकी पारिवारिक तस्वीरें और डेटा केवल आपके पास"
          subtitle="A plain-English breakdown of why Utsav Studio does not track you or harvest personal media."
        />

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold-200/80 shadow-card-warm space-y-8 text-stone-700 leading-relaxed text-sm sm:text-base">
          {/* Highlight Box */}
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start space-x-4">
            <Lock className="w-6 h-6 text-emerald-700 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-base mb-1">
                The Golden Privacy Rule of Utsav Studio
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                When you create an invitation card or video on Utsav Studio, your personal photos, celebration details, and exported media <strong>never leave your device</strong>. Processing and rendering happen in your browser using local storage (IndexedDB) and the Canvas API.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-royal-950">
              1. No Account Required for Public Users
            </h3>
            <p className="text-stone-600 text-sm">
              We do not ask public users to register, sign up, or verify their phone numbers or email addresses. Anyone can create, edit, and download invitations freely.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-royal-950">
              2. Local Storage (IndexedDB)
            </h3>
            <p className="text-stone-600 text-sm">
              Your drafts and custom creations are saved inside your own browser using IndexedDB. If you clear your browser cache or use incognito mode, your drafts stay local to that session. We do not maintain server copies of your personal invitations.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-royal-950">
              3. In-Browser Video & Card Rendering
            </h3>
            <p className="text-stone-600 text-sm">
              Video compilation and card generation run client-side via modern web APIs. Personal family photos uploaded to custom frames are drawn directly on your local canvas and never transmitted across the internet.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-royal-950">
              4. Zero Data Selling or Cross-Site Trackers
            </h3>
            <p className="text-stone-600 text-sm">
              We do not sell personal information, browsing history, or contact details to third-party ad networks or data brokers.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-100 text-xs text-stone-500">
            Last Updated: November 2026 • Utsav Studio Legal & Privacy Team
          </div>
        </div>
      </Container>
    </div>
  );
}
