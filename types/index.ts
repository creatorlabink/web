// Creatorlab – Shared TypeScript types

export interface User {
  id: string;
  email: string;
  name?: string;
  plan?: 'free' | 'lifetime' | 'annual';
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Ebook {
  id: string;
  user_id: string;
  title: string;
  raw_text?: string;
  formatted_json?: Record<string, unknown> | null;
  template: 'minimal' | 'workbook' | 'business';
  ai_applied?: boolean;
  ai_source?: 'manual' | 'heuristic' | 'openai' | 'openai_or_heuristic' | string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  error: string;
}

// ─── Text Parser types (mirrors backend utils/textParser.ts) ─────────────────
export type BlockType = 
  | 'chapter'       // Major chapter heading (navy banner)
  | 'h1'           // Section heading
  | 'h2'           // Subsection heading  
  | 'h3'           // Minor heading
  | 'paragraph'    // Body text
  | 'bullet'       // Bullet list item (teal box)
  | 'numbered'     // Numbered list item
  | 'quote'        // Pull quote (gold border, cream bg)
  | 'callout'      // Important message (navy callout box)
  | 'prompt'       // ChatGPT prompt (teal border, light green bg)
  | 'action_task'  // Action task heading (gold box)
  | 'goal'         // Goal section (navy callout)
  | 'divider'      // Horizontal rule
  | 'prompt_text'  // Text inside a prompt block
  // NEW intelligent block types
  | 'subheading'   // Bold standalone line within content (short, no period)
  | 'highlight'    // Key insight or important statement
  | 'tip'          // Helpful tip (green accent)
  | 'warning'      // Caution/warning (red accent)
  | 'example'      // Example content (purple accent)
  | 'benefit'      // Benefit/feature item (blue check)
  | 'definition'   // Term: Definition format
  | 'intro_list'   // Introduces a list (ends with ":")
  | 'emphasis'     // Emphasized text (italic + color)
  | 'step_item';   // Step in a process

export interface Block {
  type: BlockType;
  text: string;
  number?: string;
  chapterNum?: number;
}

export interface ParsedSection {
  heading: string;
  blocks: Block[];
  isChapter?: boolean;
  chapterNum?: number;
}

export interface ParsedEbook {
  title: string;
  sections: ParsedSection[];
}

export interface AiFormatResponse {
  parsed: ParsedEbook;
  formatted_text: string;
  ai_applied: boolean;
  ai_source: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export interface PaymentStatus {
  plan: 'free' | 'lifetime' | 'annual';
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

export interface IntegrationStatus {
  provider: string;
  connected: boolean;
  account?: {
    id?: string | null;
    username?: string | null;
  } | null;
  expires_at?: string | null;
  scopes?: string | null;
}

export interface IntegrationConnectUrl {
  provider: string;
  url: string;
  state: string;
}

export interface CelebioPublishResponse {
  success: boolean;
  provider: string;
  import_id?: string | null;
  product_id?: string | null;
  status?: string;
  edit_url?: string | null;
}

// Phase 4 placeholder
export interface AiFormattedEbook {
  title: string;
  chapters: {
    heading: string;
    body: string;
  }[];
}
