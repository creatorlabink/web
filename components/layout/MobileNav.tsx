'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, User, MonitorPlay, Sparkles, Plug } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/ebooks', label: 'Ebooks', icon: BookOpen },
  { href: '/dashboard/teleprompter', label: 'Prompt', icon: MonitorPlay },
  { href: '/dashboard/unveil', label: 'Unveil', icon: Sparkles },
  { href: '/dashboard/apps', label: 'Apps', icon: Plug },
  { href: '/dashboard/account', label: 'Account', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0a] border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                active ? 'text-indigo-400' : 'text-gray-500 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
