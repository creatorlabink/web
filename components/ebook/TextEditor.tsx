'use client';

import { useState, useCallback } from 'react';
import { FileText, Lightbulb, ChevronDown, ChevronUp, Hash, List, Quote, AlertCircle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateSelector } from './TemplateSelector';
import { AiFormattingPanel } from './AiFormattingPanel';
import type { Ebook } from '@/types';

interface TextEditorProps {
  title: string;
  content: string;
  template: Ebook['template'];
  aiEnabled: boolean;
  aiApplied: boolean;
  aiSource?: string;
  isFormattingAi: boolean;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onTemplateChange: (v: Ebook['template']) => void;
  onAiToggle: (v: boolean) => void;
  onApplyAi: () => void;
  onSave: () => void;
  isSaving: boolean;
  error?: string | null;
  /** If set, editor is in "edit existing" mode */
  ebookId?: string;
}

const SAMPLE_TEXT = `# My Awesome Ebook Title

## Chapter 1: Getting Started

Welcome to your first chapter! This is a regular paragraph. You can write as much content here as you like.

### What You Will Learn

In this section we cover the basics:

- First bullet point about topic A
- Another important concept to remember
- One more thing that matters

> This is a quote or key insight that stands out from the rest.

1. Step one: Start with a clear goal
2. Step two: Break it into small tasks
3. Step three: Take consistent action

Key Takeaway: Consistency beats intensity every time.

---

## Chapter 2: Going Deeper

Continue adding chapters using ## headings. Use ### for sub-sections, - for bullets, > for quotes, and 1. 2. 3. for numbered lists.
`;

const FORMATTING_HINTS = [
  { icon: Hash, syntax: '# Title', result: 'Heading 1', color: 'text-amber-400' },
  { icon: Hash, syntax: '## Section', result: 'Heading 2 / Chapter', color: 'text-amber-400' },
  { icon: Hash, syntax: '### Sub', result: 'Heading 3', color: 'text-amber-400' },
  { icon: List, syntax: '- item', result: 'Bullet list', color: 'text-emerald-400' },
  { icon: List, syntax: '1. item', result: 'Numbered list', color: 'text-emerald-400' },
  { icon: Quote, syntax: '> text', result: 'Pull quote', color: 'text-violet-400' },
  { icon: AlertCircle, syntax: 'Key Takeaway:', result: 'Callout box', color: 'text-rose-400' },
  { icon: Hash, syntax: '---', result: 'Section divider', color: 'text-gray-400' },
];

export function TextEditor({
  title,
  content,
  template,
  aiEnabled,
  aiApplied,
  aiSource,
  isFormattingAi,
  onTitleChange,
  onContentChange,
  onTemplateChange,
  onAiToggle,
  onApplyAi,
  onSave,
  isSaving,
  error,
}: TextEditorProps) {
  const [showGuide, setShowGuide] = useState(false);

  const loadSample = useCallback(() => {
    onTitleChange('My Awesome Ebook Title');
    onContentChange(SAMPLE_TEXT);
  }, [onTitleChange, onContentChange]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Title Input ─────────────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Ebook Title</label>
        <input
          type="text"
          placeholder="Enter your ebook title…"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-base font-medium transition-all duration-200',
            'bg-white/5 backdrop-blur-sm placeholder:text-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
            !title.trim() && error
              ? 'border-red-500/50 text-red-300'
              : 'border-white/10 text-white hover:border-white/20'
          )}
        />
        {!title.trim() && error && (
          <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Title is required
          </p>
        )}
      </div>

      {/* ── Template selector ───────────────────────────────────────────── */}
      <TemplateSelector value={template} onChange={onTemplateChange} />

      {/* ── AI formatting controls ──────────────────────────────────────── */}
      <AiFormattingPanel
        enabled={aiEnabled}
        aiApplied={aiApplied}
        aiSource={aiSource}
        formatting={isFormattingAi}
        onToggle={onAiToggle}
        onApply={onApplyAi}
      />

      {/* ── Formatting guide toggle ──────────────────────────────────────── */}
      <div className={cn(
        'rounded-xl border overflow-hidden transition-all duration-300',
        showGuide 
          ? 'border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-orange-950/20' 
          : 'border-white/10 bg-white/5 hover:border-amber-500/20 hover:bg-amber-950/10'
      )}>
        <button
          type="button"
          onClick={() => setShowGuide((p) => !p)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-amber-300/90 hover:text-amber-200 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4" />
            Formatting Guide – How to structure your text
          </span>
          {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showGuide && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            {FORMATTING_HINTS.map((hint, i) => {
              const Icon = hint.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  <Icon className={cn('w-3.5 h-3.5', hint.color)} />
                  <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/80">
                    {hint.syntax}
                  </code>
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-400">{hint.result}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Text area ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Content
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-mono">{wordCount.toLocaleString()} words</span>
            <button
              type="button"
              onClick={loadSample}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Load sample
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={'Paste or type your ebook content here…\n\nUse # for headings, ## for chapters, - for bullets, > for quotes.'}
          rows={18}
          className={cn(
            'w-full rounded-xl border px-4 py-4 text-sm font-mono leading-relaxed resize-y transition-all duration-200',
            'bg-[#0c0c0c] backdrop-blur-sm placeholder:text-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
            !content.trim() && error
              ? 'border-red-500/50 text-red-300'
              : 'border-white/10 text-gray-200 hover:border-white/20'
          )}
        />
        {!content.trim() && error && (
          <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Content is required
          </p>
        )}
      </div>

      {/* ── Error display ────────────────────────────────────────────────── */}
      {error && content.trim() && title.trim() && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* ── Save Button ──────────────────────────────────────────────────── */}
      <button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className={cn(
          'flex items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300',
          isSaving
            ? 'bg-indigo-500/30 text-indigo-300 cursor-not-allowed border border-indigo-500/20'
            : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]'
        )}
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Ebook
          </>
        )}
      </button>
    </div>
  );
}
