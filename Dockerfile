FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar manifiestos de dependencias e instalar solo dependencias de producción
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiar el código fuente de la aplicación
COPY src ./src
COPY server.js ./

# Variables de entorno por defecto (la configuración de RDS se inyecta en ejecución)
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=1.1.0

EXPOSE 3000

CMD ["node", "server.js"]
