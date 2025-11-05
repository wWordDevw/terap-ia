# Stage 1: Dependencies
FROM node:20-slim AS deps

WORKDIR /app

# Instalar dependencias de sistema necesarias para compilar binarios nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias con rebuild forzado de paquetes nativos
RUN npm ci --include=optional

# Stage 2: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias de sistema necesarias para el build
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar package.json primero
COPY package*.json ./

# Copiar dependencias desde deps
COPY --from=deps /app/node_modules ./node_modules

# Eliminar lightningcss completamente y reinstalarlo desde cero
RUN rm -rf node_modules/lightningcss && \
    rm -rf node_modules/@tailwindcss/oxide && \
    npm install lightningcss --no-save --verbose

# Copiar c�digo fuente
COPY . .

# Variables de entorno necesarias para el build
ENV NEXT_TELEMETRY_DISABLED=1

# Build de Next.js
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-slim AS runner

WORKDIR /app

# Crear usuario no-root
RUN groupadd -g 1001 nodejs && useradd -r -u 1001 -g nodejs nextjs

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar a usuario no-root
USER nextjs

EXPOSE 3001

# Variables de entorno por defecto
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["node", "server.js"]
