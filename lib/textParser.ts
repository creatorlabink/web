/**
 * Client-side text parser – mirrors backend utils/textParser.ts
 * Used for live preview without a server round-trip.
 */
import { Block, BlockType, ParsedEbook, ParsedSection } from '@/types';

const H3_RE = /^###\s+(.+)$/;
const H2_RE = /^##\s+(.+)$/;
const H1_RE = /^#\s+(.+)$/;
const BULLET_RE = /^[\*\-•]\s+(.+)$/;
const NUMBERED_RE = /^(\d+)\.\s+(.+)$/;
const QUOTE_RE = /^>\s*(.+)$/;
const DIVIDER_RE = /^[-=]{3,}\s*$/;
const CALLOUT_RE = /^(key\s*takeaway[s]?|note|tip|important|warning)[:\s]/i;

function classifyLine(line: string): Block | null {
  const t = line.trim();
  if (!t) return null;
  let m: RegExpMatchArray | null;
  if ((m = t.match(H3_RE))) return { type: 'h3', text: m[1].trim() };
  if ((m = t.match(H2_RE))) return { type: 'h2', text: m[1].trim() };
  if ((m = t.match(H1_RE))) return { type: 'h1', text: m[1].trim() };
  if (DIVIDER_RE.test(t)) return { type: 'divider' as BlockType, text: '' };
  if ((m = t.match(QUOTE_RE))) return { type: 'quote', text: m[1].trim() };
  if ((m = t.match(BULLET_RE))) return { type: 'bullet', text: m[1].trim() };
  if ((m = t.match(NUMBERED_RE))) return { type: 'numbered', text: m[2].trim(), number: `${m[1]}.` };
  if (CALLOUT_RE.test(t)) return { type: 'callout', text: t };
  return { type: 'paragraph', text: t };
}

export function parseText(rawText: string, fallbackTitle = 'Untitled Ebook'): ParsedEbook {
  const lines = rawText.split(/\r?\n/);
  const allBlocks: Block[] = [];
  for (const line of lines) {
    const b = classifyLine(line);
    if (b) allBlocks.push(b);
  }

  const titleBlock = allBlocks.find((b) => b.type === 'h1' || b.type === 'h2');
  const title = titleBlock ? titleBlock.text : fallbackTitle;

  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;
  for (const block of allBlocks) {
    if (block.type === 'h1' || block.type === 'h2') {
      if (current) sections.push(current);
      current = { heading: block.text, blocks: [] };
    } else {
      if (!current) current = { heading: title, blocks: [] };
      current.blocks.push(block);
    }
  }
  if (current) sections.push(current);
  if (!sections.length) sections.push({ heading: title, blocks: allBlocks });

  return { title, sections };
}
