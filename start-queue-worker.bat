@echo off
echo Démarrage du worker de queue Laravel...
cd "c:\Users\wwwra\Desktop\Laravel Learning\blog"
php artisan queue:work --sleep=3 --tries=3 --timeout=90
pause
