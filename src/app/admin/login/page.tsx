'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Lock, ShieldAlert, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg(
        'Supabase authentication is not yet configured. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      );
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/admin/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected authentication error occurred.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ivory-50 px-4 py-16">
      <Container className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-gold-300 shadow-card-warm p-8 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-royal-950 text-gold-400 border border-gold-400 flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
              Staff & Administrator Access
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-royal-950 mt-3 mb-1">
              Admin Portal
            </h1>
            <p className="text-xs text-stone-500">
              Restricted to authorized Utsav Studio administrators.
            </p>
          </div>

          {/* Public user reminder */}
          <div className="mb-6 p-3.5 bg-gold-50 border border-gold-300/80 rounded-2xl text-xs text-royal-950 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you creating an invitation?</p>
              <p className="text-stone-600 mt-0.5">
                Public users do not need an account. You can create invitations without logging in.
              </p>
              <Link href="/templates" className="font-semibold text-magenta-700 hover:underline mt-1 inline-block">
                Go to Free Templates →
              </Link>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-6 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Supabase Configuration Pending</p>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Connect your Supabase project in <code className="bg-amber-100 px-1 rounded">.env.local</code> to activate live administrative authentication.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-royal-950 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@utsavstudio.in"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-950 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full justify-center"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-xs text-stone-500 hover:text-royal-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Return to Public Website
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
