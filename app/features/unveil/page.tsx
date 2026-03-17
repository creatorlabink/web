'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useOfferState } from '@/lib/offer';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { analyticsApi } from '@/lib/api';
import {
  ArrowRight,
  BookMarked,
  Brain,
  CheckCircle2,
  Eye,
  FileText,
  Flame,
  Layers,
  Lock,
  Palette,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react';

export default function UnveilFeaturePage() {
  const { earlyOfferActive } = useOfferState();

  const trackCta = () => {
    analyticsApi.track('cta_click', {
      source: 'feature_unveil',
      metadata: { early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-[#0a0a0a] to-blue-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-indigo-500/20 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="text-indigo-300 text-sm font-semibold">Feature Spotlight</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Unveil
              </h1>
              <p className="text-2xl text-indigo-300 font-semibold mb-4">
                AI-Powered Ebook Creation
              </p>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Drop in your raw text — notes, outlines, transcripts, anything — and watch as Unveil&apos;s AI engine
                instantly transforms it into a beautifully structured, publication-ready ebook. No formatting headaches. No design degree. Just magic.
              </p>
              <Link href="/auth/signup" onClick={trackCta}>
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-xl shadow-indigo-500/25 gap-2">
                  Try Unveil Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-gray-500 text-sm ml-2">unveil-editor.ai</span>
                  </div>

                  {/* Simulated transformation */}
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Input</p>
                    <p className="text-gray-300 text-sm font-mono leading-relaxed">
                      so basically my framework has 3 pillars. first is mindset which is about...
                    </p>
                  </div>
                  <div className="flex justify-center py-2">
                    <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="bg-indigo-950/50 rounded-xl p-4 border border-indigo-500/30">
                    <p className="text-indigo-400 text-xs uppercase tracking-wider mb-2">Output</p>
                    <div className="space-y-2">
                      <p className="text-white text-lg font-bold">Chapter 1: The Three Pillars</p>
                      <p className="text-indigo-200 font-semibold">1.1 Pillar One — Mindset</p>
                      <p className="text-gray-300 text-sm">The foundation of sustainable growth begins with...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Capabilities ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-indigo-600 text-sm font-bold uppercase tracking-wider mb-4">What Unveil Does</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              Your AI Formatting<br />
              <span className="text-indigo-600">Superpower</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unveil doesn&apos;t just reformat text. It understands structure, hierarchy, and flow — then creates a professional layout automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'Smart Chapter Detection', desc: 'AI identifies natural breaks and creates chapters with proper titling and numbering.' },
              { icon: Layers, title: 'Auto Heading Hierarchy', desc: 'Headings, subheadings, and sections are layered perfectly — H1 to H4 and beyond.' },
              { icon: FileText, title: 'Bullet & Quote Formatting', desc: 'Lists, key takeaways, and pull quotes are detected and styled beautifully.' },
              { icon: Palette, title: 'Template Application', desc: 'Choose from Minimal, Business, or Workbook templates. Colors, fonts, and layout adapt instantly.' },
              { icon: Wand2, title: 'AI Callout Boxes', desc: 'Key insights, tips, and warnings are highlighted in styled callout boxes automatically.' },
              { icon: Sparkles, title: 'One-Click Polish', desc: 'The entire ebook is production-ready in one click. No manual formatting ever needed.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
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

      {/* ─── Before / After ────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              See the Transformation
            </h2>
            <p className="text-xl text-gray-600">Raw text in. Polished ebook out. In seconds.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Before</span>
              </div>
              <div className="font-mono text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>ok so my coaching program has basically 5 modules</p>
                <p>module 1 is finding your niche... this is where you figure out what you want to focus on</p>
                <p>module 2 - building the offer - you need a compelling offer that solves problems</p>
                <p>- pricing strategy</p>
                <p>- packaging</p>
                <p>- positioning</p>
                <p>then module 3 which is all about marketing...</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase">After</span>
              </div>
              <div className="text-sm space-y-3">
                <h4 className="text-xl font-black text-gray-900 border-b border-gray-200 pb-2">The 5-Module Coaching Blueprint</h4>
                <div>
                  <p className="text-indigo-600 font-bold">Module 1 — Finding Your Niche</p>
                  <p className="text-gray-600">Discover your area of focus and define the audience you&apos;re uniquely positioned to serve.</p>
                </div>
                <div>
                  <p className="text-indigo-600 font-bold">Module 2 — Building Your Offer</p>
                  <p className="text-gray-600 mb-2">Create a compelling offer designed to solve real problems:</p>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Pricing strategy</li>
                    <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Packaging</li>
                    <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Positioning</li>
                  </ul>
                </div>
                <div>
                  <p className="text-indigo-600 font-bold">Module 3 — Marketing Mastery</p>
                  <p className="text-gray-600">Strategies to reach and convert your ideal clients...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 relative overflow-hidden">
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
            Your Content Deserves<br />to Look Professional
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Let Unveil handle the formatting. You focus on the ideas.
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
