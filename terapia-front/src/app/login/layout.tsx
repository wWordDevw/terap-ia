import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Sistema de Gestión Terapéutica',
  description: 'Accede al sistema de gestión de grupos terapéuticos PHP/IOP',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

