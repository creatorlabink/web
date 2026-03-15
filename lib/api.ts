/**
 * API Client – centralised axios instance for connecting to the
 * Creatorlab Express backend.
 */
import axios from 'axios';
import Cookies from 'js-cookie';
import { parseText } from '@/lib/textParser';
import { generatePDFBlob } from '@/lib/pdfGenerator';
import { generateEPUBBlob } from '@/lib/epubGenerator';
import type {
  AiFormatResponse,
  Ebook,
  User,
  ParsedEbook,
  IntegrationStatus,
  IntegrationConnectUrl,
  CelebioPublishResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const LOCAL_MODE = process.env.NEXT_PUBLIC_LOCAL_MODE === 'true';

const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@creatorlab.io',
  name: 'Creatorlab Demo',
  plan: 'lifetime',
};

const DEMO_PASSWORD = 'creator123';
const DEMO_TOKEN = 'local-demo-token';
const EBOOKS_KEY = 'creatorlab_local_ebooks';
const CELEBIO_KEY = 'creatorlab_celebio_connection';
const GUMROAD_KEY = 'creatorlab_gumroad_connection';
const CONVERTKIT_KEY = 'creatorlab_convertkit_connection';
const ZAPIER_KEY = 'creatorlab_zapier_connection';

type LocalResponse<T> = Promise<{ data: T }>;

function localOk<T>(data: T): LocalResponse<T> {
  return Promise.resolve({ data });
}

function localErr(message: string): never {
  const error = {
    response: {
      data: { error: message },
      status: 400,
    },
  };
  throw error;
}

function readLocalEbooks(): Ebook[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(EBOOKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Ebook[];
  } catch {
    return [];
  }
}

