'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/types';
import { authAPI } from './api';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const response = await authAPI.me();
          setUser(response.user);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          Cookies.remove('auth_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, twoFactorCode?: string) => {
    const response = await authAPI.login({ email, password, two_factor_code: twoFactorCode });
    
    // Only set user if login is complete (no 2FA required)
    if (!response.requires_two_factor) {
      setUser(response.user);
    }
    
    return response;
  };

  const register = async (data: any) => {
    const response = await authAPI.register(data);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
