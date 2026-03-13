'use client';

import { useCountdown } from '@/lib/useCountdown';

interface CountdownTimerProps {
  /** 'banner' = single-line pill, 'hero' = big blocks, 'mini' = 2-line compact */
  variant?: 'banner' | 'hero' | 'mini';
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CountdownTimer({ variant = 'hero' }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, expired } = useCountdown();

  if (expired) {
    return (
      <p className="text-sm text-gray-400 font-medium">
        Early adopter offer has ended.
      </p>
    );
  }

  if (variant === 'banner') {
    return (
      <span className="font-semibold tabular-nums">
        {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    );
  }

  if (variant === 'mini') {
    return (
      <div className="flex items-center gap-1 tabular-nums text-sm font-semibold">
        <span className="bg-indigo-600 text-white rounded px-1.5 py-0.5">{pad(days)}</span>
        <span className="text-gray-400">:</span>
        <span className="bg-indigo-600 text-white rounded px-1.5 py-0.5">{pad(hours)}</span>
        <span className="text-gray-400">:</span>
        <span className="bg-indigo-600 text-white rounded px-1.5 py-0.5">{pad(minutes)}</span>
        <span className="text-gray-400">:</span>
        <span className="bg-indigo-600 text-white rounded px-1.5 py-0.5">{pad(seconds)}</span>
      </div>
    );
  }

  // hero variant – large blocks
  const units = [
    { label: 'Days', value: pad(days) },
    { label: 'Hours', value: pad(hours) },
    { label: 'Minutes', value: pad(minutes) },
    { label: 'Seconds', value: pad(seconds) },
  ];

  return (
    <div className="flex items-center gap-3 justify-center">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="bg-gray-900 text-white text-3xl font-extrabold tabular-nums w-16 h-16 flex items-center justify-center rounded-xl shadow-md">
              {value}
            </div>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-bold text-gray-400 mb-5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
