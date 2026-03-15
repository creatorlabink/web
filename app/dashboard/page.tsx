'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/authContext';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Crown,
  Download,
  FileText,
  PlusCircle,
  Sparkles,
  Wand2,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const isLifetime = user?.plan === 'lifetime';

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Creator Dashboard"
        subtitle={`Welcome back${user?.name ? `, ${user.name}` : ''}. Ready to publish something valuable today?`}
      />

      <div className="flex-1 px-6 py-8 space-y-8 overflow-y-auto">

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card className="xl:col-span-2 border-indigo-500/30 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Today&apos;s focus</p>
            <h2 className="mt-2 text-2xl font-extrabold">Turn raw words into a sellable ebook.</h2>
            <p className="mt-2 text-indigo-100 text-sm max-w-xl">
              Use AI formatting to organize chapters and points, then export your final PDF.
              Everything from one workspace.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/ebooks">
                <Button size="sm" className="bg-white text-indigo-700 hover:bg-indigo-50 border-0">
                  Create New Ebook
                </Button>
              </Link>
              <Link href="/dashboard/ebooks">
                <Button size="sm" variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Open My Library
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Plan status</p>
            <div className="mt-3 flex items-center gap-2">
              <Crown className={`w-5 h-5 ${isLifetime ? 'text-emerald-400' : 'text-amber-400'}`} />
              <p className="font-bold text-white">{isLifetime ? 'Lifetime Access' : 'Free Plan'}</p>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {isLifetime
                ? 'You can export unlimited PDFs and use all premium workflows.'
                : 'Upgrade once to unlock lifetime PDF exports and premium access.'}
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <PlusCircle className="w-5 h-5 text-indigo-400" />,
                label: 'Start a New Ebook',
                desc: 'Open editor, add title, paste content',
                href: '/dashboard/ebooks',
                disabled: false,
              },
              {
                icon: <Wand2 className="w-5 h-5 text-purple-400" />,
                label: 'Apply AI Formatting',
                desc: 'Structure messy text into chapters',
                href: '/dashboard/ebooks',
                disabled: false,
              },
              {
                icon: <Sparkles className="w-5 h-5 text-amber-400" />,
                label: 'Switch Templates',
                desc: 'Try Minimal, Business, Workbook',
                href: '/dashboard/ebooks',
                disabled: false,
              },
              {
                icon: <Download className="w-5 h-5 text-emerald-400" />,
                label: 'Export Final PDF',
                desc: 'Generate your polished deliverable',
                href: '/dashboard/ebooks',
                disabled: false,
              },
            ].map(({ icon, label, desc, href, disabled }) => (
              <Link href={disabled ? '#' : href} key={label}>
                <Card
                  hover={!disabled}
                  className={`flex items-start gap-4 border-white/10 bg-white/5 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="p-2.5 bg-white/5 rounded-xl shrink-0 border border-white/10">{icon}</div>
                  <div>
                    <p className="font-semibold text-sm text-white">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Publishing Checklist</h2>
            <Link href="/dashboard/ebooks" className="text-xs text-indigo-400 font-medium hover:underline flex items-center gap-1">
              Open Workspace <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Add your ebook title and source text',
              'Enable AI formatting for cleaner structure',
              'Select template style and review preview',
              'Save draft and export polished PDF',
            ].map((item) => (
              <Card key={item} className="flex items-center gap-3 border-white/10 bg-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-sm font-medium text-gray-300">{item}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Why creators convert faster here</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: 'One workspace', desc: 'Write, structure, preview, and export without tool-switching.' },
              { icon: Sparkles, title: 'AI-assisted flow', desc: 'Turn rough text into readable chapter structure fast.' },
              { icon: Download, title: 'Production output', desc: 'Generate client-ready or audience-ready PDF exports.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl px-4 py-4 text-sm border border-white/10 bg-white/5"
              >
                <Icon className="w-4.5 h-4.5 text-indigo-400 mb-2" />
                <p className="font-bold text-white">{title}</p>
                <p className="text-xs mt-1 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {!isLifetime && (
          <section>
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Clock3 className="w-5 h-5 shrink-0 mt-0.5 text-indigo-200" />
                  <div>
                    <p className="font-bold">Early Adopter Offer — $11.97 Lifetime Access</p>
                    <p className="text-indigo-200 text-sm mt-0.5">
                      One payment now protects you from annual pricing later.
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/ebooks" className="shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 border-0"
                  >
                    Upgrade from Ebooks
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
