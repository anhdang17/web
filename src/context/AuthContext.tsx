'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  address?: string;
  city?: string;
  district?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Lỗi');
  return json.data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch('/api/auth/me');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (identifier: string, password: string) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    setUser(data.user);
    if (data.token) localStorage.setItem('token', data.token);
  };

  const register = async (data: RegisterData) => {
    const result = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setUser(result.user);
    if (result.token) localStorage.setItem('token', result.token);
  };

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
