'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(45);
  const [textSize, setTextSize] = useState(32);
  const [lineIndex, setLineIndex] = useState(0);

  const scriptLines = useMemo(
    () => [
      '...and that brings me to my next point.',
      'The key to building an audience is consistency.',
      'Show up every single day, even when you don\'t feel like it.',
      'That\'s what separates successful creators from everyone else.',
      'You don\'t need perfect gear. You need clear messaging.',
      'Speak directly to one person, and your content feels personal.',
    ],
    []
  );

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(900, 4500 - speed * 35);
    const timer = window.setInterval(() => {
      setLineIndex(prev => (prev + 1) % scriptLines.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isPlaying, speed, scriptLines.length]);

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
                Script Reader for Video Creators
              </p>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Read your script from your laptop screen while <span className="text-white font-semibold">filming videos or streaming live</span>. 
                Set it super slow to glance occasionally while looking natural, or keep it visible throughout your content. 
                Perfect for YouTubers, streamers, and anyone who needs to stay on message without memorizing.
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
                    <span className="text-gray-500 text-sm ml-2">teleprompter.app</span>
                  </div>

                  {/* Simulated teleprompter scroll */}
                  <div className="bg-gray-900/80 rounded-xl p-6 border border-purple-500/30 min-h-[280px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                        <span className={`text-xs font-semibold uppercase ${isPlaying ? 'text-red-400' : 'text-gray-400'}`}>
                          {isPlaying ? 'Recording' : 'Paused'}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">Read-only demo</span>
                    </div>
                    
                    <div className="flex-1 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90 pointer-events-none" />
                      <div className="space-y-4 text-center transition-all duration-700">
                        <p className="text-gray-500" style={{ fontSize: `${Math.max(16, textSize - 8)}px` }}>
                          {scriptLines[(lineIndex + scriptLines.length - 1) % scriptLines.length]}
                        </p>
                        <p className="text-white font-semibold leading-relaxed" style={{ fontSize: `${textSize}px` }}>
                          {scriptLines[lineIndex]}
                        </p>
                        <p className="text-purple-300" style={{ fontSize: `${Math.max(18, textSize - 4)}px` }}>
                          {scriptLines[(lineIndex + 1) % scriptLines.length]}
                        </p>
                        <p className="text-gray-400" style={{ fontSize: `${Math.max(16, textSize - 8)}px` }}>
                          {scriptLines[(lineIndex + 2) % scriptLines.length]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        <span className="w-14">Speed</span>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={speed}
                          onChange={(e) => setSpeed(Number(e.target.value))}
                          className="flex-1 accent-purple-500"
                        />
                        <span className="w-9 text-right">{speed}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        <span className="w-14">Text Size</span>
                        <input
                          type="range"
                          min={24}
                          max={44}
                          value={textSize}
                          onChange={(e) => setTextSize(Number(e.target.value))}
                          className="flex-1 accent-purple-500"
                        />
                        <span className="w-9 text-right">{textSize}</span>
                      </div>
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(prev => !prev)}
                          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
                          aria-label={isPlaying ? 'Pause teleprompter' : 'Play teleprompter'}
                        >
                          {isPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          )}
                        </button>
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
              Read Your Script.<br />
              <span className="text-purple-600">Stay Natural.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: MessageSquare,
                title: 'Paste Your Script',
                desc: 'Drop in your video script, talking points, or presentation notes. Any text works.',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'Set Your Speed',
                desc: 'Adjust the scroll speed from super slow (occasional glances) to steady (constant reading). Find your rhythm.',
              },
              {
                step: '03',
                icon: PenLine,
                title: 'Record & Present',
                desc: 'Start your video or stream. The text scrolls smoothly so you never lose your place.',
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
              Perfect For Video<br />
              <span className="text-purple-600">Content Creators</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Headphones, title: 'YouTubers', desc: 'Read your video scripts while maintaining eye contact with the camera. No more retakes.' },
              { icon: Mic, title: 'Live Streamers', desc: 'Keep your talking points visible while you stream. Never forget what you wanted to say.' },
              { icon: Type, title: 'Course Creators', desc: 'Record polished course content without memorizing every line. Stay natural, stay focused.' },
              { icon: MessageSquare, title: 'Presenters', desc: 'Deliver webinars and presentations confidently with your notes scrolling at your pace.' },
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Creators Love Teleprompter</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Adjustable scroll speed from super slow to fast',
                'Large, readable text that\'s easy to see',
                'Glance occasionally or read continuously',
                'Pause and resume with simple controls',
                'Works on any laptop or desktop screen',
                'Position it anywhere on your screen',
                'Look natural while staying on script',
                'Eliminate awkward pauses and retakes',
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
            Stop Memorizing.<br />Start Creating.
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Read your scripts naturally and create better content, faster.
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
