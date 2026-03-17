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
  Flame,
  Headphones,
  Lock,
  MessageSquare,
  Mic,
  PenLine,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react';

export default function TeleprompterFeaturePage() {
  const { earlyOfferActive } = useOfferState();

  const trackCta = () => {
    analyticsApi.track('cta_click', {
      source: 'feature_teleprompter',
      metadata: { early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-[#0a0a0a] to-pink-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
                <Mic className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-semibold">Feature Spotlight</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Teleprompter
              </h1>
              <p className="text-2xl text-purple-300 font-semibold mb-4">
                Speak Your Ideas. We Format Them.
              </p>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Not everyone writes — some people <span className="text-white font-semibold">think out loud</span>. 
                Teleprompter takes your spoken words, recordings, or rough transcripts and transforms them into clean, 
                structured ebook content. Perfect for coaches, speakers, podcasters, and creators who know their stuff but hate typing.
              </p>
              <Link href="/auth/signup" onClick={trackCta}>
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-500/25 gap-2">
                  Try Teleprompter Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-gray-500 text-sm ml-2">teleprompter.ai</span>
                  </div>

                  {/* Simulated voice-to-text */}
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-pulse" />
                      </div>
                      <span className="text-gray-400 text-xs">2:34</span>
                    </div>
                    <p className="text-gray-400 text-sm italic">
                      &ldquo;...and the third thing I always tell my clients is, you have to focus on your morning routine because that sets the tone for everything else...&rdquo;
                    </p>
                  </div>

                  <div className="flex justify-center py-2">
                    <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                  </div>

                  <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-500/30">
                    <p className="text-purple-400 text-xs uppercase tracking-wider mb-2">Formatted Output</p>
                    <div className="space-y-2">
                      <p className="text-white text-lg font-bold">Chapter 3: The Morning Routine Framework</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        The third pillar of peak performance is your morning routine. It sets the tone for every decision, interaction, and outcome throughout the day.
                      </p>
                      <div className="bg-purple-900/30 rounded-lg p-3 border-l-3 border-purple-400">
                        <p className="text-purple-200 text-xs font-semibold mb-1">KEY TAKEAWAY</p>
                        <p className="text-gray-300 text-sm">Your morning routine isn&apos;t just a habit — it&apos;s the foundation of everything else.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How Teleprompter Works ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-purple-600 text-sm font-bold uppercase tracking-wider mb-4">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              From Voice to<br />
              <span className="text-purple-600">Published Ebook</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: MessageSquare,
                title: 'Paste Your Transcript',
                desc: 'Drop in any spoken content — podcast transcripts, coaching call recordings, voice memos, or even raw dictation.',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'AI Cleans & Structures',
                desc: 'Teleprompter removes filler words, fixes grammar, identifies natural sections, and creates a logical flow.',
              },
              {
                step: '03',
                icon: PenLine,
                title: 'Review & Publish',
                desc: 'Fine-tune the AI\'s work, choose a template, and export a polished ebook — all from your spoken ideas.',
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <span className="absolute top-6 right-6 text-5xl font-black text-gray-100">{step}</span>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who It's For ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              Perfect For Creators Who<br />
              <span className="text-purple-600">Think Out Loud</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Headphones, title: 'Podcasters', desc: 'Turn your best episodes into downloadable ebook guides. Repurpose content effortlessly.' },
              { icon: Mic, title: 'Speakers & Coaches', desc: 'Record your workshops or coaching calls and transform them into premium materials.' },
              { icon: Type, title: 'Course Creators', desc: 'Dictate your course modules and let AI create matching ebook companions.' },
              { icon: MessageSquare, title: 'Thought Leaders', desc: 'Capture your ideas through voice and publish polished thought leadership ebooks.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-purple-50 rounded-2xl p-8 border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Teleprompter Does for You</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Removes filler words (um, uh, like, you know...)',
                'Fixes grammar and sentence structure',
                'Creates chapter breaks from natural pauses',
                'Formats lists and key points automatically',
                'Adds professional headings and subheadings',
                'Generates key takeaway callout boxes',
                'Preserves your authentic voice and style',
                'Works with any language or accent',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative overflow-hidden">
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
            Your Voice Has Value.<br />Turn It Into an Ebook.
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Stop letting great ideas stay trapped in recordings. Publish them.
          </p>
          <Link href="/auth/signup" onClick={trackCta}>
            <Button
              size="lg"
              className="text-xl px-12 py-7 bg-white text-purple-700 hover:bg-purple-50 shadow-2xl shadow-black/20 gap-3"
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
