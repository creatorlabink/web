import { Check, X, Flame } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';
import { useOfferState } from '@/lib/offer';

const perks = [
  'Unlimited ebook creation',
  'AI-assisted formatting',
  'All 3 premium templates',
  'PDF export',
  'Future features included',
];

export function PriceComparison() {
  const { earlyOfferActive } = useOfferState();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {/* ─── Early Adopter ──────────────────────────────────────────────── */}
      <div className={`relative rounded-2xl border-2 p-8 shadow-lg ${earlyOfferActive ? 'border-indigo-500 bg-white' : 'border-gray-200 bg-gray-50'}`}>
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${earlyOfferActive ? 'bg-indigo-600' : 'bg-gray-500'}`}>
            {earlyOfferActive && <Flame className="w-3 h-3" />}
            {earlyOfferActive ? 'Limited Offer' : 'Offer Ended'}
          </span>
        </div>

        <p className={`text-sm font-semibold uppercase tracking-wide mb-2 ${earlyOfferActive ? 'text-indigo-600' : 'text-gray-500'}`}>
          Early Adopter
        </p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-5xl font-extrabold text-gray-900">$11.97</span>
          <span className="text-gray-500 text-sm">once</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          {earlyOfferActive
            ? 'Lifetime access — pay once, keep forever.'
            : 'Early adopter window has ended.'}
        </p>

        <ul className="space-y-2.5 mb-8">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-indigo-500 shrink-0" />
              {p}
            </li>
          ))}
        </ul>

        {earlyOfferActive ? (
          <Link href="/auth/signup" className="block">
            <Button className="w-full" size="lg">
              Claim Lifetime Access
            </Button>
          </Link>
        ) : (
          <Button variant="ghost" className="w-full" size="lg" disabled>
            No longer available
          </Button>
        )}
      </div>

      {/* ─── Regular ────────────────────────────────────────────────────── */}
      <div className={`rounded-2xl border p-8 ${earlyOfferActive ? 'border-gray-200 bg-gray-50' : 'border-indigo-500 bg-white shadow-lg'}`}>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Regular Price
        </p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className={`text-5xl font-extrabold ${earlyOfferActive ? 'text-gray-400' : 'text-gray-900'}`}>$257.65</span>
          <span className={`text-sm ${earlyOfferActive ? 'text-gray-400' : 'text-gray-600'}`}>/year</span>
        </div>
        <p className={`text-sm mb-6 ${earlyOfferActive ? 'text-gray-400' : 'text-gray-500'}`}>
          Billed annually after early adopter window.
        </p>

        <ul className="space-y-2.5 mb-8">
          {perks.map((p) => (
            <li key={p} className={`flex items-center gap-2 text-sm ${earlyOfferActive ? 'text-gray-400' : 'text-gray-700'}`}>
              {earlyOfferActive ? <X className="w-4 h-4 text-gray-300 shrink-0" /> : <Check className="w-4 h-4 text-indigo-500 shrink-0" />}
              {p}
            </li>
          ))}
        </ul>

        <Button variant="ghost" className="w-full" size="lg" disabled={earlyOfferActive}>
          {earlyOfferActive ? 'Not available yet' : 'Now active'}
        </Button>
      </div>
    </div>
  );
}
