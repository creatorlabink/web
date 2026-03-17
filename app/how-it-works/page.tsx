'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useOfferState } from '@/lib/offer';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { analyticsApi } from '@/lib/api';
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ClipboardPaste,
  Download,
  Eye,
  Flame,
  Lock,
  Palette,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function HowItWorksPage() {
  const { earlyOfferActive } = useOfferState();

  const trackCta = () => {
    analyticsApi.track('cta_click', {
      source: 'how_it_works',
      metadata: { early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  const steps = [
    {
      number: '01',
      icon: ClipboardPaste,
      title: 'Paste Your Content',
      description:
        'Drop in your notes, blog posts, transcripts, course material, or rough outline. No formatting needed — messy is perfectly fine.',
      details: [
        'Supports any text format',
        'Copy-paste from Google Docs, Notion, or anywhere',
        'Works with outlines, transcripts, full drafts',
        'No file uploads needed — just raw text',
      ],
      color: 'indigo',
      gradient: 'from-indigo-500/20 to-indigo-600/5',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'AI Formats Everything',
      description:
        'Our AI engine instantly detects chapters, headings, bullet points, quotes, and key takeaways — then structures your content into a polished ebook layout.',
      details: [
        'Auto-detects chapter titles and sections',
        'Formats bullets, numbered lists, and quotes',
        'Highlights key takeaways and callouts',
        'Creates professional typography hierarchy',
      ],
      color: 'purple',
      gradient: 'from-purple-500/20 to-purple-600/5',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      number: '03',
      icon: Palette,
      title: 'Choose a Template',
      description:
        'Pick from 3 designer-quality templates — Minimal, Business, or Workbook. Each one gives your content a completely different professional look.',
      details: [
        '3 pro templates included',
        'Instant preview as you switch',
        'Color schemes auto-applied',
        'Designed for maximum readability',
      ],
      color: 'pink',
      gradient: 'from-pink-500/20 to-pink-600/5',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
    {
      number: '04',
      icon: Eye,
      title: 'Preview & Refine',
      description:
        'See exactly how your ebook will look before exporting. Make quick edits, reorder sections, or tweak the AI\'s suggestions until it\'s perfect.',
      details: [
        'Live preview of your ebook',
        'Edit text inline',
        'Reorder chapters instantly',
        'Fine-tune AI suggestions',
      ],
      color: 'amber',
      gradient: 'from-amber-500/20 to-amber-600/5',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      number: '05',
      icon: Download,
      title: 'Export & Publish',
      description:
        'Download your polished ebook as a beautiful PDF. Sell it on Gumroad, share on social media, use it as a lead magnet — it\'s yours.',
      details: [
        'High-quality PDF export',
        'Share or sell anywhere',
        'Perfect for lead magnets & courses',
        'Unlimited exports',
      ],
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0a0a0a] to-purple-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-indigo-600/15 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            From Idea to Ebook<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              In 5 Simple Steps
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            No design skills. No complicated software. Just paste your content, and let CreatorLab do the heavy lifting.
          </p>
          <Link href="/auth/signup" onClick={trackCta}>
            <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Steps ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-20">
            {steps.map((step, idx) => (
              <div key={step.number} className={`flex flex-col md:flex-row gap-10 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Visual side */}
                <div className="flex-1 w-full">
                  <div className={`relative bg-gradient-to-br ${step.gradient} rounded-3xl p-10 border border-gray-100`}>
                    <span className="absolute top-6 right-6 text-8xl font-black text-gray-100/60">
                      {step.number}
                    </span>
                    <div className={`w-20 h-20 rounded-2xl ${step.iconBg} flex items-center justify-center mb-6`}>
                      <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Details side */}
                <div className="flex-1 w-full">
                  <ul className="space-y-4">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-lg">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
            Ready to Create Your<br />First Ebook?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            It takes less than 5 minutes. Seriously.
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
