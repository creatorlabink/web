'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { AuthResponse } from '@/types';
import { BookMarked, ArrowLeft, Check, Clock } from 'lucide-react';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

function validate(email: string, password: string, confirm: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (!confirm) errors.confirm = 'Please confirm your password.';
  else if (password !== confirm) errors.confirm = 'Passwords do not match.';
  return errors;
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'tiktok' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errors = validate(email, password, confirm);
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await authApi.signup(email, password, name || undefined);
      const { token, user } = res.data as AuthResponse;
      login(token, user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setServerError(msg || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'tiktok') => {
    setServerError('');
    setSocialLoading(provider);
    try {
      const res = await authApi.oauthConnectUrl(provider, 'signup');
      const data = res.data as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setServerError('Could not start social signup flow.');
      }
    } catch {
      setServerError('Could not start social signup flow.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left column - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl mb-12">
            <BookMarked className="w-7 h-7 text-indigo-400" />
            Creatorlab
          </Link>
          
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
            Your ebook empire<br />
            <span className="text-indigo-400">starts here.</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-md">
            Join 2,100+ creators who turned their ideas into professional ebooks — no design skills needed.
          </p>
          
          <div className="space-y-4">
            {[
              { text: 'Lifetime access for one payment', highlight: true },
              { text: 'AI structures your raw content', highlight: false },
              { text: 'Export polished PDFs instantly', highlight: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.highlight ? 'bg-indigo-500' : 'bg-white/10'}`}>
                  <Check className={`w-3.5 h-3.5 ${item.highlight ? 'text-white' : 'text-indigo-400'}`} />
                </div>
                <span className={`text-lg ${item.highlight ? 'text-white font-semibold' : 'text-gray-300'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['AM', 'JK', 'MR', 'SL'].map((initials, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-[#0a0a0a]">
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold">2,100+ creators</p>
                <p className="text-gray-400 text-sm">Already publishing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right column - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Urgency pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Early access offer ends in</span>
              <CountdownTimer variant="mini" />
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 text-white font-bold text-lg mb-6">
              <BookMarked className="w-5 h-5 text-indigo-400" />
              Creatorlab
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-1">Create your account</h1>
            <p className="text-gray-400 text-sm mb-6">
              Start turning your words into beautiful ebooks.
            </p>

            {/* Perks */}
            <ul className="mb-6 space-y-1.5">
              {[
                'Lifetime access — no subscription',
                'Unlimited ebooks & PDF exports',
                'AI formatting + 3 templates',
              ].map((p) => (
                <li key={p} className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            {serverError && (
              <div className="mb-4 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl border border-red-500/20">
                {serverError}
              </div>
            )}

            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleSocialSignup('google')}
                disabled={socialLoading !== null}
                className="w-full rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {socialLoading === 'google' ? 'Connecting Google...' : 'Continue with Google'}
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignup('tiktok')}
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
                <span className="bg-[#111218] px-3 text-xs text-gray-500">or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Your name (optional)"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
                autoComplete="name"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />

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
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                hint="At least 8 characters."
                autoComplete="new-password"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />

              <Input
                label="Confirm password"
                type="password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={fieldErrors.confirm}
                autoComplete="new-password"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />

              <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" loading={loading} size="md">
                Create Account
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-3">
              By signing up you agree to our Terms of Service.
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-indigo-400 font-semibold hover:underline">
                Log in
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
