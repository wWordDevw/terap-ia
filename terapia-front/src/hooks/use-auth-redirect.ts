'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

// Hook para redirigir usuarios basado en su estado de autenticación
export function useAuthRedirect(options?: {
  requireAuth?: boolean;
  redirectTo?: string;
  publicRoutes?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const {
    requireAuth = true,
    redirectTo = '/login',
    publicRoutes = ['/login', '/login/register', '/login/forgot-password', '/login/reset-password']
  } = options || {};

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (requireAuth && !user && !isPublicRoute) {
      router.push(redirectTo);
    }

    if (user && isPublicRoute) {
      router.push('/');
    }
  }, [user, loading, pathname, router, requireAuth, redirectTo, publicRoutes]);

  return { user, loading };
}

