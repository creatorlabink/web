'use client';

import { useMemo } from 'react';
import { parseText } from '@/lib/textParser';
import { Block, ParsedEbook, Ebook, ParsedSection } from '@/types';
import { cn } from '@/lib/utils';
import { 
  FileText, Sparkles, BookOpen, Layers, 
  MessageSquare, Target, CheckCircle2, 
  Lightbulb, AlertTriangle, ArrowRight,
  Zap, Star
} from 'lucide-react';

interface EbookPreviewProps {
  title: string;
  content: string;
  template: Ebook['template'];
  aiApplied?: boolean;
  parsed?: ParsedEbook;
}

// ─── Template Theme System ────────────────────────────────────────────────────

const THEMES = {
  minimal: {
    name: 'Minimal',
    // Header/Chapter styling
    headerBg: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800',
    chapterBg: 'bg-gradient-to-r from-[#0D1B2A] to-[#1B2838]',
    chapterLabel: 'text-amber-400',
    chapterText: 'text-white',
    accentBar: 'bg-gradient-to-r from-amber-400 to-amber-500',
    // Page styling
    pageBg: 'bg-gradient-to-b from-[#FDFCFB] to-[#F8F6F4]',
    // Typography
    h1: 'text-slate-800',
    h2: 'text-slate-700',
    h3: 'text-slate-600',
    body: 'text-slate-700',
    muted: 'text-slate-500',
    // Accents  
    primary: 'text-slate-700',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-400',
    // Bullets/Lists
    bullet: 'bg-teal-500',
    numbered: 'text-teal-600',
    // Special blocks
    quoteBg: 'bg-amber-50/80',
    quoteBorder: 'border-amber-400',
    calloutBg: 'bg-[#0D1B2A]',
    calloutText: 'text-white',
    promptBg: 'bg-emerald-50',
    promptBorder: 'border-emerald-500',
    promptLabel: 'text-emerald-600',
    tipBg: 'bg-blue-50',
    tipBorder: 'border-blue-400',
    tipIcon: 'text-blue-500',
    warningBg: 'bg-red-50',
    warningBorder: 'border-red-400',
    warningIcon: 'text-red-500',
    highlightBg: 'bg-violet-50',
    highlightBorder: 'border-violet-400',
    subheadingColor: 'text-slate-800',
    subheadingBg: 'bg-slate-100',
    benefitIcon: 'text-teal-500',
    exampleBg: 'bg-purple-50',
    exampleBorder: 'border-purple-300',
  },
  business: {
    name: 'Business',
    headerBg: 'bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900',
    chapterBg: 'bg-gradient-to-r from-blue-900 to-indigo-900',
    chapterLabel: 'text-amber-300',
    chapterText: 'text-white',
    accentBar: 'bg-gradient-to-r from-amber-400 to-yellow-400',
    pageBg: 'bg-gradient-to-b from-white to-slate-50',
    h1: 'text-blue-900',
    h2: 'text-blue-800',
    h3: 'text-blue-700',
    body: 'text-slate-700',
    muted: 'text-slate-500',
    primary: 'text-blue-800',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-400',
    bullet: 'bg-blue-500',
    numbered: 'text-blue-600',
    quoteBg: 'bg-blue-50',
    quoteBorder: 'border-blue-400',
    calloutBg: 'bg-blue-900',
    calloutText: 'text-white',
    promptBg: 'bg-emerald-50',
    promptBorder: 'border-emerald-500',
    promptLabel: 'text-emerald-600',
    tipBg: 'bg-sky-50',
    tipBorder: 'border-sky-400',
    tipIcon: 'text-sky-500',
    warningBg: 'bg-orange-50',
    warningBorder: 'border-orange-400',
    warningIcon: 'text-orange-500',
    highlightBg: 'bg-indigo-50',
    highlightBorder: 'border-indigo-400',
    subheadingColor: 'text-blue-900',
    subheadingBg: 'bg-blue-50',
    benefitIcon: 'text-blue-500',
    exampleBg: 'bg-indigo-50',
    exampleBorder: 'border-indigo-300',
  },
  workbook: {
    name: 'Workbook',
    headerBg: 'bg-gradient-to-r from-purple-900 via-violet-800 to-purple-900',
    chapterBg: 'bg-gradient-to-r from-purple-900 to-violet-900',
    chapterLabel: 'text-amber-300',
    chapterText: 'text-white',
    accentBar: 'bg-gradient-to-r from-amber-400 to-orange-400',
    pageBg: 'bg-gradient-to-b from-[#FDFCFB] to-[#F9F7F5]',
    h1: 'text-purple-900',
    h2: 'text-purple-800',
    h3: 'text-purple-700',
    body: 'text-slate-700',
    muted: 'text-slate-500',
    primary: 'text-purple-800',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-400',
    bullet: 'bg-purple-500',
    numbered: 'text-purple-600',
    quoteBg: 'bg-purple-50',
    quoteBorder: 'border-purple-400',
    calloutBg: 'bg-purple-900',
    calloutText: 'text-white',
    promptBg: 'bg-emerald-50',
    promptBorder: 'border-emerald-500',
    promptLabel: 'text-emerald-600',
    tipBg: 'bg-violet-50',
    tipBorder: 'border-violet-400',
    tipIcon: 'text-violet-500',
    warningBg: 'bg-rose-50',
    warningBorder: 'border-rose-400',
    warningIcon: 'text-rose-500',
    highlightBg: 'bg-fuchsia-50',
    highlightBorder: 'border-fuchsia-400',
    subheadingColor: 'text-purple-900',
    subheadingBg: 'bg-purple-100',
    benefitIcon: 'text-purple-500',
    exampleBg: 'bg-violet-50',
    exampleBorder: 'border-violet-300',
  },
};

