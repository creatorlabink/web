'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { integrationsApi } from '@/lib/api';

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Finalizing Gumroad connection...');

  const code = useMemo(() => params.get('code') || '', [params]);
  const state = useMemo(() => params.get('state') || '', [params]);
  const error = useMemo(() => params.get('error') || '', [params]);

  useEffect(() => {
    let active = true;

    async function finish() {
      if (error) {
        if (!active) return;
        setStatus('error');
        setMessage('Gumroad denied the connection request.');
        return;
      }
      if (!code || !state) {
        if (!active) return;
        setStatus('error');
        setMessage('Missing OAuth callback parameters from Gumroad.');
        return;
      }
      try {
        await integrationsApi.gumroadExchangeCode(code, state);
        if (!active) return;
        setStatus('success');
        setMessage('Gumroad connected. Redirecting to Connected Apps...');
        setTimeout(() => router.replace('/dashboard/apps'), 900);
      } catch {
        if (!active) return;
        setStatus('error');
        setMessage('Failed to connect Gumroad. Please try again.');
      }
    }

    finish();
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
      <h1 className="text-xl font-bold mb-2">Gumroad Integration</h1>
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );
}

function Fallback() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
      </div>
      <h1 className="text-xl font-bold mb-2">Gumroad Integration</h1>
      <p className="text-sm text-gray-300">Finalizing Gumroad connection...</p>
    </div>
  );
}

export default function GumroadCallbackPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white flex items-center justify-center px-6">
      <Suspense fallback={<Fallback />}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
