'use client';

import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, BookMarked, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [emailHint, setEmailHint] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!token) {
        if (!active) return;
        setTokenValid(false);
        setTokenError('Invalid or missing reset link. Please request a new password reset email.');
        setVerifying(false);
        return;
      }

      setVerifying(true);
      setTokenError('');

      try {
        const res = await authApi.verifyResetToken(token);
        if (!active) return;
        const data = res.data as { valid?: boolean; email?: string };
        setTokenValid(Boolean(data.valid));
        setEmailHint(data.email || '');
      } catch (err: unknown) {
        if (!active) return;
        const message = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message
          || (err as { response?: { data?: { error?: string } } })?.response?.data?.error
          || 'This reset link is invalid or has expired. Please request a new one.';
        setTokenValid(false);
        setTokenError(message);
      } finally {
        if (active) setVerifying(false);
      }
    };

    void verify();

    return () => {
      active = false;
    };
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldError('');
    setSubmitError('');

    if (!password || !confirmPassword) {
      setFieldError('Please enter and confirm your new password.');
      return;
    }

    if (password.length < 8) {
      setFieldError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFieldError('Passwords do not match.');
      return;
    }

    setSaving(true);

    try {
      await authApi.resetPassword(token, password, confirmPassword);
      setDone(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message
        || (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Unable to reset password right now. Please try again.';
      setSubmitError(message);
    } finally {
      setSaving(false);
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

            <h1 className="text-2xl font-extrabold text-white mb-1">Set new password</h1>
            <p className="text-gray-400 text-sm mb-8">
              Choose a new password for your account.
            </p>

            {verifying ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                Verifying your reset link...
              </div>
            ) : done ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                  Your password has been updated successfully.
                  <br />
                  A confirmation email has been sent. If this was not you, contact support@creatorlab.ink immediately.
                </div>
                <Link href="/auth/login" className="block text-center text-indigo-400 font-semibold hover:underline">
                  Continue to login
                </Link>
              </div>
            ) : !tokenValid ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {tokenError}
                </div>
                <Link href="/auth/forgot-password" className="block text-center text-indigo-400 font-semibold hover:underline">
                  Request a new reset link
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {emailHint && (
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-sm text-indigo-200">
                    Resetting password for {emailHint}
                  </div>
                )}

                {(fieldError || submitError) && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {fieldError || submitError}
                  </div>
                )}

                <Input
                  label="New password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />

                <Input
                  label="Confirm new password"
                  type="password"
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />

                <Button
                  type="submit"
                  loading={saving}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  size="md"
                >
                  <Lock className="w-4 h-4" />
                  Save New Password
                </Button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-gray-300 text-sm">
          Loading password reset...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
