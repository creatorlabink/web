'use client';

import { useState } from 'react';
import { X, Lock, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  onClose: () => void;
}

const PERKS = [
  'Unlimited PDF exports – forever',
  'All current & future templates',
  'AI-assisted formatting (Phase 4)',
  'Priority support',
  'One-time payment – no subscription',
];

export function PaymentModal({ onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentApi.createCheckout();
      const { url } = res.data as { url: string };
      if (url) {
        window.location.href = url;
      } else {
        setError('Could not start checkout. Please try again.');
      }
    } catch {
      setError('Payment service unavailable. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 pt-6 pb-8 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">Unlock PDF Export</h2>
          <p className="text-sm text-indigo-200">
            Get lifetime access for a one-time payment
          </p>
        </div>

        {/* Pricing callout */}
        <div className="mx-6 -mt-4 bg-white rounded-xl border-2 border-indigo-600 p-4 shadow-md text-center">
          <div className="flex items-end justify-center gap-1 mb-0.5">
            <span className="text-4xl font-extrabold text-gray-900">$11.97</span>
            <span className="text-base text-gray-500 mb-1.5">one-time</span>
          </div>
          <p className="text-xs text-gray-500 line-through mb-1">$257.65/year after launch</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3" /> Early Adopter Price – Limited Time
          </span>
        </div>

        {/* Perks */}
        <ul className="px-6 pt-4 pb-2 space-y-2">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              {perk}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <p className="mx-6 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* CTA */}
        <div className="px-6 pb-6 pt-3">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-white font-bold text-sm transition-all',
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md active:scale-95'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to checkout…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Get Lifetime Access – $11.97
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Secure payment via Stripe. 30-day refund guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
