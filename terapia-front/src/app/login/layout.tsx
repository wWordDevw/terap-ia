// Forzar renderizado dinámico para TODA la carpeta /login y subcarpetas
export const dynamic = 'force-dynamic';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

