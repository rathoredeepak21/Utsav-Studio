import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedInvitations } from '@/components/home/FeaturedInvitations';
import { CardInvitationsSection } from '@/components/home/CardInvitationsSection';
import { VideoInvitationsSection } from '@/components/home/VideoInvitationsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { FreePromiseBanner } from '@/components/home/FreePromiseBanner';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section with Prominent Buttons & Previews */}
      <HeroSection />

      {/* 2. All Celebration Categories (Hindi & English) */}
      <CategoryGrid />

      {/* 3. Featured Invitation Templates */}
      <FeaturedInvitations />

      {/* 4. Dedicated Card Invitation Section */}
      <CardInvitationsSection />

      {/* 5. Dedicated Animated Video Invitation Section */}
      <VideoInvitationsSection />

      {/* 6. How It Works Section */}
      <HowItWorksSection />

      {/* 7. Why Families Choose Utsav Studio */}
      <WhyChooseUs />

      {/* 8. Free Forever & Zero Watermark Promise with Comparison Table */}
      <FreePromiseBanner />

      {/* 9. Testimonials (Sample Cultural Use-Cases) */}
      <TestimonialsSection />

      {/* 10. Complete FAQ Section */}
      <FaqSection />
    </>
  );
}
