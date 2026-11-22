'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Star, Heart, CheckCircle2, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  quoteHindi: string;
  name: string;
  city: string;
  celebration: string;
  rating: number;
}

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Every other website demanded Rs. 1,499 just to remove their ugly watermark from our wedding card. Utsav Studio allowed us to download a gorgeous royal Rajasthani invitation in pure HD for free without even asking for our phone number!",
    quoteHindi:
      "अन्य सभी वेबसाइट्स वॉटरमार्क हटाने के लिए पैसे मांग रही थीं। उत्सव स्टूडियो ने बिना किसी लॉगिन के हमें बेहद सुंदर निमंत्रण पत्र मुफ़्त में डाउनलोड करने दिया।",
    name: "Sunita & Rajesh Sharma",
    city: "Jaipur, Rajasthan",
    celebration: "Daughter's Royal Vivah",
    rating: 5,
  },
  {
    quote:
      "The Hindi font support is top notch. We were able to type traditional Sanskrit shlokas and Hindi text for our Griha Pravesh with zero formatting issues. Sent it on WhatsApp to 400 relatives effortlessly.",
    quoteHindi:
      "हिंदी और संस्कृत श्लोकों के लिए फॉन्ट्स कमाल के हैं। गृह प्रवेश के 400 निमंत्रण व्हाट्सएप पर आसानी से भेजे।",
    name: "Vikas & Meena Patel",
    city: "Ahmedabad, Gujarat",
    celebration: "Auspicious Griha Pravesh",
    rating: 5,
  },
  {
    quote:
      "I made an animated jungle safari video invitation for my son's 1st birthday in just 5 minutes. The fact that the video rendered completely in my phone's browser without uploading our private baby photos won my trust.",
    quoteHindi:
      "बेटे के पहले जन्मदिन की वीडियो रील 5 मिनट में तैयार हो गई। सबसे अच्छी बात कि हमारी पारिवारिक तस्वीरें किसी बाहरी सर्वर पर अपलोड नहीं हुईं।",
    name: "Pooja Verma",
    city: "Mumbai, Maharashtra",
    celebration: "1st Birthday Safari Reel",
    rating: 5,
  },
  {
    quote:
      "Organized our parents' 25th Silver Jubilee anniversary. The silver filigree design was so elegant that all our relatives thought we hired a professional design agency!",
    quoteHindi:
      "माता-पिता की 25वीं सालगिरह का कार्ड इतना सुंदर बना कि सभी रिश्तेदारों को लगा किसी डिज़ाइनर से बनवाया है।",
    name: "Rohan & Sneha Kulkarni",
    city: "Pune, Maharashtra",
    celebration: "25th Silver Jubilee Anniversary",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-ivory-50 border-b border-gold-200/50">
      <Container>
        <SectionHeading
          badge="User Stories & Experiences"
          badgeHindi="अनुभव व प्रतिक्रियाएं"
          title="Loved by Families Across India"
          titleHindi="भारतीय परिवारों का भरोसा और स्नेह"
          subtitle="Real celebration scenarios reflecting how Utsav Studio helps families celebrate life’s milestones freely."
        />

        {/* Sample Content Disclosure Notice */}
        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            ℹ️ Sample user testimonials illustrating authentic cultural celebration use-cases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SAMPLE_TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-gold-200/80 shadow-card-warm flex flex-col justify-between relative group hover:border-gold-400 transition-colors"
            >
              <div>
                {/* Star Rating and Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-gold-300" />
                </div>

                <p className="text-stone-700 text-sm leading-relaxed mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <p className="font-hindi text-stone-500 text-xs sm:text-sm leading-relaxed italic mb-6">
                  &ldquo;{t.quoteHindi}&rdquo;
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-royal-950">
                    {t.name}
                  </h4>
                  <p className="text-xs text-stone-500">{t.city}</p>
                </div>

                <span className="text-[11px] font-medium bg-ivory-200 text-magenta-800 px-2.5 py-1 rounded-full border border-ivory-300">
                  {t.celebration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
