'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  // Dashboard uses its own sidebar nav — hide the top Navbar there
  if (pathname.startsWith('/dashboard')) return null;

  return (
    <>
      {/* ─── Top announcement strip (only for non-authed users) ─────────── */}
      {!loading && !user && (
        <div className="bg-indigo-600 text-white text-center text-xs font-medium py-2 px-4">
          🔥 Early Adopter lifetime access — $11.97 for{' '}
          <CountdownTimer variant="banner" />{' '}
          more.{' '}
          <Link href="/auth/signup" className="underline ml-1 font-bold">
            Claim now →
          </Link>
        </div>
      )}

      {/* ─── Main nav ───────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            CreatorLab.ink
          </Link>

          {/* Nav links */}
          {!loading && (
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                    Dashboard
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
