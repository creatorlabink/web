/**
 * Intelligent text parser for Creatorlab ebooks
 * Automatically detects and classifies content types for beautiful rendering.
 * Uses pattern recognition and heuristics to create visually rich ebooks.
 */
import { Block, BlockType, ParsedEbook, ParsedSection } from '@/types';

// ─── Pattern Definitions ──────────────────────────────────────────────────────

// Major structure patterns
const CHAPTER_RE = /^(?:CHAPTER|Chapter)\s*(\d+)[:\s]*(.*)$/i;
const STEP_RE = /^(?:Step)\s*(\d+)[:\s]*(.*)$/i;
const BONUS_RE = /^(?:BONUS|Bonus)\s*\d*[:\s]*(.*)$/i;
const CONCLUSION_RE = /^(?:Conclusion|Summary|Final\s*Thoughts)[:\s]?(.*)$/i;

// Markdown headings
const H4_RE = /^####\s+(.+)$/;
const H3_RE = /^###\s+(.+)$/;
const H2_RE = /^##\s+(.+)$/;
const H1_RE = /^#\s+(.+)$/;

// Lists and formatting
const BULLET_RE = /^[\*\-•]\s+(.+)$/;
const NUMBERED_RE = /^(\d+)\.\s+(.+)$/;
const QUOTE_RE = /^>\s*(.+)$/;
const DIVIDER_RE = /^[-=]{3,}\s*$/;

