// CreatorLab.ink – Shared TypeScript types

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
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  error: string;
}

// ─── Text Parser types (mirrors backend utils/textParser.ts) ─────────────────
export type BlockType = 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'numbered' | 'quote' | 'callout' | 'divider';

export interface Block {
  type: BlockType;
  text: string;
  number?: string;
}

export interface ParsedSection {
  heading: string;
  blocks: Block[];
}

export interface ParsedEbook {
  title: string;
  sections: ParsedSection[];
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export interface PaymentStatus {
  plan: 'free' | 'lifetime' | 'annual';
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

// Phase 4 placeholder
export interface AiFormattedEbook {
  title: string;
  chapters: {
    heading: string;
    body: string;
  }[];
}
