import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { PriceComparison } from '@/components/ui/PriceComparison';
import { Card } from '@/components/ui/Card';
import {
  BookOpen,
  Sparkles,
  Download,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
        {/* Countdown urgency badge */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-5 py-3 rounded-2xl mb-8">
          <span className="font-semibold">⏳ Early adopter offer ends in:</span>
          <CountdownTimer variant="mini" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-6">
          Turn your ideas into{' '}
          <span className="text-indigo-600 underline decoration-wavy decoration-indigo-300 underline-offset-4">
            beautiful ebooks
          </span>
          <br />in minutes.
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-4 leading-relaxed">
          Paste any text, choose a template, and let our AI handle the formatting.
          Export a professional PDF ebook — no design skills required.
        </p>

        {/* Price callout */}
        <p className="text-lg font-semibold text-indigo-700 mb-10">
          🎉 Lifetime access for just{' '}
          <span className="text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-lg">
            $11.97
          </span>{' '}
          — normally $257.65/year.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2 text-lg px-8 py-4">
              Get Lifetime Access – $11.97
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="secondary">
              Log in to my account
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-5">
          No subscription. No credit card tricks. Pay once, use forever.
        </p>

        {/* Hero countdown blocks */}
        <div className="mt-12">
          <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-medium">
            Offer expires in
          </p>
          <CountdownTimer variant="hero" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SOCIAL PROOF BAR
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-indigo-600 py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 text-white text-sm font-medium">
          {[
            { icon: <Users className="w-4 h-4" />, text: 'Built for writers & coaches' },
            { icon: <Zap className="w-4 h-4" />, text: 'Generate ebooks in 60 seconds' },
            { icon: <Shield className="w-4 h-4" />, text: 'Secure JWT authentication' },
            { icon: <Star className="w-4 h-4" />, text: 'AI-powered formatting' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 opacity-90">
              {icon}
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              From text to ebook in 3 steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No complicated software. Just paste, format, and download.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <BookOpen className="w-7 h-7 text-indigo-500" />,
                title: 'Paste Your Text',
                desc: 'Drop in your manuscript, blog post, course content, or notes. Any plain text works.',
              },
              {
                step: '02',
                icon: <Sparkles className="w-7 h-7 text-indigo-500" />,
                title: 'AI Formats It',
                desc: 'Our AI detects chapters, headings, bullet points, and key takeaways — automatically.',
              },
              {
                step: '03',
                icon: <Download className="w-7 h-7 text-indigo-500" />,
                title: 'Export as PDF',
                desc: 'Choose a template and download a polished PDF ready to sell, share, or send.',
              },
            ].map(({ step, icon, title, desc }) => (
              <Card key={title} hover padding="lg" className="relative overflow-hidden">
                <div className="absolute top-4 right-4 text-5xl font-black text-gray-100 select-none">
                  {step}
                </div>
                <div className="mb-4 relative">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 relative">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed relative">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TEMPLATES PREVIEW (Phase 4 placeholder)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            3 stunning templates included
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            Every template is clean, professional, and export-ready. Full template preview
            coming in the next update.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Minimal',
                desc: 'Clean and distraction-free. Perfect for guides & reports.',
                color: 'bg-gray-900',
                tag: 'Most popular',
              },
              {
                name: 'Workbook',
                desc: 'Includes exercise boxes and reflection prompts for courses.',
                color: 'bg-indigo-600',
                tag: 'Great for coaches',
              },
              {
                name: 'Business',
                desc: 'Bold headings and accent colors for professional documents.',
                color: 'bg-emerald-600',
                tag: 'Phase 4',
              },
            ].map(({ name, desc, color, tag }) => (
              <div key={name} className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                {/* Preview block */}
                <div className={`${color} h-32 flex items-center justify-center`}>
                  <span className="text-white/30 text-6xl font-black">{name[0]}</span>
                </div>
                <div className="p-5 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{name}</span>
                    <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PRICING COMPARISON
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Lock in lifetime access — before it&apos;s gone
          </h2>
          <p className="text-gray-500 mb-4 max-w-xl mx-auto">
            This is a one-time deal for early adopters. Once the countdown hits zero,
            pricing switches to $257.65/year.
          </p>

          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 text-sm text-red-500 font-medium bg-red-50 border border-red-100 px-4 py-2 rounded-full">
              ⚠️ Offer expires in: <CountdownTimer variant="banner" />
            </div>
          </div>

          <PriceComparison />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'What does "lifetime access" mean?',
                a: "Pay once and use CreatorLab.ink forever — including all future updates and new templates — at no extra charge.",
              },
              {
                q: 'What happens after the 18-day countdown?',
                a: "The $11.97 price goes away. New users will pay $257.65/year. You'll be grandfathered in at the lifetime rate if you sign up now.",
              },
              {
                q: 'What file format does the export produce?',
                a: "PDF — universally compatible and ready to sell or share. Additional export formats (EPUB, DOCX) are on the roadmap.",
              },
              {
                q: 'Do I need any writing or design skills?',
                a: "None at all. Paste your raw text and CreatorLab.ink structures and designs it for you automatically.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-100 p-5 cursor-pointer">
                <summary className="font-semibold text-gray-900 list-none flex justify-between items-center">
                  {q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Start creating your first ebook today
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join creators who are turning their words into revenue.
            Lifetime access for $11.97 — limited time only.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50 focus:ring-white gap-2 text-lg px-8 py-4"
            >
              Get Lifetime Access – $11.97
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div className="mt-6 flex justify-center">
            <div className="text-sm text-indigo-200 font-medium">
              Offer expires in: <CountdownTimer variant="banner" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} CreatorLab.ink — All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/auth/signup" className="hover:text-indigo-600 transition-colors">Sign Up</Link>
            <Link href="/auth/login" className="hover:text-indigo-600 transition-colors">Log In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
