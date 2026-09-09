'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserAccount {
  id: string;
  phone: string;
  name: string;
}

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateAccount: (data: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch authenticated user status on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signup = async (data: { name: string; phone: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.user) {
        setUser(result.user);
        router.push('/dashboard');
      }
      return result;
    } catch (err) {
      return { success: false, error: 'Network error creating account.' };
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const result = await res.json();
      if (result.success && result.user) {
        setUser(result.user);
        router.push('/dashboard');
      }
      return result;
    } catch (err) {
      return { success: false, error: 'Network error signing in.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout network error:', e);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const updateAccount = async (data: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }) => {
    try {
      const res = await fetch('/api/auth/update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.user) {
        setUser((prev) => (prev ? { ...prev, ...result.user } : result.user));
      }
      return result;
    } catch (err) {
      return { success: false, error: 'Network error updating account.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
