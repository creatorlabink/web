'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { AuthResponse } from '@/types';
import { BookMarked, ArrowLeft, Sparkles, Lock, Zap } from 'lucide-react';

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'tiktok' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errors = validate(email, password);
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      const { token, user } = res.data as AuthResponse;
      login(token, user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const data = (err as { response?: { status?: number; data?: { error?: string; message?: string; checkout_url?: string } } })?.response?.data;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402 && data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      const msg = data?.message || data?.error;
      setServerError(msg || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'tiktok') => {
    setServerError('');
    setSocialLoading(provider);
    try {
      const res = await authApi.oauthConnectUrl(provider, 'login');
      const data = res.data as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setServerError('Could not start social login flow.');
      }
    } catch {
      setServerError('Could not start social login flow.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left column - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-[#0a0a0a]" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl mb-12">
            <BookMarked className="w-7 h-7 text-indigo-400" />
            Creatorlab
          </Link>
          
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
            Welcome back,<br />
            <span className="text-indigo-400">creator.</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-md">
            Your ebooks are waiting. Let's publish something valuable today.
          </p>
          
          <div className="space-y-5">
            {[
              { icon: Sparkles, text: 'AI-powered formatting saves hours' },
              { icon: Lock, text: 'Your content stays private and secure' },
              { icon: Zap, text: 'Export production-ready PDFs instantly' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right column - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 text-white font-bold text-lg mb-6">
              <BookMarked className="w-5 h-5 text-indigo-400" />
              Creatorlab
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm mb-8">
              Log in to your account to continue creating ebooks.
            </p>

            {process.env.NEXT_PUBLIC_LOCAL_MODE === 'true' && (
              <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                <p className="font-semibold">Local demo login</p>
                <p className="text-amber-400/80">Email: demo@creatorlab.io</p>
                <p className="text-amber-400/80">Password: creator123</p>
              </div>
            )}

            {serverError && (
              <div className="mb-4 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl border border-red-500/20">
                {serverError}
              </div>
            )}

            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading !== null}
                className="w-full rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {socialLoading === 'google' ? 'Connecting Google...' : 'Continue with Google'}
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('tiktok')}
                disabled={socialLoading !== null}
                className="w-full rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {socialLoading === 'tiktok' ? 'Connecting TikTok...' : 'Continue with TikTok'}
              </button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#111218] px-3 text-xs text-gray-500">or use email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                autoComplete="email"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                autoComplete="current-password"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />

              <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" loading={loading} size="md">
                Log in to my account
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
              Don&#39;t have an account?{' '}
              <Link href="/auth/signup" className="text-indigo-400 font-semibold hover:underline">
                Sign up for early access →
              </Link>
            </div>
          </div>

          {/* Back link */}
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
