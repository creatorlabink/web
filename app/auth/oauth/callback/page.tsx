'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { AuthResponse } from '@/types';

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Finalizing social login...');

  const provider = useMemo(() => (params.get('provider') || '').toLowerCase(), [params]);
  const code = useMemo(() => params.get('code') || '', [params]);
  const state = useMemo(() => params.get('state') || '', [params]);
  const error = useMemo(() => params.get('error') || '', [params]);

  useEffect(() => {
    let active = true;

    async function completeLogin() {
      if (error) {
        if (!active) return;
        setStatus('error');
        setMessage('Social login was cancelled or denied.');
        return;
      }

      if ((provider !== 'google' && provider !== 'tiktok') || !code || !state) {
        if (!active) return;
        setStatus('error');
        setMessage('Missing or invalid OAuth callback parameters.');
        return;
      }

      try {
        const res = await authApi.oauthExchangeCode(provider, code, state);
        const { token, user } = res.data as AuthResponse;
        login(token, user);
        if (!active) return;
        setStatus('success');
        setMessage('Login successful. Redirecting to dashboard...');
        setTimeout(() => {
          router.replace('/dashboard');
        }, 900);
      } catch (err: unknown) {
        const data = (err as { response?: { status?: number; data?: { checkout_url?: string } } })?.response?.data;
        const statusCode = (err as { response?: { status?: number } })?.response?.status;
        if (statusCode === 402 && data?.checkout_url) {
          window.location.href = data.checkout_url;
          return;
        }
        if (!active) return;
        setStatus('error');
        setMessage('Social login failed. Please try again.');
      }
    }

    completeLogin();

    return () => {
      active = false;
    };
  }, [provider, code, state, error, login, router]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
      <div className="flex justify-center mb-4">
        {status === 'loading' && <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />}
        {status === 'success' && <CheckCircle2 className="w-7 h-7 text-emerald-400" />}
        {status === 'error' && <AlertCircle className="w-7 h-7 text-red-400" />}
      </div>
      <h1 className="text-xl font-bold mb-2">Social Login</h1>
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );
}

function CallbackFallback() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
      </div>
      <h1 className="text-xl font-bold mb-2">Social Login</h1>
      <p className="text-sm text-gray-300">Finalizing social login...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white flex items-center justify-center px-6">
      <Suspense fallback={<CallbackFallback />}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
