import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedInvitations } from '@/components/home/FeaturedInvitations';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { FreePromiseBanner } from '@/components/home/FreePromiseBanner';
import { FaqSection } from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedInvitations />
      <WhyChooseUs />
      <FreePromiseBanner />
      <FaqSection />
    </>
  );
}
