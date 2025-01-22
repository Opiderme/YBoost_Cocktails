# Utilise l'image officielle Nginx comme base
FROM nginx:latest

# Copie le fichier de configuration personnalisé dans le conteneur
COPY nginx.conf /etc/nginx/nginx.conf

# Copie les fichiers du site dans le répertoire racine de Nginx
COPY html/ /usr/share/nginx/html/

# Expose le port 80
EXPOSE 80
