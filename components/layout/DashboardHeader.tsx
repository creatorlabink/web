'use client';

import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { useAuth } from '@/lib/authContext';
import { Tag } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user } = useAuth();
  const isLifetime = user?.plan === 'lifetime';

  return (
    <header className="border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Early adopter countdown – hide once user has upgraded */}
      {!isLifetime && (
        <div className="hidden sm:flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2">
          <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-indigo-700 leading-none mb-1">
              $11.97 lifetime offer expires in
            </p>
            <CountdownTimer variant="mini" />
          </div>
        </div>
      )}
    </header>
  );
}
