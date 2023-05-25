FROM php:8.2-fpm

RUN apt-get update
RUN apt-get install -y openssl zip unzip git curl
RUN apt-get install -y libzip-dev libonig-dev libicu-dev
RUN apt-get install -y autoconf pkg-config libssl-dev
RUN apt-get install -y libjpeg62-turbo-dev libpng-dev

RUN docker-php-ext-install bcmath mbstring intl opcache
RUN docker-php-ext-install pdo pdo_mysql mysqli
RUN docker-php-ext-install gd

RUN pecl install xdebug-3.2.0
ADD xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini