'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { isAdminEmail } from '@/lib/adminAccess';
import { cn } from '@/lib/utils';
import {
  Crown,
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  BookMarked,
  MonitorPlay,
  Sparkles,
  Plug,
  Shield,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/ebooks', label: 'My Ebooks', icon: BookOpen },
  { href: '/dashboard/teleprompter', label: 'Teleprompter', icon: MonitorPlay },
  { href: '/dashboard/unveil', label: 'Unveil', icon: Sparkles },
  { href: '/dashboard/apps', label: 'Connected Apps', icon: Plug },
  { href: '/dashboard/account', label: 'Account', icon: User },
];

const adminNavItem = { href: '/dashboard/admin/emails', label: 'Admin Emails', icon: Shield };

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isLifetime = user?.plan === 'lifetime';
  const isAdmin = isAdminEmail(user?.email);
  const visibleNavItems = isAdmin ? [...navItems, adminNavItem] : navItems;

  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 flex flex-col bg-[#0a0a0a] border-r border-white/10">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-lg tracking-tight">
          <BookMarked className="w-5 h-5 text-indigo-400" />
          Creatorlab
        </Link>
        <p className="text-xs text-gray-500 mt-2">Creator publishing workspace</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {visibleNavItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-white/10 space-y-3">
        <div className="px-3">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border',
              isLifetime
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            )}
          >
            <Crown className="w-3 h-3" />
            {isLifetime ? 'Lifetime plan' : 'Free plan'}
          </span>
        </div>
        {user && (
          <div className="px-3">
            <p className="text-xs font-semibold text-white truncate">
              {user.name || user.email}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
