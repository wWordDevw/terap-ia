import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware para proteger rutas que requieren autenticacion
 * TEMPORALMENTE DESHABILITADO - permitiendo acceso sin autenticación
 */
export function middleware(request: NextRequest) {
  // TODO: Volver a habilitar la autenticación después de revisar el formulario
  return NextResponse.next();
  
  /* CÓDIGO ORIGINAL COMENTADO - DESCOMENTAR CUANDO TERMINES
  const token = request.cookies.get('accessToken')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Si no hay token en cookies, intentar obtenerlo de localStorage via header
  const hasToken = token || request.headers.get('x-access-token');

  const { pathname } = request.nextUrl;

  // Rutas publicas que no requieren autenticacion
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Si esta en una ruta publica y tiene token, redirigir a home
  if (isPublicRoute && hasToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si esta en una ruta protegida y no tiene token, redirigir a login
  if (!isPublicRoute && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
  */
}

/**
 * Configuracion del middleware
 * Especifica en que rutas se debe ejecutar
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
