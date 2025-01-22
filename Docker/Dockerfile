FROM php:fpm

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

COPY package*.json ./

RUN docker-php-ext-install pdo pdo_mysql

EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
