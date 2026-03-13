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

// Phase 4 placeholder
export interface AiFormattedEbook {
  title: string;
  chapters: {
    heading: string;
    body: string;
  }[];
}