type Theme = typeof THEMES.minimal;

// ─── Block Renderer ───────────────────────────────────────────────────────────

function BlockView({ block, theme }: { block: Block; theme: Theme }) {
  switch (block.type) {
    // ═══ CHAPTER HEADER ═══
    case 'chapter':
      return (
        <div className="mb-6 mt-8 first:mt-0">
          <div className={cn('rounded-xl overflow-hidden shadow-lg', theme.chapterBg)}>
            <div className="px-5 py-4">
              {block.chapterNum && (
                <p className={cn('text-[10px] font-bold tracking-[0.25em] uppercase mb-1', theme.chapterLabel)}>
                  Chapter {block.chapterNum}
                </p>
              )}
              <h1 className={cn('text-xl font-bold leading-snug', theme.chapterText)}>
                {block.text}
              </h1>
            </div>
            <div className={cn('h-1.5', theme.accentBar)} />
          </div>
        </div>
      );

    // ═══ HEADINGS ═══
    case 'h1':
      return (
        <div className="mt-8 mb-4">
          <h1 className={cn('text-2xl font-bold leading-tight', theme.h1)}>{block.text}</h1>
          <div className={cn('h-1 w-20 mt-2 rounded-full', theme.accentBar)} />
        </div>
      );
    
    case 'h2':
      return (
        <h2 className={cn('text-xl font-bold mt-6 mb-3 pb-2 border-b-2', theme.h2, theme.accentBorder)}>
          {block.text}
        </h2>
      );
    
    case 'h3':
      return (
        <h3 className={cn('text-base font-bold mt-5 mb-2', theme.h3)}>
          {block.text}
        </h3>
      );

    // ═══ SUBHEADING - Bold standalone topic line ═══
    case 'subheading':
      return (
        <div className="mt-5 mb-3">
          <div className={cn('inline-block px-3 py-1.5 rounded-lg font-bold text-sm', theme.subheadingBg, theme.subheadingColor)}>
            {block.text}
          </div>
        </div>
      );

    // ═══ PARAGRAPH ═══
    case 'paragraph':
      return (
        <p className={cn('text-sm leading-relaxed mb-3 text-justify', theme.body)}>
          {block.text}
        </p>
      );

    // ═══ INTRO LIST - Line that introduces a list ═══
    case 'intro_list':
      return (
        <p className={cn('text-sm font-semibold mt-4 mb-2', theme.primary)}>
          {block.text}:
        </p>
      );

    // ═══ BULLET LIST ═══
    case 'bullet':
      return (
        <div className="flex items-start gap-3 mb-2.5 ml-1">
          <span className={cn('mt-2 w-2 h-2 rounded-full flex-shrink-0', theme.bullet)} />
          <span className={cn('text-sm leading-relaxed', theme.body)}>{block.text}</span>
        </div>
      );

    // ═══ NUMBERED LIST ═══
    case 'numbered':
      return (
        <div className="flex items-start gap-3 mb-2.5 ml-1">
          <span className={cn('text-sm font-bold w-6 flex-shrink-0', theme.numbered)}>
            {block.number}
          </span>
          <span className={cn('text-sm leading-relaxed', theme.body)}>{block.text}</span>
        </div>
      );

    // ═══ BENEFIT/FEATURE ITEM - With checkmark ═══
    case 'benefit':
      return (
        <div className="flex items-start gap-3 mb-3 ml-1">
          <CheckCircle2 className={cn('w-5 h-5 mt-0.5 flex-shrink-0', theme.benefitIcon)} />
          <span className={cn('text-sm leading-relaxed', theme.body)}>{block.text}</span>
        </div>
      );

    // ═══ EXAMPLE - Purple accent ═══
    case 'example':
      return (
        <div className={cn('my-3 border-l-4 rounded-r-lg pl-4 pr-4 py-3', theme.exampleBg, theme.exampleBorder)}>
          <div className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
            <p className={cn('text-sm leading-relaxed', theme.body)}>{block.text}</p>
          </div>
        </div>
      );

    // ═══ DEFINITION - Term: Definition ═══
    case 'definition':
      const colonIdx = block.text.indexOf(':');
      const dashIdx = block.text.indexOf(' - ');
      const splitIdx = colonIdx > 0 ? colonIdx : dashIdx;
      const separator = colonIdx > 0 ? ':' : ' - ';
      
      if (splitIdx > 0) {
        const term = block.text.substring(0, splitIdx).replace(/\*\*/g, '');
        const def = block.text.substring(splitIdx + separator.length);
        return (
          <div className="mb-3 ml-1">
            <span className={cn('font-bold', theme.primary)}>{term}</span>
            <span className={theme.muted}> — </span>
            <span className={cn('text-sm', theme.body)}>{def}</span>
          </div>
        );
      }
      return <p className={cn('text-sm mb-3', theme.body)}>{block.text}</p>;

    // ═══ QUOTE - Gold border callout ═══
    case 'quote':
      return (
        <div className={cn('my-4 border-l-4 rounded-r-xl pl-5 pr-4 py-4', theme.quoteBg, theme.quoteBorder)}>
          <p className={cn('text-sm italic leading-relaxed', theme.body)}>
            "{block.text}"
          </p>
        </div>
      );

    // ═══ KEY CALLOUT - Navy box ═══
    case 'callout':
      return (
        <div className={cn('my-5 rounded-xl px-5 py-4 shadow-md', theme.calloutBg)}>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className={cn('text-sm font-semibold leading-relaxed', theme.calloutText)}>
              {block.text}
            </p>
          </div>
        </div>
      );

    // ═══ HIGHLIGHT - Important statement ═══
    case 'highlight':
      return (
        <div className={cn('my-4 border-l-4 rounded-r-lg pl-4 pr-4 py-3', theme.highlightBg, theme.highlightBorder)}>
          <p className={cn('text-sm leading-relaxed font-medium', theme.body)}>
            {block.text}
          </p>
        </div>
      );

    // ═══ TIP - Green/Blue helpful tip ═══
    case 'tip':
      return (
        <div className={cn('my-4 border-l-4 rounded-r-xl pl-4 pr-4 py-3', theme.tipBg, theme.tipBorder)}>
          <div className="flex items-start gap-3">
            <Lightbulb className={cn('w-5 h-5 flex-shrink-0', theme.tipIcon)} />
            <p className={cn('text-sm leading-relaxed', theme.body)}>{block.text}</p>
          </div>
        </div>
      );

    // ═══ WARNING - Red caution ═══
    case 'warning':
      return (
        <div className={cn('my-4 border-l-4 rounded-r-xl pl-4 pr-4 py-3', theme.warningBg, theme.warningBorder)}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={cn('w-5 h-5 flex-shrink-0', theme.warningIcon)} />
            <p className={cn('text-sm leading-relaxed font-medium', theme.body)}>{block.text}</p>
          </div>
        </div>
      );

    // ═══ CHATGPT PROMPT - Green box with icon ═══
    case 'prompt':
      return (
        <div className={cn('my-5 border-l-4 rounded-r-xl overflow-hidden', theme.promptBg, theme.promptBorder)}>
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className={cn('w-4 h-4', theme.promptLabel)} />
              <p className={cn('text-[10px] font-bold tracking-wider uppercase', theme.promptLabel)}>
                ChatGPT Prompt
              </p>
            </div>
            <p className={cn('text-sm leading-relaxed whitespace-pre-wrap', theme.body)}>
              {block.text.replace(/^(?:ChatGPT\s*)?Prompt[:\s]*/i, '')}
            </p>
          </div>
        </div>
      );

    // ═══ ACTION TASK - Gold actionable item ═══
    case 'action_task':
      return (
        <div className={cn('my-5 rounded-xl px-5 py-4 border-2', theme.accentBg, theme.accentBorder)}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <p className={cn('text-sm font-bold', theme.accent)}>{block.text}</p>
          </div>
        </div>
      );

    // ═══ GOAL - Navy goal box ═══
    case 'goal':
      return (
        <div className={cn('my-5 rounded-xl px-5 py-4 shadow-md', theme.calloutBg)}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className={cn('text-sm font-bold', theme.calloutText)}>{block.text}</p>
          </div>
        </div>
      );

    // ═══ DIVIDER ═══
    case 'divider':
      return (
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <Star className="w-3 h-3 text-slate-300" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      );

    // ═══ STEP ITEM ═══
    case 'step_item':
      return (
        <div className="flex items-start gap-3 mb-3 ml-1">
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0', theme.bullet)}>
            {block.number || '•'}
          </div>
          <span className={cn('text-sm leading-relaxed', theme.body)}>{block.text}</span>
        </div>
      );

    // ═══ EMPHASIS ═══
    case 'emphasis':
      return (
        <p className={cn('text-sm leading-relaxed mb-3 italic', theme.accent)}>
          {block.text}
        </p>
      );

    default:
      return <p className={cn('text-sm mb-3', theme.body)}>{block.text}</p>;
  }
}

