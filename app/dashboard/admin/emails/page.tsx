'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { adminEmailApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { isAdminEmail } from '@/lib/adminAccess';
import { AdminEmailMessage, AdminEmailTemplate } from '@/types';
import { Loader2, Mail, Send, Inbox, Sparkles } from 'lucide-react';

const PRESET_VARIABLES: Record<string, unknown> = {
  userName: 'Creator',
  appUrl: 'https://creatorlab.ink/dashboard',
  actionUrl: 'https://creatorlab.ink/dashboard',
  ebookTitle: 'Untitled Ebook',
  provider: 'cele.bio',
  amount: '$11.97',
  date: new Date().toLocaleDateString(),
};

export default function AdminEmailsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accessReady, setAccessReady] = useState(false);
  const [templates, setTemplates] = useState<AdminEmailTemplate[]>([]);
  const [messages, setMessages] = useState<AdminEmailMessage[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('account_verification');
  const [variablesJson, setVariablesJson] = useState(JSON.stringify(PRESET_VARIABLES, null, 2));
  const [previewSubject, setPreviewSubject] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [recipient, setRecipient] = useState(user?.email || '');
  const [customSubject, setCustomSubject] = useState('');
  const [customHtml, setCustomHtml] = useState('<p>Hello from CreatorLab ✨</p>');
  const [busy, setBusy] = useState<'preview' | 'sendTemplate' | 'sendCustom' | 'refresh' | null>(null);
  const [notice, setNotice] = useState('');

  const parsedVariables = useMemo(() => {
    try {
      return JSON.parse(variablesJson) as Record<string, unknown>;
    } catch {
      return null;
    }
  }, [variablesJson]);

  async function loadData() {
    setBusy('refresh');
    try {
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
    } catch {
      setNotice('Failed to load admin email data.');
    } finally {
      setLoading(false);
      setBusy(null);
    }
  }

  useEffect(() => {
    setRecipient((current) => current || user?.email || '');
  }, [user?.email]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/auth/login?next=%2Fdashboard%2Fadmin%2Femails');
      return;
    }

    if (!isAdminEmail(user.email)) {
      router.replace('/dashboard');
      return;
    }

    setAccessReady(true);
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!accessReady) return;
    loadData();
  }, [accessReady]);

  async function handlePreview() {
    if (!parsedVariables) {
      setNotice('Variables JSON is invalid.');
      return;
    }

    setBusy('preview');
    setNotice('');
    try {
      const res = await adminEmailApi.renderTemplate(selectedTemplate, parsedVariables);
      const data = res.data as { subject: string; html: string };
      setPreviewSubject(data.subject || '');
      setPreviewHtml(data.html || '');
    } catch {
      setNotice('Failed to render template preview.');
    } finally {
      setBusy(null);
    }
  }

  async function handleSendTemplate() {
    if (!recipient.trim()) {
      setNotice('Recipient email is required.');
      return;
    }
    if (!parsedVariables) {
      setNotice('Variables JSON is invalid.');
      return;
    }

    setBusy('sendTemplate');
    setNotice('');
    try {
      await adminEmailApi.sendTemplate(recipient.trim(), selectedTemplate, parsedVariables);
      setNotice('Template email sent successfully.');
      await loadData();
    } catch {
      setNotice('Failed to send template email.');
    } finally {
      setBusy(null);
    }
  }

  async function handleSendCustom() {
    if (!recipient.trim() || !customSubject.trim() || !customHtml.trim()) {
      setNotice('Recipient, custom subject, and custom HTML are required.');
      return;
    }

    setBusy('sendCustom');
    setNotice('');
    try {
      await adminEmailApi.sendCustom(recipient.trim(), customSubject.trim(), customHtml);
      setNotice('Custom email sent successfully.');
      await loadData();
    } catch {
      setNotice('Failed to send custom email.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Admin Email Center"
        subtitle="Send/receive emails, preview branded templates, and manage communication workflows."
      />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {authLoading || !accessReady || loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-indigo-300" />
                <h2 className="text-base font-bold text-white">Template Composer</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wide text-gray-500">Recipient</label>
                  <input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white px-3 py-2.5"
                    placeholder="name@example.com"
                  />

                  <label className="text-xs uppercase tracking-wide text-gray-500">Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white px-3 py-2.5"
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
                    rows={10}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-xs text-white px-3 py-2.5 font-mono"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handlePreview}
                      disabled={busy !== null}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-gray-200 text-sm font-semibold"
                    >
                      {busy === 'preview' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Preview
                    </button>
                    <button
                      onClick={handleSendTemplate}
                      disabled={busy !== null}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold"
                    >
                      {busy === 'sendTemplate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send Template
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0d0d14] overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Preview Subject</p>
                    <p className="text-sm text-white mt-1">{previewSubject || '(Generate preview)'}</p>
                  </div>
                  <div className="h-105 bg-white">
                    {previewHtml ? (
                      <iframe title="email-preview" className="w-full h-full" srcDoc={previewHtml} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 text-sm">Template preview appears here</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <h2 className="text-base font-bold text-white mb-3">Custom Email</h2>
              <div className="space-y-3">
                <input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white px-3 py-2.5"
                  placeholder="Custom subject"
                />
                <textarea
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  rows={7}
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white px-3 py-2.5 font-mono"
                />
                <button
                  onClick={handleSendCustom}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-semibold"
                >
                  {busy === 'sendCustom' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Custom Email
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Inbox className="w-4 h-4 text-indigo-300" />
                <h2 className="text-base font-bold text-white">Recent Email Activity</h2>
              </div>
              <div className="space-y-2 max-h-95 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-500">No email activity yet.</p>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="rounded-xl border border-white/10 bg-white/2 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white truncate">{message.subject || '(no subject)'}</p>
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

            {notice && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 px-4 py-3 text-sm">{notice}</div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
