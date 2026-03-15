/**
 * PDF Generator for CreatorLab
 * Generates beautifully styled PDFs from parsed ebook content using jsPDF.
 */
import jsPDF from 'jspdf';
import type { Block, ParsedEbook, ParsedSection } from '@/types';

// ─── Template Themes ──────────────────────────────────────────────────────────
const THEMES = {
  minimal: {
    primary: [30, 41, 59],      // Slate 800
    secondary: [100, 116, 139],  // Slate 500
    accent: [217, 119, 6],       // Amber 600
    bg: [255, 255, 255],         // White
    text: [15, 23, 42],          // Slate 900
    muted: [71, 85, 105],        // Slate 600
    chapter: [15, 23, 42],       // Slate 900
    chapterBg: [241, 245, 249],  // Slate 100
    calloutBg: [248, 250, 252],  // Slate 50
    tipBg: [236, 253, 245],      // Emerald 50
    tipAccent: [16, 185, 129],   // Emerald 500
    warningBg: [254, 243, 199],  // Amber 100
    warningAccent: [217, 119, 6],// Amber 600
    exampleBg: [245, 243, 255],  // Violet 50
    exampleAccent: [139, 92, 246],// Violet 500
    promptBg: [236, 254, 255],   // Cyan 50
    promptAccent: [6, 182, 212], // Cyan 500
    quoteBg: [255, 251, 235],    // Amber 50
    quoteBorder: [245, 158, 11], // Amber 500
  },
  business: {
    primary: [30, 64, 175],      // Blue 800
    secondary: [59, 130, 246],   // Blue 500
    accent: [245, 158, 11],      // Amber 500
    bg: [255, 255, 255],
    text: [15, 23, 42],
    muted: [71, 85, 105],
    chapter: [255, 255, 255],
    chapterBg: [30, 64, 175],
    calloutBg: [239, 246, 255],  // Blue 50
    tipBg: [236, 253, 245],
    tipAccent: [16, 185, 129],
    warningBg: [254, 243, 199],
    warningAccent: [217, 119, 6],
    exampleBg: [245, 243, 255],
    exampleAccent: [139, 92, 246],
    promptBg: [236, 254, 255],
    promptAccent: [6, 182, 212],
    quoteBg: [255, 251, 235],
    quoteBorder: [245, 158, 11],
  },
  workbook: {
    primary: [109, 40, 217],     // Violet 700
    secondary: [139, 92, 246],   // Violet 500
    accent: [245, 158, 11],      // Amber 500
    bg: [255, 255, 255],
    text: [15, 23, 42],
    muted: [71, 85, 105],
    chapter: [255, 255, 255],
    chapterBg: [109, 40, 217],
    calloutBg: [245, 243, 255],  // Violet 50
    tipBg: [236, 253, 245],
    tipAccent: [16, 185, 129],
    warningBg: [254, 243, 199],
    warningAccent: [217, 119, 6],
    exampleBg: [243, 232, 255],  // Purple 100
    exampleAccent: [168, 85, 247],// Purple 500
    promptBg: [236, 254, 255],
    promptAccent: [6, 182, 212],
    quoteBg: [255, 251, 235],
    quoteBorder: [245, 158, 11],
  },
} as const;

type ThemeKey = keyof typeof THEMES;
type ColorArray = readonly [number, number, number];

// ─── PDF Configuration ────────────────────────────────────────────────────────
const PAGE_WIDTH = 210;  // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN_LEFT = 25;
const MARGIN_RIGHT = 25;
const MARGIN_TOP = 30;
const MARGIN_BOTTOM = 25;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const MAX_Y = PAGE_HEIGHT - MARGIN_BOTTOM;

// Font sizes
const FONT_SIZES = {
  title: 28,
  chapter: 20,
  h1: 16,
  h2: 14,
  h3: 12,
  body: 11,
  small: 9,
};

// Line heights (multiplier)
const LINE_HEIGHT = 1.4;

// ─── Helper Functions ─────────────────────────────────────────────────────────

