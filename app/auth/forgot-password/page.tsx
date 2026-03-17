'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { BookMarked, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setLoading(true);

    try {
      await authApi.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message
        || (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Unable to request password reset right now. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-6">
              <BookMarked className="w-5 h-5 text-indigo-400" />
              Creatorlab
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-1">Reset your password</h1>
            <p className="text-gray-400 text-sm mb-8">
              Enter your email and we&apos;ll guide you to recover account access.
            </p>

            {submitted ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                Recovery request received for <span className="font-semibold">{email}</span>.
                <br />
                Check your inbox for your secure password reset link.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  size="md"
                >
                  <Mail className="w-4 h-4" />
                  Request Password Reset
                </Button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
              Remembered your password?{' '}
              <Link href="/auth/login" className="text-indigo-400 font-semibold hover:underline">
                Back to login
              </Link>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
