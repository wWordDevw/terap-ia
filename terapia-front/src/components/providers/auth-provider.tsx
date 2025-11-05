'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

/**
 * Provider de autenticacion
 * Carga el usuario del localStorage al iniciar la app
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  return <>{children}</>;
}
