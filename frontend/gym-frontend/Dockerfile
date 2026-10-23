# =========================================================
# ETAPA 1 - BUILD DO REACT/VITE
# =========================================================
FROM node:22-alpine AS build

WORKDIR /app

# Copia primeiro os arquivos de dependências
COPY package*.json ./

# Instala exatamente as versões do package-lock.json
RUN npm ci

# Copia o restante do projeto
COPY . .

# Gera o build de produção do Vite
RUN npm run build


# =========================================================
# ETAPA 2 - NGINX
# =========================================================
FROM nginx:1.27-alpine

# Remove configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia nosso nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build do React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]