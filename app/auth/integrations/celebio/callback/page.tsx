'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { integrationsApi } from '@/lib/api';

function CelebioCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Finalizing cele.bio connection...');

  const code = useMemo(() => params.get('code') || '', [params]);
  const state = useMemo(() => params.get('state') || '', [params]);
  const error = useMemo(() => params.get('error') || '', [params]);

  useEffect(() => {
    let active = true;

    async function finishConnection() {
      if (error) {
        if (!active) return;
        setStatus('error');
        setMessage('Cele.bio denied the connection request.');
        return;
      }

      if (!code || !state) {
        if (!active) return;
        setStatus('error');
        setMessage('Missing OAuth callback parameters from cele.bio.');
        return;
      }

      try {
        await integrationsApi.celebioExchangeCode(code, state);
        if (!active) return;
        setStatus('success');
        setMessage('Cele.bio account connected. Redirecting to your ebooks...');
        setTimeout(() => {
          router.replace('/dashboard/ebooks');
        }, 900);
      } catch {
        if (!active) return;
        setStatus('error');
        setMessage('Failed to connect cele.bio. Please try again.');
      }
    }

    finishConnection();
    return () => {
      active = false;
    };
  }, [code, state, error, router]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
      <div className="flex justify-center mb-4">
        {status === 'loading' && <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />}
        {status === 'success' && <CheckCircle2 className="w-7 h-7 text-emerald-400" />}
        {status === 'error' && <AlertCircle className="w-7 h-7 text-red-400" />}
      </div>
      <h1 className="text-xl font-bold mb-2">cele.bio Integration</h1>
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
      <h1 className="text-xl font-bold mb-2">cele.bio Integration</h1>
      <p className="text-sm text-gray-300">Finalizing cele.bio connection...</p>
    </div>
  );
}

export default function CelebioCallbackPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white flex items-center justify-center px-6">
      <Suspense fallback={<CallbackFallback />}>
        <CelebioCallbackContent />
      </Suspense>
    </div>
  );
}
