'use client';

import { FormEvent, useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Loader2, Shield, Users, DollarSign, BarChart3, Activity, Clock, 
  TrendingUp, TrendingDown, Search, Filter, ChevronDown, ChevronRight,
  MoreVertical, Eye, Edit2, Trash2, Key, UserCheck, Mail, Send, 
  Inbox, Sparkles, Book, FileText, Database, Server, AlertCircle,
  CheckCircle, XCircle, ArrowUpRight, RefreshCw, UserMinus, Download,
  Settings, LogOut, X, History
} from 'lucide-react';
import { authApi, adminUsersApi, adminEmailApi, adminDashboardApi, adminRevenueApi, adminAnalyticsApi, adminEbooksApi, adminAuditLogsApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import type {
  AdminUser, AdminEmailMessage, AdminEmailTemplate, AuthResponse,
  AdminDashboardStats, AdminUserDetails, AdminRevenueStats,
  AdminAnalyticsDashboard, AdminEbook, AdminAuditLog, AdminPagination,
  AdminSystemStatus
} from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

const TABS = [
  { key: 'overview', label: 'Overview', icon: Activity },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'revenue', label: 'Revenue', icon: DollarSign },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'ebooks', label: 'Ebooks', icon: Book },
  { key: 'emails', label: 'Emails', icon: Mail },
  { key: 'audit', label: 'Audit Logs', icon: History },
  { key: 'system', label: 'System', icon: Server },
] as const;

type TabKey = typeof TABS[number]['key'];

const PRESET_VARIABLES: Record<string, unknown> = {
  userName: 'Creator',
  appUrl: 'https://creatorlab.ink',
  actionUrl: 'https://creatorlab.ink/dashboard',
  ebookTitle: 'My Ebook',
  provider: 'cele.bio',
  amount: '$11.97',
  date: new Date().toLocaleDateString(),
};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
}

