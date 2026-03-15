'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Link2, Loader2, Unlink2, Store, FileText, Mail, BookOpen, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { integrationsApi } from '@/lib/api';
import { IntegrationStatus } from '@/types';

const RECOMMENDED_APPS = [
  { name: 'cele.bio', description: 'Publish CreatorLab ebooks as product drafts in your cele.bio storefront.', icon: Store, status: 'Live' },
  { name: 'Gumroad', description: 'Sell EPUB/PDF directly with instant digital fulfillment.', icon: FileText, status: 'Live' },
  { name: 'ConvertKit', description: 'Add buyers/leads to email automations after ebook checkout.', icon: Mail, status: 'Live' },
  { name: 'Amazon KDP', description: 'Open KDP upload flow with pre-exported EPUB assets.', icon: BookOpen, status: 'Assisted' },
  { name: 'Zapier', description: 'Send publish events to thousands of apps and workflows.', icon: Users, status: 'Live' },
];

export default function ConnectedAppsPage() {
  const [celebioStatus, setCelebioStatus] = useState<IntegrationStatus | null>(null);
  const [gumroadStatus, setGumroadStatus] = useState<IntegrationStatus | null>(null);
  const [convertkitStatus, setConvertkitStatus] = useState<IntegrationStatus | null>(null);
  const [zapierStatus, setZapierStatus] = useState<IntegrationStatus | null>(null);
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [gumroadConnecting, setGumroadConnecting] = useState(false);
  const [gumroadDisconnecting, setGumroadDisconnecting] = useState(false);
  const [convertkitConnecting, setConvertkitConnecting] = useState(false);
  const [convertkitDisconnecting, setConvertkitDisconnecting] = useState(false);
  const [zapierConnecting, setZapierConnecting] = useState(false);
  const [zapierDisconnecting, setZapierDisconnecting] = useState(false);
  const [zapierTesting, setZapierTesting] = useState(false);

  async function loadStatus() {
    try {
      const [celebioRes, gumroadRes, convertkitRes, zapierRes] = await Promise.all([
        integrationsApi.celebioStatus(),
        integrationsApi.gumroadStatus(),
        integrationsApi.convertkitStatus(),
        integrationsApi.zapierStatus(),
      ]);
      setCelebioStatus(celebioRes.data as IntegrationStatus);
      setGumroadStatus(gumroadRes.data as IntegrationStatus);
      setConvertkitStatus(convertkitRes.data as IntegrationStatus);
      setZapierStatus(zapierRes.data as IntegrationStatus);
    } catch {
      setCelebioStatus({ provider: 'celebio', connected: false });
      setGumroadStatus({ provider: 'gumroad', connected: false });
      setConvertkitStatus({ provider: 'convertkit', connected: false });
      setZapierStatus({ provider: 'zapier', connected: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleConnect() {
    setConnecting(true);
    try {
      const res = await integrationsApi.celebioConnectUrl();
      const data = res.data as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setConnecting(false);
      alert('Could not start cele.bio connection.');
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await integrationsApi.celebioDisconnect();
      await loadStatus();
    } catch {
      setDisconnecting(false);
      alert('Could not disconnect cele.bio.');
    }
  }

  async function handleGumroadConnect() {
    setGumroadConnecting(true);
    try {
      const res = await integrationsApi.gumroadConnectUrl();
      const data = res.data as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setGumroadConnecting(false);
      alert('Could not start Gumroad connection.');
    }
  }

  async function handleGumroadDisconnect() {
    setGumroadDisconnecting(true);
    try {
      await integrationsApi.gumroadDisconnect();
      await loadStatus();
    } catch {
      setGumroadDisconnecting(false);
      alert('Could not disconnect Gumroad.');
    }
  }

  async function handleConvertkitConnect() {
    setConvertkitConnecting(true);
    try {
      const res = await integrationsApi.convertkitConnectUrl();
      const data = res.data as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setConvertkitConnecting(false);
      alert('Could not start ConvertKit connection.');
    }
  }

  async function handleConvertkitDisconnect() {
    setConvertkitDisconnecting(true);
    try {
      await integrationsApi.convertkitDisconnect();
      await loadStatus();
    } catch {
      setConvertkitDisconnecting(false);
      alert('Could not disconnect ConvertKit.');
    }
  }

  async function handleZapierConnect() {
    setZapierConnecting(true);
    try {
      await integrationsApi.zapierConnect(zapierWebhookUrl.trim());
      await loadStatus();
    } catch {
      setZapierConnecting(false);
      alert('Could not connect Zapier webhook.');
    }
  }

  async function handleZapierDisconnect() {
    setZapierDisconnecting(true);
    try {
      await integrationsApi.zapierDisconnect();
      await loadStatus();
    } catch {
      setZapierDisconnecting(false);
      alert('Could not disconnect Zapier.');
    }
  }

  async function handleZapierTest() {
    setZapierTesting(true);
    try {
      await integrationsApi.zapierTest();
      alert('Zapier test event sent successfully.');
    } catch {
      alert('Failed to send Zapier test event.');
    } finally {
      setZapierTesting(false);
    }
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Connected Apps"
        subtitle="Connect tools to publish, sell, and automate your ebook workflows."
      />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-white">cele.bio</h2>
              <p className="text-sm text-gray-400 mt-1">
                OAuth connection for one-click draft publishing from CreatorLab.
              </p>
              {loading ? (
                <p className="text-xs text-gray-500 mt-3">Checking connection status...</p>
              ) : (
                <p className="text-xs mt-3 text-gray-300">
                  Status:{' '}
                  <span className={celebioStatus?.connected ? 'text-emerald-300' : 'text-amber-300'}>
                    {celebioStatus?.connected
                      ? `Connected${celebioStatus?.account?.username ? ` as ${celebioStatus.account.username}` : ''}`
                      : 'Not connected'}
                  </span>
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {celebioStatus?.connected ? (
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-gray-200 text-sm font-semibold transition-colors"
                >
                  {disconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink2 className="w-4 h-4" />}
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  Connect cele.bio
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-white">Gumroad</h2>
              <p className="text-sm text-gray-400 mt-1">OAuth connection for direct product creation from CreatorLab ebooks.</p>
              <p className="text-xs mt-3 text-gray-300">
                Status:{' '}
                <span className={gumroadStatus?.connected ? 'text-emerald-300' : 'text-amber-300'}>
                  {gumroadStatus?.connected
                    ? `Connected${gumroadStatus?.account?.username ? ` as ${gumroadStatus.account.username}` : ''}`
                    : 'Not connected'}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              {gumroadStatus?.connected ? (
                <button
                  onClick={handleGumroadDisconnect}
                  disabled={gumroadDisconnecting}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-gray-200 text-sm font-semibold transition-colors"
                >
                  {gumroadDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink2 className="w-4 h-4" />}
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleGumroadConnect}
                  disabled={gumroadConnecting}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {gumroadConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  Connect Gumroad
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-white">ConvertKit</h2>
              <p className="text-sm text-gray-400 mt-1">OAuth connection to sync publish events into your email/automation flows.</p>
              <p className="text-xs mt-3 text-gray-300">
                Status:{' '}
                <span className={convertkitStatus?.connected ? 'text-emerald-300' : 'text-amber-300'}>
                  {convertkitStatus?.connected
                    ? `Connected${convertkitStatus?.account?.username ? ` as ${convertkitStatus.account.username}` : ''}`
                    : 'Not connected'}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              {convertkitStatus?.connected ? (
                <button
                  onClick={handleConvertkitDisconnect}
                  disabled={convertkitDisconnecting}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-gray-200 text-sm font-semibold transition-colors"
                >
                  {convertkitDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink2 className="w-4 h-4" />}
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConvertkitConnect}
                  disabled={convertkitConnecting}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {convertkitConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  Connect ConvertKit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-[260px]">
              <h2 className="text-lg font-bold text-white">Zapier</h2>
              <p className="text-sm text-gray-400 mt-1">Connect a Zapier Catch Hook URL to receive CreatorLab publish events.</p>
              <p className="text-xs mt-3 text-gray-300">
                Status:{' '}
                <span className={zapierStatus?.connected ? 'text-emerald-300' : 'text-amber-300'}>
                  {zapierStatus?.connected ? 'Connected' : 'Not connected'}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 min-w-[300px]">
              {!zapierStatus?.connected && (
                <input
                  value={zapierWebhookUrl}
                  onChange={(e) => setZapierWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 px-3 py-2.5"
                />
              )}
              <div className="flex gap-2">
                {zapierStatus?.connected ? (
                  <>
                    <button
                      onClick={handleZapierTest}
                      disabled={zapierTesting}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                    >
                      {zapierTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Send Test Event
                    </button>
                    <button
                      onClick={handleZapierDisconnect}
                      disabled={zapierDisconnecting}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-gray-200 text-sm font-semibold transition-colors"
                    >
                      {zapierDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink2 className="w-4 h-4" />}
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleZapierConnect}
                    disabled={zapierConnecting || !zapierWebhookUrl.trim()}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                  >
                    {zapierConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                    Connect Zapier
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-base font-bold text-white mb-4">Recommended integrations</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {RECOMMENDED_APPS.map(({ name, description, icon: Icon, status }) => (
              <div key={name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-1 ${status === 'Live' ? 'bg-emerald-500/20 text-emerald-300' : status === 'Assisted' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-gray-300'}`}>
                    {status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            cele.bio, Gumroad, ConvertKit, and Zapier are now wired with live integration actions.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
