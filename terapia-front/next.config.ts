/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración experimental para app directory
  experimental: {
    // Ya no es necesario en Next.js 14+, pero lo mantenemos por compatibilidad
  },

  // Configuración para TypeScript
  typescript: {
    // Durante el build, continúa aunque haya errores de TypeScript (solo para desarrollo)
    ignoreBuildErrors: false,
  },

  // Configuración para ESLint
  eslint: {
    // Durante el build, continúa aunque haya warnings de ESLint (solo para desarrollo)
    ignoreDuringBuilds: false,
  },

  // Configuración para imágenes
  images: {
    // Dominios permitidos para imágenes externas (si necesitas cargar imágenes de URLs externas)
    domains: [
      'localhost',
      'terap-ia.victalejo.dev',
      '147.93.184.62',
      // Añade aquí otros dominios si necesitas cargar imágenes externas
    ],
    
    // Formatos de imagen permitidos
    formats: ['image/webp', 'image/avif'],
    
    // Configuración para imágenes locales
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuración para archivos estáticos
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // Configuración para redirects (si necesitas)
  async redirects() {
    return [
      // Ejemplo: redirigir /home a /
      // {
      //   source: '/home',
      //   destination: '/',
      //   permanent: true,
      // },
    ];
  },

  // Configuración para rewrites (si necesitas)
  async rewrites() {
    // En desarrollo local, hacemos proxy al backend en localhost:3100
    // En producción con Docker Compose (DOCKER_COMPOSE=true), usamos red interna
    // En producción con Dokku (apps separadas), NO hacemos rewrite - el frontend llama directamente a la API pública
    const useDockerCompose = process.env.DOCKER_COMPOSE === 'true';

    if (process.env.NODE_ENV === 'production' && !useDockerCompose) {
      // Dokku con apps separadas - sin rewrite, el frontend usa NEXT_PUBLIC_API_URL directamente
      return [];
    }

    return [
      // Proxy al backend
      {
        source: '/api/v1/:path*',
        destination: useDockerCompose
          ? 'http://backend:3000/api/v1/:path*'  // Red interna Docker Compose
          : 'http://localhost:3100/api/v1/:path*', // localhost en desarrollo
      },
    ];
  },

  // Variables de entorno públicas (opcional)
  env: {
    // Estas variables estarán disponibles en el cliente
    NEXT_PUBLIC_APP_NAME: 'Sistema de Gestión Terapéutica',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Configuración para el compilador (opcional)
  compiler: {
    // Remover console.logs en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuración para el bundle analyzer (opcional)
  ...(process.env.ANALYZE === 'true' && {
    // Para analizar el bundle: ANALYZE=true npm run build
    webpack: (config: { plugins: any[]; }, { buildId, dev, isServer, defaultLoaders, webpack }: any) => {
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')();
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        );
      }
      return config;
    },
  }),

  // Configuración para optimización
  // swcMinify ya no es necesario en Next.js 15+ (está habilitado por defecto)

  // Configuración de output
  // Para Docker/standalone server
  output: 'standalone',
  // Para exportación estática: output: 'export',
  // trailingSlash: true, // Descomenta si necesitas trailing slashes
  // distDir: 'dist', // Descomenta si quieres cambiar el directorio de build

  // Configuración para desarrollo
  reactStrictMode: true,
  
  // Configuración para el servidor de desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    // Configuraciones solo para desarrollo
  }),
};

export default nextConfig;