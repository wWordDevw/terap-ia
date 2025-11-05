'use client';

import type React from "react";
import { usePathname } from 'next/navigation';
import AppShell from "./app-shell";
import { useAuth } from '@/contexts/auth-context';
import NotificationContainer from '@/components/ui/notification-container';

// Rutas que no deben mostrar el AppShell
const PUBLIC_ROUTES = ['/login', '/login/register', '/login/forgot-password', '/login/reset-password'];

export default function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  
  // Verificar si la ruta actual es pública
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  
  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // Si es una ruta pública, no mostrar el AppShell
  if (isPublicRoute) {
    return (
      <>
        {children}
        <NotificationContainer />
      </>
    );
  }
  
  // Para rutas privadas, mostrar el AppShell
  return (
    <>
      <AppShell>{children}</AppShell>
      <NotificationContainer />
    </>
  );
}