function setColor(doc: jsPDF, color: ColorArray): void {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setFillColor(doc: jsPDF, color: ColorArray): void {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setDrawColor(doc: jsPDF, color: ColorArray): void {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function checkPageBreak(doc: jsPDF, y: number, needed: number, theme: typeof THEMES[ThemeKey]): number {
  if (y + needed > MAX_Y) {
    doc.addPage();
    // Add subtle footer/page number
    doc.setFontSize(8);
    setColor(doc, theme.muted);
    return MARGIN_TOP;
  }
  return y;
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

// ─── Block Renderers ──────────────────────────────────────────────────────────

function renderChapter(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  y = checkPageBreak(doc, y, 30, theme);
  
  // Background rectangle
  setFillColor(doc, theme.chapterBg);
  doc.rect(MARGIN_LEFT - 5, y - 5, CONTENT_WIDTH + 10, 25, 'F');
  
  // Chapter text
  doc.setFontSize(FONT_SIZES.chapter);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.chapter);
  doc.text(block.text, MARGIN_LEFT, y + 10);
  
  return y + 35;
}

function renderHeading(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey], level: 1 | 2 | 3): number {
  const size = level === 1 ? FONT_SIZES.h1 : level === 2 ? FONT_SIZES.h2 : FONT_SIZES.h3;
  const spacing = level === 1 ? 20 : level === 2 ? 16 : 12;
  
  y = checkPageBreak(doc, y, spacing, theme);
  
  doc.setFontSize(size);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.primary);
  
  const lines = wrapText(doc, block.text, CONTENT_WIDTH);
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT, y + (i * size * LINE_HEIGHT * 0.35));
  });
  
  return y + (lines.length * size * LINE_HEIGHT * 0.35) + 8;
}

function renderParagraph(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, theme.text);
  
  const lines = wrapText(doc, block.text, CONTENT_WIDTH);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  
  lines.forEach((line, i) => {
    const currentY = y + (i * lineHeight);
    if (currentY > MAX_Y) {
      doc.addPage();
      y = MARGIN_TOP - (i * lineHeight);
    }
  });
  
  y = checkPageBreak(doc, y, lines.length * lineHeight + 4, theme);
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT, y + (i * lineHeight));
  });
  
  return y + (lines.length * lineHeight) + 6;
}

function renderBullet(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  y = checkPageBreak(doc, y, 15, theme);
  
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, theme.text);
  
  // Bullet point (filled circle)
  setFillColor(doc, theme.accent);
  doc.circle(MARGIN_LEFT + 2, y - 1.5, 1.5, 'F');
  
  const lines = wrapText(doc, block.text, CONTENT_WIDTH - 12);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT + 10, y + (i * lineHeight));
  });
  
  return y + (lines.length * lineHeight) + 4;
}

function renderNumbered(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  y = checkPageBreak(doc, y, 15, theme);
  
  const num = block.number || '1';
  
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.accent);
  doc.text(`${num}.`, MARGIN_LEFT, y);
  
  doc.setFont('helvetica', 'normal');
  setColor(doc, theme.text);
  
  const lines = wrapText(doc, block.text, CONTENT_WIDTH - 12);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT + 10, y + (i * lineHeight));
  });
  
  return y + (lines.length * lineHeight) + 4;
}

function renderQuote(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  const lines = wrapText(doc, block.text, CONTENT_WIDTH - 20);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  const boxHeight = (lines.length * lineHeight) + 12;
  
  y = checkPageBreak(doc, y, boxHeight + 10, theme);
  
  // Background
  setFillColor(doc, theme.quoteBg);
  doc.rect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, boxHeight, 'F');
  
  // Left accent bar
  setFillColor(doc, theme.quoteBorder);
  doc.rect(MARGIN_LEFT, y - 5, 4, boxHeight, 'F');
  
  // Quote text (italic)
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'italic');
  setColor(doc, theme.muted);
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT + 12, y + 3 + (i * lineHeight));
  });
  
  return y + boxHeight + 8;
}

