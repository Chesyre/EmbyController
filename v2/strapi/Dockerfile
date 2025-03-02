FROM node:18-alpine

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources
COPY . .

# Build de Strapi
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "develop"]