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
  FeatureUsageStats,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const API_BASE_ROOT = API_BASE_URL.replace(/\/api\/?$/, '');
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

const apiRoot = axios.create({
  baseURL: API_BASE_ROOT,
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

apiRoot.interceptors.request.use((config) => {
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

apiRoot.interceptors.response.use(
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

async function withApiPrefixFallback<T>(
  requestWithApiPrefix: () => Promise<T>,
  requestWithoutApiPrefix: () => Promise<T>
): Promise<T> {
  try {
    return await requestWithApiPrefix();
  } catch (error: any) {
    const status = error?.response?.status;
    const hasNoHttpResponse = !error?.response;
    if ((status === 404 || hasNoHttpResponse) && API_BASE_ROOT !== API_BASE_URL) {
      return requestWithoutApiPrefix();
    }
    throw error;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (email: string, password: string, name?: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post('/auth/signup', { email, password, name }),
        () => apiRoot.post('/auth/signup', { email, password, name })
      );
    }
    const user: User = {
      ...DEMO_USER,
      name: name || DEMO_USER.name,
      email: email || DEMO_USER.email,
    };
    return localOk({ token: DEMO_TOKEN, user });
  },
  login: (email: string, password: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post('/auth/login', { email, password }),
        () => apiRoot.post('/auth/login', { email, password })
      );
    }
    if (email.toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) {
      localErr('Demo login failed. Use demo@creatorlab.io / creator123');
    }
    return localOk({ token: DEMO_TOKEN, user: DEMO_USER });
  },
  getMe: () => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/auth/me'),
        () => apiRoot.get('/auth/me')
      );
    }
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
  forgotPassword: (email: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post('/auth/forgot-password', { email }),
        () => apiRoot.post('/auth/forgot-password', { email })
      );
    }
    return localOk({ message: 'If an account exists for this email, a password reset link has been sent.' });
  },
  verifyResetToken: (token: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/auth/reset-password/verify', { params: { token } }),
        () => apiRoot.get('/auth/reset-password/verify', { params: { token } })
      );
    }
    if (!token) localErr('Invalid or expired reset link.');
    return localOk({ valid: true, email: 'de***@creatorlab.ink' });
  },
  resetPassword: (token: string, password: string, confirmPassword: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post('/auth/reset-password', { token, password, confirmPassword }),
        () => apiRoot.post('/auth/reset-password', { token, password, confirmPassword })
      );
    }
    if (!token) localErr('Invalid or expired reset link.');
    if (password.length < 8) localErr('Password must be at least 8 characters.');
    if (password !== confirmPassword) localErr('Passwords do not match.');
    return localOk({ message: 'Password reset successful. You can now log in with your new password.' });
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
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/email/templates'),
        () => apiRoot.get('/admin/email/templates')
      );
    }
    return localOk({
      templates: [
        { key: 'account_verification', name: 'Account Verification', description: 'Verify account', category: 'auth' },
        { key: 'password_reset', name: 'Password Reset', description: 'Reset password', category: 'auth' },
        { key: 'ebook_export_ready', name: 'Ebook Export Ready', description: 'Export done', category: 'ebook' },
      ],
    });
  },
  renderTemplate: (templateKey: string, variables: Record<string, unknown>) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post('/admin/email/render', { templateKey, variables }),
        () => apiRoot.post('/admin/email/render', { templateKey, variables })
      );
    }
    return localOk({
      templateKey,
      subject: `Preview: ${templateKey}`,
      html: `<div style=\"padding:20px;font-family:Arial\"><h2>${templateKey}</h2><pre>${JSON.stringify(variables, null, 2)}</pre></div>`,
      text: `Preview: ${templateKey}`,
    });
  },
  sendTemplate: (to: string, templateKey: string, variables: Record<string, unknown>) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post('/admin/email/send-template', { to, templateKey, variables }),
        () => apiRoot.post('/admin/email/send-template', { to, templateKey, variables })
      );
    }
    return localOk({ success: true, id: 'local-template-email' });
  },
  sendCustom: (to: string, subject: string, html: string, text?: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post('/admin/email/send-custom', { to, subject, html, text }),
        () => apiRoot.post('/admin/email/send-custom', { to, subject, html, text })
      );
    }
    return localOk({ success: true, id: 'local-custom-email' });
  },
  listMessages: (direction?: 'inbound' | 'outbound', limit = 50) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () =>
          api.get('/admin/email/messages', {
            params: {
              direction,
              limit,
            },
          }),
        () =>
          apiRoot.get('/admin/email/messages', {
            params: {
              direction,
              limit,
            },
          })
      );
    }
    return localOk({ messages: [] });
  },
};

