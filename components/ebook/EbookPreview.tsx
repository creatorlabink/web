'use client';

import { useMemo } from 'react';
import { parseText } from '@/lib/textParser';
import { Block, ParsedEbook } from '@/types';
import { cn } from '@/lib/utils';

interface EbookPreviewProps {
  title: string;
  content: string;
  /** If provided, overrides local parse (e.g. from server preview endpoint) */
  parsed?: ParsedEbook;
}

// ─── Block renderer ───────────────────────────────────────────────────────────
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h1':
      return (
        <div className="mt-6 mb-2">
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{block.text}</h1>
          <hr className="mt-2 border-indigo-200" />
        </div>
      );
    case 'h2':
      return <h2 className="text-xl font-bold text-gray-800 mt-5 mb-1.5">{block.text}</h2>;
    case 'h3':
      return <h3 className="text-base font-semibold text-gray-700 mt-4 mb-1">{block.text}</h3>;
    case 'paragraph':
      return <p className="text-sm text-gray-700 leading-relaxed mb-2">{block.text}</p>;
    case 'bullet':
      return (
        <div className="flex items-start gap-2 mb-1.5 ml-2">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
          <span className="text-sm text-gray-700">{block.text}</span>
        </div>
      );
    case 'numbered':
      return (
        <div className="flex items-start gap-2 mb-1.5 ml-2">
          <span className="text-sm font-bold text-indigo-600 w-5 flex-shrink-0">{block.number}</span>
          <span className="text-sm text-gray-700">{block.text}</span>
        </div>
      );
    case 'quote':
      return (
        <div className="my-3 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg pl-4 pr-3 py-3">
          <p className="text-sm italic text-indigo-800">{block.text}</p>
        </div>
      );
    case 'callout':
      return (
        <div className="my-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">{block.text}</p>
        </div>
      );
    case 'divider':
      return <hr className="my-4 border-gray-200" />;
    default:
      return null;
  }
}

// ─── Section renderer ─────────────────────────────────────────────────────────
function SectionView({ section, index }: { section: { heading: string; blocks: Block[] }; index: number }) {
  return (
    <div className={cn('mb-6', index > 0 && 'pt-6 border-t border-gray-100')}>
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-indigo-500">
        {section.heading}
      </h2>
      {section.blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function EbookPreview({ title, content, parsed: serverParsed }: EbookPreviewProps) {
  const localParsed = useMemo(() => parseText(content, title || 'Untitled Ebook'), [content, title]);
  const parsed = serverParsed ?? localParsed;

  const isEmpty = !content.trim();

  return (
    <div className="h-full overflow-y-auto">
      {/* ── A4-like preview frame ────────────────────────────────────────── */}
      <div className="max-w-[560px] mx-auto">
        {/* Cover mini */}
        <div className="rounded-t-xl bg-indigo-600 px-6 py-5 text-white text-center mb-0">
          <p className="text-[10px] uppercase tracking-widest mb-1 opacity-70">PREVIEW</p>
          <h1 className="text-lg font-bold leading-tight">
            {parsed.title || title || 'Untitled Ebook'}
          </h1>
          <p className="text-xs mt-1 opacity-60">
            {parsed.sections.length} {parsed.sections.length === 1 ? 'section' : 'sections'}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 px-6 py-5 shadow-sm min-h-[400px]">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-sm text-gray-500">Start typing to see your ebook preview here.</p>
              <p className="text-xs text-gray-400 mt-1">Use # for headings, - for bullets</p>
            </div>
          ) : (
            parsed.sections.map((section, i) => (
              <SectionView key={i} section={section} index={i} />
            ))
          )}
        </div>

        {/* Footer branding */}
        <div className="text-center py-2">
          <p className="text-[10px] text-gray-400">Generated with CreatorLab.ink</p>
        </div>
      </div>
    </div>
  );
}
