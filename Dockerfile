FROM node:22-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro
COPY package*.json ./

# Instala dependências da aplicação
RUN apt-get update && \
    apt-get install -y libvips libvips-dev && \
    npm install --omit=dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copia o restante do código
COPY . .

# Expõe a porta usada pelo servidor
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["node", "server.js"]