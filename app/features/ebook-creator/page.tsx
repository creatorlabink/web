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
  Download,
  Eye,
  Flame,
  Globe,
  Lock,
  Palette,
  Rows3,
  Share2,
  Type,
  Zap,
} from 'lucide-react';

export default function EbookCreatorFeaturePage() {
  const { earlyOfferActive } = useOfferState();

  const trackCta = () => {
    analyticsApi.track('cta_click', {
      source: 'feature_ebook_creator',
      metadata: { early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-[#0a0a0a] to-teal-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-emerald-500/20 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-semibold">Feature Spotlight</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Ebook Creator
              </h1>
              <p className="text-2xl text-emerald-300 font-semibold mb-4">
                Templates, Styling & Export Engine
              </p>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                The powerhouse behind every CreatorLab ebook. Choose from designer-quality templates, customize styling to match
                your brand, preview everything in real time, and export pixel-perfect PDFs ready to sell or share.
              </p>
              <Link href="/auth/signup" onClick={trackCta}>
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-500/25 gap-2">
                  Try Ebook Creator Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Visual — plain text to designed page */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-4">
                    <p className="text-emerald-300 text-xs uppercase tracking-wider mb-3">Plain Text Input</p>
                    <div className="space-y-2 text-xs text-gray-300 font-mono leading-relaxed">
                      <p>title: The Creator Consistency Playbook</p>
                      <p>chapter 1 - why consistency matters</p>
                      <p>Most creators quit before they get momentum...</p>
                      <p>- show up daily</p>
                      <p>- measure one metric</p>
                      <p>- improve one thing each week</p>
                      <p>chapter 2 - build a repeatable workflow</p>
                      <p>Create, publish, review, repeat...</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-[#0D1B2A] to-[#132a43] p-4 shadow-2xl shadow-emerald-900/30">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#F5A623] uppercase tracking-wider" style={{ fontSize: '7px' }}>Designed Ebook (Page 1)</p>
                      <span className="text-emerald-300 uppercase tracking-wide" style={{ fontSize: '5px' }}>Styled + Branded</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-[#F5A623]/40 bg-white min-h-[280px] shadow-xl">
                      <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-[#F5A623] via-amber-400 to-emerald-500" />
                      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-[#0D1B2A] via-[#1E3A5F] to-[#0D1B2A]" />

                      <div className="relative pt-12 pb-4 pl-6 pr-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="tracking-[0.12em] text-gray-500 uppercase" style={{ fontSize: '7px' }}>CreatorLab Press</h3>
                          <span className="font-semibold text-[#1E3A5F]" style={{ fontSize: '7px' }}>Pg 01</span>
                        </div>

                        <h4 className="font-black text-[#0D1B2A] leading-tight mb-1" style={{ fontSize: '10px' }}>The Creator Consistency Playbook</h4>
                        <p className="font-bold text-[#1E3A5F] mb-2 uppercase tracking-wide" style={{ fontSize: '7px' }}>Chapter 1 — Why Consistency Matters</p>

                        <div className="grid grid-cols-[1fr_auto] gap-2 items-start mb-2">
                          <p className="text-gray-700 leading-relaxed" style={{ fontSize: '5px' }}>
                            Most creators quit before momentum starts. Consistency compounds results.
                          </p>
                          <div className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-1">
                            <p className="font-semibold text-emerald-700" style={{ fontSize: '6px' }}>+214%</p>
                            <p className="text-emerald-600" style={{ fontSize: '5px' }}>Engagement</p>
                          </div>
                        </div>

                        <div className="rounded-lg bg-[#f8fafc] border border-slate-200 p-2 mb-2">
                          <p className="text-gray-500 uppercase tracking-wider mb-1" style={{ fontSize: '7px' }}>Action Checklist</p>
                          <ul className="space-y-1">
                            <li className="text-gray-700" style={{ fontSize: '5px' }}>✓ Show up daily</li>
                            <li className="text-gray-700" style={{ fontSize: '5px' }}>✓ Measure one metric</li>
                            <li className="text-gray-700" style={{ fontSize: '5px' }}>✓ Improve weekly</li>
                          </ul>
                        </div>

                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-2">
                          <p className="text-amber-700 font-semibold uppercase tracking-wide" style={{ fontSize: '7px' }}>Key Takeaway</p>
                          <p className="text-amber-900 font-medium" style={{ fontSize: '5px' }}>Consistency beats intensity over time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Templates ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-600 text-sm font-bold uppercase tracking-wider mb-4">Templates</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              3 Designer Templates<br />
              <span className="text-emerald-600">Infinite Possibilities</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Minimal', desc: 'Clean navy and gold. Perfect for lead magnets, brand books, and authority-building guides.', colors: ['#0D1B2A','#F5A623','#FFFFFF'], best: 'Lead magnets & guides' },
              { name: 'Business', desc: 'Corporate blue with structured layouts. Ideal for reports, proposals, and professional PDFs.', colors: ['#1E3A5F','#C9A227','#FFFFFF'], best: 'Reports & proposals' },
              { name: 'Workbook', desc: 'Vibrant purple and amber. Built for courses, coaching materials, and interactive exercises.', colors: ['#5B21B6','#F59E0B','#FFFFFF'], best: 'Courses & coaching' },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex gap-2 mb-5">
                  {t.colors.map((c) => (
                    <div key={c} className="w-8 h-8 rounded-full border border-gray-200" style={{ background: c }} />
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.name}</h3>
                <p className="text-gray-600 mb-4">{t.desc}</p>
                <span className="text-sm font-semibold text-emerald-600">Best for: {t.best}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Capabilities ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              Everything You Need to<br />
              <span className="text-emerald-600">Create & Publish</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: 'Real-Time Preview', desc: 'See exactly how your ebook looks as you make changes. What you see is what you get.' },
              { icon: Palette, title: 'Custom Branding', desc: 'Apply your colors, fonts, and style. Your ebook, your brand.' },
              { icon: Rows3, title: 'Chapter Management', desc: 'Reorder, rename, and restructure chapters with drag-and-drop ease.' },
              { icon: Type, title: 'Rich Text Editing', desc: 'Full control over headings, bullets, quotes, bold, italic, and more.' },
              { icon: Download, title: 'PDF Export', desc: 'High-quality, print-ready PDF files. Perfect for digital sales or physical printing.' },
              { icon: Share2, title: 'Publish Anywhere', desc: 'Push to cele.bio, Gumroad, or download and share on your own platform.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Feature list ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Full Feature Set</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Unlimited ebook creation',
              'All 3 premium templates',
              'AI-powered formatting',
              'One-click PDF export',
              'Real-time live preview',
              'Chapter drag-and-drop',
              'Custom branding & colors',
              'Pull-quote and callout boxes',
              'Bullet and numbered list styling',
              'Module & section headers',
              'Publish to cele.bio',
              'Publish to Gumroad',
              'Exercise & reflection prompts',
              'Future features included free',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 relative overflow-hidden">
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
            Your Ebook Deserves<br />a Professional Touch
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Templates. Styling. Export. Everything in one place.
          </p>
          <Link href="/auth/signup" onClick={trackCta}>
            <Button
              size="lg"
              className="text-xl px-12 py-7 bg-white text-emerald-700 hover:bg-emerald-50 shadow-2xl shadow-black/20 gap-3"
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
