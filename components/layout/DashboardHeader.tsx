'use client';

import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { useAuth } from '@/lib/authContext';
import { Crown, Tag } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user } = useAuth();
  const isLifetime = user?.plan === 'lifetime';

  return (
    <header className="border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur px-6 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-white truncate">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>}
      </div>

      <div className="hidden sm:flex items-center gap-3">
        {isLifetime ? (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <Crown className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-emerald-400 leading-none">Lifetime plan active</p>
              <p className="text-[11px] text-emerald-500/70 mt-1">All export and premium features unlocked</p>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
            <Tag className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-indigo-400 leading-none mb-1">
                $11.97 lifetime offer ends in
              </p>
              <CountdownTimer variant="mini" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
