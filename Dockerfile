# 1. Etapa de construcción
FROM node:20-slim AS builder
WORKDIR /app

# Copiar definición de dependencias y crear node_modules
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci

# Copiar código fuente
COPY . .

# Construir artefactos si usas cds build
RUN npm run build

# Eliminar dependencias de desarrollo para producción
RUN npm prune --production

# 2. Etapa de producción liviana
FROM node:20-slim AS runtime
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4004

# Copiar desde builder
COPY --from=builder /app /app

# Ejecutar como usuario no root
USER node

# Exponer puerto
EXPOSE 4004

# Comando de arranque
CMD ["npm", "start"]
