#!/bin/bash

# Generar clave de aplicación si no existe
if [ -z "$APP_KEY" ]; then
    php artisan key:generate
fi

# Instalar dependencias de npm si no existen
if [ ! -d "node_modules" ]; then
    npm install
fi

# Construir assets
npm run build

# Esperar a que MySQL esté disponible y ejecutar migraciones
echo "Verificando conexión con MySQL..."
until php artisan db:monitor
do
    echo "Esperando a MySQL..."
    sleep 2
done

echo "MySQL está disponible, ejecutando migraciones..."
php artisan migrate --force 

# Limpiar caché
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Establecer permisos
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# Crear enlace simbólico para el almacenamiento
php artisan storage:link

# Iniciar servidor de desarrollo de Laravel
php artisan serve --host=0.0.0.0 --port=8000
