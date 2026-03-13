'use client';

import { useState } from 'react';
import { Download, Pencil, Trash2, BookOpen, Plus, Loader2 } from 'lucide-react';
import { Ebook } from '@/types';
import { ebooksApi, pdfApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface EbookListProps {
  ebooks: Ebook[];
  userPlan: string;
  onEdit: (ebook: Ebook) => void;
  onDelete: (id: string) => void;
  onNewEbook: () => void;
  onUpgradeNeeded: () => void;
}

function templateBadge(template: string) {
  const map: Record<string, string> = {
    minimal:  'bg-gray-100 text-gray-600',
    workbook: 'bg-blue-100 text-blue-700',
    business: 'bg-purple-100 text-purple-700',
  };
  return map[template] ?? 'bg-gray-100 text-gray-600';
}

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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isPaid = userPlan === 'lifetime' || userPlan === 'annual';

  async function handleDownload(ebook: Ebook) {
    if (!isPaid) {
      onUpgradeNeeded();
      return;
    }
    setDownloadingId(ebook.id);
    try {
      const blob = await pdfApi.export(ebook.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ebook.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      if (axiosErr.response?.data?.error === 'payment_required') {
        onUpgradeNeeded();
      } else {
        alert('Export failed. Please try again.');
      }
    } finally {
      setDownloadingId(null);
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

  if (ebooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">No ebooks yet</h3>
        <p className="text-sm text-gray-500 mb-4">Create your first ebook to get started.</p>
        <button
          onClick={onNewEbook}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Ebook
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ebooks.map((ebook) => (
        <div
          key={ebook.id}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5 hover:border-indigo-200 hover:shadow-sm transition-all"
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-gray-900 text-sm truncate">{ebook.title}</p>
              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize', templateBadge(ebook.template))}>
                {ebook.template}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Updated {formatDate(ebook.updated_at)}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Edit */}
            <button
              onClick={() => onEdit(ebook)}
              title="Edit ebook"
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Export PDF */}
            <button
              onClick={() => handleDownload(ebook)}
              disabled={downloadingId === ebook.id}
              title={isPaid ? 'Download PDF' : 'Upgrade to download'}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                isPaid
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-700',
                downloadingId === ebook.id && 'opacity-60 cursor-not-allowed'
              )}
            >
              {downloadingId === ebook.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {isPaid ? 'PDF' : 'Unlock'}
            </button>

            {/* Delete */}
            <button
              onClick={() => handleDelete(ebook.id)}
              disabled={deletingId === ebook.id}
              title="Delete ebook"
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              {deletingId === ebook.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