function renderCallout(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey], type: 'callout' | 'tip' | 'warning' | 'example'): number {
  const lines = wrapText(doc, block.text, CONTENT_WIDTH - 20);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  const boxHeight = Math.max((lines.length * lineHeight) + 16, 24);
  
  y = checkPageBreak(doc, y, boxHeight + 10, theme);
  
  // Get colors based on type
  let bgColor: ColorArray, accentColor: ColorArray, label: string;
  switch (type) {
    case 'tip':
      bgColor = theme.tipBg;
      accentColor = theme.tipAccent;
      label = '💡 TIP';
      break;
    case 'warning':
      bgColor = theme.warningBg;
      accentColor = theme.warningAccent;
      label = '⚠️ NOTE';
      break;
    case 'example':
      bgColor = theme.exampleBg;
      accentColor = theme.exampleAccent;
      label = '📌 EXAMPLE';
      break;
    default:
      bgColor = theme.calloutBg;
      accentColor = theme.primary;
      label = '✨ KEY POINT';
  }
  
  // Background
  setFillColor(doc, bgColor);
  doc.roundedRect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, boxHeight, 3, 3, 'F');
  
  // Left accent bar
  setFillColor(doc, accentColor);
  doc.rect(MARGIN_LEFT, y - 5, 4, boxHeight, 'F');
  
  // Label
  doc.setFontSize(FONT_SIZES.small);
  doc.setFont('helvetica', 'bold');
  setColor(doc, accentColor);
  doc.text(label, MARGIN_LEFT + 10, y + 2);
  
  // Content
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, theme.text);
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT + 10, y + 10 + (i * lineHeight));
  });
  
  return y + boxHeight + 8;
}

function renderPrompt(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  const lines = wrapText(doc, block.text, CONTENT_WIDTH - 20);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  const boxHeight = Math.max((lines.length * lineHeight) + 20, 28);
  
  y = checkPageBreak(doc, y, boxHeight + 10, theme);
  
  // Background
  setFillColor(doc, theme.promptBg);
  doc.roundedRect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, boxHeight, 3, 3, 'F');
  
  // Border
  setDrawColor(doc, theme.promptAccent);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, boxHeight, 3, 3, 'S');
  
  // Label
  doc.setFontSize(FONT_SIZES.small);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.promptAccent);
  doc.text('💬 PROMPT', MARGIN_LEFT + 8, y + 3);
  
  // Content (monospace-like)
  doc.setFontSize(FONT_SIZES.body - 1);
  doc.setFont('courier', 'normal');
  setColor(doc, theme.text);
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT + 8, y + 12 + (i * lineHeight));
  });
  
  return y + boxHeight + 8;
}

function renderHighlight(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  const lines = wrapText(doc, block.text, CONTENT_WIDTH - 16);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  const boxHeight = (lines.length * lineHeight) + 12;
  
  y = checkPageBreak(doc, y, boxHeight + 10, theme);
  
  // Light highlight background
  setFillColor(doc, [255, 251, 235]); // Amber 50
  doc.rect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, boxHeight, 'F');
  
  // Left accent
  setFillColor(doc, theme.accent);
  doc.rect(MARGIN_LEFT, y - 5, 3, boxHeight, 'F');
  
  // Content (bold)
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.text);
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT + 10, y + 3 + (i * lineHeight));
  });
  
  return y + boxHeight + 6;
}

function renderSubheading(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  y = checkPageBreak(doc, y, 16, theme);
  
  doc.setFontSize(FONT_SIZES.h3);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.secondary);
  
  doc.text(block.text, MARGIN_LEFT, y);
  
  return y + 10;
}

function renderDefinition(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  y = checkPageBreak(doc, y, 18, theme);
  
  // Try to parse term:definition from text
  const colonIdx = block.text.indexOf(':');
  const term = colonIdx > 0 ? block.text.slice(0, colonIdx).trim() : '';
  const def = colonIdx > 0 ? block.text.slice(colonIdx + 1).trim() : block.text;
  
  // Term (bold)
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.primary);
  doc.text(`${term}:`, MARGIN_LEFT, y);
  
  const termWidth = doc.getTextWidth(`${term}: `);
  
  // Definition
  doc.setFont('helvetica', 'normal');
  setColor(doc, theme.text);
  
  const lines = wrapText(doc, def, CONTENT_WIDTH - termWidth - 5);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  
  lines.forEach((line, i) => {
    if (i === 0) {
      doc.text(line, MARGIN_LEFT + termWidth + 2, y);
    } else {
      doc.text(line, MARGIN_LEFT, y + (i * lineHeight));
    }
  });
  
  return y + (Math.max(1, lines.length) * lineHeight) + 6;
}

