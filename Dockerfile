FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Exponer el puerto configurado en index.js
EXPOSE 8080

# Comando para arrancar (puede ser sobreescrito en docker-compose)
CMD ["pnpm", "start"]