function StatCard({ title, value, subValue, icon: Icon, trend, color = 'indigo' }: StatCardProps) {
  const colorClasses = {
    indigo: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
    rose: 'from-rose-500/10 to-rose-500/5 border-rose-500/20',
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
  };

  const iconColorClasses = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-5 transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-xl bg-white/5 ${iconColorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// USER DETAIL DRAWER (Customer 360)
// ============================================================================

interface UserDrawerProps {
  userId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

function UserDetailDrawer({ userId, onClose, onUpdate }: UserDrawerProps) {
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebooks' | 'payments' | 'events' | 'actions'>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminUsersApi.getUserDetails(userId)
      .then(res => {
        const data = res.data as AdminUserDetails;
        setDetails(data);
        setEditName(data.user.name || '');
      })
      .catch(() => setMessage({ type: 'error', text: 'Failed to load user details' }))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleUpdatePlan = async (plan: 'free' | 'lifetime' | 'annual') => {
    if (!userId) return;
    setActionLoading(`plan-${plan}`);
    try {
      await adminUsersApi.updateUserPlan(userId, plan);
      setMessage({ type: 'success', text: `Plan updated to ${plan}` });
      onUpdate();
      const res = await adminUsersApi.getUserDetails(userId);
      setDetails(res.data as AdminUserDetails);
    } catch {
      setMessage({ type: 'error', text: 'Failed to update plan' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!userId || !newPassword || newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    setActionLoading('password');
    try {
      await adminUsersApi.resetPassword(userId, newPassword);
      setMessage({ type: 'success', text: 'Password reset successfully' });
      setNewPassword('');
    } catch {
      setMessage({ type: 'error', text: 'Failed to reset password' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleImpersonate = async () => {
    if (!userId) return;
    setActionLoading('impersonate');
    try {
      const res = await adminUsersApi.impersonate(userId);
      const { token } = res.data as { token: string };
      window.open(`/dashboard?impersonate_token=${token}`, '_blank');
      setMessage({ type: 'success', text: 'Impersonation session started in new tab' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to impersonate user' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateName = async () => {
    if (!userId) return;
    setActionLoading('name');
    try {
      await adminUsersApi.updateUser(userId, { name: editName });
      setMessage({ type: 'success', text: 'Name updated' });
      setEditingName(false);
      onUpdate();
      const res = await adminUsersApi.getUserDetails(userId);
      setDetails(res.data as AdminUserDetails);
    } catch {
      setMessage({ type: 'error', text: 'Failed to update name' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userId || !confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setActionLoading('delete');
    try {
      await adminUsersApi.deleteUser(userId);
      setMessage({ type: 'success', text: 'User deleted' });
      onUpdate();
      onClose();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    } finally {
      setActionLoading(null);
    }
  };

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Customer 360</h2>
              <p className="text-sm text-gray-400">{details?.user.email || 'Loading...'}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1 mt-4">
            {(['overview', 'ebooks', 'payments', 'events', 'actions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-colors ${
                  activeTab === tab ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`mx-6 mt-4 rounded-lg border px-3 py-2 text-sm ${
            message.type === 'success' 
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/20 bg-rose-500/10 text-rose-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
          ) : details ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Total Spent" value={details.totalSpentFormatted} icon={DollarSign} color="emerald" />
                    <StatCard title="Ebooks Created" value={details.stats.ebookCount} icon={Book} color="indigo" />
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold mb-3">Profile</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email</span>
                        <span>{details.user.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Name</span>
                        {editingName ? (
                          <div className="flex gap-2">
                            <input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="px-2 py-1 rounded bg-white/5 border border-white/10 text-sm w-32"
                            />
                            <button onClick={handleUpdateName} disabled={actionLoading === 'name'} className="text-indigo-400 hover:text-indigo-300">
                              {actionLoading === 'name' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                            </button>
                            <button onClick={() => setEditingName(false)} className="text-gray-400 hover:text-white">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{details.user.name || '-'}</span>
                            <button onClick={() => setEditingName(true)} className="text-gray-500 hover:text-white">
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plan</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          details.user.plan === 'lifetime' ? 'bg-emerald-500/20 text-emerald-300' :
                          details.user.plan === 'annual' ? 'bg-indigo-500/20 text-indigo-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {details.user.plan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Joined</span>
                        <span>{details.user.created_at ? new Date(details.user.created_at).toLocaleDateString() : '-'}</span>
                      </div>
                    </div>
                  </div>

                  {details.socialIdentities.length > 0 && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-sm font-semibold mb-3">Connected Accounts</h3>
                      <div className="space-y-2">
                        {details.socialIdentities.map((identity, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="capitalize text-gray-400">{identity.provider}</span>
                            <span className="text-xs text-gray-500">{identity.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ebooks' && (
                <div className="space-y-3">
                  {details.ebooks.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No ebooks yet</p>
                  ) : (
                    details.ebooks.map(ebook => (
                      <div key={ebook.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{ebook.title}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {ebook.template} · {ebook.status} · {new Date(ebook.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            ebook.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {ebook.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3">
                  {details.payments.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No payments yet</p>
                  ) : (
                    details.payments.map(payment => (
                      <div key={payment.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{payment.amountFormatted}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(payment.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            payment.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {details.events.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No events tracked</p>
                  ) : (
                    details.events.map(event => (
                      <div key={event.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 px-3 py-2 text-sm">
                        <span className="text-indigo-300">{event.event_name}</span>
                        <span className="text-xs text-gray-500">{new Date(event.created_at).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      Plan Management
                    </h3>
                    <div className="flex gap-2">
                      {(['free', 'lifetime', 'annual'] as const).map(plan => (
                        <button
                          key={plan}
                          onClick={() => handleUpdatePlan(plan)}
                          disabled={actionLoading?.startsWith('plan') || details.user.plan === plan}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            details.user.plan === plan 
                              ? 'bg-indigo-500/20 text-indigo-300 cursor-default'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300'
                          }`}
                        >
                          {actionLoading === `plan-${plan}` ? <Loader2 className="w-4 h-4 animate-spin" /> : plan}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      Password Reset
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New password (min 8 chars)"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                      />
                      <button
                        onClick={handleResetPassword}
                        disabled={actionLoading === 'password' || newPassword.length < 8}
                        className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-sm font-medium disabled:opacity-50"
                      >
                        {actionLoading === 'password' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      Impersonation
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">Login as this user in a new browser tab to debug issues.</p>
                    <button
                      onClick={handleImpersonate}
                      disabled={actionLoading === 'impersonate'}
                      className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-sm font-medium"
                    >
                      {actionLoading === 'impersonate' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Impersonation Session'}
                    </button>
                  </div>

                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-rose-400">
                      <Trash2 className="w-4 h-4" />
                      Danger Zone
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">Permanently delete this user and all their data.</p>
                    <button
                      onClick={handleDeleteUser}
                      disabled={actionLoading === 'delete'}
                      className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-sm font-medium"
                    >
                      {actionLoading === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete User'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-10">User not found</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MINI CHART COMPONENT
// ============================================================================

interface MiniBarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
  color?: string;
}

function MiniBarChart({ data, maxValue, color = 'indigo' }: MiniBarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full ${colorClasses[color]} rounded-t opacity-80`}
            style={{ height: `${(item.value / max) * 100}%`, minHeight: item.value > 0 ? '4px' : '0' }}
          />
          <span className="text-[9px] text-gray-500 truncate max-w-full">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN ADMIN PAGE
// ============================================================================

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, loading: authLoading, login, logout } = useAuth();

  // Auth state
  const [adminReady, setAdminReady] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<AdminRevenueStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsDashboard | null>(null);
  const [systemStatus, setSystemStatus] = useState<AdminSystemStatus | null>(null);

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState<string>('');
  const [usersPagination, setUsersPagination] = useState<AdminPagination | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Ebooks state
  const [ebooks, setEbooks] = useState<AdminEbook[]>([]);
  const [ebooksLoading, setEbooksLoading] = useState(false);
  const [ebookSearch, setEbookSearch] = useState('');
  const [ebooksPagination, setEbooksPagination] = useState<AdminPagination | null>(null);

  // Email state
  const [templates, setTemplates] = useState<AdminEmailTemplate[]>([]);
  const [messages, setMessages] = useState<AdminEmailMessage[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('account_verification');
  const [variablesJson, setVariablesJson] = useState(JSON.stringify(PRESET_VARIABLES, null, 2));
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [recipient, setRecipient] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customHtml, setCustomHtml] = useState('<p>Hello from CreatorLab</p>');
  const [emailBusy, setEmailBusy] = useState<string | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [auditLogsPagination, setAuditLogsPagination] = useState<AdminPagination | null>(null);

  // Success/error messages
  const [successMsg, setSuccessMsg] = useState('');

  // ============================================================================
  // DATA LOADING FUNCTIONS
  // ============================================================================

  const loadDashboardStats = useCallback(async () => {
    try {
      const res = await adminDashboardApi.getStats();
      setDashboardStats(res.data as AdminDashboardStats);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  }, []);

  const loadRevenueStats = useCallback(async () => {
    try {
      const res = await adminRevenueApi.getStats();
      setRevenueStats(res.data as AdminRevenueStats);
    } catch (err) {
      console.error('Failed to load revenue stats:', err);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const res = await adminAnalyticsApi.getDashboard();
      setAnalyticsData(res.data as AdminAnalyticsDashboard);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  }, []);

  const loadSystemStatus = useCallback(async () => {
    try {
      const res = await adminDashboardApi.getSystemStatus();
      setSystemStatus(res.data as AdminSystemStatus);
    } catch (err) {
      console.error('Failed to load system status:', err);
    }
  }, []);

  const loadUsers = useCallback(async (page = 1) => {
    setUsersLoading(true);
    try {
      const res = await adminUsersApi.listUsers({
        search: userSearch || undefined,
        plan: userPlanFilter || undefined,
        page,
        limit: 25,
      });
      const data = res.data as { users: AdminUser[]; pagination: AdminPagination };
      setUsers(data.users);
      setUsersPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setUsersLoading(false);
    }
  }, [userSearch, userPlanFilter]);

  const loadEbooks = useCallback(async (page = 1) => {
    setEbooksLoading(true);
    try {
      const res = await adminEbooksApi.list({
        search: ebookSearch || undefined,
        page,
        limit: 25,
      });
      const data = res.data as { ebooks: AdminEbook[]; pagination: AdminPagination };
      setEbooks(data.ebooks);
      setEbooksPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load ebooks:', err);
    } finally {
      setEbooksLoading(false);
    }
  }, [ebookSearch]);

  const loadAuditLogs = useCallback(async (page = 1) => {
    setAuditLogsLoading(true);
    try {
      const res = await adminAuditLogsApi.list({ page, limit: 50 });
      const data = res.data as { logs: AdminAuditLog[]; pagination: AdminPagination };
      setAuditLogs(data.logs);
      setAuditLogsPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setAuditLogsLoading(false);
    }
  }, []);

  const loadEmailData = useCallback(async () => {
    try {
      const [templatesRes, messagesRes] = await Promise.all([
        adminEmailApi.listTemplates(),
        adminEmailApi.listMessages(undefined, 50),
      ]);
      setTemplates((templatesRes.data as { templates: AdminEmailTemplate[] }).templates || []);
      setMessages((messagesRes.data as { messages: AdminEmailMessage[] }).messages || []);
    } catch (err) {
      console.error('Failed to load email data:', err);
    }
  }, []);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  const verifyAdminSession = async (): Promise<boolean> => {
    try {
      await adminDashboardApi.getStats();
      return true;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403 || status === 401) return false;
      throw err;
    }
  };

  const initializeAdmin = async () => {
    if (!user) {
      setAdminReady(false);
      setPageLoading(false);
      return;
    }

    try {
      const ok = await verifyAdminSession();
      if (!ok) {
        logout();
        setAdminReady(false);
        setError('This account is not an admin account.');
        setPageLoading(false);
        return;
      }

      await Promise.all([
        loadDashboardStats(),
        loadUsers(),
        loadEmailData(),
      ]);

      setRecipient(user.email || '');
      setAdminReady(true);
      setError('');
    } catch {
      setError('Could not load admin tools.');
      setAdminReady(false);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    initializeAdmin();
  }, [authLoading, user?.email]);

  useEffect(() => {
    if (!adminReady) return;
    
    if (activeTab === 'revenue' && !revenueStats) {
      loadRevenueStats();
    } else if (activeTab === 'analytics' && !analyticsData) {
      loadAnalytics();
    } else if (activeTab === 'system' && !systemStatus) {
      loadSystemStatus();
    } else if (activeTab === 'audit' && auditLogs.length === 0) {
      loadAuditLogs();
    } else if (activeTab === 'ebooks' && ebooks.length === 0) {
      loadEbooks();
    }
  }, [activeTab, adminReady]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);
    try {
      const res = await authApi.login(email.trim(), password);
      const { token, user: nextUser } = res.data as AuthResponse;
      login(token, nextUser);

      const ok = await verifyAdminSession();
      if (!ok) {
        logout();
        setError('Access denied. Only admin accounts can use this page.');
        return;
      }

      await Promise.all([loadDashboardStats(), loadUsers(), loadEmailData()]);
      setRecipient(nextUser.email || '');
      setAdminReady(true);
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const data = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      if (status === 402) {
        setError('Access denied. Only admin accounts can log in here.');
      } else {
        setError(data?.message || data?.error || 'Admin login failed.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEmailPreview = async () => {
    try {
      const vars = JSON.parse(variablesJson);
      setEmailBusy('preview');
      const res = await adminEmailApi.renderTemplate(selectedTemplate, vars);
      const data = res.data as { subject: string; html: string };
      setPreviewSubject(data.subject);
      setPreviewHtml(data.html);
    } catch {
      setError('Failed to preview template');
    } finally {
      setEmailBusy(null);
    }
  };

  const handleSendTemplate = async () => {
    if (!recipient) return;
    try {
      const vars = JSON.parse(variablesJson);
      setEmailBusy('sendTemplate');
      await adminEmailApi.sendTemplate(recipient, selectedTemplate, vars);
      setSuccessMsg('Template email sent!');
      loadEmailData();
    } catch {
      setError('Failed to send template');
    } finally {
      setEmailBusy(null);
    }
  };

  const handleSendCustom = async () => {
    if (!recipient || !customSubject || !customHtml) return;
    setEmailBusy('sendCustom');
    try {
      await adminEmailApi.sendCustom(recipient, customSubject, customHtml);
      setSuccessMsg('Custom email sent!');
      loadEmailData();
    } catch {
      setError('Failed to send custom email');
    } finally {
      setEmailBusy(null);
    }
  };

  // ============================================================================
  // RENDER: LOGIN SCREEN
  // ============================================================================

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!adminReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Portal</h1>
              <p className="text-sm text-gray-400">CreatorLab.ink</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 px-4 py-3 text-sm font-semibold transition-all disabled:opacity-60"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign in to Admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-indigo-400 hover:text-indigo-300">
              Back to user login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: ADMIN DASHBOARD
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {selectedUserId && (
        <UserDetailDrawer
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUpdate={loadUsers}
        />
      )}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">CreatorLab Admin</h1>
              <p className="text-xs text-gray-400">World-class dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadDashboardStats();
                loadUsers();
                if (revenueStats) loadRevenueStats();
                if (analyticsData) loadAnalytics();
                if (systemStatus) loadSystemStatus();
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">{user?.email}</span>
            <button
              onClick={() => { logout(); router.replace('/admin'); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {(error || successMsg) && (
        <div className="px-6 pt-4">
          {error && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 flex items-center justify-between">
              {error}
              <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {successMsg && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 flex items-center justify-between">
              {successMsg}
              <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-emerald-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <main className="p-6">
        {activeTab === 'overview' && dashboardStats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={dashboardStats.overview.totalUsers}
                subValue={`+${dashboardStats.overview.newUsersToday} today`}
                icon={Users}
                color="indigo"
              />
              <StatCard
                title="Total Revenue"
                value={dashboardStats.revenue.totalRevenueFormatted}
                subValue={`${dashboardStats.revenue.thisMonthFormatted} this month`}
                icon={DollarSign}
                trend={{ value: dashboardStats.revenue.growthPercent, isPositive: dashboardStats.revenue.growthPercent >= 0 }}
                color="emerald"
              />
              <StatCard
                title="Conversion Rate"
                value={`${dashboardStats.conversion.conversionRatePercent}%`}
                subValue={`${dashboardStats.conversion.paidUsers} paid users`}
                icon={TrendingUp}
                color="cyan"
              />
              <StatCard
                title="Active Users (7d)"
                value={dashboardStats.overview.activeUsers7d}
                subValue={`${dashboardStats.overview.ebooksThisWeek} ebooks this week`}
                icon={Activity}
                color="purple"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Plan Distribution
                </h3>
                <div className="space-y-3">
                  {dashboardStats.planBreakdown.map(p => {
                    const total = dashboardStats.conversion.totalUsers || 1;
                    const pct = ((p.count / total) * 100).toFixed(1);
                    return (
                      <div key={p.plan}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{p.plan}</span>
                          <span className="text-gray-400">{p.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.plan === 'lifetime' ? 'bg-emerald-500' :
                              p.plan === 'annual' ? 'bg-indigo-500' : 'bg-gray-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Top Templates
                </h3>
                <div className="space-y-3">
                  {dashboardStats.topTemplates.map((t, idx) => (
                    <div key={t.template} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs text-gray-400">
                        {idx + 1}
                      </span>
                      <span className="flex-1 capitalize">{t.template}</span>
                      <span className="text-sm text-gray-400">{t.usage_count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Recent Payments
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dashboardStats.recentPayments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No payments yet</p>
                  ) : (
                    dashboardStats.recentPayments.slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{p.amountFormatted}</p>
                          <p className="text-xs text-gray-500">{p.userEmail}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search by email or name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm"
                />
              </div>
              <select
                value={userPlanFilter}
                onChange={e => setUserPlanFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm"
              >
                <option value="">All Plans</option>
                <option value="free">Free</option>
                <option value="lifetime">Lifetime</option>
                <option value="annual">Annual</option>
              </select>
              <button
                onClick={() => loadUsers(1)}
                disabled={usersLoading}
                className="px-4 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm font-medium"
              >
                {usersLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-400">User</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-400">Plan</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-400">Ebooks</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-400">Spent</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-400">Joined</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wide text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-white/2">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{u.email}</p>
                            <p className="text-xs text-gray-500">{u.name || '-'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            u.plan === 'lifetime' ? 'bg-emerald-500/20 text-emerald-300' :
                            u.plan === 'annual' ? 'bg-indigo-500/20 text-indigo-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{u.ebook_count ?? 0}</td>
                        <td className="px-4 py-3 text-gray-400">{u.totalSpentFormatted ?? '$0.00'}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedUserId(u.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {usersPagination && usersPagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {users.length} of {usersPagination.totalCount} users
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadUsers(usersPagination.page - 1)}
                    disabled={usersPagination.page <= 1}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm">
                    Page {usersPagination.page} of {usersPagination.totalPages}
                  </span>
                  <button
                    onClick={() => loadUsers(usersPagination.page + 1)}
                    disabled={!usersPagination.hasMore}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {!revenueStats ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Total Revenue" value={revenueStats.totals.totalRevenueFormatted} icon={DollarSign} color="emerald" />
                  <StatCard title="Avg Transaction" value={revenueStats.totals.avgTransactionFormatted} icon={TrendingUp} color="indigo" />
                  <StatCard title="Refunds" value={revenueStats.totals.refundCount} subValue={revenueStats.totals.refundTotalFormatted} icon={ArrowUpRight} color="rose" />
                  <StatCard title="Transactions" value={revenueStats.recentTransactions.length} icon={Activity} color="cyan" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold mb-4">Monthly Revenue (Last 12 Months)</h3>
                  <MiniBarChart data={revenueStats.monthly.map(m => ({ label: m.month, value: m.revenueCents }))} color="emerald" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Top Customers
                    </h3>
                    <div className="space-y-3">
                      {revenueStats.topCustomers.map((c, idx) => (
                        <div key={c.id} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{c.email}</p>
                            <p className="text-xs text-gray-500">{c.transactionCount} transactions</p>
                          </div>
                          <span className="text-sm font-medium text-emerald-400">{c.totalSpentFormatted}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      Recent Transactions
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {revenueStats.recentTransactions.slice(0, 10).map(t => (
                        <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div>
                            <p className="text-sm font-medium">{t.amountFormatted}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{t.userEmail}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {t.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {!analyticsData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard title="Total Events" value={analyticsData.eventCounts.total_events} icon={Activity} color="indigo" />
                  <StatCard title="Events (7 Days)" value={analyticsData.eventCounts.events_7d} icon={Clock} color="cyan" />
                  <StatCard title="Events (30 Days)" value={analyticsData.eventCounts.events_30d} icon={BarChart3} color="purple" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Conversion Funnel
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[
                      { label: 'Page Views', value: analyticsData.funnel.pageViews, color: 'bg-gray-500' },
                      { label: 'CTA Clicks', value: analyticsData.funnel.ctaClicks, color: 'bg-indigo-500' },
                      { label: 'Signups', value: analyticsData.funnel.signups, color: 'bg-cyan-500' },
                      { label: 'Ebook Created', value: analyticsData.funnel.ebookCreated, color: 'bg-purple-500' },
                      { label: 'Downloads', value: analyticsData.funnel.downloads, color: 'bg-amber-500' },
                      { label: 'Payments', value: analyticsData.funnel.payments, color: 'bg-emerald-500' },
                    ].map(step => (
                      <div key={step.label} className="text-center">
                        <div className={`w-12 h-12 rounded-xl ${step.color} mx-auto flex items-center justify-center text-lg font-bold`}>
                          {step.value}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{step.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-lg font-bold text-indigo-400">{analyticsData.funnel.ctaToSignupRate}%</p>
                      <p className="text-xs text-gray-500">CTA to Signup</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-lg font-bold text-cyan-400">{analyticsData.funnel.signupToEbookRate}%</p>
                      <p className="text-xs text-gray-500">Signup to Ebook</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-lg font-bold text-emerald-400">{analyticsData.funnel.signupToPaymentRate}%</p>
                      <p className="text-xs text-gray-500">Signup to Payment</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold mb-4">Top Events</h3>
                    <div className="space-y-2">
                      {analyticsData.topEvents.map(e => (
                        <div key={e.event_name} className="flex items-center justify-between py-1.5">
                          <span className="text-sm">{e.event_name}</span>
                          <span className="text-sm text-gray-400">{e.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold mb-4">Template Usage</h3>
                    <div className="space-y-2">
                      {analyticsData.templateUsage.map(t => (
                        <div key={t.template} className="flex items-center justify-between py-1.5">
                          <span className="text-sm capitalize">{t.template}</span>
                          <span className="text-sm text-gray-400">{t.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold mb-4">AI Usage</h3>
                    <div className="flex gap-4">
                      <div className="flex-1 text-center p-4 rounded-xl bg-indigo-500/10">
                        <p className="text-2xl font-bold text-indigo-400">{analyticsData.aiUsage.ai_used}</p>
                        <p className="text-xs text-gray-400 mt-1">AI Formatted</p>
                      </div>
                      <div className="flex-1 text-center p-4 rounded-xl bg-gray-500/10">
                        <p className="text-2xl font-bold text-gray-400">{analyticsData.aiUsage.manual}</p>
                        <p className="text-xs text-gray-400 mt-1">Manual</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'ebooks' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={ebookSearch}
                  onChange={e => setEbookSearch(e.target.value)}
                  placeholder="Search ebooks by title or user email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm"
                />
              </div>
              <button
                onClick={() => loadEbooks(1)}
                disabled={ebooksLoading}
                className="px-4 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm font-medium"
              >
                {ebooksLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ebooksLoading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                </div>
              ) : ebooks.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-20">No ebooks found</div>
              ) : (
                ebooks.map(ebook => (
                  <div key={ebook.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{ebook.title}</p>
                        <p className="text-xs text-gray-500 truncate">{ebook.user_email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        ebook.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {ebook.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="capitalize">{ebook.template}</span>
                      <span>{new Date(ebook.updated_at).toLocaleDateString()}</span>
                    </div>
                    {ebook.ai_applied && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-indigo-400">
                        <Sparkles className="w-3 h-3" />
                        AI Formatted
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  Send Template Email
                </h3>
                
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Recipient</label>
                  <input
                    type="email"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={e => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm"
                  >
                    {templates.map(t => (
                      <option key={t.key} value={t.key} className="bg-[#0a0a0a]">
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Variables (JSON)</label>
                  <textarea
                    value={variablesJson}
                    onChange={e => setVariablesJson(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleEmailPreview}
                    disabled={emailBusy !== null}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium flex items-center gap-2"
                  >
                    {emailBusy === 'preview' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Preview
                  </button>
                  <button
                    onClick={handleSendTemplate}
                    disabled={emailBusy !== null || !recipient}
                    className="px-4 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm font-medium flex items-center gap-2"
                  >
                    {emailBusy === 'sendTemplate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                </div>

                {previewSubject && (
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-4 py-2 bg-white/5 text-xs">
                      <span className="text-gray-500">Subject:</span> {previewSubject}
                    </div>
                    <iframe srcDoc={previewHtml} className="w-full h-48 bg-white" title="Email Preview" />
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-emerald-400" />
                  Send Custom Email
                </h3>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Subject</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">HTML Body</label>
                  <textarea
                    value={customHtml}
                    onChange={e => setCustomHtml(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-mono"
                  />
                </div>

                <button
                  onClick={handleSendCustom}
                  disabled={emailBusy !== null || !recipient || !customSubject || !customHtml}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-sm font-medium flex items-center gap-2"
                >
                  {emailBusy === 'sendCustom' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Custom Email
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-indigo-400" />
                Recent Email Activity
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">No email activity yet</p>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className="rounded-lg border border-white/5 bg-white/2 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{m.subject || '(no subject)'}</p>
                          <p className="text-xs text-gray-500 truncate">{m.sender_email} to {m.recipient_email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${
                          m.direction === 'outbound' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {m.direction}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{new Date(m.created_at).toLocaleString()} · {m.status}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                Admin Activity Log
              </h3>
              
              {auditLogsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                </div>
              ) : auditLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No audit logs yet</p>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map(log => (
                    <div key={log.id} className="rounded-lg border border-white/5 bg-white/2 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                            {log.action}
                          </span>
                          <p className="text-sm mt-2">{log.actor_email || 'System'}</p>
                          {log.target_table && (
                            <p className="text-xs text-gray-500">{log.target_table} · {log.target_id?.slice(0, 8)}...</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      {log.payload_json && Object.keys(log.payload_json).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">View payload</summary>
                          <pre className="mt-2 text-xs text-gray-500 bg-white/5 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.payload_json, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            {!systemStatus ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-400" />
                      System Health
                    </h3>
                    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      systemStatus.status === 'healthy' 
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {systemStatus.status === 'healthy' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {systemStatus.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Database Latency</p>
                      <p className="text-2xl font-bold mt-1">{systemStatus.database.latencyMs}ms</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Database Size</p>
                      <p className="text-2xl font-bold mt-1">{systemStatus.database.sizeFormatted}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Server Uptime</p>
                      <p className="text-2xl font-bold mt-1">{Math.floor(systemStatus.server.uptime / 3600)}h</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Table Statistics
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {systemStatus.tableStats.map(t => (
                      <div key={t.table_name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                        <span className="text-sm">{t.table_name}</span>
                        <span className="text-sm text-gray-400">{t.row_count.toLocaleString()} rows</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Server Memory
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <p className="text-xs text-gray-500">Heap Used</p>
                      <p className="text-lg font-bold mt-1">{(systemStatus.server.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <p className="text-xs text-gray-500">Heap Total</p>
                      <p className="text-lg font-bold mt-1">{(systemStatus.server.memoryUsage.heapTotal / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <p className="text-xs text-gray-500">External</p>
                      <p className="text-lg font-bold mt-1">{(systemStatus.server.memoryUsage.external / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
