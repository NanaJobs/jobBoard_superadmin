/**
 * Super Admin Live API Client
 * Connects directly to the Django REST Backend (local or production)
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://job-board1-sghl.onrender.com";

export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  if (url.includes("res.cloudinary.com/jobboard/")) {
    const cleanPath = url.split("res.cloudinary.com/jobboard/")[1] || "";
    return `${cleanBase}/media/${cleanPath}`;
  }
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

// Token & User Persistence
export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: 'applicant' | 'company' | 'admin' | 'super_admin';
  is_verified: boolean;
  is_suspended: boolean;
  created_at: string;
}

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('nanajobs-authenticated');
  localStorage.removeItem('kindred-authenticated');
}

export function getStoredUser(): AuthUser | null {
  const user = localStorage.getItem('auth_user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem('auth_user', JSON.stringify(user));
  localStorage.setItem('nanajobs-authenticated', 'true');
  localStorage.setItem('kindred-authenticated', 'true');
}

// Base Fetcher with Token Refresh
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // Handle Token Refresh on 401
  if (response.status === 401 && getRefreshToken()) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: getRefreshToken() }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccess = refreshData.data?.access || refreshData.access;
        if (newAccess) {
          localStorage.setItem('access_token', newAccess);
          headers['Authorization'] = `Bearer ${newAccess}`;
          response = await fetch(url, { ...options, headers });
        }
      } else {
        clearTokens();
      }
    } catch {
      clearTokens();
    }
  }

  function formatErrorMessage(data: any): string {
    if (!data) return 'An unexpected error occurred';
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail;
    if (data.errors) {
      if (typeof data.errors === 'string') return data.errors;
      if (typeof data.errors === 'object' && data.errors !== null) {
        const messages: string[] = [];
        for (const [key, value] of Object.entries(data.errors)) {
          if (Array.isArray(value)) messages.push(value.join(' '));
          else if (typeof value === 'string') messages.push(value);
          else if (typeof value === 'object' && value !== null) messages.push(Object.values(value).flat().join(' '));
        }
        if (messages.length > 0) return messages.join(' ');
      }
    }
    if (data.error && typeof data.error === 'string') return data.error;
    return 'An error occurred. Please check your credentials or try again.';
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = formatErrorMessage(data);
    throw new Error(errorMsg);
  }

  return data;
}

// -------------------------------------------------------------
// 1. Authentication & Profile API
// -------------------------------------------------------------
export const authApi = {
  async login(email: string, password: string) {
    const data = await apiRequest('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data?.access && data.data?.refresh) {
      setTokens(data.data.access, data.data.refresh);
      if (data.data.user) {
        setStoredUser(data.data.user);
      }
    }
    return data;
  },

  async logout() {
    const refresh = getRefreshToken();
    try {
      if (refresh) {
        await apiRequest('/api/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        });
      }
    } finally {
      clearTokens();
    }
  },

  async getProfile() {
    const data = await apiRequest('/api/auth/profile/');
    if (data.data) {
      setStoredUser(data.data);
    }
    return data;
  },
};

// -------------------------------------------------------------
// 2. Dashboards & Analytics API
// -------------------------------------------------------------
export const dashboardApi = {
  async getAdminDashboard() {
    return apiRequest('/api/dashboard/admin/');
  },
};

// -------------------------------------------------------------
// 3. Super Admin Management API
// -------------------------------------------------------------
export const adminApi = {
  async getDashboard() {
    return apiRequest('/api/dashboard/admin/');
  },

  async getUsers(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    const qs = query.toString();
    return apiRequest(`/api/admin/users/${qs ? `?${qs}` : ''}`);
  },

  async getUserDetail(id: string) {
    return apiRequest(`/api/admin/users/${id}/`);
  },

  async suspendUser(id: string, action: 'suspend' | 'activate') {
    return apiRequest(`/api/admin/users/${id}/suspend/`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },

  async deleteUser(id: string) {
    return apiRequest(`/api/admin/users/${id}/`, {
      method: 'DELETE',
    });
  },

  async updateUser(id: string, data: Record<string, any>) {
    return apiRequest(`/api/admin/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getJobs(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    const qs = query.toString();
    return apiRequest(`/api/jobs/admin/all/${qs ? `?${qs}` : ''}`);
  },

  async toggleFeatureJob(id: string) {
    return apiRequest(`/api/jobs/admin/${id}/feature/`, {
      method: 'PATCH',
    });
  },

  async getApplications(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    const qs = query.toString();
    return apiRequest(`/api/applications/admin/all/${qs ? `?${qs}` : ''}`);
  },

  async deleteJob(id: string) {
    return apiRequest(`/api/jobs/admin/${id}/`, {
      method: 'DELETE',
    });
  },

  async getCategories() {
    return apiRequest('/api/jobs/categories/');
  },

  async createCategory(data: { name: string; description?: string }) {
    return apiRequest('/api/jobs/admin/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: { name?: string; description?: string }) {
    return apiRequest(`/api/jobs/admin/categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string) {
    return apiRequest(`/api/jobs/admin/categories/${id}/`, {
      method: 'DELETE',
    });
  },

  async getCompanies(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    const qs = query.toString();
    return apiRequest(`/api/profiles/companies/${qs ? `?${qs}` : ''}`);
  },
};

// -------------------------------------------------------------
// 4. Reports & Moderation API
// -------------------------------------------------------------
export const reportsApi = {
  async getAdminReports(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    const qs = query.toString();
    return apiRequest(`/api/reports/admin/all/${qs ? `?${qs}` : ''}`);
  },

  async getAdminReportDetail(id: string) {
    return apiRequest(`/api/reports/admin/${id}/`);
  },

  async resolveAdminReport(id: string, data: { status: string; action_taken: string; admin_notes?: string }) {
    return apiRequest(`/api/reports/admin/${id}/resolve/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