// Special content patterns
const PROMPT_START_RE = /^(?:Prompt|ChatGPT\s*Prompt|Prompt\s*(?:to|for)|Here\s*is\s*(?:a|the)\s*prompt)[:\s]/i;
const PROMPT_LABEL_RE = /^[✉️💬📝]?\s*(?:CHATGPT\s*PROMPT|AI\s*PROMPT|PROMPT)[:\s]?$/i;
const ACTION_TASK_RE = /^(?:Action\s*Task|Your\s*Action|Action\s*Plan|Action\s*Step)[s]?[:\s]?$/i;
const GOAL_RE = /^(?:Your\s*Goal|Goal\s*for\s*This\s*Step|Today's\s*Goal)[:\s]?$/i;

// Callout patterns (expanded)
const KEY_TAKEAWAY_RE = /^(?:Key\s*Takeaway[s]?|Key\s*Point[s]?|Key\s*Insight[s]?)[:\s]/i;
const TIP_RE = /^(?:Tip|Pro\s*Tip|Quick\s*Tip|Hot\s*Tip|Helpful\s*Tip)[:\s]/i;
const NOTE_RE = /^(?:Note|Please\s*Note|Remember|Keep\s*in\s*Mind)[:\s]/i;
const WARNING_RE = /^(?:Warning|Caution|Important|Be\s*Careful|Watch\s*Out|Avoid)[:\s!]/i;
const EXAMPLE_RE = /^(?:Example|For\s*Example|For\s*Instance|Here's\s*an\s*Example|Case\s*Study)[:\s]/i;
const BENEFIT_RE = /^(?:Benefit|Advantage|Why\s*This\s*Works)[:\s]/i;

// Definition pattern (Term: Definition or **Term** - Definition)
const DEFINITION_RE = /^(?:\*\*)?([^:\-*]+)(?:\*\*)?[\s]*[:\-–—]\s+(.+)$/;

// Intro to list patterns (lines ending with ":" that introduce lists)
const INTRO_LIST_RE = /^(.+):$/;

// "How they..." patterns (common in ebook examples)
const HOW_THEY_RE = /^How\s+they\s+.+$/i;

// Subheading patterns - standalone short lines that introduce topics
const SUBHEADING_EXACT = [
  'Skills',
  'Experiences', 
  'Pain and struggles',
  'Difficult situations you overcame',
  'Knowledge and expertise',
  'Things you know how to do',
  'Things you have done or gone through',
  'What is normal to you may be life-changing for someone else',
  'Benefits',
  'Features',
  'Advantages',
  'Requirements',
  'Prerequisites',
];

// Highlight patterns - key statements that deserve emphasis
const HIGHLIGHT_PATTERNS = [
  /^The\s+(?:key|most\s+important|secret|truth|reality|problem|solution)\s+(?:is|was)/i,
  /^(?:This\s+is\s+)?(important|crucial|critical|essential|vital)/i,
  /^What\s+(?:is\s+normal|you\s+know|matters)/i,
  /^The\s+goal\s+is/i,
  /^People\s+pay\s+for/i,
  /^If\s+your\s+knowledge/i,
  /value\s+is\s+simple/i,
  /then\s+it\s+has\s+value/i,
];

// Context tracking
let inPromptBlock = false;
let previousBlocks: Block[] = [];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function isShortTitleCase(text: string): boolean {
  const words = text.split(/\s+/);
  if (words.length < 2 || words.length > 8) return false;
  if (text.includes('.') && !text.match(/\d\./)) return false;
  if (text.length > 50) return false;
  
  // Check if it looks like a title (mostly capitalized words)
  const capitalizedWords = words.filter(w => /^[A-Z]/.test(w));
  return capitalizedWords.length >= Math.ceil(words.length * 0.5);
}

function matchesAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some(p => p.test(text));
}

function isAllCaps(text: string): boolean {
  return text.length < 50 && /^[A-Z][A-Z\s]+$/.test(text) && !text.includes('.');
}

function isExampleLine(text: string): boolean {
  return HOW_THEY_RE.test(text) || 
         /^(?:Like|Such\s+as|E\.g\.|i\.e\.)/i.test(text) ||
         /^(?:Someone\s+who|A\s+person\s+who|Anyone\s+who)/i.test(text);
}

function detectHighlight(text: string): boolean {
  return matchesAnyPattern(text, HIGHLIGHT_PATTERNS);
}

function isSubheadingText(text: string): boolean {
  // Check exact matches first
  const lower = text.toLowerCase().trim();
  for (const sub of SUBHEADING_EXACT) {
    if (lower === sub.toLowerCase()) return true;
  }
  
  // Pattern matches
  if (/^Things\s+you\s+(know|have|studied|learned)/i.test(text)) return true;
  if (/^(?:Your|The)\s+knowledge/i.test(text)) return true;
  if (/^(?:Difficult|Hard)\s+situations/i.test(text)) return true;
  
  return false;
}

function getPreviousBlockType(): BlockType | null {
  return previousBlocks.length > 0 ? previousBlocks[previousBlocks.length - 1].type : null;
}

// ─── Main Classification Function ─────────────────────────────────────────────

function classifyLine(line: string): Block | null {
  const t = line.trim();
  if (!t) {
    inPromptBlock = false;
    return null;
  }

  let m: RegExpMatchArray | null;

  // ═══ STRUCTURAL ELEMENTS ═══

  // Chapter headings
  if ((m = t.match(CHAPTER_RE))) {
    inPromptBlock = false;
    const chapterNum = parseInt(m[1], 10);
    const title = m[2].trim() || `Chapter ${chapterNum}`;
    return { type: 'chapter', text: title, chapterNum };
  }

  // Bonus chapters
  if ((m = t.match(BONUS_RE))) {
    inPromptBlock = false;
    return { type: 'chapter', text: m[1].trim() || t };
  }

  // Conclusion
  if ((m = t.match(CONCLUSION_RE))) {
    inPromptBlock = false;
    return { type: 'chapter', text: m[1].trim() || 'Conclusion' };
  }

  // Step headings
  if ((m = t.match(STEP_RE))) {
    inPromptBlock = false;
    return { type: 'h2', text: `Step ${m[1]}: ${m[2].trim()}`, number: m[1] };
  }

  // Markdown headings
  if ((m = t.match(H4_RE))) { inPromptBlock = false; return { type: 'h3', text: m[1].trim() }; }
  if ((m = t.match(H3_RE))) { inPromptBlock = false; return { type: 'h3', text: m[1].trim() }; }
  if ((m = t.match(H2_RE))) { inPromptBlock = false; return { type: 'h2', text: m[1].trim() }; }
  if ((m = t.match(H1_RE))) { inPromptBlock = false; return { type: 'h1', text: m[1].trim() }; }

  // Divider
  if (DIVIDER_RE.test(t)) { inPromptBlock = false; return { type: 'divider', text: '' }; }

  // ═══ SPECIAL CALLOUTS & BOXES ═══

  // ChatGPT Prompt label line
  if (PROMPT_LABEL_RE.test(t)) {
    inPromptBlock = true;
    return { type: 'prompt', text: 'ChatGPT Prompt' };
  }

  // Prompt start
  if (PROMPT_START_RE.test(t)) {
    inPromptBlock = true;
    return { type: 'prompt', text: t };
  }

  // Inside prompt block - continuation
  if (inPromptBlock) {
    if (t.startsWith('"') || t.startsWith('"') || t.startsWith("'")) {
      return { type: 'prompt_text', text: t.replace(/^["'""]|["'""]$/g, '') };
    }
    if (!t.match(/^[A-Z][a-z]+:/) && !t.match(/^[-•*\d]/)) {
      return { type: 'prompt_text', text: t };
    }
    inPromptBlock = false;
  }

  // Goal section
  if (GOAL_RE.test(t)) {
    inPromptBlock = false;
    return { type: 'goal', text: t.replace(/[:\s]*$/, '') };
  }

  // Action task
  if (ACTION_TASK_RE.test(t)) {
    inPromptBlock = false;
    return { type: 'action_task', text: t.replace(/[:\s]*$/, '') };
  }

  // Key takeaway / callout
  if (KEY_TAKEAWAY_RE.test(t)) {
    inPromptBlock = false;
    return { type: 'callout', text: t };
  }

  // Tip
  if (TIP_RE.test(t)) {
    return { type: 'tip', text: t };
  }

  // Note / Remember
  if (NOTE_RE.test(t)) {
    return { type: 'highlight', text: t };
  }

  // Warning
  if (WARNING_RE.test(t)) {
    return { type: 'warning', text: t };
  }

  // Example intro
  if (EXAMPLE_RE.test(t)) {
    return { type: 'example', text: t };
  }

  // Benefit
  if (BENEFIT_RE.test(t)) {
    return { type: 'benefit', text: t };
  }

  // ═══ LISTS ═══

  if ((m = t.match(QUOTE_RE))) return { type: 'quote', text: m[1].trim() };
  if ((m = t.match(BULLET_RE))) return { type: 'bullet', text: m[1].trim() };
  if ((m = t.match(NUMBERED_RE))) return { type: 'numbered', text: m[2].trim(), number: `${m[1]}.` };

  // ═══ INTELLIGENT CONTENT DETECTION ═══

  // ALL CAPS lines as headings  
  if (isAllCaps(t)) {
    inPromptBlock = false;
    return { type: 'h3', text: t };
  }

  // Check for subheading patterns
  if (isSubheadingText(t)) {
    return { type: 'subheading', text: t };
  }

  // Definition format (Term: definition or Term - definition)
  if ((m = t.match(DEFINITION_RE)) && m[1].length < 30 && m[2].length > 10) {
    return { type: 'definition', text: t };
  }

  // "How they..." example lines (common in ebook content)
  if (isExampleLine(t)) {
    return { type: 'example', text: t };
  }

  // Lines that introduce lists (end with ":")
  if ((m = t.match(INTRO_LIST_RE))) {
    const next = m[1].trim();
    if (next.length < 80 && next.length > 10) {
      return { type: 'intro_list', text: next };
    }
  }

  // Short title-case lines that look like subheadings (2-6 words, no period)
  if (isShortTitleCase(t) && t.length < 40 && !t.includes(',') && !t.endsWith('.')) {
    return { type: 'subheading', text: t };
  }

  // Highlight detection for key statements
  if (detectHighlight(t)) {
    return { type: 'highlight', text: t };
  }

  // Default: paragraph
  return { type: 'paragraph', text: t };
}

// ─── Post-processing ──────────────────────────────────────────────────────────

function mergePromptBlocks(blocks: Block[]): Block[] {
  const result: Block[] = [];
  let promptBuffer: string[] = [];
  
  for (const block of blocks) {
    if (block.type === 'prompt') {
      if (promptBuffer.length > 0) {
        result.push({ type: 'prompt', text: promptBuffer.join('\n') });
        promptBuffer = [];
      }
      result.push(block);
    } else if (block.type === 'prompt_text') {
      promptBuffer.push(block.text);
    } else {
      if (promptBuffer.length > 0) {
        result.push({ type: 'prompt', text: promptBuffer.join('\n') });
        promptBuffer = [];
      }
      result.push(block);
    }
  }
  
  if (promptBuffer.length > 0) {
    result.push({ type: 'prompt', text: promptBuffer.join('\n') });
  }
  
  return result;
}

function enhanceBlockContext(blocks: Block[]): Block[] {
  const enhanced: Block[] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const prev = i > 0 ? blocks[i - 1] : null;
    
    // If a paragraph comes right after intro_list, consider making bullets more prominent
    if (block.type === 'bullet' && prev?.type === 'intro_list') {
      enhanced.push({ ...block, type: 'benefit' });
    }
    // Multiple consecutive "How they..." lines become benefits
    else if (block.type === 'example' && HOW_THEY_RE.test(block.text) && 
             prev?.type === 'example' && HOW_THEY_RE.test(prev.text)) {
      enhanced.push({ ...block, type: 'benefit' });
    }
    // Convert first example to benefit style too
    else if (block.type === 'example' && HOW_THEY_RE.test(block.text)) {
      const next = i < blocks.length - 1 ? blocks[i + 1] : null;
      if (next?.type === 'example' && HOW_THEY_RE.test(next.text)) {
        enhanced.push({ ...block, type: 'benefit' });
      } else {
        enhanced.push(block);
      }
    }
    else {
      enhanced.push(block);
    }
  }
  
  return enhanced;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function parseText(rawText: string, fallbackTitle = 'Untitled Ebook'): ParsedEbook {
  inPromptBlock = false;
  previousBlocks = [];
  
  const lines = rawText.split(/\r?\n/);
  const allBlocks: Block[] = [];

  for (const line of lines) {
    const b = classifyLine(line);
    if (b) {
      allBlocks.push(b);
      previousBlocks.push(b);
    }
  }

  // Post-process
  let processed = mergePromptBlocks(allBlocks);
  processed = enhanceBlockContext(processed);

  // Extract title
  const titleBlock = processed.find((b) => b.type === 'chapter' || b.type === 'h1' || b.type === 'h2');
  const title = titleBlock ? titleBlock.text : fallbackTitle;

  // Build sections
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const block of processed) {
    if (block.type === 'chapter') {
      if (current) sections.push(current);
      current = { heading: block.text, blocks: [], isChapter: true, chapterNum: block.chapterNum };
    } else if (block.type === 'h1' || block.type === 'h2') {
      if (current && current.blocks.length === 0 && !current.isChapter) {
        current.heading = block.text;
      } else if (!current) {
        current = { heading: block.text, blocks: [] };
      } else {
        current.blocks.push(block);
      }
    } else {
      if (!current) current = { heading: title, blocks: [] };
      current.blocks.push(block);
    }
  }
  
  if (current) sections.push(current);
  if (!sections.length) sections.push({ heading: title, blocks: processed });

  return { title, sections };
}
