@echo off
echo ===================================
echo   BUILD POUR LA PRODUCTION
echo ===================================

echo 1. Nettoyage des caches...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo 2. Installation des dependances optimisees...
call composer install --optimize-autoloader --no-dev

echo 3. Build des assets frontend...
call npm run build:prod

echo 4. Optimisation Laravel...
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo 5. Migration de la base de donnees...
php artisan migrate --force

echo ===================================
echo   BUILD TERMINE AVEC SUCCES!
echo ===================================
pause
