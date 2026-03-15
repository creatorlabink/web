'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { PriceComparison } from '@/components/ui/PriceComparison';
import { Card } from '@/components/ui/Card';
import { useOfferState } from '@/lib/offer';
import { analyticsApi } from '@/lib/api';
import {
  ArrowRight,
  BadgeCheck,
  BookMarked,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  FileText,
  Flame,
  Gift,
  Layers,
  Lock,
  Rocket,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const { earlyOfferActive } = useOfferState();

  const trackCta = () => {
    analyticsApi.track('cta_click', {
      source: 'landing',
      metadata: { section: 'hero_or_final', early_offer_active: earlyOfferActive },
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* ════════════════════════════════════════════════════════════════════
          HERO SECTION - Dark, bold, urgent
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0a0a0a] to-purple-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-indigo-600/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-purple-600/15 via-transparent to-transparent blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full">
          {/* Urgency banner */}
          {earlyOfferActive && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 rounded-full px-5 py-2.5 backdrop-blur-sm">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-amber-300 text-sm font-bold uppercase tracking-wider">Limited Time</span>
                </span>
                <span className="w-px h-4 bg-amber-500/30" />
                <span className="text-white text-sm font-semibold">95% OFF ends in <CountdownTimer variant="mini" /></span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Copy */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Stop Writing.<br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Start Publishing.
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Turn your raw ideas into <span className="text-white font-semibold">stunning, sellable ebooks</span> in minutes — 
                not months. AI does the formatting. You take the credit.
              </p>

              {/* Price anchor */}
              <div className="inline-flex flex-col items-start bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  {earlyOfferActive && (
                    <span className="text-gray-500 line-through text-lg">$257.65/year</span>
                  )}
                  <span className="bg-emerald-500 text-black text-xs font-black px-2 py-1 rounded-md uppercase">
                    {earlyOfferActive ? 'Save $245+' : 'Best Value'}
                  </span>
                </div>
                <p className="text-4xl sm:text-5xl font-black text-white">
                  {earlyOfferActive ? '$11.97' : '$257.65'}
                  <span className="text-lg font-medium text-gray-400 ml-2">
                    {earlyOfferActive ? 'once — forever yours' : '/year'}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                <Link href="/auth/signup" onClick={trackCta}>
                  <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 gap-2">
                    {earlyOfferActive ? 'Claim Lifetime Access Now' : 'Start Creating'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#templates">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    See Templates
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-gray-400">
                <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-400" /> Secure checkout</span>
                <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Instant access</span>
                <span className="inline-flex items-center gap-1.5"><Crown className="w-4 h-4 text-purple-400" /> Lifetime updates</span>
              </div>
            </div>

            {/* Right column - Stats + Countdown */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                {earlyOfferActive ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-red-400" />
                        <span className="text-white font-bold">Offer Expires</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full">Limited</span>
                    </div>
                    <CountdownTimer variant="hero" />
                    <p className="text-gray-400 text-sm mt-4 text-center">
                      After this, lifetime access goes away. You&apos;ll pay <span className="text-white font-semibold">$257.65/year</span> — every year.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-300 text-lg mb-2">Early adopter pricing has ended.</p>
                    <p className="text-white font-semibold">Annual access now available.</p>
                  </div>
                )}

                {/* Social proof stats */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                  {[
                    { icon: FileText, value: '6,400+', label: 'Ebooks Created' },
                    { icon: Users, value: '2,100+', label: 'Happy Creators' },
                    { icon: Star, value: '4.9/5', label: 'User Rating' },
                    { icon: TrendingUp, value: '$340K+', label: 'Creator Revenue' },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="text-center">
                      <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                      <p className="text-2xl font-black text-white">{value}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-black text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30 rotate-6 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> No design skills needed
              </div>
              <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-purple-500/30 -rotate-3 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" /> 5-minute setup
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronRight className="w-4 h-4 rotate-90 animate-bounce" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-indigo-600 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-white">
            <span className="text-sm font-semibold opacity-90">TRUSTED BY:</span>
            {['Writers', 'Coaches', 'Course Creators', 'Consultants', 'Thought Leaders'].map((item) => (
              <span key={item} className="text-sm font-medium opacity-80">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PROBLEM / SOLUTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-indigo-600 text-sm font-bold uppercase tracking-wider mb-4">The Old Way vs The Creatorlab Way</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              You&apos;ve Been Doing It<br />
              <span className="text-red-500">The Hard Way</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Most creators spend weeks formatting ebooks. You don&apos;t have to be most creators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Old way */}
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400">Without Creatorlab</p>
                  <p className="text-lg font-bold text-gray-900">The Painful Process</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'Spend hours formatting in Word or Canva',
                  'Hire expensive designers ($500+)',
                  'Struggle with inconsistent layouts',
                  'Waste time on bullet points and spacing',
                  'End up with amateur-looking ebooks',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✕</span>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* New way */}
            <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">With Creatorlab</p>
                  <p className="text-lg font-bold text-gray-900">The Easy Way</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'Paste your content → done in 5 minutes',
                  'Pay once, use forever (lifetime access)',
                  'AI formats chapters, bullets, quotes',
                  'Choose from 3 pro templates',
                  'Export stunning PDFs instantly',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3-step process */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: FileText, title: 'Paste Your Content', desc: 'Drop in your notes, transcript, or outline. Messy is fine.' },
              { step: '02', icon: Sparkles, title: 'AI Formats It', desc: 'Chapters, bullets, quotes detected instantly. Magic.' },
              { step: '03', icon: Rocket, title: 'Download & Sell', desc: 'Export a polished PDF. Start making money.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <span className="absolute top-6 right-6 text-5xl font-black text-gray-100">{step}</span>
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TEMPLATE SHOWCASE WITH IMAGES
      ════════════════════════════════════════════════════════════════════ */}
      <section id="templates" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4">Professional Templates</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              3 Designer-Quality Templates<br />
              <span className="text-indigo-400">Zero Design Skills Required</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Click once to switch. Your ebook looks premium no matter which you choose.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Minimal', 
                tagline: 'Clean Authority', 
                image: '/templates/minimal-preview.png',
                color: 'from-[#0D1B2A] to-[#1a2f4a]',
                accent: 'bg-[#F5A623]',
                features: ['Navy + Gold color scheme', 'Chapter banners', 'Pull-quote boxes', 'Styled prompts'],
                best: 'Lead magnets, brand books, guides'
              },
              { 
                name: 'Business', 
                tagline: 'Executive Clarity', 
                image: '/templates/business-preview.svg',
                color: 'from-[#1E3A5F] to-[#2d5a8a]',
                accent: 'bg-[#C9A227]',
                features: ['Corporate blue palette', 'Section dividers', 'Data callouts', 'Clean hierarchy'],
                best: 'Reports, proposals, frameworks'
              },
              { 
                name: 'Workbook', 
                tagline: 'Interactive Learning', 
                image: '/templates/workbook-preview.svg',
                color: 'from-[#5B21B6] to-[#7c3aed]',
                accent: 'bg-[#F59E0B]',
                features: ['Purple + Amber scheme', 'Module headers', 'Exercise boxes', 'Reflection prompts'],
                best: 'Courses, coaching, exercises'
              },
            ].map((template) => (
              <div key={template.name} className="group relative bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2">
                {/* Template preview image */}
                <div className={`relative h-72 bg-gradient-to-br ${template.color} flex items-center justify-center overflow-hidden`}>
                  <Image
                    src={template.image}
                    alt={`${template.name} template preview`}
                    width={350}
                    height={280}
                    className="object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                  />
                  {/* Floating badge */}
                  <div className={`absolute top-4 right-4 ${template.accent} text-black text-xs font-bold px-3 py-1.5 rounded-full`}>
                    {template.tagline}
                  </div>
                </div>

                {/* Template info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">Best for: {template.best}</p>
                  
                  <ul className="space-y-2">
                    {template.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signup" onClick={trackCta}>
              <Button size="lg" className="text-lg px-10 py-6 gap-2">
                Try All Templates Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-indigo-600 text-sm font-bold uppercase tracking-wider mb-4">Creator Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              Real Creators.<br />
              <span className="text-indigo-600">Real Results.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I turned a messy 10,000-word transcript into a premium ebook in under an hour. My audience thought I hired a design team.",
                name: 'Ava M.',
                role: 'Course Creator',
                revenue: '$4,200 in first month',
                initials: 'AM',
              },
              {
                quote: "Best $11.97 I've ever spent. The AI formatting saves me literal days. I've already published 3 ebooks since joining.",
                name: 'Marcus R.',
                role: 'Business Coach',
                revenue: '6 ebooks published',
                initials: 'MR',
              },
              {
                quote: "I was skeptical about the templates, but they look incredible. My clients now ask who designed my materials.",
                name: 'Jenna K.',
                role: 'Digital Creator',
                revenue: '$8,500 in sales',
                initials: 'JK',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  {testimonial.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PRICING SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider mb-4">
            {earlyOfferActive && <Flame className="w-4 h-4" />}
            {earlyOfferActive ? 'Early Adopter Pricing' : 'Simple Pricing'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            {earlyOfferActive ? (
              <>Lock In Lifetime Access<br /><span className="text-amber-400">Before The Price Goes Up</span></>
            ) : (
              <>One Plan.<br /><span className="text-indigo-400">Everything Included.</span></>
            )}
          </h2>

          {earlyOfferActive && (
            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-full px-6 py-3 mb-8">
              <Clock className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="text-white font-semibold">Offer expires in <CountdownTimer variant="mini" /></span>
            </div>
          )}

          <PriceComparison />

          {earlyOfferActive && (
            <p className="text-gray-400 mt-8 text-sm max-w-lg mx-auto">
              After this countdown, lifetime access disappears forever. You&apos;ll pay <span className="text-white font-semibold">$257.65 every year</span> instead of <span className="text-emerald-400 font-semibold">$11.97 once</span>.
            </p>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Your Ideas Deserve<br />
            Better Than a Google Doc.
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join 2,100+ creators who stopped procrastinating and started publishing.
            Your next ebook could be done this week.
          </p>

          <Link href="/auth/signup" onClick={trackCta}>
            <Button size="lg" className="text-xl px-12 py-7 bg-white text-indigo-700 hover:bg-indigo-50 shadow-2xl shadow-black/20 gap-3">
              {earlyOfferActive ? 'Claim Lifetime Access — $11.97' : 'Start Creating — $257.65/year'}
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/80 text-sm">
            <span className="inline-flex items-center gap-2"><Lock className="w-4 h-4" /> Secure checkout</span>
            <span className="inline-flex items-center gap-2"><Zap className="w-4 h-4" /> Instant access</span>
            <span className="inline-flex items-center gap-2"><Gift className="w-4 h-4" /> All future updates</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <BookMarked className="w-6 h-6 text-indigo-400" />
              Creatorlab
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Creatorlab — Built for creators who publish.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors">Get Started</Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
