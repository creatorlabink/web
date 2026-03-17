'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';
import { BookOpen, ChevronDown, Flame, Menu, X } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { useOfferState } from '@/lib/offer';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const { earlyOfferActive } = useOfferState();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dashboard uses its own sidebar nav — hide the top Navbar there
  if (pathname.startsWith('/dashboard')) return null;

  return (
    <>
      {/* ─── Top announcement strip (only for non-authed users) ─────────── */}
      {!loading && !user && (
        <div className="bg-indigo-600 text-white text-center text-xs font-medium py-2 px-4">
          {earlyOfferActive ? (
            <>
              <Flame className="w-3.5 h-3.5 inline" /> Early Adopter lifetime access — $11.97 for{' '}
              <CountdownTimer variant="banner" />{' '}
              more.{' '}
              <Link href="/auth/signup" className="underline ml-1 font-bold">
                Claim now →
              </Link>
            </>
          ) : (
            <>
              Early adopter offer ended. Annual plan is now active at $257.65/year.
            </>
          )}
        </div>
      )}

      {/* ─── Main nav ───────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            Creatorlab
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          {!loading && (
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm font-medium hidden md:block">
                    Dashboard
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hidden md:block">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 pb-4">
            <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!loading && !user && (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                >
                  Log in
                </Link>
              )}
              {!loading && user && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
