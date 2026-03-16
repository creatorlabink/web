'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/authContext';
import { isAdminEmail } from '@/lib/adminAccess';
import { adminUsersApi } from '@/lib/api';
import { AdminUser } from '@/types';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { User, Mail, ShieldCheck, CreditCard, Tag } from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();
  const isAdmin = isAdminEmail(user?.email);

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');

  const loadUsers = async (searchValue?: string) => {
    setLoadingUsers(true);
    setAdminError('');
    try {
      const res = await adminUsersApi.listUsers(searchValue || undefined);
      const data = res.data as { users?: AdminUser[] };
      setUsers(data.users ?? []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setAdminError(msg || 'Could not load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const updatePlan = async (targetUser: AdminUser, plan: 'free' | 'lifetime' | 'annual') => {
    setSavingUserId(targetUser.id);
    setAdminError('');
    setAdminMessage('');
    try {
      await adminUsersApi.updateUserPlan(targetUser.id, plan);
      setUsers((prev) => prev.map((item) => (item.id === targetUser.id ? { ...item, plan } : item)));
      setAdminMessage(`Updated ${targetUser.email} to ${plan}.`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setAdminError(msg || 'Could not update user plan');
    } finally {
      setSavingUserId(null);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  return (
    <DashboardLayout>
      <DashboardHeader title="Account" subtitle="Manage your profile and plan." />

      <div className="flex-1 px-6 py-8 space-y-6">

        {/* ── Profile ──────────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-white/5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-semibold text-white">
                  {user?.name || <span className="text-gray-500 italic">Not set</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-semibold text-white">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Phase 3: profile edit form */}
          <p className="text-xs text-gray-600 mt-4">
            Profile editing available in Phase 3.
          </p>
        </Card>

        {/* ── Plan & Billing ────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-white/5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Plan & Billing
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Plan</p>
              <p className="text-sm font-semibold text-white capitalize">
                {user?.plan || 'Free'}
              </p>
            </div>
          </div>

          {user?.plan !== 'lifetime' ? (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-2">
                <Tag className="w-4 h-4" />
                Early Adopter Offer — $11.97 Lifetime
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Upgrade now to lock in lifetime access. Offer expires in:
              </p>
              <CountdownTimer variant="mini" />
              {/* Phase 3: Stripe checkout */}
              <Button className="mt-4 w-full sm:w-auto" size="sm" disabled>
                Upgrade to Lifetime – $11.97 (Phase 3)
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              You have lifetime access. Enjoy all features forever!
            </div>
          )}
        </Card>

        {/* ── Security ──────────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-white/5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Security
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Password</p>
              <p className="text-sm text-gray-400">••••••••</p>
            </div>
          </div>
          {/* Phase 3: change password form */}
          <p className="text-xs text-gray-600 mt-4">
            Password change available in Phase 3.
          </p>
        </Card>

        {/* ── Danger zone ───────────────────────────────────────────────── */}
        <Card className="border-red-500/20 bg-red-500/5">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Permanently delete your account and all ebooks.
          </p>
          {/* Phase 3: account deletion */}
          <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" disabled>
            Delete Account (Phase 3)
          </Button>
        </Card>

        {isAdmin && (
          <Card className="border-white/10 bg-white/5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Admin · Plan Access
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500"
              />
              <Button
                size="sm"
                onClick={() => loadUsers(search.trim())}
                disabled={loadingUsers}
                className="sm:w-auto"
              >
                {loadingUsers ? 'Loading...' : 'Search'}
              </Button>
            </div>

            {adminError && (
              <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {adminError}
              </div>
            )}

            {adminMessage && (
              <div className="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                {adminMessage}
              </div>
            )}

            <div className="space-y-2">
              {users.map((targetUser) => (
                <div key={targetUser.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{targetUser.email}</p>
                      <p className="text-xs text-gray-400">{targetUser.name || 'No name'} · current plan: {targetUser.plan}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="border border-white/10"
                        disabled={savingUserId === targetUser.id || targetUser.plan === 'lifetime'}
                        onClick={() => updatePlan(targetUser, 'lifetime')}
                      >
                        Grant Lifetime
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="border border-white/10"
                        disabled={savingUserId === targetUser.id || targetUser.plan === 'annual'}
                        onClick={() => updatePlan(targetUser, 'annual')}
                      >
                        Set Annual
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="border border-red-500/30 text-red-300 hover:bg-red-500/10"
                        disabled={savingUserId === targetUser.id || targetUser.plan === 'free'}
                        onClick={() => updatePlan(targetUser, 'free')}
                      >
                        Revoke (Free)
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {!loadingUsers && users.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                  No users found.
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
