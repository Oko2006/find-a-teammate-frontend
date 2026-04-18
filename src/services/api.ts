import axios from 'axios';
import {
  DirectMessage,
  DirectThread,
  Notification,
  PlannerResult,
  Profile,
  Project,
  User,
} from '../types';

const BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_EMAIL_KEY = 'user_email';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const decodeJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const response = await apiClient.post('/api/auth/refresh/', { refresh: refreshToken });
        const newAccess = response.data.access;
        setTokens(newAccess, refreshToken);
        apiClient.defaults.headers.Authorization = `Bearer ${newAccess}`;
        pendingRequests.forEach((cb) => cb(newAccess));
        pendingRequests = [];
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

const resolveMediaUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const mapProfileToUser = (profile: Profile, email: string): User => {
  return {
    id: profile.user,
    email,
    fullName: profile.full_name,
    major: profile.major,
    studyYear: profile.study_year,
    bio: profile.bio,
    skills: profile.skills,
    interests: profile.interests,
    preferredRole: profile.preferred_role,
    avatarUrl: resolveMediaUrl(profile.profile_picture || undefined),
  };
};

export const apiService = {
  auth: {
    register: async (email: string, password: string, password2: string) => {
      return apiClient.post('/api/auth/register/', { email, password, password2 });
    },
    login: async (email: string, password: string) => {
      const response = await apiClient.post('/api/auth/login/', { email, password });
      setTokens(response.data.access, response.data.refresh);
      localStorage.setItem(USER_EMAIL_KEY, email);
      return response;
    },
    logout: async () => {
      const refresh = getRefreshToken();
      if (refresh) {
        await apiClient.post('/api/auth/logout/', { refresh });
      }
      clearTokens();
      localStorage.removeItem(USER_EMAIL_KEY);
    },
  },

  profiles: {
    list: async () => apiClient.get('/api/profiles/'),
    update: async (id: number, payload: Partial<Profile>) => apiClient.patch(`/api/profiles/${id}/`, payload),
    getCurrentProfile: async () => {
      const token = getAccessToken();
      const payload = token ? decodeJwt(token) : null;
      const userId = payload?.user_id;
      if (!userId) throw new Error('User not authenticated');
      const response = await apiClient.get('/api/profiles/');
      const profile = response.data.results
        ? response.data.results.find((item: Profile) => item.user === userId)
        : response.data.find((item: Profile) => item.user === userId);
      if (!profile) throw new Error('Profile not found');
      const email = localStorage.getItem(USER_EMAIL_KEY) || '';
      return { profile, user: mapProfileToUser(profile, email) };
    },
  },

  projects: {
    list: async (params?: Record<string, string>) => apiClient.get('/api/projects/', { params }),
    get: async (id: number) => apiClient.get(`/api/projects/${id}/`),
    apply: async (projectId: number, message: string) => apiClient.post('/api/projects/applications/', { project: projectId, message }),
  },

  applications: {
    decide: async (applicationId: number, decision: 'accept' | 'reject') =>
      apiClient.post(`/api/projects/applications/${applicationId}/decide/`, { decision }),
  },

  matching: {
    recommendedProjects: async () => apiClient.get('/api/matching/projects/'),
  },

  messaging: {
    listThreads: async () => apiClient.get('/api/messaging/direct-threads/'),
    listMessages: async () => apiClient.get('/api/messaging/direct-messages/'),
    sendMessage: async (threadId: number, body: string) =>
      apiClient.post('/api/messaging/direct-messages/', { thread: threadId, body }),
    startThread: async (userId: number) =>
      apiClient.post('/api/messaging/direct-threads/start/', { user_id: userId }),
  },

  notifications: {
    list: async () => apiClient.get('/api/notifications/'),
    markAllRead: async () => apiClient.post('/api/notifications/mark-all-read/'),
  },

  planner: {
    create: async (inputText?: string, file?: File) => {
      const formData = new FormData();
      if (inputText) {
        formData.append('input_text', inputText);
      }
      if (file) {
        formData.append('upload_file', file);
      }
      return apiClient.post('/api/planner/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    get: async (id: number) => apiClient.get(`/api/planner/${id}/`),
  },
};

export const apiAdapters = {
  mapProfileToUser,
};
