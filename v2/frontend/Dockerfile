# Étape de build
FROM node:18-alpine as build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copie des fichiers de build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]