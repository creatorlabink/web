/**
 * API Client – centralised axios instance for connecting to the
 * CreatorLab.ink Express backend.
 */
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
  signup: (email: string, password: string, name?: string) =>
    api.post('/auth/signup', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// ─── Ebooks ───────────────────────────────────────────────────────────────────
export const ebooksApi = {
  list: () => api.get('/ebooks'),
  get: (id: string) => api.get(`/ebooks/${id}`),
  create: (title: string, rawText: string, template = 'minimal') =>
    api.post('/ebooks', { title, raw_text: rawText, template }),
  update: (id: string, data: Partial<{ title: string; raw_text: string; template: string }>) =>
    api.put(`/ebooks/${id}`, data),
  delete: (id: string) => api.delete(`/ebooks/${id}`),
};

// ─── PDF Export ───────────────────────────────────────────────────────────────
export const pdfApi = {
  export: async (ebookId: string) => {
    const response = await api.post(`/pdf/export/${ebookId}`, {}, { responseType: 'blob' });
    return response.data as Blob;
  },
  preview: (ebookId: string) => api.get(`/pdf/preview/${ebookId}`),
};

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentApi = {
  createCheckout: () => api.post('/payment/checkout'),
  getStatus: () => api.get('/payment/status'),
  verifySession: (sessionId: string) => api.get(`/payment/verify?session_id=${sessionId}`),
};

export default api;
