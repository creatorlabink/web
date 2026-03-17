'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useOfferState } from '@/lib/offer';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { analyticsApi } from '@/lib/api';
import {
  ArrowRight,
  BookMarked,
  Check,
  CheckCircle2,
  Crown,
  Flame,
  Gift,
  HelpCircle,
  Lock,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';

const allPerks = [
  { name: 'Unlimited ebook creation', free: false, monthly: true, yearly: true, lifetime: true },
  { name: 'AI-powered formatting (Unveil)', free: false, monthly: true, yearly: true, lifetime: true },
  { name: 'Teleprompter — voice-to-ebook', free: false, monthly: true, yearly: true, lifetime: true },
  { name: 'All 3 premium templates', free: false, monthly: true, yearly: true, lifetime: true },
  { name: 'PDF export', free: false, monthly: true, yearly: true, lifetime: true },
  { name: 'Real-time preview', free: false, monthly: true, yearly: true, lifetime: true },
  { name: 'Custom branding & colors', free: false, monthly: false, yearly: true, lifetime: true },
  { name: 'Publish to cele.bio & Gumroad', free: false, monthly: false, yearly: true, lifetime: true },
  { name: 'Priority support', free: false, monthly: false, yearly: true, lifetime: true },
  { name: 'All future features', free: false, monthly: false, yearly: true, lifetime: true },
  { name: 'Lifetime updates (no renewals)', free: false, monthly: false, yearly: false, lifetime: true },
];

export default function PricingPage() {
  const { earlyOfferActive } = useOfferState();
  const [billingToggle, setBillingToggle] = useState<'monthly' | 'yearly'>('yearly');

  const trackCta = (plan: string) => {
    analyticsApi.track('cta_click', {
      source: 'pricing',
      metadata: { plan, early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0a0a0a] to-purple-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-indigo-600/15 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4">
            Pricing
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Simple, Transparent<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            One platform. Everything included. Pick the plan that works for you.
          </p>
        </div>
      </section>

      {/* ─── Early Adopter Banner ──────────────────────────────────────── */}
      {earlyOfferActive && (
        <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-5">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Flame className="w-6 h-6 text-amber-900 animate-pulse" />
            <p className="text-amber-900 font-bold text-lg">
              Early Adopter Special — Lifetime Access for <span className="text-2xl">$11.97</span> (one-time)
            </p>
            <span className="text-amber-800 font-semibold text-sm">
              Expires in <CountdownTimer variant="mini" />
            </span>
          </div>
        </section>
      )}

      {/* ─── Pricing Cards ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Billing toggle */}
          {!earlyOfferActive && (
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setBillingToggle('monthly')}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    billingToggle === 'monthly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingToggle('yearly')}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    billingToggle === 'yearly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Yearly
                  <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    Save 40%
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className={`grid gap-8 max-w-5xl mx-auto ${earlyOfferActive ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {/* ─── Early Adopter Lifetime (only when active) ───────────── */}
            {earlyOfferActive && (
              <div className="relative rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-white p-8 shadow-xl shadow-amber-200/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    <Flame className="w-3.5 h-3.5" />
                    Limited Time
                  </span>
                </div>

                <div className="pt-4">
                  <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">Early Adopter — Lifetime</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-6xl font-black text-gray-900">$11.97</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">One-time payment. Yours forever.</p>
                  <p className="text-xs text-amber-600 font-semibold mb-6">
                    <Flame className="w-3 h-3 inline" /> Offer expires in <CountdownTimer variant="mini" />
                  </p>

                  <Link href="/auth/signup" onClick={() => trackCta('lifetime')} className="block mb-6">
                    <Button className="w-full py-4 text-lg bg-amber-500 hover:bg-amber-600 text-white gap-2">
                      Claim Lifetime Access <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>

                  <ul className="space-y-3">
                    {allPerks.map((p) => (
                      <li key={p.name} className="flex items-center gap-2.5 text-sm">
                        {p.lifetime ? (
                          <Check className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 shrink-0" />
                        )}
                        <span className={p.lifetime ? 'text-gray-700' : 'text-gray-400'}>{p.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ─── Monthly ─────────────────────────────────────────────── */}
            <div className={`relative rounded-3xl border p-8 ${
              !earlyOfferActive && billingToggle === 'monthly'
                ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-100/50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-5xl font-black ${!earlyOfferActive && billingToggle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
                  $29.97
                </span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Cancel anytime. No commitment.</p>

              <Link href="/auth/signup" onClick={() => trackCta('monthly')} className="block mb-6">
                <Button
                  className="w-full py-3"
                  variant={!earlyOfferActive && billingToggle === 'monthly' ? 'primary' : 'secondary'}
                  disabled={earlyOfferActive}
                >
                  {earlyOfferActive ? 'Available after early access' : 'Get Started'}
                </Button>
              </Link>

              <ul className="space-y-3">
                {allPerks.map((p) => (
                  <li key={p.name} className="flex items-center gap-2.5 text-sm">
                    {p.monthly ? (
                      <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={p.monthly ? 'text-gray-700' : 'text-gray-400'}>{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Yearly ──────────────────────────────────────────────── */}
            <div className={`relative rounded-3xl border-2 p-8 ${
              !earlyOfferActive && billingToggle === 'yearly'
                ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-100/50'
                : earlyOfferActive
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              {!earlyOfferActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5" />
                    Best Value
                  </span>
                </div>
              )}

              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Yearly</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-5xl font-black ${(!earlyOfferActive && billingToggle === 'yearly') ? 'text-gray-900' : 'text-gray-400'}`}>
                  $257.65
                </span>
                <span className="text-gray-400 text-sm">/year</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">~$21.47/month — billed annually.</p>
              <p className="text-emerald-600 text-xs font-semibold mb-6">Save $102/year vs monthly</p>

              <Link href="/auth/signup" onClick={() => trackCta('yearly')} className="block mb-6">
                <Button
                  className="w-full py-3"
                  variant={!earlyOfferActive && billingToggle === 'yearly' ? 'primary' : 'secondary'}
                  disabled={earlyOfferActive}
                >
                  {earlyOfferActive ? 'Available after early access' : 'Get Started — Best Value'}
                </Button>
              </Link>

              <ul className="space-y-3">
                {allPerks.map((p) => (
                  <li key={p.name} className="flex items-center gap-2.5 text-sm">
                    {p.yearly ? (
                      <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={p.yearly ? 'text-gray-700' : 'text-gray-400'}>{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Guarantee */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-8 py-5">
              <Lock className="w-8 h-8 text-emerald-500" />
              <div className="text-left">
                <p className="font-bold text-gray-900">30-Day Money-Back Guarantee</p>
                <p className="text-sm text-gray-600">Not happy? Get a full refund within 30 days. No questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-indigo-600 text-sm font-bold uppercase tracking-wider mb-4">FAQ</span>
            <h2 className="text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'What does "lifetime access" mean?',
                a: 'It means you pay $11.97 once during the early adopter window and you get access forever — no monthly or yearly fees, ever. You also get every future feature we build.',
              },
              {
                q: 'What happens after the early adopter window closes?',
                a: 'The lifetime deal goes away permanently. New users will need to choose either the monthly ($29.97/mo) or yearly ($257.65/yr) plan.',
              },
              {
                q: 'Can I cancel my monthly subscription?',
                a: 'Absolutely. Cancel anytime from your dashboard. Your access continues until the end of the billing period.',
              },
              {
                q: 'What\'s included in all plans?',
                a: 'Every plan includes unlimited ebook creation, AI formatting (Unveil), Teleprompter, all 3 templates, and PDF export. Yearly and lifetime plans also include custom branding, publishing integrations, and priority support.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Not currently, but we offer a 30-day money-back guarantee on all plans. Try it risk-free.',
              },
              {
                q: 'Can I upgrade from monthly to yearly?',
                a: 'Yes! You can upgrade anytime from your account settings. We\'ll prorate the difference.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 mb-2">{q}</p>
                    <p className="text-gray-600 leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Proof ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: '2,100+', label: 'Happy Creators' },
              { icon: Star, value: '4.9/5', label: 'User Rating' },
              { icon: TrendingUp, value: '6,400+', label: 'Ebooks Created' },
              { icon: Gift, value: '100%', label: 'Satisfaction' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-3xl font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Start Publishing Today.
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            {earlyOfferActive
              ? 'Lock in lifetime access before the price goes up.'
              : 'Choose your plan and create your first ebook in minutes.'}
          </p>
          <Link href="/auth/signup" onClick={() => trackCta('final_cta')}>
            <Button
              size="lg"
              className="text-xl px-12 py-7 bg-white text-indigo-700 hover:bg-indigo-50 shadow-2xl shadow-black/20 gap-3"
            >
              {earlyOfferActive ? 'Claim Lifetime Access — $11.97' : 'Get Started Now'}
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/80 text-sm">
            <span className="inline-flex items-center gap-2"><Lock className="w-4 h-4" /> Secure checkout</span>
            <span className="inline-flex items-center gap-2"><Zap className="w-4 h-4" /> Instant access</span>
            <span className="inline-flex items-center gap-2"><Gift className="w-4 h-4" /> 30-day guarantee</span>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <BookMarked className="w-6 h-6 text-indigo-400" />
              Creatorlab
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Creatorlab — Built for creators who publish.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link>
              <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
