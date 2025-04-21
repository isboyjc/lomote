'use client';

import React, { createContext, useContext } from 'react';
import { useAuth, UseAuthResult } from '@/hooks/use-auth';

// 创建认证上下文
const AuthContext = createContext<UseAuthResult | undefined>(undefined);

// 认证Provider组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子，用于在组件中访问认证状态
export function useAuthContext(): UseAuthResult {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext必须在AuthProvider内部使用');
  }
  
  return context;
} 