// ─── Section Renderer ─────────────────────────────────────────────────────────

function SectionView({ section, index, theme }: { section: ParsedSection; index: number; theme: Theme }) {
  if (section.isChapter) {
    return (
      <div className={cn('mb-8', index > 0 && 'pt-6')}>
        {/* Chapter heading */}
        <div className="mb-6">
          <div className={cn('rounded-xl overflow-hidden shadow-lg', theme.chapterBg)}>
            <div className="px-5 py-4">
              {section.chapterNum && (
                <p className={cn('text-[10px] font-bold tracking-[0.25em] uppercase mb-1', theme.chapterLabel)}>
                  Chapter {section.chapterNum}
                </p>
              )}
              <h1 className={cn('text-xl font-bold leading-snug', theme.chapterText)}>
                {section.heading}
              </h1>
            </div>
            <div className={cn('h-1.5', theme.accentBar)} />
          </div>
        </div>
        
        {/* Chapter content */}
        {section.blocks.map((block, i) => (
          <BlockView key={i} block={block} theme={theme} />
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn('mb-8', index > 0 && 'pt-6 border-t border-slate-200')}>
      <h2 className={cn('text-xl font-bold mb-4 pb-2 border-b-2', theme.h2, theme.accentBorder)}>
        {section.heading}
      </h2>
      {section.blocks.map((block, i) => (
        <BlockView key={i} block={block} theme={theme} />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EbookPreview({ title, content, template, aiApplied = false, parsed: serverParsed }: EbookPreviewProps) {
  const theme = THEMES[template];
  const localParsed = useMemo(() => parseText(content, title || 'Untitled Ebook'), [content, title]);
  const parsed = serverParsed ?? localParsed;
  const isEmpty = !content.trim();

  return (
    <div className="h-full overflow-y-auto px-3 py-6">
      {/* Premium preview frame */}
      <div className="max-w-[540px] mx-auto">
        
        {/* Cover / Header */}
        <div className={cn(
          'rounded-t-2xl px-6 py-6 text-center shadow-xl',
          'border border-b-0 border-white/10',
          theme.headerBg
        )}>
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <BookOpen className="w-3.5 h-3.5 text-white/80" />
              <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
                Live Preview
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white leading-tight mb-3">
            {parsed.title || title || 'Untitled Ebook'}
          </h1>
          
          {/* Meta */}
          <div className="flex items-center justify-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {parsed.sections.length} {parsed.sections.length === 1 ? 'section' : 'sections'}
            </span>
            <span>•</span>
            <span className="capitalize">{theme.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              {aiApplied && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              {aiApplied ? 'AI Enhanced' : 'Manual'}
            </span>
          </div>
        </div>
        
        {/* Accent bar */}
        <div className={cn('h-2 shadow-sm', theme.accentBar)} />

        {/* Content area */}
        <div className={cn(
          'rounded-b-2xl border border-t-0 border-slate-200/60 px-6 py-8 min-h-[500px]',
          'shadow-xl shadow-black/5',
          theme.pageBg
        )}>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5 shadow-inner">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-base font-medium text-slate-500 mb-2">
                Start typing to see your ebook preview
              </p>
              <p className="text-sm text-slate-400">
                Use # for headings, - for bullets, &gt; for quotes
              </p>
            </div>
          ) : (
            parsed.sections.map((section, i) => (
              <SectionView key={i} section={section} index={i} theme={theme} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2.5 py-5">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
            <BookOpen className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-medium text-gray-500">
            Generated with <span className="text-indigo-500">Creatorlab</span>
          </p>
        </div>
      </div>
    </div>
  );
}
