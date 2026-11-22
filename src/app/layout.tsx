import type { Metadata } from 'next';
import {
  Cinzel,
  Plus_Jakarta_Sans,
  Rozha_One,
  Noto_Sans_Devanagari,
  Great_Vibes,
} from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const rozhaOne = Rozha_One({
  weight: '400',
  subsets: ['latin', 'devanagari'],
  variable: '--font-rozha',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Utsav Studio | Free Digital Invitation Maker - Har Khushi Ka Digital Nimantaran',
  description:
    'Completely free Indian digital invitation maker for weddings, birthdays, engagements, and celebrations. Zero login required, no watermark, and full privacy.',
  keywords: [
    'Digital Invitation Maker',
    'Free Indian Wedding Card Maker',
    'Hindi Invitation Card Online',
    'Shubh Vivah Nimantaran',
    'Video Invitation Maker Free',
    'Birthday Invitation Card Maker',
    'Engagement Card Online',
    'Griha Pravesh Card Free',
    'Utsav Studio',
  ],
  authors: [{ name: 'Utsav Studio' }],
  metadataBase: new URL('https://utsavstudio.in'),
  openGraph: {
    title: 'Utsav Studio | Free Digital Invitation Maker',
    description: 'Har Khushi Ka Digital Nimantaran - 100% Free, No Watermark, No Login Required.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${plusJakarta.variable} ${rozhaOne.variable} ${notoDevanagari.variable} ${greatVibes.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-ivory-50 text-stone-900 antialiased selection:bg-gold-200 selection:text-royal-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