function writeLocalEbooks(ebooks: Ebook[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(EBOOKS_KEY, JSON.stringify(ebooks));
}

function getLocalCelebioStatus(): IntegrationStatus {
  if (typeof window === 'undefined') {
    return { provider: 'celebio', connected: false };
  }

  const raw = window.localStorage.getItem(CELEBIO_KEY);
  if (!raw) {
    return { provider: 'celebio', connected: false };
  }

  try {
    const parsed = JSON.parse(raw) as { connected?: boolean; account?: { username?: string } };
    return {
      provider: 'celebio',
      connected: Boolean(parsed.connected),
      account: parsed.account ? { username: parsed.account.username || 'creator' } : { username: 'creator' },
      scopes: 'products.write files.write products.read',
    };
  } catch {
    return { provider: 'celebio', connected: false };
  }
}

function getLocalIntegrationStatus(provider: string, storageKey: string): IntegrationStatus {
  if (typeof window === 'undefined') {
    return { provider, connected: false };
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return { provider, connected: false };
  }

  try {
    const parsed = JSON.parse(raw) as { connected?: boolean; account?: { username?: string } };
    return {
      provider,
      connected: Boolean(parsed.connected),
      account: parsed.account ? { username: parsed.account.username || provider } : { username: provider },
    };
  } catch {
    return { provider, connected: false };
  }
}

interface EbookUpsertPayload {
  title: string;
  raw_text: string;
  template: Ebook['template'];
  apply_ai?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from cookie on every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('cl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('cl_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (email: string, password: string, name?: string) => {
    if (!LOCAL_MODE) return api.post('/auth/signup', { email, password, name });
    const user: User = {
      ...DEMO_USER,
      name: name || DEMO_USER.name,
      email: email || DEMO_USER.email,
    };
    return localOk({ token: DEMO_TOKEN, user });
  },
  login: (email: string, password: string) => {
    if (!LOCAL_MODE) return api.post('/auth/login', { email, password });
    if (email.toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) {
      localErr('Demo login failed. Use demo@creatorlab.io / creator123');
    }
    return localOk({ token: DEMO_TOKEN, user: DEMO_USER });
  },
  getMe: () => {
    if (!LOCAL_MODE) return api.get('/auth/me');
    const token = Cookies.get('cl_token');
    if (!token) localErr('Unauthorized');
    return localOk({ user: DEMO_USER });
  },
  oauthConnectUrl: (provider: 'google' | 'tiktok', intent: 'login' | 'signup') => {
    if (!LOCAL_MODE) return api.get(`/auth/oauth/${provider}/connect-url`, { params: { intent } });
    return localOk({
      provider,
      intent,
      state: `local-${provider}-${intent}`,
      url: `/auth/oauth/callback?provider=${provider}&code=local-code&state=local-${provider}-${intent}`,
    });
  },
  oauthExchangeCode: (provider: 'google' | 'tiktok', code: string, state: string) => {
    if (!LOCAL_MODE) return api.post(`/auth/oauth/${provider}/exchange`, { code, state });
    return localOk({
      token: DEMO_TOKEN,
      user: {
        ...DEMO_USER,
        email: provider === 'google' ? 'google.demo@creatorlab.io' : 'tiktok.demo@creatorlab.io',
        name: provider === 'google' ? 'Google Creator' : 'TikTok Creator',
      },
      provider,
    });
  },
};

// ─── Ebooks ───────────────────────────────────────────────────────────────────
export const ebooksApi = {
  list: () => {
    if (!LOCAL_MODE) return api.get('/ebooks');
    return localOk({ ebooks: readLocalEbooks() });
  },
  get: (id: string) => {
    if (!LOCAL_MODE) return api.get(`/ebooks/${id}`);
    const ebook = readLocalEbooks().find((item) => item.id === id);
    if (!ebook) localErr('Ebook not found');
    return localOk({ ebook });
  },
  create: (payload: EbookUpsertPayload) => {
    if (!LOCAL_MODE) return api.post('/ebooks', payload);
    const now = new Date().toISOString();
    const parsed = payload.apply_ai ? parseText(payload.raw_text, payload.title) : parseText(payload.raw_text, payload.title);
    const ebook: Ebook = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}`,
      user_id: DEMO_USER.id,
      title: payload.title,
      raw_text: payload.raw_text,
      formatted_json: {
        title: parsed.title,
        sections: parsed.sections,
        ai_applied: Boolean(payload.apply_ai),
        ai_source: payload.apply_ai ? 'heuristic' : 'manual',
      },
      template: payload.template,
      ai_applied: Boolean(payload.apply_ai),
      ai_source: payload.apply_ai ? 'heuristic' : 'manual',
      status: 'draft',
      created_at: now,
      updated_at: now,
    };
    const next = [ebook, ...readLocalEbooks()];
    writeLocalEbooks(next);
    return localOk({ ebook });
  },
  update: (id: string, data: Partial<EbookUpsertPayload>) => {
    if (!LOCAL_MODE) return api.put(`/ebooks/${id}`, data);
    const items = readLocalEbooks();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) localErr('Ebook not found');
    const nextTitle = data.title ?? items[index].title;
    const nextRaw = data.raw_text ?? (items[index].raw_text || '');
    const parsed = parseText(nextRaw, nextTitle);
    const aiApplied = Boolean(data.apply_ai ?? items[index].ai_applied);
    const updated: Ebook = {
      ...items[index],
      ...data,
      template: (data.template as Ebook['template']) || items[index].template,
      formatted_json: {
        title: parsed.title,
        sections: parsed.sections,
        ai_applied: aiApplied,
        ai_source: aiApplied ? 'heuristic' : 'manual',
      },
      ai_applied: aiApplied,
      ai_source: aiApplied ? 'heuristic' : 'manual',
      updated_at: new Date().toISOString(),
    };
    items[index] = updated;
    writeLocalEbooks(items);
    return localOk({ ebook: updated });
  },
  delete: (id: string) => {
    if (!LOCAL_MODE) return api.delete(`/ebooks/${id}`);
    const next = readLocalEbooks().filter((item) => item.id !== id);
    writeLocalEbooks(next);
    return localOk({ message: 'Ebook deleted' });
  },
};

// ─── PDF Export ───────────────────────────────────────────────────────────────
export const pdfApi = {
  export: async (ebookId: string) => {
    if (LOCAL_MODE) {
      const ebook = readLocalEbooks().find((item) => item.id === ebookId);
      if (!ebook) localErr('Ebook not found');
      // Parse the ebook content
      const parsed: ParsedEbook = parseText(ebook.raw_text || '', ebook.title);
      // Generate real PDF using jsPDF
      const template = ebook.template || 'minimal';
      return generatePDFBlob(parsed, template);
    }
    const response = await api.post(`/pdf/export/${ebookId}`, {}, { responseType: 'blob' });
    return response.data as Blob;
  },
  preview: (ebookId: string) => {
    if (!LOCAL_MODE) return api.get(`/pdf/preview/${ebookId}`);
    const ebook = readLocalEbooks().find((item) => item.id === ebookId);
    if (!ebook) localErr('Ebook not found');
    const parsed = parseText(ebook.raw_text || '', ebook.title);
    return localOk({ parsed, template: ebook.template, ai_applied: Boolean(ebook.ai_applied), ai_source: ebook.ai_source || 'manual' });
  },
};

// ─── EPUB Export ──────────────────────────────────────────────────────────────
export const epubApi = {
  export: async (ebookId: string) => {
    if (LOCAL_MODE) {
      const ebook = readLocalEbooks().find((item) => item.id === ebookId);
      if (!ebook) localErr('Ebook not found');
      const parsed: ParsedEbook = parseText(ebook.raw_text || '', ebook.title);
      return generateEPUBBlob(parsed);
    }

    try {
      const response = await api.post(`/epub/export/${ebookId}`, {}, { responseType: 'blob' });
      return response.data as Blob;
    } catch {
      const ebookResponse = await api.get(`/ebooks/${ebookId}`);
      const ebook = (ebookResponse.data as { ebook: Ebook }).ebook;
      const parsed: ParsedEbook = parseText(ebook?.raw_text || '', ebook?.title || 'Untitled Ebook');
      return generateEPUBBlob(parsed);
    }
  },
};

// ─── AI Formatting ────────────────────────────────────────────────────────────
export const aiApi = {
  format: (title: string, rawText: string) => {
    if (!LOCAL_MODE) return api.post('/ai/format', { title, raw_text: rawText });
    const parsed = parseText(rawText, title || 'Untitled Ebook');
    const formatted_text = [
      `# ${parsed.title}`,
      '',
      ...parsed.sections.flatMap((section) => [
        `## ${section.heading}`,
        ...section.blocks.map((block) => {
          if (block.type === 'h1') return `# ${block.text}`;
          if (block.type === 'h2') return `## ${block.text}`;
          if (block.type === 'h3') return `### ${block.text}`;
          if (block.type === 'bullet') return `- ${block.text}`;
          if (block.type === 'numbered') return `${block.number || '1.'} ${block.text}`;
          if (block.type === 'quote') return `> ${block.text}`;
          if (block.type === 'divider') return '---';
          return block.text;
        }),
        '',
      ]),
    ].join('\n').replace(/\n{3,}/g, '\n\n');

    const payload: AiFormatResponse = {
      parsed,
      formatted_text,
      ai_applied: true,
      ai_source: 'heuristic',
    };
    return localOk(payload);
  },
};

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsApi = {
  track: (eventName: string, payload?: Record<string, unknown>) => {
    if (!LOCAL_MODE) {
      return api.post('/analytics/event', {
        event_name: eventName,
        ...payload,
      });
    }
    return localOk({ ok: true, event_name: eventName });
  },
};

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentApi = {
  createCheckout: () => {
    if (!LOCAL_MODE) return api.post('/payment/checkout');
    return localOk({ url: '', sessionId: 'local-mode' });
  },
  getStatus: () => {
    if (!LOCAL_MODE) return api.get('/payment/status');
    return localOk({ plan: 'lifetime' as const });
  },
  verifySession: (sessionId: string) => {
    if (!LOCAL_MODE) return api.get(`/payment/verify?session_id=${sessionId}`);
    return localOk({ success: true, plan: 'lifetime', sessionId });
  },
};

