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

export interface AdminEmailTemplate {
  key: string;
  name: string;
  description: string;
  category: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  plan: 'free' | 'lifetime' | 'annual';
  created_at?: string;
  updated_at?: string;
  ebook_count?: number;
  payment_count?: number;
  total_spent?: number;
  totalSpentFormatted?: string;
}

export interface AdminEmailMessage {
  id: string;
  direction: 'inbound' | 'outbound' | string;
  template_key: string;
  sender_email: string;
  recipient_email: string;
  subject: string;
  status: string;
  created_at: string;
}

// ─── Admin Dashboard Types ────────────────────────────────────────────────────

export interface AdminDashboardOverview {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalEbooks: number;
  ebooksThisWeek: number;
  activeUsers7d: number;
}

export interface AdminDashboardRevenue {
  totalRevenueCents: number;
  totalRevenueFormatted: string;
  thisMonthCents: number;
  thisMonthFormatted: string;
  lastMonthCents: number;
  growthPercent: number;
}

export interface AdminConversionStats {
  totalUsers: number;
  paidUsers: number;
  lifetimeUsers: number;
  annualUsers: number;
  conversionRatePercent: number;
}

export interface AdminPlanBreakdown {
  plan: string;
  count: number;
}

export interface AdminRecentPayment {
  id: string;
  userEmail: string;
  userName: string | null;
  amount: number;
  amountFormatted: string;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  overview: AdminDashboardOverview;
  revenue: AdminDashboardRevenue;
  conversion: AdminConversionStats;
  planBreakdown: AdminPlanBreakdown[];
  topTemplates: { template: string; usage_count: number }[];
  recentPayments: AdminRecentPayment[];
}

export interface AdminUserDetails {
  user: AdminUser;
  ebooks: {
    id: string;
    title: string;
    template: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  payments: {
    id: string;
    stripe_session_id: string;
    amount: number;
    amountFormatted: string;
    currency: string;
    status: string;
    created_at: string;
  }[];
  totalSpentCents: number;
  totalSpentFormatted: string;
  events: {
    id: string;
    event_name: string;
    ebook_id: string | null;
    template: string | null;
    source: string | null;
    created_at: string;
  }[];
  socialIdentities: {
    provider: string;
    provider_user_id: string;
    email: string | null;
    created_at: string;
  }[];
  auditLogs: {
    id: string;
    actor_email: string;
    action: string;
    payload_json: Record<string, unknown>;
    created_at: string;
  }[];
  stats: {
    ebookCount: number;
    paymentCount: number;
    eventCount: number;
  };
}

export interface AdminRevenueMonthly {
  month: string;
  revenueCents: number;
  revenueFormatted: string;
  transactionCount: number;
}

export interface AdminTopCustomer {
  id: string;
  email: string;
  name: string | null;
  transactionCount: number;
  totalSpentCents: number;
  totalSpentFormatted: string;
}

export interface AdminRevenueStats {
  totals: {
    totalRevenueCents: number;
    totalRevenueFormatted: string;
    avgTransactionCents: number;
    avgTransactionFormatted: string;
    refundCount: number;
    refundTotalCents: number;
    refundTotalFormatted: string;
  };
  monthly: AdminRevenueMonthly[];
  recentTransactions: AdminRecentPayment[];
  topCustomers: AdminTopCustomer[];
}

export interface AdminAnalyticsFunnel {
  pageViews: number;
  ctaClicks: number;
  signups: number;
  ebookCreated: number;
  downloads: number;
  payments: number;
  ctaToSignupRate: number | string;
  signupToEbookRate: number | string;
  signupToPaymentRate: number | string;
}

export interface AdminAnalyticsDashboard {
  eventCounts: {
    total_events: number;
    events_7d: number;
    events_30d: number;
  };
  funnel: AdminAnalyticsFunnel;
  dailySignups: { date: string; signups: number }[];
  templateUsage: { template: string; count: number }[];
  aiUsage: { ai_used: number; manual: number };
  topEvents: { event_name: string; count: number }[];
  eventsByDay: { date: string; event_count: number }[];
}

export interface AdminEbook {
  id: string;
  title: string;
  template: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  ai_applied: boolean;
}

export interface AdminAuditLog {
  id: string;
  actor_user_id: string | null;
  actor_email: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  payload_json: Record<string, unknown>;
  created_at: string;
}

export interface AdminSystemStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database: {
    latencyMs: number;
    sizeBytes: number;
    sizeFormatted: string;
  };
  tableStats: { table_name: string; row_count: number }[];
  server: {
    nodeVersion: string;
    uptime: number;
    memoryUsage: {
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
  };
}

export interface AdminPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

// Phase 4 placeholder
export interface AiFormattedEbook {
  title: string;
  chapters: {
    heading: string;
    body: string;
  }[];
}
