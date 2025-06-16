# Imagem oficial com Node.js e Chromium pré-configurados
FROM mcr.microsoft.com/playwright:focal

# Diretório da aplicação
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install --production && npm install -g pm2

# Copia o restante do código
COPY . .

# Porta da aplicação
EXPOSE 3000

# Variáveis de ambiente (opcional, mas recomendado)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production

# Inicia com PM2
CMD ["pm2-runtime", "server.js"]
