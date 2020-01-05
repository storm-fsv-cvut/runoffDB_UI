FROM php:7.1-apache
RUN apt-get update \
 && a2enmod rewrite \
 && curl -sS https://getcomposer.org/installer \
  | php -- --install-dir=/usr/local/bin --filename=composer \
 && echo "AllowEncodedSlashes On" >> /etc/apache2/apache2.conf \
 && docker-php-ext-install mbstring pdo pdo_mysql \
 && mv /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini
