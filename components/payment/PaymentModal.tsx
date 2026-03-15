'use client';

import { useState } from 'react';
import { X, Lock, Zap, CheckCircle, Loader2, Sparkles, Shield, Crown } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  onClose: () => void;
}

const PERKS = [
  { icon: Sparkles, text: 'Unlimited PDF exports for every ebook' },
  { icon: Crown, text: 'All templates: Minimal, Business, Workbook' },
  { icon: Zap, text: 'AI-assisted formatting workflow included' },
  { icon: Shield, text: 'Future premium updates included' },
  { icon: CheckCircle, text: 'One-time payment, no recurring subscription' },
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#12121a] to-[#0a0a0f] shadow-2xl shadow-black/50">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg shadow-violet-500/30">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unlock Lifetime Access</h2>
          <p className="text-sm text-gray-400">
            Publish faster with premium export and AI formatting tools
          </p>
        </div>

        {/* Pricing card */}
        <div className="relative mx-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 p-5 shadow-inner">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 bg-gradient-to-r from-amber-600 to-orange-500 px-4 py-1.5 rounded-full shadow-lg">
              <Zap className="w-3.5 h-3.5" />
              Early Adopter Price – Limited Time
            </span>
          </div>
          
          <div className="flex items-end justify-center gap-2 mt-3 mb-2">
            <span className="text-5xl font-extrabold text-white">$11.97</span>
            <span className="text-base text-gray-400 mb-2">one-time</span>
          </div>
          <p className="text-center text-sm text-gray-500">
            <span className="line-through">$257.65/year</span>
            <span className="ml-2 text-emerald-400 font-semibold">Save 95%</span>
          </p>
        </div>

        {/* Perks */}
        <ul className="px-6 pt-6 pb-4 space-y-3">
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <li key={perk.text} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-violet-400" />
                </div>
                {perk.text}
              </li>
            );
          })}
        </ul>

        {/* Error */}
        {error && (
          <div className="mx-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <X className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 pb-8 pt-4">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={cn(
              'w-full flex items-center justify-center gap-2.5 rounded-xl py-4 text-sm font-bold transition-all duration-300',
              loading
                ? 'bg-violet-500/30 text-violet-300 cursor-not-allowed border border-violet-500/20'
                : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-400 hover:to-indigo-400 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to checkout…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Secure My Lifetime Access – $11.97
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500">
              Secure payment via Stripe • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
