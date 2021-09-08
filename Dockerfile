FROM php:7.4-apache
EXPOSE 80 443
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN apt-get update \
 && apt-get install -y git \
 && a2enmod rewrite \
 && a2enmod headers \
 && mv /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini \
 && sed -e 's/;date.timezone =/date.timezone = "Europe\/Prague"/' -i /usr/local/etc/php/php.ini \
 && sed -e 's/;max_input_vars = 1000/max_input_vars = 10000/' -i /usr/local/etc/php/php.ini \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
 && apt-get install -y mariadb-client \
 && docker-php-ext-install pdo pdo_mysql \
 && docker-php-ext-install mysqli \
 && docker-php-ext-enable mysqli \
 && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
 && curl -sL https://deb.nodesource.com/setup_10.x | bash \
 && apt-get install -y zlib1g-dev libzip-dev \
 && docker-php-ext-install zip \
 && apt-get install -y nodejs
WORKDIR /var/www/html
