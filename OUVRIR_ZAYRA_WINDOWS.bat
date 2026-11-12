@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
  start "Serveur ZAYRA" cmd /k "py -3 -m http.server 8765 --bind 127.0.0.1"
  timeout /t 2 >nul
  start "" "http://127.0.0.1:8765/index.html"
  exit /b 0
)
where python >nul 2>&1
if %errorlevel%==0 (
  start "Serveur ZAYRA" cmd /k "python -m http.server 8765 --bind 127.0.0.1"
  timeout /t 2 >nul
  start "" "http://127.0.0.1:8765/index.html"
  exit /b 0
)
echo Python n'est pas installe sur ce PC.
echo Ouverture de l'aperçu statique. Pour garantir le panier entre les pages, lancer le site avec un serveur local ou le publier sur un domaine.
pause
start "" "%~dp0index.html"
