'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/authContext';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { User, Mail, ShieldCheck, CreditCard, Tag } from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <DashboardHeader title="Account" subtitle="Manage your profile and plan." />

      <div className="flex-1 px-6 py-8 space-y-6">

        {/* ── Profile ──────────────────────────────────────────────────── */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || <span className="text-gray-400 italic">Not set</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Phase 3: profile edit form */}
          <p className="text-xs text-gray-400 mt-4">
            Profile editing available in Phase 3.
          </p>
        </Card>

        {/* ── Plan & Billing ────────────────────────────────────────────── */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Plan & Billing
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Current Plan</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {user?.plan || 'Free'}
              </p>
            </div>
          </div>

          {user?.plan !== 'lifetime' ? (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-2">
                <Tag className="w-4 h-4" />
                Early Adopter Offer — $11.97 Lifetime
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Upgrade now to lock in lifetime access. Offer expires in:
              </p>
              <CountdownTimer variant="mini" />
              {/* Phase 3: Stripe checkout */}
              <Button className="mt-4 w-full sm:w-auto" size="sm" disabled>
                Upgrade to Lifetime – $11.97 (Phase 3)
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              You have lifetime access. Enjoy all features forever!
            </div>
          )}
        </Card>

        {/* ── Security ──────────────────────────────────────────────────── */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Security
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Password</p>
              <p className="text-sm text-gray-500">••••••••</p>
            </div>
          </div>
          {/* Phase 3: change password form */}
          <p className="text-xs text-gray-400 mt-4">
            Password change available in Phase 3.
          </p>
        </Card>

        {/* ── Danger zone ───────────────────────────────────────────────── */}
        <Card className="border-red-100 bg-red-50/30">
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Permanently delete your account and all ebooks.
          </p>
          {/* Phase 3: account deletion */}
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" disabled>
            Delete Account (Phase 3)
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