function renderActionTask(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  const lines = wrapText(doc, block.text, CONTENT_WIDTH - 20);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  const boxHeight = (lines.length * lineHeight) + 16;
  
  y = checkPageBreak(doc, y, boxHeight + 10, theme);
  
  // Background (gold tint)
  setFillColor(doc, [255, 251, 235]);
  doc.roundedRect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, boxHeight, 3, 3, 'F');
  
  // Border
  setDrawColor(doc, theme.accent);
  doc.setLineWidth(1);
  doc.roundedRect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, boxHeight, 3, 3, 'S');
  
  // Label
  doc.setFontSize(FONT_SIZES.small);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.accent);
  doc.text('🎯 ACTION', MARGIN_LEFT + 8, y + 3);
  
  // Content
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, theme.text);
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT + 8, y + 12 + (i * lineHeight));
  });
  
  return y + boxHeight + 8;
}

function renderDivider(doc: jsPDF, y: number, theme: typeof THEMES[ThemeKey]): number {
  y = checkPageBreak(doc, y, 15, theme);
  
  setDrawColor(doc, theme.secondary);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT + 40, y, PAGE_WIDTH - MARGIN_RIGHT - 40, y);
  
  return y + 12;
}

function renderIntroList(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  y = checkPageBreak(doc, y, 15, theme);
  
  doc.setFontSize(FONT_SIZES.body);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.primary);
  
  const lines = wrapText(doc, block.text + ':', CONTENT_WIDTH);
  const lineHeight = FONT_SIZES.body * LINE_HEIGHT * 0.35;
  
  lines.forEach((line, i) => {
    doc.text(line, MARGIN_LEFT, y + (i * lineHeight));
  });
  
  return y + (lines.length * lineHeight) + 4;
}

// ─── Main Block Renderer ──────────────────────────────────────────────────────

function renderBlock(doc: jsPDF, block: Block, y: number, theme: typeof THEMES[ThemeKey]): number {
  switch (block.type) {
    case 'chapter':
      return renderChapter(doc, block, y, theme);
    case 'h1':
      return renderHeading(doc, block, y, theme, 1);
    case 'h2':
      return renderHeading(doc, block, y, theme, 2);
    case 'h3':
    case 'subheading':
      return block.type === 'subheading' 
        ? renderSubheading(doc, block, y, theme)
        : renderHeading(doc, block, y, theme, 3);
    case 'paragraph':
      return renderParagraph(doc, block, y, theme);
    case 'bullet':
      return renderBullet(doc, block, y, theme);
    case 'numbered':
    case 'step_item':
      return renderNumbered(doc, block, y, theme);
    case 'quote':
      return renderQuote(doc, block, y, theme);
    case 'callout':
    case 'highlight':
    case 'benefit':
      return block.type === 'highlight' 
        ? renderHighlight(doc, block, y, theme)
        : renderCallout(doc, block, y, theme, 'callout');
    case 'tip':
      return renderCallout(doc, block, y, theme, 'tip');
    case 'warning':
      return renderCallout(doc, block, y, theme, 'warning');
    case 'example':
      return renderCallout(doc, block, y, theme, 'example');
    case 'prompt':
    case 'prompt_text':
      return renderPrompt(doc, block, y, theme);
    case 'action_task':
    case 'goal':
      return renderActionTask(doc, block, y, theme);
    case 'definition':
      return renderDefinition(doc, block, y, theme);
    case 'intro_list':
      return renderIntroList(doc, block, y, theme);
    case 'divider':
      return renderDivider(doc, y, theme);
    case 'emphasis':
      return renderHighlight(doc, block, y, theme);
    default:
      return renderParagraph(doc, block, y, theme);
  }
}

// ─── Title Page ───────────────────────────────────────────────────────────────

