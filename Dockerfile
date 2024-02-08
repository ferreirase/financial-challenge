# Use uma imagem Node.js como base
FROM node:18.19.0-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o arquivo package-lock.json (ou yarn.lock) para o diretório de trabalho
COPY package*.json ./

RUN npm install -g npm@10.4.0

# Instale as dependências do projeto
RUN npm install --force

# Copie o restante do código-fonte para o diretório de trabalho
COPY . .

# Compile o código TypeScript
RUN npm run build

# Exponha a porta em que o aplicativo será executado (opcional, depende do aplicativo)
EXPOSE 3000

# Comando para iniciar o aplicativo quando o contêiner for iniciado
CMD ["npm", "start"]
