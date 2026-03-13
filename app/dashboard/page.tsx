'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/authContext';
import {
  PlusCircle,
  FileText,
  Sparkles,
  Download,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ── Sample placeholder ebooks (replaced by real API data in Phase 3) ──────────
const PLACEHOLDER_EBOOKS = [
  {
    id: '1',
    title: "The Creator's Playbook",
    template: 'minimal',
    status: 'draft',
    updated_at: '2026-03-10',
  },
  {
    id: '2',
    title: 'My First Course Guide',
    template: 'workbook',
    status: 'draft',
    updated_at: '2026-03-08',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back${user?.name ? `, ${user.name}` : ''}! 👋`}
      />

      <div className="flex-1 px-6 py-8 space-y-8 overflow-y-auto">

        {/* ── Quick actions ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <PlusCircle className="w-5 h-5 text-indigo-500" />,
                label: 'New Ebook',
                desc: 'Paste your text and export',
                href: '/dashboard/ebooks',
                phase: 3,
              },
              {
                icon: <Sparkles className="w-5 h-5 text-amber-500" />,
                label: 'AI Formatting',
                desc: 'Auto-detect chapters & bullets',
                href: '#',
                phase: 4,
              },
              {
                icon: <Download className="w-5 h-5 text-emerald-500" />,
                label: 'Export PDF',
                desc: 'Download your ebook as PDF',
                href: '#',
                phase: 3,
              },
            ].map(({ icon, label, desc, href, phase }) => (
              <Link href={phase <= 2 ? href : '#'} key={label}>
                <Card
                  hover={phase <= 2}
                  className={`flex items-start gap-4 ${phase > 2 ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="p-2.5 bg-gray-50 rounded-xl shrink-0">{icon}</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    {phase > 2 && (
                      <span className="inline-block mt-1.5 text-[10px] bg-indigo-50 text-indigo-500 font-semibold px-2 py-0.5 rounded-full">
                        Phase {phase}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Recent ebooks placeholder ────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Recent Ebooks
            </h2>
            <Link href="/dashboard/ebooks" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {PLACEHOLDER_EBOOKS.map((book) => (
              <Card key={book.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Template: <span className="capitalize">{book.template}</span> · Updated{' '}
                      {book.updated_at}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full capitalize">
                    {book.status}
                  </span>
                  {/* Phase 3: Wire to real export */}
                  <Button size="sm" variant="secondary" disabled>
                    Export PDF
                  </Button>
                </div>
              </Card>
            ))}

            {/* Empty state hint */}
            <Card className="text-center py-10 border-dashed border-2 border-gray-200 bg-gray-50 shadow-none">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                Real ebooks will appear here once you create them.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Text input editor coming in Phase 3.
              </p>
            </Card>
          </div>
        </section>

        {/* ── Phase roadmap ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Product Roadmap
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { phase: 'Phase 1', label: 'Env & stack setup', done: true },
              { phase: 'Phase 2', label: 'Layout & landing', done: true },
              { phase: 'Phase 3', label: 'Text input & PDF export', done: false },
              { phase: 'Phase 4', label: 'Templates & AI formatting', done: false },
            ].map(({ phase, label, done }) => (
              <div
                key={phase}
                className={`rounded-xl px-4 py-3 text-sm border ${
                  done
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-gray-100 bg-gray-50 text-gray-400'
                }`}
              >
                <p className="font-bold">{phase}</p>
                <p className="text-xs mt-0.5">{label}</p>
                {done && <p className="text-[11px] mt-1 font-semibold">✓ Complete</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ── Early adopter upgrade callout ─────────────────────────────── */}
        {user?.plan !== 'lifetime' && (
          <section>
            <Card className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-0 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 shrink-0 mt-0.5 text-indigo-200" />
                  <div>
                    <p className="font-bold">Early Adopter Offer — $11.97 Lifetime</p>
                    <p className="text-indigo-200 text-sm mt-0.5">
                      Lock in lifetime access before the countdown expires.
                    </p>
                  </div>
                </div>
                {/* Phase 3: link to Stripe checkout */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 border-0 shrink-0"
                  disabled
                >
                  Upgrade (Phase 3)
                </Button>
              </div>
            </Card>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
