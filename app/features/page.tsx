'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useOfferState } from '@/lib/offer';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { analyticsApi } from '@/lib/api';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Eye,
  Flame,
  Lock,
  Mic,
  Sparkles,
  Zap,
} from 'lucide-react';

const features = [
  {
    slug: 'unveil',
    icon: Eye,
    title: 'Unveil',
    tagline: 'AI-Powered Ebook Creation',
    description:
      'Transform raw text into a polished, publication-ready ebook in minutes. Unveil uses advanced AI to detect structure, format chapters, style headings, and produce stunning layouts — no design skills required.',
    highlights: [
      'AI auto-detects chapters, headings, and quotes',
      '3 designer-quality templates',
      'One-click PDF export',
      'Unlimited ebooks',
    ],
    gradient: 'from-indigo-500 to-blue-600',
    bgGlow: 'from-indigo-600/20',
    accentBg: 'bg-indigo-100',
    accentText: 'text-indigo-600',
  },
  {
    slug: 'teleprompter',
    icon: Mic,
    title: 'Teleprompter',
    tagline: 'Speak Your Ideas, We Format Them',
    description:
      'Record or paste your spoken content and let Teleprompter turn rambling ideas into structured, publishable ebooks. Perfect for coaches, speakers, and creators who think out loud.',
    highlights: [
      'Voice-to-ebook pipeline',
      'AI cleans up spoken language',
      'Auto-structures chapters from transcripts',
      'Works with any recording or transcript',
    ],
    gradient: 'from-purple-500 to-pink-600',
    bgGlow: 'from-purple-600/20',
    accentBg: 'bg-purple-100',
    accentText: 'text-purple-600',
  },
  {
    slug: 'ebook-creator',
    icon: BookOpen,
    title: 'Ebook Creator',
    tagline: 'Templates, Styling & Export Engine',
    description:
      'The powerhouse behind every CreatorLab ebook. Choose templates, customize styling, preview in real-time, and export pixel-perfect PDFs. Your content, your brand, your ebook — ready to sell.',
    highlights: [
      'Real-time ebook preview',
      'Custom branding & colors',
      'Multiple export formats',
      'Publish to cele.bio & Gumroad',
    ],
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'from-emerald-600/20',
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
  },
];

export default function FeaturesPage() {
  const { earlyOfferActive } = useOfferState();

  const trackCta = () => {
    analyticsApi.track('cta_click', {
      source: 'features',
      metadata: { early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0a0a0a] to-purple-950/30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-indigo-600/15 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-gradient-radial from-purple-600/15 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4">
            Features
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Three Powerful Tools.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              One Unstoppable Platform.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to go from raw ideas to beautifully published ebooks — powered by AI, designed for speed.
          </p>
        </div>
      </section>

      {/* ─── Feature Cards ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-16">
            {features.map((feature, idx) => (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                className="group block"
              >
                <div className={`flex flex-col md:flex-row gap-10 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <div className={`relative rounded-3xl p-10 bg-gradient-to-br ${feature.bgGlow} to-gray-50 border border-gray-100 group-hover:border-indigo-200 group-hover:shadow-lg transition-all duration-300`}>
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-10 h-10 text-white" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 block">{feature.tagline}</span>
                      <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full">
                    <ul className="space-y-4 mb-8">
                      {feature.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${feature.accentText}`} />
                          <span className="text-gray-700 text-lg">{h}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                      Learn more about {feature.title}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </Link>
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
            All Three Tools.<br />One Simple Price.
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Get Unveil, Teleprompter, and Ebook Creator — everything you need to publish like a pro.
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
              <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
