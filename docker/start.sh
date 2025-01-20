#!/bin/bash

# Esperar a que MySQL esté disponible
until php artisan migrate --force
do
    echo "Esperando a MySQL..."
    sleep 1
done

# Iniciar PHP-FPM
php-fpm