export const adminUsersApi = {
  listUsers: (params?: { search?: string; plan?: string; sortBy?: string; sortOrder?: string; page?: number; limit?: number }) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/users', { params }),
        () => apiRoot.get('/admin/users', { params })
      );
    }

    return localOk({
      users: [
        {
          id: 'demo-user',
          email: 'demo@creatorlab.io',
          name: 'Creatorlab Demo',
          plan: 'lifetime',
          ebook_count: 3,
          payment_count: 1,
          total_spent: 1197,
          totalSpentFormatted: '$11.97',
        },
      ],
      pagination: { page: 1, limit: 25, totalCount: 1, totalPages: 1, hasMore: false },
    });
  },
  getUserDetails: (userId: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get(`/admin/users/${userId}`),
        () => apiRoot.get(`/admin/users/${userId}`)
      );
    }

    return localOk({
      user: { id: userId, email: 'demo@creatorlab.io', name: 'Demo User', plan: 'lifetime' },
      ebooks: [],
      payments: [],
      totalSpentCents: 0,
      totalSpentFormatted: '$0.00',
      events: [],
      socialIdentities: [],
      auditLogs: [],
      stats: { ebookCount: 0, paymentCount: 0, eventCount: 0 },
    });
  },
  updateUser: (userId: string, data: { name?: string; email?: string; plan?: string }) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.patch(`/admin/users/${userId}`, data),
        () => apiRoot.patch(`/admin/users/${userId}`, data)
      );
    }
    return localOk({ user: { id: userId, ...data } });
  },
  deleteUser: (userId: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.delete(`/admin/users/${userId}`),
        () => apiRoot.delete(`/admin/users/${userId}`)
      );
    }
    return localOk({ success: true, message: 'User deleted' });
  },
  resetPassword: (userId: string, newPassword: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post(`/admin/users/${userId}/reset-password`, { newPassword }),
        () => apiRoot.post(`/admin/users/${userId}/reset-password`, { newPassword })
      );
    }
    return localOk({ success: true, message: 'Password reset successfully' });
  },
  impersonate: (userId: string) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.post(`/admin/users/${userId}/impersonate`),
        () => apiRoot.post(`/admin/users/${userId}/impersonate`)
      );
    }
    return localOk({ success: true, token: 'demo-impersonation-token', user: { id: userId }, message: 'Impersonating user' });
  },
  updateUserPlan: (userId: string, plan: 'free' | 'lifetime' | 'annual') => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.patch(`/admin/users/${userId}/plan`, { plan }),
        () => apiRoot.patch(`/admin/users/${userId}/plan`, { plan })
      );
    }
    return localOk({ user: { id: userId, plan } });
  },
};

