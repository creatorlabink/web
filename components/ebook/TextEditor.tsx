'use client';

import { useState, useCallback } from 'react';
import { FileText, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';

interface TextEditorProps {
  title: string;
  content: string;
  template: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onTemplateChange: (v: string) => void;
  onSave: () => void;
  isSaving: boolean;
  error?: string | null;
  /** If set, editor is in "edit existing" mode */
  ebookId?: string;
}

const TEMPLATES = [
  { value: 'minimal',  label: 'Minimal',  desc: 'Clean, simple, reader-focused' },
  { value: 'workbook', label: 'Workbook', desc: 'Structured exercises & notes' },
  { value: 'business', label: 'Business', desc: 'Professional, polished tone' },
];

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

export function TextEditor({
  title,
  content,
  template,
  onTitleChange,
  onContentChange,
  onTemplateChange,
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
    <div className="flex flex-col gap-4">
      {/* ── Title ──────────────────────────────────────────────────────── */}
      <Input
        label="Ebook Title"
        placeholder="Enter your ebook title…"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        error={!title.trim() && error ? 'Title is required' : undefined}
      />

      {/* ── Template selector ───────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onTemplateChange(t.value)}
              className={cn(
                'rounded-lg border-2 p-3 text-left transition-all text-sm',
                template === t.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-600'
              )}
            >
              <div className="font-semibold">{t.label}</div>
              <div className="text-xs mt-0.5 opacity-70">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Formatting guide toggle ──────────────────────────────────────── */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowGuide((p) => !p)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium text-amber-800"
        >
          <span className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Formatting Guide – How to structure your text
          </span>
          {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showGuide && (
          <div className="px-4 pb-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-amber-700">
            <span><code className="font-mono bg-amber-100 px-1 rounded"># Title</code> → Heading 1</span>
            <span><code className="font-mono bg-amber-100 px-1 rounded">## Section</code> → Heading 2 / Chapter</span>
            <span><code className="font-mono bg-amber-100 px-1 rounded">### Sub</code> → Heading 3</span>
            <span><code className="font-mono bg-amber-100 px-1 rounded">- item</code> → Bullet list</span>
            <span><code className="font-mono bg-amber-100 px-1 rounded">1. item</code> → Numbered list</span>
            <span><code className="font-mono bg-amber-100 px-1 rounded">&gt; text</code> → Pull quote</span>
            <span><code className="font-mono bg-amber-100 px-1 rounded">Key Takeaway:</code> → Callout box</span>
            <span><code className="font-mono bg-amber-100 px-1 rounded">---</code> → Section divider</span>
          </div>
        )}
      </div>

      {/* ── Text area ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{wordCount.toLocaleString()} words</span>
            <button
              type="button"
              onClick={loadSample}
              className="text-xs text-indigo-600 hover:underline"
            >
              Load sample
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={'Paste or type your ebook content here…\n\nUse # for headings, ## for chapters, - for bullets, > for quotes.'}
          rows={22}
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-sm font-mono leading-relaxed resize-y',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !content.trim() && error
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 bg-white'
          )}
        />
        {!content.trim() && error && (
          <p className="mt-1 text-xs text-red-600">Content is required</p>
        )}
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      {error && content.trim() && title.trim() && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className={cn(
          'flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all',
          isSaving
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm'
        )}
      >
        <FileText className="w-4 h-4" />
        {isSaving ? 'Saving…' : 'Save Ebook'}
      </button>
    </div>
  );
}
