'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useOfferState } from '@/lib/offer';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { analyticsApi } from '@/lib/api';
import {
  ArrowRight,
  BookMarked,
  Flame,
  Globe,
  Heart,
  Lock,
  Rocket,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

export default function AboutPage() {
  const { earlyOfferActive } = useOfferState();

  const trackCta = () => {
    analyticsApi.track('cta_click', {
      source: 'about',
      metadata: { early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0a0a0a] to-purple-950/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-radial from-purple-600/15 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4">
            About CreatorLab
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            We Believe Every Creator<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Deserves to Publish
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            CreatorLab was born from a simple frustration: why does turning great ideas into great-looking ebooks have to be so damn hard?
          </p>
        </div>
      </section>

      {/* ─── Story ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-indigo-600 text-sm font-bold uppercase tracking-wider mb-4">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                Built by Creators,<br />for Creators
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  We&apos;ve been there. Late nights wrestling with formatting. Spending hundreds on designers.
                  Watching great content sit unpublished because the &ldquo;design part&rdquo; felt impossible.
                </p>
                <p>
                  CreatorLab exists to remove that barrier. We combined AI-powered formatting with beautiful templates
                  so you can go from raw text to published ebook in minutes — not months.
                </p>
                <p>
                  Whether you&apos;re a coach sharing your framework, a course creator packaging your curriculum,
                  or a writer who just wants their words to look as good as they read — CreatorLab is for you.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 border border-indigo-100">
                <div className="space-y-8">
                  {[
                    { icon: Rocket, value: '2024', label: 'Founded', color: 'text-indigo-600' },
                    { icon: Users, value: '2,100+', label: 'Creators Served', color: 'text-purple-600' },
                    { icon: Globe, value: '45+', label: 'Countries', color: 'text-pink-600' },
                    { icon: Heart, value: '4.9/5', label: 'User Rating', color: 'text-emerald-600' },
                  ].map(({ icon: Icon, value, label, color }) => (
                    <div key={label} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-gray-900">{value}</p>
                        <p className="text-sm text-gray-500">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-indigo-600 text-sm font-bold uppercase tracking-wider mb-4">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              Empowering the Next Generation<br />of Digital Publishers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Accessibility',
                desc: 'Professional ebook creation shouldn\'t require a design degree or a $500 budget. We make it accessible to everyone.',
              },
              {
                icon: Sparkles,
                title: 'Intelligence',
                desc: 'AI that understands structure. Our engine detects chapters, formats quotes, and creates hierarchy — so you don\'t have to.',
              },
              {
                icon: Zap,
                title: 'Speed',
                desc: 'From raw text to finished ebook in under 5 minutes. Because your ideas deserve to be published today, not next month.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {earlyOfferActive && (
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 mb-8">
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-white text-sm font-semibold">
                Early adopter pricing ends in <CountdownTimer variant="mini" />
              </span>
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Join 2,100+ Creators<br />Who Already Publish with Us
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Your next ebook is 5 minutes away.
          </p>
          <Link href="/auth/signup" onClick={trackCta}>
            <Button
              size="lg"
              className="text-xl px-12 py-7 bg-white text-indigo-700 hover:bg-indigo-50 shadow-2xl shadow-black/20 gap-3"
            >
              {earlyOfferActive ? 'Claim Lifetime Access — $11.97' : 'Start Creating — $257.65/year'}
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/80 text-sm">
            <span className="inline-flex items-center gap-2"><Lock className="w-4 h-4" /> Secure checkout</span>
            <span className="inline-flex items-center gap-2"><Zap className="w-4 h-4" /> Instant access</span>
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
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