function renderTitlePage(doc: jsPDF, title: string, theme: typeof THEMES[ThemeKey]): void {
  // Background gradient simulation (solid color for simplicity)
  setFillColor(doc, theme.chapterBg);
  doc.rect(0, 80, PAGE_WIDTH, 80, 'F');
  
  // Title
  doc.setFontSize(FONT_SIZES.title);
  doc.setFont('helvetica', 'bold');
  setColor(doc, theme.chapter);
  
  const titleLines = wrapText(doc, title, CONTENT_WIDTH);
  const titleY = 110;
  
  titleLines.forEach((line, i) => {
    const lineWidth = doc.getTextWidth(line);
    doc.text(line, (PAGE_WIDTH - lineWidth) / 2, titleY + (i * 14));
  });
  
  // Decorative line
  setFillColor(doc, theme.accent);
  const lineY = titleY + (titleLines.length * 14) + 10;
  doc.rect((PAGE_WIDTH - 60) / 2, lineY, 60, 2, 'F');
  
  // Subtitle / branding
  doc.setFontSize(FONT_SIZES.small);
  doc.setFont('helvetica', 'normal');
  setColor(doc, theme.muted);
  const brandText = 'Created with CreatorLab.ink';
  const brandWidth = doc.getTextWidth(brandText);
  doc.text(brandText, (PAGE_WIDTH - brandWidth) / 2, PAGE_HEIGHT - 30);
}

// ─── Section Header Renderer ──────────────────────────────────────────────────

function renderSectionHeader(doc: jsPDF, section: ParsedSection, y: number, theme: typeof THEMES[ThemeKey]): number {
  if (section.isChapter) {
    // Render as chapter header
    y = checkPageBreak(doc, y, 35, theme);
    
    // Background rectangle
    setFillColor(doc, theme.chapterBg);
    doc.rect(MARGIN_LEFT - 5, y - 5, CONTENT_WIDTH + 10, 30, 'F');
    
    // Chapter label
    if (section.chapterNum) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      setColor(doc, theme.accent);
      doc.text(`CHAPTER ${section.chapterNum}`, MARGIN_LEFT, y + 4);
    }
    
    // Chapter title
    doc.setFontSize(FONT_SIZES.chapter);
    doc.setFont('helvetica', 'bold');
    setColor(doc, theme.chapter);
    const lines = wrapText(doc, section.heading, CONTENT_WIDTH);
    const titleY = section.chapterNum ? y + 14 : y + 10;
    lines.forEach((line, i) => {
      doc.text(line, MARGIN_LEFT, titleY + (i * 8));
    });
    
    // Accent bar
    const barY = titleY + (lines.length * 8) + 4;
    setFillColor(doc, theme.accent);
    doc.rect(MARGIN_LEFT, barY, 50, 2, 'F');
    
    return barY + 12;
  } else {
    // Render as h2 heading
    y = checkPageBreak(doc, y, 16, theme);
    
    doc.setFontSize(FONT_SIZES.h2);
    doc.setFont('helvetica', 'bold');
    setColor(doc, theme.primary);
    
    const lines = wrapText(doc, section.heading, CONTENT_WIDTH);
    lines.forEach((line, i) => {
      doc.text(line, MARGIN_LEFT, y + (i * FONT_SIZES.h2 * LINE_HEIGHT * 0.35));
    });
    
    // Underline accent
    const underlineY = y + (lines.length * FONT_SIZES.h2 * LINE_HEIGHT * 0.35) + 2;
    setDrawColor(doc, theme.accent);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_LEFT, underlineY, MARGIN_LEFT + 40, underlineY);
    
    return underlineY + 8;
  }
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generatePDF(parsed: ParsedEbook, template: ThemeKey = 'minimal'): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const theme = THEMES[template] || THEMES.minimal;
  
  // Title page
  renderTitlePage(doc, parsed.title, theme);
  
  // Content pages
  doc.addPage();
  let y = MARGIN_TOP;
  
  // Render sections
  parsed.sections.forEach((section: ParsedSection, sectionIndex: number) => {
    // Render section header (chapter or h2)
    if (section.heading && (section.isChapter || sectionIndex > 0 || section.blocks.length > 0)) {
      y = renderSectionHeader(doc, section, y, theme);
    }
    
    // Render blocks within section
    section.blocks.forEach((block: Block) => {
      y = renderBlock(doc, block, y, theme);
    });
    y += 4; // Section spacing
  });
  
  // Page numbers (simple)
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    setColor(doc, theme.muted);
    doc.text(`${i - 1}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
  }
  
  return doc;
}

/**
 * Generate PDF and return as Blob
 */
export function generatePDFBlob(parsed: ParsedEbook, template: ThemeKey = 'minimal'): Blob {
  const doc = generatePDF(parsed, template);
  return doc.output('blob');
}
