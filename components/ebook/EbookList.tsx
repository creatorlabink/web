'use client';

import { useEffect, useState } from 'react';
import { Download, Pencil, Trash2, BookOpen, Plus, Loader2, Sparkles, Clock, FileText, Send } from 'lucide-react';
import { Ebook, IntegrationStatus, CelebioPublishResponse } from '@/types';
import { ebooksApi, pdfApi, epubApi, integrationsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PublishModal } from '@/components/ebook/PublishModal';

interface EbookListProps {
  ebooks: Ebook[];
  userPlan: string;
  onEdit: (ebook: Ebook) => void;
  onDelete: (id: string) => void;
  onNewEbook: () => void;
  onUpgradeNeeded: () => void;
}

const TEMPLATE_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  minimal: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-300',
    icon: 'from-slate-600 to-slate-800',
  },
  workbook: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    icon: 'from-purple-600 to-violet-800',
  },
  business: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    icon: 'from-blue-600 to-indigo-800',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function EbookList({
  ebooks,
  userPlan,
  onEdit,
  onDelete,
  onNewEbook,
  onUpgradeNeeded,
}: EbookListProps) {
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);
  const [downloadingEpubId, setDownloadingEpubId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingEbook, setPublishingEbook] = useState<Ebook | null>(null);
  const [celebioStatus, setCelebioStatus] = useState<IntegrationStatus | null>(null);
  const [connectingCelebio, setConnectingCelebio] = useState(false);
  const [publishingCelebio, setPublishingCelebio] = useState(false);
  const [celebioPublishStatus, setCelebioPublishStatus] = useState<string | null>(null);
  const [celebioEditUrl, setCelebioEditUrl] = useState<string | null>(null);

  const isPaid = userPlan === 'lifetime' || userPlan === 'annual';

  useEffect(() => {
    let active = true;

    async function loadCelebioStatus() {
      try {
        const res = await integrationsApi.celebioStatus();
        if (!active) return;
        setCelebioStatus(res.data as IntegrationStatus);
      } catch {
        if (!active) return;
        setCelebioStatus({ provider: 'celebio', connected: false });
      }
    }

    loadCelebioStatus();
    return () => {
      active = false;
    };
  }, []);

  function saveBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownloadPdf(ebook: Ebook) {
    if (!isPaid) {
      onUpgradeNeeded();
      return;
    }
    setDownloadingPdfId(ebook.id);
    try {
      const blob = await pdfApi.export(ebook.id);
      saveBlob(blob, `${ebook.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      if (axiosErr.response?.data?.error === 'payment_required') {
        onUpgradeNeeded();
      } else {
        alert('Export failed. Please try again.');
      }
    } finally {
      setDownloadingPdfId(null);
    }
  }

  async function handleDownloadEpub(ebook: Ebook) {
    if (!isPaid) {
      onUpgradeNeeded();
      return;
    }
    setDownloadingEpubId(ebook.id);
    try {
      const blob = await epubApi.export(ebook.id);
      saveBlob(blob, `${ebook.title.replace(/[^a-z0-9]/gi, '_')}.epub`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      if (axiosErr.response?.data?.error === 'payment_required') {
        onUpgradeNeeded();
      } else {
        alert('EPUB export failed. Please try again.');
      }
    } finally {
      setDownloadingEpubId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this ebook? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await ebooksApi.delete(id);
      onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleConnectCelebio() {
    setConnectingCelebio(true);
    try {
      const res = await integrationsApi.celebioConnectUrl();
      const data = res.data as { url: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Could not start cele.bio connection.');
    } finally {
      setConnectingCelebio(false);
    }
  }

  async function handleDisconnectCelebio() {
    try {
      await integrationsApi.celebioDisconnect();
      setCelebioStatus({ provider: 'celebio', connected: false });
      setCelebioPublishStatus(null);
      setCelebioEditUrl(null);
    } catch {
      alert('Could not disconnect cele.bio.');
    }
  }

  async function handlePublishCelebio(ebook: Ebook) {
    setPublishingCelebio(true);
    try {
      const res = await integrationsApi.celebioPublish(ebook.id, {
        description: `Created with CreatorLab.ink • Template: ${ebook.template}`,
        isDraft: true,
      });
      const data = res.data as CelebioPublishResponse;
      setCelebioPublishStatus(data.status || 'queued');
      setCelebioEditUrl(data.edit_url || null);
      if (data.edit_url) {
        window.open(data.edit_url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      alert('Publishing to cele.bio failed. Ensure your account is connected.');
    } finally {
      setPublishingCelebio(false);
    }
  }

  if (ebooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mb-5">
          <BookOpen className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No ebooks yet</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          Create your first ebook to start building your digital product library.
        </p>
        <button
          onClick={onNewEbook}
          className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white text-sm font-semibold px-6 py-3 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create Your First Ebook
        </button>
      </div>
    );
  }

  return (
    <>
      {publishingEbook && (
        <PublishModal
          ebook={publishingEbook}
          exportingEpub={downloadingEpubId === publishingEbook.id}
          exportingPdf={downloadingPdfId === publishingEbook.id}
          isCelebioConnected={Boolean(celebioStatus?.connected)}
          celebioAccountLabel={celebioStatus?.account?.username || null}
          isConnectingCelebio={connectingCelebio}
          isPublishingCelebio={publishingCelebio}
          celebioPublishStatus={celebioPublishStatus}
          celebioEditUrl={celebioEditUrl}
          onClose={() => setPublishingEbook(null)}
          onExportEpub={() => handleDownloadEpub(publishingEbook)}
          onExportPdf={() => handleDownloadPdf(publishingEbook)}
          onConnectCelebio={handleConnectCelebio}
          onDisconnectCelebio={handleDisconnectCelebio}
          onPublishCelebio={() => handlePublishCelebio(publishingEbook)}
        />
      )}

      <div className="space-y-3">
        {ebooks.map((ebook) => {
          const templateStyle = TEMPLATE_STYLES[ebook.template] || TEMPLATE_STYLES.minimal;
          const isDownloadingPdf = downloadingPdfId === ebook.id;
          const isDeleting = deletingId === ebook.id;
        
          return (
            <div
              key={ebook.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
            >
            {/* Subtle gradient line on left */}
            <div className={cn('absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b', templateStyle.icon)} />
            
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Icon */}
              <div className={cn(
                'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg',
                templateStyle.icon
              )}>
                <FileText className="w-6 h-6 text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <p className="font-semibold text-white text-sm truncate">{ebook.title}</p>
                  
                  {/* Template badge */}
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border',
                    templateStyle.bg,
                    templateStyle.text,
                    'border-white/10'
                  )}>
                    {ebook.template}
                  </span>
                  
                  {/* AI badge */}
                  {ebook.ai_applied && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                      <Sparkles className="w-3 h-3" />
                      AI Enhanced
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Updated {formatDate(ebook.updated_at)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                {/* Edit */}
                <button
                  onClick={() => onEdit(ebook)}
                  title="Edit ebook"
                  className="p-2.5 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Export PDF */}
                <button
                  onClick={() => handleDownloadPdf(ebook)}
                  disabled={isDownloadingPdf}
                  title={isPaid ? 'Download PDF' : 'Upgrade to download'}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200',
                    isPaid
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30',
                    isDownloadingPdf && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {isDownloadingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isPaid ? 'Export PDF' : 'Upgrade'}
                </button>

                {/* Publish */}
                <button
                  onClick={() => {
                    if (!isPaid) {
                      onUpgradeNeeded();
                      return;
                    }
                    setPublishingEbook(ebook);
                  }}
                  title={isPaid ? 'Publish options' : 'Upgrade to publish'}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200',
                    isPaid
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(ebook.id)}
                  disabled={isDeleting}
                  title="Delete ebook"
                  className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
