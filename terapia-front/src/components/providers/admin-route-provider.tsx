'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/components/providers/toast-provider';

interface AdminRouteProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que protege rutas solo para administradores
 * Redirige al dashboard si el usuario no es admin
 */
export function AdminRouteProvider({ children }: AdminRouteProviderProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      addToast('Debes iniciar sesión para acceder a esta página', 'error');
      router.push('/login');
      return;
    }

    // Si no es admin, redirigir al dashboard
    if (user?.role !== 'admin') {
      addToast('No tienes permisos para acceder a esta sección', 'error');
      router.push('/');
    }
  }, [user, isAuthenticated, router, addToast]);

  // Mostrar el contenido solo si es admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Solo los administradores pueden acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
