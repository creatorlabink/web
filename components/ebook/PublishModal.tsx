'use client';

import { ExternalLink, Upload, FileDown, X, BookOpenCheck, Store, Globe, Link2, Unlink2, Send, Loader2 } from 'lucide-react';
import { Ebook } from '@/types';

interface PublishModalProps {
  ebook: Ebook;
  exportingEpub: boolean;
  exportingPdf: boolean;
  isCelebioConnected: boolean;
  celebioAccountLabel?: string | null;
  isConnectingCelebio: boolean;
  isPublishingCelebio: boolean;
  celebioPublishStatus?: string | null;
  celebioEditUrl?: string | null;
  onClose: () => void;
  onExportEpub: () => void;
  onExportPdf: () => void;
  onConnectCelebio: () => void;
  onDisconnectCelebio: () => void;
  onPublishCelebio: () => void;
}

interface Platform {
  name: string;
  blurb: string;
  uploadUrl: string;
  format: 'EPUB' | 'PDF';
}

const PLATFORMS: Platform[] = [
  {
    name: 'Amazon KDP (Kindle)',
    blurb: 'Upload EPUB directly for Kindle ebook publishing.',
    uploadUrl: 'https://kdp.amazon.com/',
    format: 'EPUB',
  },
  {
    name: 'Apple Books',
    blurb: 'Use Apple Books for Authors to publish your EPUB.',
    uploadUrl: 'https://authors.apple.com/',
    format: 'EPUB',
  },
  {
    name: 'Kobo Writing Life',
    blurb: 'Publish your EPUB to Kobo readers worldwide.',
    uploadUrl: 'https://www.kobo.com/writinglife',
    format: 'EPUB',
  },
  {
    name: 'Google Play Books',
    blurb: 'Upload your ebook in the Partner Center.',
    uploadUrl: 'https://play.google.com/books/publish/',
    format: 'EPUB',
  },
  {
    name: 'Draft2Digital',
    blurb: 'Distribute your EPUB to many bookstores from one place.',
    uploadUrl: 'https://www.draft2digital.com/',
    format: 'EPUB',
  },
  {
    name: 'Gumroad / Storefront',
    blurb: 'Sell your ebook directly as a digital product.',
    uploadUrl: 'https://gumroad.com/',
    format: 'PDF',
  },
];

export function PublishModal({
  ebook,
  exportingEpub,
  exportingPdf,
  isCelebioConnected,
  celebioAccountLabel,
  isConnectingCelebio,
  isPublishingCelebio,
  celebioPublishStatus,
  celebioEditUrl,
  onClose,
  onExportEpub,
  onExportPdf,
  onConnectCelebio,
  onDisconnectCelebio,
  onPublishCelebio,
}: PublishModalProps) {
  function openPlatform(platform: Platform) {
    window.open(platform.uploadUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0f1014] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div>
            <h2 className="text-lg font-bold text-white">Publish your ebook</h2>
            <p className="text-sm text-gray-400 mt-0.5">{ebook.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-sm text-gray-300 mb-4">
            Export your files and open your target platform in one click. Most book platforms require upload through their dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onExportEpub}
              disabled={exportingEpub}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              <FileDown className="w-4 h-4" />
              {exportingEpub ? 'Preparing EPUB...' : 'Download EPUB'}
            </button>
            <button
              onClick={onExportPdf}
              disabled={exportingPdf}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              <FileDown className="w-4 h-4" />
              {exportingPdf ? 'Preparing PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Publish directly to cele.bio</p>
              <p className="text-xs text-gray-400 mt-1">
                Connect once with OAuth, then send your ebook as a product draft.
              </p>
              <p className="text-xs mt-2 text-gray-300">
                Status:{' '}
                <span className={isCelebioConnected ? 'text-emerald-300' : 'text-amber-300'}>
                  {isCelebioConnected
                    ? `Connected${celebioAccountLabel ? ` as ${celebioAccountLabel}` : ''}`
                    : 'Not connected'}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isCelebioConnected ? (
                <>
                  <button
                    onClick={onPublishCelebio}
                    disabled={isPublishingCelebio}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                  >
                    {isPublishingCelebio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isPublishingCelebio ? 'Publishing...' : 'Publish to cele.bio'}
                  </button>
                  <button
                    onClick={onDisconnectCelebio}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 text-gray-200 text-sm font-semibold transition-colors"
                  >
                    <Unlink2 className="w-4 h-4" />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={onConnectCelebio}
                  disabled={isConnectingCelebio}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {isConnectingCelebio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  {isConnectingCelebio ? 'Connecting...' : 'Connect cele.bio'}
                </button>
              )}
            </div>
          </div>

          {celebioPublishStatus && (
            <div className="mt-3 text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
              Last publish status: {celebioPublishStatus}
              {celebioEditUrl && (
                <a
                  href={celebioEditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-indigo-300 underline"
                >
                  Open on cele.bio
                </a>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-5 grid sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {PLATFORMS.map((platform) => (
            <div key={platform.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center">
                    {platform.name.includes('Amazon') ? (
                      <BookOpenCheck className="w-4 h-4" />
                    ) : platform.name.includes('Gumroad') ? (
                      <Store className="w-4 h-4" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{platform.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{platform.blurb}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wide bg-white/10 text-gray-300 rounded-full px-2 py-1">
                  {platform.format}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openPlatform(platform)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-semibold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Open Upload Page
                </button>
                <button
                  onClick={() => {
                    if (platform.format === 'EPUB') {
                      onExportEpub();
                    } else {
                      onExportPdf();
                    }
                    openPlatform(platform);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-indigo-500/80 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Export + Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
