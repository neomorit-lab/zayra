@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
 start "ZAYRA Admin Local" cmd /k "py -3 -m http.server 8765 --bind 127.0.0.1"
 timeout /t 2 >nul
 start "" "http://127.0.0.1:8765/admin/"
 exit /b 0
)
where python >nul 2>&1
if %errorlevel%==0 (
 start "ZAYRA Admin Local" cmd /k "python -m http.server 8765 --bind 127.0.0.1"
 timeout /t 2 >nul
 start "" "http://127.0.0.1:8765/admin/"
 exit /b 0
)
echo Python n'est pas installe. Installez Python pour lancer la previsualisation locale.
pause
