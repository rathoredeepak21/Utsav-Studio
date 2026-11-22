import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import {
  HelpCircle,
  Smartphone,
  Type,
  Video,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center & Tutorials | Utsav Studio',
  description:
    'Step-by-step guides on how to design cards, customize Hindi text, render videos in browser, and share on WhatsApp.',
};

const GUIDES = [
  {
    icon: <Sparkles className="w-6 h-6 text-gold-600" />,
    title: 'How to Create an Invite in 3 Minutes',
    titleHindi: '3 मिनट में निमंत्रण पत्र कैसे तैयार करें',
    steps: [
      'Choose your occasion category (Wedding, Birthday, Anniversary, etc.).',
      'Select a template you love or choose "Start Blank Canvas".',
      'Replace the placeholder names, date, and venue with your ceremony details.',
      'Click "Export Free HD Card" to immediately save to your phone or computer.',
    ],
  },
  {
    icon: <Type className="w-6 h-6 text-gold-600" />,
    title: 'Typing in Hindi & Sanskrit Shlokas',
    titleHindi: 'हिंदी एवं संस्कृत श्लोक कैसे लिखें',
    steps: [
      'You can type directly using Hindi typing keyboards (Google Indic, Gboard, Windows Hindi input).',
      'Or copy & paste sacred shlokas like "|| श्री गणेशाय नमः ||" or "मंगलम् भगवान विष्णुः".',
      'Choose from authentic Devanagari fonts like Rozha One, Yatra One, and Noto Sans.',
    ],
  },
  {
    icon: <Share2 className="w-6 h-6 text-gold-600" />,
    title: 'Sharing on WhatsApp & Social Media',
    titleHindi: 'व्हाट्सएप पर कैसे भेजें',
    steps: [
      'All cards and video reels are formatted in 9:16 vertical ratio (1080x1920).',
      'After downloading, open WhatsApp and attach the image directly to your chats or Status.',
      'Because there are no watermarks or compressions, it looks crystal-clear on all phones.',
    ],
  },
  {
    icon: <Video className="w-6 h-6 text-gold-600" />,
    title: 'Making Animated Video Reels',
    titleHindi: 'एनिमेटेड वीडियो रील कैसे बनाएं',
    steps: [
      'Open the Video Editor from the navigation menu or any video template.',
      'Customize each slide or scene with couple details and event dates.',
      'Click "Export Free HD Video" — rendering happens automatically inside your browser!',
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="py-16 bg-ivory-50 min-h-screen">
      <Container className="max-w-5xl">
        <SectionHeading
          badge="Help & Tutorials"
          badgeHindi="सहायता एवं मार्गदर्शन"
          title="How to Use Utsav Studio"
          titleHindi="डिजिटल निमंत्रण बनाने के आसान चरण"
          subtitle="Everything you need to know about customizing, downloading, and sharing your celebrations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {GUIDES.map((guide) => (
            <div
              key={guide.title}
              className="bg-white p-7 rounded-3xl border border-gold-200/80 shadow-card-warm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200/60 flex items-center justify-center mb-4">
                  {guide.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-royal-950 mb-0.5">
                  {guide.title}
                </h3>
                <p className="font-hindi text-magenta-700 text-xs font-semibold mb-4">
                  {guide.titleHindi}
                </p>

                <ol className="space-y-2.5 text-stone-600 text-sm list-decimal list-inside leading-relaxed">
                  {guide.steps.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Us Box */}
        <div className="text-center p-8 bg-royal-950 text-white rounded-3xl border border-gold-500/40 shadow-royal-glow/20">
          <h3 className="font-serif text-2xl font-bold text-gold-300 mb-2">
            Have questions or need assistance?
          </h3>
          <p className="text-stone-300 text-sm max-w-md mx-auto mb-6">
            We are here to help your family celebrations shine. Contact our team anytime.
          </p>
          <Button href="/contact" variant="gold" size="md">
            Contact Support (संपर्क करें)
          </Button>
        </div>
      </Container>
    </div>
  );
}
