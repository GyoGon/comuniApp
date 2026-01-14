FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto configurado en index.js
EXPOSE 8080

# Comando para arrancar
CMD ["node", "index.js"]
