# Imagem base enxuta com Node.js 22
FROM node:22-slim

# Diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    libgbm1 \
    libxshmfence1 \
    libxss1 \
    libgtk-3-0 \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instala as dependências do Node.js
RUN npm install

# Copia o restante da aplicação
COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 3000

# Comando padrão de inicialização
CMD ["node", "server.js"]