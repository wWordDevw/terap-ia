# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci --include=dev

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependencias del sistema necesarias para migraciones
RUN apk add --no-cache \
    postgresql-client \
    netcat-openbsd

# Instalar dependencias de producción únicamente
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar la aplicación compilada
COPY --from=builder /app/dist ./dist

# Copiar archivos de base de datos para migraciones
COPY --from=builder /app/database ./database

# Copiar plantillas necesarias (archivos .docx para MTPR)
COPY --from=builder /app/*.docx ./

# Copiar entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Crear directorio para documentos generados
RUN mkdir -p /app/generated-documents

# Cambiar ownership de /app ANTES de cambiar al usuario
RUN chown -R nestjs:nodejs /app

USER nestjs

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar entrypoint que ejecuta migraciones antes de iniciar la app
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
