'use client';

import React, { useState } from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  category: string;
  q: string;
  qHindi: string;
  a: string;
  aHindi: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Pricing & Watermark",
    q: "Is Utsav Studio really 100% free with no watermarks?",
    qHindi: "क्या उत्सव स्टूडियो सच में बिना वॉटरमार्क के 100% मुफ़्त है?",
    a: "Yes! Every single template, Hindi font, sticker, and export format on Utsav Studio is completely free. We do not place any watermark, brand logo, or export fee on your invitation cards and video reels.",
    aHindi: "हाँ! उत्सव स्टूडियो का हर टेम्पलेट, हिंदी फ़ॉन्ट्स और डाउनलोड पूरी तरह मुफ़्त है। आपके निमंत्रण पत्र पर कोई भी वॉटरमार्क नहीं लगाया जाता।",
  },
  {
    category: "Account & Sign-up",
    q: "Do I need to create an account or sign in to make an invitation?",
    qHindi: "क्या निमंत्रण बनाने के लिए मुझे अकाउंट या लॉगिन की आवश्यकता है?",
    a: "Not at all. Public users do not need to register, verify phone numbers, or enter email addresses. You can immediately open any template, edit your details, and download. Your drafts are saved in your browser's local memory (IndexedDB).",
    aHindi: "बिल्कुल नहीं। आप बिना किसी फ़ोन नंबर या ईमेल के सीधे कार्ड बनाना शुरू कर सकते हैं। आपका काम आपके ब्राउज़र में स्वतः सुरक्षित रहता है।",
  },
  {
    category: "Languages & Fonts",
    q: "Can I write invitations in Hindi, Sanskrit shlokas, and English?",
    qHindi: "क्या मैं हिंदी, संस्कृत श्लोक और अंग्रेज़ी में निमंत्रण लिख सकता हूँ?",
    a: "Yes! We support authentic Hindi Unicode fonts (Rozha One, Yatra One, Tiro Devanagari, Noto Sans) alongside elegant English calligraphy. You can easily paste or type Sanskrit shlokas like '|| श्री गणेशाय नमः ||' or 'मंगलम् भगवान विष्णुः'.",
    aHindi: "हाँ! उत्सव स्टूडियो में देवनागरी और संस्कृत श्लोकों के लिए विशेष रूप से डिज़ाइन किए गए आकर्षक फ़ॉन्ट्स उपलब्ध हैं।",
  },
  {
    category: "Privacy & Photos",
    q: "Are my family photos and videos uploaded to a cloud server?",
    qHindi: "क्या मेरी पारिवारिक तस्वीरें किसी सर्वर पर अपलोड की जाती हैं?",
    a: "No. Your privacy is paramount. Your personal photographs and celebration media remain stored strictly inside your local browser memory. Card compilation and video rendering happen right inside your browser without uploading your media to remote servers.",
    aHindi: "नहीं। आपकी निजता हमारे लिए सर्वोपरि है। आपकी तस्वीरें और वीडियो आपके अपने डिवाइस में ही प्रोसेस होते हैं, किसी बाहरी सर्वर पर नहीं।",
  },
  {
    category: "WhatsApp & Formats",
    q: "Can I send the downloaded cards and videos directly on WhatsApp?",
    qHindi: "क्या मैं डाउनलोड किए गए कार्ड और वीडियो व्हाट्सएप पर भेज सकता हूँ?",
    a: "Yes! All designs are created in universal vertical 9:16 mobile format (1080x1920) and standard formats (PNG, JPG, MP4), making them crystal-clear for WhatsApp Status, direct family chats, and Instagram Reels.",
    aHindi: "हाँ! सभी निमंत्रण मोबाइल और व्हाट्सएप के लिए विशेष रूप से 9:16 अनुपात में तैयार किए जाते हैं, जिन्हें आप एक क्लिक में व्हाट्सएप पर भेज सकते हैं।",
  },
  {
    category: "Video Reels",
    q: "How does the in-browser video invitation maker work?",
    qHindi: "ब्राउज़र में वीडियो निमंत्रण कैसे बनता है?",
    a: "Our video engine uses cutting-edge HTML5 Canvas and WebCodecs technologies to sequence your photo slides, festive music, and animated text directly on your device, delivering an MP4 video file instantly without waiting in server queues.",
    aHindi: "हमारा वीडियो इंजन आपके ब्राउज़र की शक्ति का उपयोग करके सीधे आपके डिवाइस में वीडियो तैयार करता है, जिससे तुरंत उच्च गुणवत्ता वाला MP4 वीडियो मिल जाता है।",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Pricing & Watermark', 'Languages & Fonts', 'Privacy & Photos', 'WhatsApp & Formats'];

  const filteredFaqs = activeCategory === 'All'
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-ivory-50 border-b border-gold-200/40">
      <Container className="max-w-4xl">
        <SectionHeading
          badge="Frequently Asked Questions"
          badgeHindi="अक्सर पूछे जाने वाले प्रश्न"
          title="Everything You Need to Know"
          titleHindi="आपके सामान्य प्रश्न एवं उत्तर"
          subtitle="Clear, honest answers about Utsav Studio's free platform, Hindi typography, and client-side data privacy."
        />

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-royal-800 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-ivory-200 border border-gold-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-gold-200/80 shadow-xs overflow-hidden transition-all hover:border-gold-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 hover:bg-ivory-100/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-royal-950">
                      {faq.q}
                    </h3>
                    <p className="font-hindi text-magenta-700 text-sm mt-0.5">
                      {faq.qHindi}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-600 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-stone-100 text-stone-600 text-sm leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                    <p className="font-hindi text-stone-500 text-xs sm:text-sm">
                      {faq.aHindi}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
