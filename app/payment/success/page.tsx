'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

type Status = 'verifying' | 'success' | 'failed';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>('verifying');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    paymentApi
      .verifySession(sessionId)
      .then((res) => {
        const data = res.data as { success: boolean };
        setStatus(data.success ? 'success' : 'failed');
      })
      .catch(() => setStatus('failed'));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Confirming your payment…</h1>
            <p className="text-sm text-gray-500">Just a moment, we are verifying your order.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to CreatorLab.ink!
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              {user?.name ? `Hey ${user.name}! ` : ''}Your lifetime access is now active.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You can now export unlimited ebooks as PDFs.
            </p>

            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 mb-6 text-left space-y-1">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">Your plan includes</p>
              {[
                'Unlimited PDF exports',
                'All templates (current & future)',
                'AI formatting when Phase 4 launches',
                'Lifetime access – no renewals',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-indigo-800">
                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/dashboard/ebooks')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl py-3 transition-colors"
            >
              Start Creating Ebooks →
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-9 h-9 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment not confirmed</h1>
            <p className="text-sm text-gray-500 mb-6">
              We could not verify your payment. If you were charged, please contact support.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold text-sm rounded-xl py-3 transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
