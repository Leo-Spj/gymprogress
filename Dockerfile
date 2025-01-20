FROM php:8.2-fpm

WORKDIR /var/www/html

# Instalar Node.js y npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Instalar dependencias
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Configurar PHP-FP M
RUN echo "pm.max_children = 50" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "pm.start_servers = 5" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "pm.min_spare_servers = 5" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "pm.max_spare_servers = 35" >> /usr/local/etc/php-fpm.d/www.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar archivos de la aplicación
COPY . .

# Instalar dependencias de composer
RUN composer install --no-dev --optimize-autoloader

# Instalar dependencias de npm y construir assets
COPY package*.json ./
RUN npm install
RUN npm run build

# Configurar permisos
RUN chown -R www-data:www-data . && \
    chmod -R 755 . && \
    chmod -R 775 storage bootstrap/cache

# Copiar y configurar script de inicio
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Exponer puerto 9000
EXPOSE 9000

CMD ["/usr/local/bin/start.sh"]