// ─── Integrations (cele.bio) ────────────────────────────────────────────────
export const integrationsApi = {
  celebioStatus: () => {
    if (!LOCAL_MODE) return api.get('/integrations/celebio/status');
    return localOk(getLocalCelebioStatus());
  },
  celebioConnectUrl: () => {
    if (!LOCAL_MODE) return api.get('/integrations/celebio/connect-url');
    const payload: IntegrationConnectUrl = {
      provider: 'celebio',
      state: 'local-state',
      url: '/auth/integrations/celebio/callback?code=local-demo-code&state=local-state',
    };
    return localOk(payload);
  },
  celebioExchangeCode: (code: string, state: string) => {
    if (!LOCAL_MODE) return api.post('/integrations/celebio/exchange-code', { code, state });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        CELEBIO_KEY,
        JSON.stringify({ connected: true, account: { username: 'local-creator' }, state })
      );
    }
    return localOk({ success: true, provider: 'celebio' });
  },
  celebioDisconnect: () => {
    if (!LOCAL_MODE) return api.delete('/integrations/celebio/disconnect');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CELEBIO_KEY);
    }
    return localOk({ success: true, provider: 'celebio' });
  },
  celebioPublish: (ebookId: string, payload: Record<string, unknown>) => {
    if (!LOCAL_MODE) return api.post(`/integrations/celebio/publish/${ebookId}`, payload);

    const status = getLocalCelebioStatus();
    if (!status.connected) {
      localErr('Connect cele.bio before publishing.');
    }

    const data: CelebioPublishResponse = {
      success: true,
      provider: 'celebio',
      import_id: `local-import-${ebookId}`,
      product_id: `local-product-${ebookId}`,
      status: 'ready',
      edit_url: `https://cele.bio/dashboard/products/local-product-${ebookId}`,
    };

    return localOk(data);
  },
  gumroadStatus: () => {
    if (!LOCAL_MODE) return api.get('/integrations/gumroad/status');
    return localOk(getLocalIntegrationStatus('gumroad', GUMROAD_KEY));
  },
  gumroadConnectUrl: () => {
    if (!LOCAL_MODE) return api.get('/integrations/gumroad/connect-url');
    const payload: IntegrationConnectUrl = {
      provider: 'gumroad',
      state: 'local-gumroad-state',
      url: '/auth/integrations/gumroad/callback?code=local-demo-code&state=local-gumroad-state',
    };
    return localOk(payload);
  },
  gumroadExchangeCode: (code: string, state: string) => {
    if (!LOCAL_MODE) return api.post('/integrations/gumroad/exchange-code', { code, state });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        GUMROAD_KEY,
        JSON.stringify({ connected: true, account: { username: 'gumroad-seller' }, state })
      );
    }
    return localOk({ success: true, provider: 'gumroad' });
  },
  gumroadDisconnect: () => {
    if (!LOCAL_MODE) return api.delete('/integrations/gumroad/disconnect');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(GUMROAD_KEY);
    }
    return localOk({ success: true, provider: 'gumroad' });
  },
  gumroadPublish: (ebookId: string, payload: Record<string, unknown>) => {
    if (!LOCAL_MODE) return api.post(`/integrations/gumroad/publish/${ebookId}`, payload);
    const status = getLocalIntegrationStatus('gumroad', GUMROAD_KEY);
    if (!status.connected) {
      localErr('Connect Gumroad before publishing.');
    }
    return localOk({
      success: true,
      provider: 'gumroad',
      status: 'ready',
      product_id: `local-gumroad-${ebookId}`,
      edit_url: `https://gumroad.com/products/local-gumroad-${ebookId}/edit`,
    });
  },
  convertkitStatus: () => {
    if (!LOCAL_MODE) return api.get('/integrations/convertkit/status');
    return localOk(getLocalIntegrationStatus('convertkit', CONVERTKIT_KEY));
  },
  convertkitConnectUrl: () => {
    if (!LOCAL_MODE) return api.get('/integrations/convertkit/connect-url');
    const payload: IntegrationConnectUrl = {
      provider: 'convertkit',
      state: 'local-convertkit-state',
      url: '/auth/integrations/convertkit/callback?code=local-demo-code&state=local-convertkit-state',
    };
    return localOk(payload);
  },
  convertkitExchangeCode: (code: string, state: string) => {
    if (!LOCAL_MODE) return api.post('/integrations/convertkit/exchange-code', { code, state });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        CONVERTKIT_KEY,
        JSON.stringify({ connected: true, account: { username: 'convertkit-account' }, state })
      );
    }
    return localOk({ success: true, provider: 'convertkit' });
  },
  convertkitDisconnect: () => {
    if (!LOCAL_MODE) return api.delete('/integrations/convertkit/disconnect');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CONVERTKIT_KEY);
    }
    return localOk({ success: true, provider: 'convertkit' });
  },
  convertkitSync: (ebookId: string, payload: Record<string, unknown>) => {
    if (!LOCAL_MODE) return api.post(`/integrations/convertkit/sync/${ebookId}`, payload);
    const status = getLocalIntegrationStatus('convertkit', CONVERTKIT_KEY);
    if (!status.connected) {
      localErr('Connect ConvertKit before syncing.');
    }
    return localOk({ success: true, provider: 'convertkit', status: 'synced', sync_id: `local-convertkit-${ebookId}` });
  },
  zapierStatus: () => {
    if (!LOCAL_MODE) return api.get('/integrations/zapier/status');
    return localOk(getLocalIntegrationStatus('zapier', ZAPIER_KEY));
  },
  zapierConnect: (webhookUrl: string) => {
    if (!LOCAL_MODE) return api.post('/integrations/zapier/connect', { webhookUrl });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        ZAPIER_KEY,
        JSON.stringify({ connected: true, account: { username: webhookUrl ? 'webhook configured' : 'webhook' } })
      );
    }
    return localOk({ success: true, provider: 'zapier' });
  },
  zapierDisconnect: () => {
    if (!LOCAL_MODE) return api.delete('/integrations/zapier/disconnect');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ZAPIER_KEY);
    }
    return localOk({ success: true, provider: 'zapier' });
  },
  zapierTest: () => {
    if (!LOCAL_MODE) return api.post('/integrations/zapier/test');
    const status = getLocalIntegrationStatus('zapier', ZAPIER_KEY);
    if (!status.connected) {
      localErr('Connect Zapier before sending test events.');
    }
    return localOk({ success: true, provider: 'zapier', status: 'sent' });
  },
  zapierPublish: (ebookId: string, payload: Record<string, unknown>) => {
    if (!LOCAL_MODE) return api.post(`/integrations/zapier/publish/${ebookId}`, payload);
    const status = getLocalIntegrationStatus('zapier', ZAPIER_KEY);
    if (!status.connected) {
      localErr('Connect Zapier before sending publish events.');
    }
    return localOk({ success: true, provider: 'zapier', status: 'sent', event_id: `local-zapier-${ebookId}` });
  },
};

