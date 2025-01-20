#!/bin/bash

# Instalar dependencias de npm si no existen
if [ ! -d "node_modules" ]; then
    npm install
fi

# Construir assets
npm run build

# Esperar a que MySQL esté disponible
until nc -z -v -w30 db 3306
do
    echo "Esperando a MySQL..."
    sleep 2
done

echo "MySQL está disponible, ejecutando migraciones..."

# Ejecutar migraciones
php artisan migrate --force

# Limpiar caché
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Establecer permisos
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# Iniciar servidor de desarrollo de Laravel
php artisan serve --host=0.0.0.0 --port=80
