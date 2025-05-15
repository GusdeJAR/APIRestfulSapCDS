# 1. Etapa de construcción
FROM node:20-slim AS builder
WORKDIR /app

# 1.1 Copiar solo definición de dependencias para cache
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci                                     

# 1.2 Copiar el resto del código y construir CAP
COPY . .
# Si usas cds build, descomenta la siguiente línea:
# RUN npx cds build --clean                    

# 1.3 Eliminar dependencias de desarrollo
RUN npm prune --production                        

# 2. Etapa de producción liviana
FROM node:20-slim AS runtime
WORKDIR /app

# 2.1 Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=4004

# 2.2 Copiar artefactos desde builder
COPY --from=builder /app /app

# 2.3 Seguridad: ejecutar como usuario no-root
USER node                                         

# 2.4 Exponer el puerto que usa tu CAP service
EXPOSE 4004                                       

# 2.5 Arrancar la aplicación usando tu script start
CMD ["npm", "start"]                              
