# Imagem base
FROM ubuntu:22.04

# Instala Node.js, Chromium e dependências ESSENCIAIS
RUN apt-get update && \
    apt-get install -y wget curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Dependências do Puppeteer (lista oficial + extras para Venom-Bot)
RUN apt-get update && apt-get install -y \
    chromium-browser \
    libgbm-dev \
    libxshmfence1 \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgconf-2-4 \ 
    gconf-service \ 
    libasound2 \
    libcups2 \
    libgtk-3-0 \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Diretório de trabalho
WORKDIR /app

# Otimização de cache (camadas Docker)
COPY package*.json ./
RUN npm install --production && \
    npm install -g pm2

# Copia o app
COPY . .

# Configurações do Venom-Bot
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production

# Porta
EXPOSE 3000

# Inicia com PM2 (log detalhado)
CMD ["pm2-runtime", "--json", "server.js"]