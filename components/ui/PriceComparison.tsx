import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';

const perks = [
  'Unlimited ebook creation',
  'AI-assisted formatting',
  'All 3 premium templates',
  'PDF export',
  'Future features included',
];

export function PriceComparison() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {/* ─── Early Adopter ──────────────────────────────────────────────── */}
      <div className="relative rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            🔥 Limited Offer
          </span>
        </div>

        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">
          Early Adopter
        </p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-5xl font-extrabold text-gray-900">$11.97</span>
          <span className="text-gray-500 text-sm">once</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">Lifetime access — pay once, keep forever.</p>

        <ul className="space-y-2.5 mb-8">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-indigo-500 shrink-0" />
              {p}
            </li>
          ))}
        </ul>

        <Link href="/auth/signup" className="block">
          <Button className="w-full" size="lg">
            Claim Lifetime Access
          </Button>
        </Link>
      </div>

      {/* ─── Regular ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Regular Price
        </p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-5xl font-extrabold text-gray-400">$257.65</span>
          <span className="text-gray-400 text-sm">/year</span>
        </div>
        <p className="text-gray-400 text-sm mb-6">Billed annually after early adopter window.</p>

        <ul className="space-y-2.5 mb-8">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-gray-400">
              <X className="w-4 h-4 text-gray-300 shrink-0" />
              {p}
            </li>
          ))}
        </ul>

        <Button variant="ghost" className="w-full" size="lg" disabled>
          Not available yet
        </Button>
      </div>
    </div>
  );
}