// ─── Admin Email System ─────────────────────────────────────────────────────
export const adminEmailApi = {
  listTemplates: () => {
    if (!LOCAL_MODE) return api.get('/admin/email/templates');
    return localOk({
      templates: [
        { key: 'account_verification', name: 'Account Verification', description: 'Verify account', category: 'auth' },
        { key: 'password_reset', name: 'Password Reset', description: 'Reset password', category: 'auth' },
        { key: 'ebook_export_ready', name: 'Ebook Export Ready', description: 'Export done', category: 'ebook' },
      ],
    });
  },
  renderTemplate: (templateKey: string, variables: Record<string, unknown>) => {
    if (!LOCAL_MODE) return api.post('/admin/email/render', { templateKey, variables });
    return localOk({
      templateKey,
      subject: `Preview: ${templateKey}`,
      html: `<div style=\"padding:20px;font-family:Arial\"><h2>${templateKey}</h2><pre>${JSON.stringify(variables, null, 2)}</pre></div>`,
      text: `Preview: ${templateKey}`,
    });
  },
  sendTemplate: (to: string, templateKey: string, variables: Record<string, unknown>) => {
    if (!LOCAL_MODE) return api.post('/admin/email/send-template', { to, templateKey, variables });
    return localOk({ success: true, id: 'local-template-email' });
  },
  sendCustom: (to: string, subject: string, html: string, text?: string) => {
    if (!LOCAL_MODE) return api.post('/admin/email/send-custom', { to, subject, html, text });
    return localOk({ success: true, id: 'local-custom-email' });
  },
  listMessages: (direction?: 'inbound' | 'outbound', limit = 50) => {
    if (!LOCAL_MODE) {
      return api.get('/admin/email/messages', {
        params: {
          direction,
          limit,
        },
      });
    }
    return localOk({ messages: [] });
  },
};

export default api;
