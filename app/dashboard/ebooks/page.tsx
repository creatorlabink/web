'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { TextEditor } from '@/components/ebook/TextEditor';
import { EbookPreview } from '@/components/ebook/EbookPreview';
import { EbookList } from '@/components/ebook/EbookList';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { ebooksApi, paymentApi } from '@/lib/api';
import { Ebook } from '@/types';

type ViewMode = 'list' | 'create' | 'edit';

export default function EbooksPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loadingEbooks, setLoadingEbooks] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('free');

  // Editor state
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [template, setTemplate] = useState('minimal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Preview panel
  const [showPreview, setShowPreview] = useState(true);

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ── Load data ──────────────────────────────────────────────────────────────
  const loadEbooks = useCallback(async () => {
    try {
      const res = await ebooksApi.list();
      const data = res.data as { ebooks: Ebook[] };
      setEbooks(data.ebooks ?? []);
    } catch {
      /* handled silently */
    } finally {
      setLoadingEbooks(false);
    }
  }, []);

  useEffect(() => {
    loadEbooks();
    paymentApi
      .getStatus()
      .then((res) => {
        const data = res.data as { plan: string };
        setUserPlan(data.plan ?? 'free');
      })
      .catch(() => {/* stays free */});
  }, [loadEbooks]);

  // ── Editor helpers ─────────────────────────────────────────────────────────
  function openNew() {
    setEditingEbook(null);
    setTitle('');
    setContent('');
    setTemplate('minimal');
    setSaveError(null);
    setViewMode('create');
  }

  function openEdit(ebook: Ebook) {
    setEditingEbook(ebook);
    setTitle(ebook.title);
    setContent(ebook.raw_text ?? '');
    setTemplate(ebook.template ?? 'minimal');
    setSaveError(null);
    setViewMode('edit');
  }

  function closeEditor() {
    setViewMode('list');
    setEditingEbook(null);
    setSaveError(null);
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setSaveError('Title and content are required.');
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      if (viewMode === 'create') {
        const res = await ebooksApi.create(title.trim(), content.trim(), template);
        const data = res.data as { ebook: Ebook };
        setEbooks((prev) => [data.ebook, ...prev]);
      } else if (editingEbook) {
        const res = await ebooksApi.update(editingEbook.id, {
          title: title.trim(),
          raw_text: content.trim(),
          template,
        });
        const data = res.data as { ebook: Ebook };
        setEbooks((prev) => prev.map((e) => (e.id === editingEbook.id ? data.ebook : e)));
      }
      closeEditor();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setSaveError(axiosErr.response?.data?.error ?? 'Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete(id: string) {
    setEbooks((prev) => prev.filter((e) => e.id !== id));
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} />}

      {/* ── List view ──────────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <>
          <DashboardHeader
            title="My Ebooks"
            subtitle="Create, manage, and export your ebooks as PDFs."
          />
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {userPlan === 'free' && ebooks.length > 0 && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-amber-800">Unlock PDF Export</p>
                  <p className="text-xs text-amber-700">
                    Get lifetime access for $11.97 to download your ebooks.
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex-shrink-0 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 transition-colors"
                >
                  Upgrade – $11.97
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                {ebooks.length} {ebooks.length === 1 ? 'ebook' : 'ebooks'}
              </h2>
              <button
                onClick={openNew}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Ebook
              </button>
            </div>

            {loadingEbooks ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : (
              <EbookList
                ebooks={ebooks}
                userPlan={userPlan}
                onEdit={openEdit}
                onDelete={handleDelete}
                onNewEbook={openNew}
                onUpgradeNeeded={() => setShowPaymentModal(true)}
              />
            )}
          </div>
        </>
      )}

      {/* ── Editor view ────────────────────────────────────────────────────── */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <>
          <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
            <button
              onClick={closeEditor}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-gray-900">
                {viewMode === 'create' ? 'New Ebook' : `Editing: ${editingEbook?.title}`}
              </h1>
              <p className="text-xs text-gray-500">
                {viewMode === 'create'
                  ? 'Paste or type your content, then save.'
                  : 'Make changes and save to update.'}
              </p>
            </div>
            <button
              onClick={() => setShowPreview((p) => !p)}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide preview' : 'Show preview'}
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Editor */}
            <div className={`overflow-y-auto px-6 py-5 ${showPreview ? 'w-full md:w-1/2' : 'w-full'}`}>
              <TextEditor
                title={title}
                content={content}
                template={template}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onTemplateChange={setTemplate}
                onSave={handleSave}
                isSaving={isSaving}
                error={saveError}
                ebookId={editingEbook?.id}
              />
            </div>

            {/* Preview (desktop) */}
            {showPreview && (
              <div className="hidden md:block w-1/2 border-l border-gray-200 bg-gray-50 overflow-y-auto px-4 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 text-center">
                  Live Preview
                </p>
                <EbookPreview title={title} content={content} />
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
