import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data as unknown;
  if (typeof data === "object" && data !== null && "detail" in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (Array.isArray(detail) && detail.length) {
      const first = detail[0] as { msg?: unknown } | undefined;
      if (first && typeof first.msg === "string" && first.msg.trim()) return first.msg;
    }
  }

  if (typeof error.message === "string" && error.message.trim()) return error.message;
  return fallback;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  status: string;
  page_count: number | null;
  chunk_count: number | null;
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Citation {
  document_id: string;
  document_name: string;
  page_number: number | null;
  excerpt: string;
  confidence: number;
}

export interface Message {
  id: string;
  role: string;
  content: string;
  citations: Citation[] | null;
  confidence_score: string | null;
  agent_used: string | null;
  created_at: string;
}

export const authApi = {
  register: (data: { email: string; full_name: string; password: string }) =>
    api.post<User>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<{ access_token: string; refresh_token: string }>("/auth/login", data),
  me: () => api.get<User>("/auth/me"),
};

export const documentsApi = {
  list: () => api.get<Document[]>("/documents"),
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<Document>("/documents", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export const chatApi = {
  list: () => api.get<Chat[]>("/chat"),
  create: (title = "New Chat") => api.post<Chat>("/chat", { title }),
  messages: (chatId: string) => api.get<Message[]>(`/chat/${chatId}/messages`),
  send: (chatId: string, content: string) =>
    api.post<Message>(`/chat/${chatId}/messages`, { content }),
};

export const healthApi = {
  check: () => api.get<{ status: string; services: Record<string, string> }>("/health"),
};