// ─── Admin Dashboard API ────────────────────────────────────────────────────
export const adminDashboardApi = {
  getStats: () => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/dashboard/stats'),
        () => apiRoot.get('/admin/dashboard/stats')
      );
    }
    return localOk({
      overview: { totalUsers: 1, newUsersToday: 0, newUsersThisWeek: 0, newUsersThisMonth: 1, totalEbooks: 2, ebooksThisWeek: 1, activeUsers7d: 1 },
      revenue: { totalRevenueCents: 1197, totalRevenueFormatted: '$11.97', thisMonthCents: 1197, thisMonthFormatted: '$11.97', lastMonthCents: 0, growthPercent: 100 },
      conversion: { totalUsers: 1, paidUsers: 1, lifetimeUsers: 1, annualUsers: 0, conversionRatePercent: 100 },
      planBreakdown: [{ plan: 'lifetime', count: 1 }],
      topTemplates: [{ template: 'minimal', usage_count: 2 }],
      recentPayments: [],
    });
  },
  getSystemStatus: () => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/dashboard/system'),
        () => apiRoot.get('/admin/dashboard/system')
      );
    }
    return localOk({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: { latencyMs: 5, sizeBytes: 1024000, sizeFormatted: '1.00 MB' },
      tableStats: [],
      server: { nodeVersion: 'v20.0.0', uptime: 3600, memoryUsage: { heapTotal: 50000000, heapUsed: 30000000, external: 1000000 } },
    });
  },
};

// ─── Admin Revenue API ──────────────────────────────────────────────────────
export const adminRevenueApi = {
  getStats: () => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/revenue'),
        () => apiRoot.get('/admin/revenue')
      );
    }
    return localOk({
      totals: { totalRevenueCents: 1197, totalRevenueFormatted: '$11.97', avgTransactionCents: 1197, avgTransactionFormatted: '$11.97', refundCount: 0, refundTotalCents: 0, refundTotalFormatted: '$0.00' },
      monthly: [],
      recentTransactions: [],
      topCustomers: [],
    });
  },
};

// ─── Admin Analytics API ────────────────────────────────────────────────────
export const adminAnalyticsApi = {
  getDashboard: () => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/analytics'),
        () => apiRoot.get('/admin/analytics')
      );
    }
    return localOk({
      eventCounts: { total_events: 10, events_7d: 5, events_30d: 10 },
      funnel: { pageViews: 100, ctaClicks: 20, signups: 5, ebookCreated: 3, downloads: 2, payments: 1, ctaToSignupRate: '25.00', signupToEbookRate: '60.00', signupToPaymentRate: '20.00' },
      dailySignups: [],
      templateUsage: [{ template: 'minimal', count: 2 }],
      aiUsage: { ai_used: 1, manual: 1 },
      topEvents: [],
      eventsByDay: [],
    });
  },

  getFeatureUsage: (): Promise<{ data: FeatureUsageStats }> => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/analytics/feature-usage'),
        () => apiRoot.get('/admin/analytics/feature-usage')
      );
    }
    return localOk({
      totals: {
        unveil: { total: 25, sessions: 10, pathsCreated: 8, reveals: 7, uniqueUsers: 4 },
        teleprompter: { total: 18, sessions: 8, scriptsLoaded: 6, playbacks: 4, uniqueUsers: 3 },
        ebook: { total: 40, editorOpened: 15, created: 12, updated: 8, downloads: 5, aiFormattingUsed: 10, uniqueUsers: 6 },
      },
      userUsage: [],
      dailyUsage: [],
    } as FeatureUsageStats);
  },
};

// ─── Admin Ebooks API ───────────────────────────────────────────────────────
export const adminEbooksApi = {
  list: (params?: { search?: string; template?: string; status?: string; page?: number; limit?: number }) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/ebooks', { params }),
        () => apiRoot.get('/admin/ebooks', { params })
      );
    }
    return localOk({
      ebooks: [],
      pagination: { page: 1, limit: 25, totalCount: 0, totalPages: 0, hasMore: false },
    });
  },
};

// ─── Admin Audit Logs API ───────────────────────────────────────────────────
export const adminAuditLogsApi = {
  list: (params?: { action?: string; actorEmail?: string; page?: number; limit?: number }) => {
    if (!LOCAL_MODE) {
      return withApiPrefixFallback(
        () => api.get('/admin/audit-logs', { params }),
        () => apiRoot.get('/admin/audit-logs', { params })
      );
    }
    return localOk({
      logs: [],
      pagination: { page: 1, limit: 50, totalCount: 0, totalPages: 0, hasMore: false },
    });
  },
};

export default api;
