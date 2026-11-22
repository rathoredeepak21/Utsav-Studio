'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error safely in console
    console.error('Utsav Studio caught error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-ivory-50 px-4 py-16">
      <Container className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 mb-6 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-royal-950 mb-2">
          Something went wrong
        </h1>
        <p className="font-hindi text-magenta-700 text-sm mb-4">
          कुछ अप्रत्याशित समस्या आई है।
        </p>

        <p className="text-stone-600 text-sm mb-8 leading-relaxed">
          We encountered an unexpected issue while loading this invitation section. Your saved designs remain safe on your device.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} variant="primary" size="md">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again (पुनः प्रयास करें)
          </Button>
          <Button href="/" variant="outline" size="md">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
