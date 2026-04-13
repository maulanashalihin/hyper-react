const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type RequestOptions = {
  method?: string;
  body?: any;
  token?: string | null;
};

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));

    // Only redirect for protected routes (not auth endpoints)
    if (response.status === 401 && !endpoint.includes('/api/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }

    throw new Error(error.error?.message || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    }),
  register: (username: string, email: string, password: string, fullName?: string) =>
    request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: { username, email, password, fullName },
    }),
  me: (token: string) =>
    request<{ user: any }>('/api/auth/me', { token }),
};

// Users API - Component usage (with token parameter)
export const usersApi = {
  getAll: (token: string) =>
    request<{ users: any[] }>('/api/users', { token }),
  getById: (id: string, token: string) =>
    request<{ user: any }>(`/api/users/${id}`, { token }),
  update: (id: string, data: any, token: string) =>
    request<{ user: any }>(`/api/users/${id}`, {
      method: 'PUT',
      body: data,
      token,
    }),
  delete: (id: string, token: string) =>
    request<void>(`/api/users/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Users API - Loader usage (gets token from localStorage)
export async function fetchUsers(): Promise<{ users: any[] }> {
  const token = localStorage.getItem('token');
  return request<{ users: any[] }>('/api/users', { token });
}
