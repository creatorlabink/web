'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { TextEditor } from '@/components/ebook/TextEditor';
import { EbookPreview } from '@/components/ebook/EbookPreview';
import { EbookList } from '@/components/ebook/EbookList';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { aiApi, ebooksApi, paymentApi } from '@/lib/api';
import { AiFormatResponse, Ebook } from '@/types';

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
  const [template, setTemplate] = useState<Ebook['template']>('minimal');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);
  const [aiSource, setAiSource] = useState<string>('manual');
  const [isFormattingAi, setIsFormattingAi] = useState(false);
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
    setAiEnabled(false);
    setAiApplied(false);
    setAiSource('manual');
    setSaveError(null);
    setViewMode('create');
  }

  function openEdit(ebook: Ebook) {
    setEditingEbook(ebook);
    setTitle(ebook.title);
    setContent(ebook.raw_text ?? '');
    setTemplate(ebook.template ?? 'minimal');
    setAiEnabled(Boolean(ebook.ai_applied));
    setAiApplied(Boolean(ebook.ai_applied));
    setAiSource(ebook.ai_source ?? 'manual');
    setSaveError(null);
    setViewMode('edit');
  }

  function closeEditor() {
    setViewMode('list');
    setEditingEbook(null);
    setSaveError(null);
    setIsFormattingAi(false);
  }

  async function handleApplyAi() {
    if (!content.trim()) {
      setSaveError('Add content first, then apply AI formatting.');
      return;
    }
    setSaveError(null);
    setIsFormattingAi(true);
    try {
      const res = await aiApi.format(title.trim() || 'Untitled Ebook', content.trim());
      const data = res.data as AiFormatResponse;
      setContent(data.formatted_text);
      setAiApplied(data.ai_applied);
      setAiSource(data.ai_source);
      if (!title.trim() && data.parsed?.title) setTitle(data.parsed.title);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setSaveError(axiosErr.response?.data?.error ?? 'AI formatting failed.');
    } finally {
      setIsFormattingAi(false);
    }
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
        const res = await ebooksApi.create({
          title: title.trim(),
          raw_text: content.trim(),
          template,
          apply_ai: aiEnabled,
        });
        const data = res.data as { ebook: Ebook };
        setEbooks((prev) => [data.ebook, ...prev]);
      } else if (editingEbook) {
        const res = await ebooksApi.update(editingEbook.id, {
          title: title.trim(),
          raw_text: content.trim(),
          template,
          apply_ai: aiEnabled,
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
            subtitle="Build, format, and export premium ebooks from one workspace."
          />
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {userPlan === 'free' && ebooks.length > 0 && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-r from-amber-950/30 to-orange-950/20">
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Loader2 className="w-5 h-5 text-white" style={{ animation: 'none' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-200">Upgrade to unlock premium exports</p>
                      <p className="text-xs text-amber-400/70 mt-0.5">
                        Get lifetime access for $11.97 and export unlimited polished PDFs.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="flex-shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold px-5 py-2.5 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
                  >
                    Upgrade – $11.97
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-gray-500" />
                </div>
                <h2 className="text-sm font-semibold text-gray-400">
                  {ebooks.length} {ebooks.length === 1 ? 'ebook' : 'ebooks'} in library
                </h2>
              </div>
              <button
                onClick={openNew}
                className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white text-sm font-semibold px-5 py-2.5 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                New Ebook Draft
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
          {/* Editor header */}
          <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#0a0a0a] to-[#0f0f12]">
            <button
              onClick={closeEditor}
              className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">
                {viewMode === 'create' ? 'Create New Ebook' : `Editing: ${editingEbook?.title}`}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {viewMode === 'create'
                  ? 'Paste your content, choose a template, apply AI formatting, and save your masterpiece.'
                  : 'Refine your content, update template choices, then save.'}
              </p>
            </div>
            <button
              onClick={() => setShowPreview((p) => !p)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Hide Preview</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span className="text-indigo-300">Show Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Editor body */}
          <div className="flex-1 overflow-hidden flex">
            {/* Editor panel */}
            <div 
              className={`overflow-y-auto ${showPreview ? 'w-full md:w-1/2' : 'w-full'}`}
              style={{
                background: 'linear-gradient(180deg, #0a0a0c 0%, #0f0f14 100%)',
              }}
            >
              <div className="px-6 py-6 max-w-2xl">
                <TextEditor
                  title={title}
                  content={content}
                  template={template}
                  aiEnabled={aiEnabled}
                  aiApplied={aiApplied}
                  aiSource={aiSource}
                  isFormattingAi={isFormattingAi}
                  onTitleChange={setTitle}
                  onContentChange={setContent}
                  onTemplateChange={setTemplate}
                  onAiToggle={(next) => {
                    setAiEnabled(next);
                    if (!next) {
                      setAiApplied(false);
                      setAiSource('manual');
                    }
                  }}
                  onApplyAi={handleApplyAi}
                  onSave={handleSave}
                  isSaving={isSaving}
                  error={saveError}
                  ebookId={editingEbook?.id}
                />
              </div>
            </div>

            {/* Preview panel */}
            {showPreview && (
              <div 
                className="hidden md:block w-1/2 border-l border-white/10 overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #13131a 0%, #1a1a24 100%)',
                }}
              >
                {/* Preview header */}
                <div className="px-4 py-3 border-b border-white/10 bg-black/20">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Live Preview
                    </p>
                  </div>
                </div>
                
                {/* Preview content */}
                <div className="h-[calc(100%-44px)] overflow-y-auto">
                  <EbookPreview title={title} content={content} template={template} aiApplied={aiApplied} />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
