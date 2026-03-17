'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Send, Inbox, Shield, Users, Sparkles } from 'lucide-react';
import { authApi, adminUsersApi, adminEmailApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { AdminEmailMessage, AdminEmailTemplate, AdminUser, AuthResponse } from '@/types';

const PRESET_VARIABLES: Record<string, unknown> = {
  userName: 'Creator',
  appUrl: 'https://creatorlab.ink/admin',
  actionUrl: 'https://creatorlab.ink/admin',
  ebookTitle: 'Untitled Ebook',
  provider: 'cele.bio',
  amount: '$11.97',
  date: new Date().toLocaleDateString(),
};

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, loading: authLoading, login, logout } = useAuth();

  const [adminReady, setAdminReady] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState('');

  const [templates, setTemplates] = useState<AdminEmailTemplate[]>([]);
  const [messages, setMessages] = useState<AdminEmailMessage[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('account_verification');
  const [variablesJson, setVariablesJson] = useState(JSON.stringify(PRESET_VARIABLES, null, 2));
  const [previewSubject, setPreviewSubject] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [recipient, setRecipient] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customHtml, setCustomHtml] = useState('<p>Hello from CreatorLab ✨</p>');
  const [busy, setBusy] = useState<'preview' | 'sendTemplate' | 'sendCustom' | 'refresh' | null>(null);

  const parsedVariables = useMemo(() => {
    try {
      return JSON.parse(variablesJson) as Record<string, unknown>;
    } catch {
      return null;
    }
  }, [variablesJson]);

  const verifyAdminSession = async (): Promise<boolean> => {
    try {
      const res = await adminUsersApi.listUsers();
      const data = res.data as { users?: AdminUser[] };
      setUsers(data.users ?? []);
      return true;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403 || status === 401) return false;
      throw err;
    }
  };

  const loadAdminEmailData = async () => {
    setBusy('refresh');
    const [templateRes, messagesRes] = await Promise.all([
      adminEmailApi.listTemplates(),
      adminEmailApi.listMessages(undefined, 50),
    ]);
    const nextTemplates = (templateRes.data as { templates: AdminEmailTemplate[] }).templates || [];
    const nextMessages = (messagesRes.data as { messages: AdminEmailMessage[] }).messages || [];
    setTemplates(nextTemplates);
    setMessages(nextMessages);
    if (nextTemplates.length && !nextTemplates.some((t) => t.key === selectedTemplate)) {
      setSelectedTemplate(nextTemplates[0].key);
    }
    setBusy(null);
  };

  const initializeAdminPortal = async () => {
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

      setRecipient((current) => current || user.email || '');
      await loadAdminEmailData();
      setAdminReady(true);
      setError('');
    } catch {
      setError('Could not load admin tools right now.');
      setAdminReady(false);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    initializeAdminPortal();
  }, [authLoading, user?.email]);

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

      setRecipient(nextUser.email || '');
      await loadAdminEmailData();
      setAdminReady(true);
      setEmail('');
      setPassword('');
      setError('');
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

  const loadUsers = async (searchValue?: string) => {
    setLoadingUsers(true);
    setError('');
    try {
      const res = await adminUsersApi.listUsers(searchValue || undefined);
      const data = res.data as { users?: AdminUser[] };
      setUsers(data.users ?? []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Could not load users.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const updatePlan = async (targetUser: AdminUser, plan: 'free' | 'lifetime' | 'annual') => {
    setSavingUserId(targetUser.id);
    setError('');
    setAdminMessage('');
    try {
      await adminUsersApi.updateUserPlan(targetUser.id, plan);
      setUsers((prev) => prev.map((item) => (item.id === targetUser.id ? { ...item, plan } : item)));
      setAdminMessage(`Updated ${targetUser.email} to ${plan}.`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Could not update user plan.');
    } finally {
      setSavingUserId(null);
    }
  };

  const handlePreview = async () => {
    if (!parsedVariables) {
      setError('Variables JSON is invalid.');
      return;
    }
    setBusy('preview');
    setError('');
    try {
      const res = await adminEmailApi.renderTemplate(selectedTemplate, parsedVariables);
      const data = res.data as { subject: string; html: string };
      setPreviewSubject(data.subject || '');
      setPreviewHtml(data.html || '');
    } catch {
      setError('Failed to render template preview.');
    } finally {
      setBusy(null);
    }
  };

  const handleSendTemplate = async () => {
    if (!recipient.trim()) {
      setError('Recipient email is required.');
      return;
    }
    if (!parsedVariables) {
      setError('Variables JSON is invalid.');
      return;
    }

    setBusy('sendTemplate');
    setError('');
    try {
      await adminEmailApi.sendTemplate(recipient.trim(), selectedTemplate, parsedVariables);
      setAdminMessage('Template email sent successfully.');
      await loadAdminEmailData();
    } catch {
      setError('Failed to send template email.');
    } finally {
      setBusy(null);
    }
  };

  const handleSendCustom = async () => {
    if (!recipient.trim() || !customSubject.trim() || !customHtml.trim()) {
      setError('Recipient, custom subject, and custom HTML are required.');
      return;
    }

    setBusy('sendCustom');
    setError('');
    try {
      await adminEmailApi.sendCustom(recipient.trim(), customSubject.trim(), customHtml);
      setAdminMessage('Custom email sent successfully.');
      await loadAdminEmailData();
    } catch {
      setError('Failed to send custom email.');
    } finally {
      setBusy(null);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!adminReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold">Admin Login</h1>
          </div>
          <p className="text-sm text-gray-400 mb-5">Only admin accounts can access this page.</p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
              required
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold"
            >
              {loginLoading ? 'Signing in…' : 'Sign in as Admin'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <Link href="/auth/login" className="text-indigo-400 hover:underline">Go to user login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">CreatorLab Admin Portal</h1>
          <p className="text-sm text-gray-400">Admin-only controls and operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{user?.email}</span>
          <button
            onClick={() => {
              logout();
              router.replace('/admin');
            }}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        {adminMessage && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {adminMessage}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-indigo-300" />
            <h2 className="text-base font-bold">User Plan Management</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            />
            <button
              onClick={() => loadUsers(search.trim())}
              disabled={loadingUsers}
              className="rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-60 px-4 py-2 text-sm font-semibold"
            >
              {loadingUsers ? 'Loading…' : 'Search'}
            </button>
          </div>

          <div className="space-y-2">
            {users.map((targetUser) => (
              <div key={targetUser.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{targetUser.email}</p>
                    <p className="text-xs text-gray-400">{targetUser.name || 'No name'} · current plan: {targetUser.plan}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs"
                      disabled={savingUserId === targetUser.id || targetUser.plan === 'lifetime'}
                      onClick={() => updatePlan(targetUser, 'lifetime')}
                    >
                      Grant Lifetime
                    </button>
                    <button
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs"
                      disabled={savingUserId === targetUser.id || targetUser.plan === 'annual'}
                      onClick={() => updatePlan(targetUser, 'annual')}
                    >
                      Set Annual
                    </button>
                    <button
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300"
                      disabled={savingUserId === targetUser.id || targetUser.plan === 'free'}
                      onClick={() => updatePlan(targetUser, 'free')}
                    >
                      Revoke (Free)
                    </button>
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
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-indigo-300" />
            <h2 className="text-base font-bold">Admin Email Center</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wide text-gray-500">Recipient</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-sm px-3 py-2.5"
                placeholder="name@example.com"
              />

              <label className="text-xs uppercase tracking-wide text-gray-500">Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-sm px-3 py-2.5"
              >
                {templates.map((template) => (
                  <option key={template.key} value={template.key} className="bg-[#0f0f12]">
                    {template.name} ({template.category})
                  </option>
                ))}
              </select>

              <label className="text-xs uppercase tracking-wide text-gray-500">Template variables (JSON)</label>
              <textarea
                value={variablesJson}
                onChange={(e) => setVariablesJson(e.target.value)}
                rows={9}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-xs px-3 py-2.5 font-mono"
              />

              <div className="flex gap-2">
                <button
                  onClick={handlePreview}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-sm font-semibold"
                >
                  {busy === 'preview' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Preview
                </button>
                <button
                  onClick={handleSendTemplate}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-sm font-semibold"
                >
                  {busy === 'sendTemplate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Template
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0d14] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-xs uppercase tracking-wide text-gray-500">Preview Subject</p>
                <p className="text-sm mt-1">{previewSubject || '(Generate preview)'}</p>
              </div>
              <div className="h-80 bg-white">
                {previewHtml ? (
                  <iframe title="email-preview" className="w-full h-full" srcDoc={previewHtml} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">Template preview appears here</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-5">
            <h3 className="text-base font-bold mb-3">Custom Email</h3>
            <div className="space-y-3">
              <input
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-sm px-3 py-2.5"
                placeholder="Custom subject"
              />
              <textarea
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                rows={6}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-sm px-3 py-2.5 font-mono"
              />
              <button
                onClick={handleSendCustom}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-sm font-semibold"
              >
                {busy === 'sendCustom' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Custom Email
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Inbox className="w-4 h-4 text-indigo-300" />
              <h3 className="text-base font-bold">Recent Email Activity</h3>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">No email activity yet.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="rounded-xl border border-white/10 bg-white/2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">{message.subject || '(no subject)'}</p>
                      <span className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-1 ${message.direction === 'inbound' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {message.direction}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{message.sender_email} → {message.recipient_email}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{new Date(message.created_at).toLocaleString()} • {message.status}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
