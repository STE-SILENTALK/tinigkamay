@echo off
title TINIGKAMAY

echo ==================== Welcome to TINIGKAMAY ====================
echo.
echo FSL Bidirectional Translation System
echo Bajet-Castillo High School
echo.

pause

taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 echo Vite already running, freeing port 5173...

(call )

taskkill /f /im python.exe >nul 2>&1
if %errorlevel% equ 0 echo Uvicorn already running, freeing port 8000...

echo.
echo.
echo Initialising Uvicorn and Vite, please wait.

start "Uvicorn (TINIGKAMAY)" /min cmd /c scripts\backend.bat
start "Vite (TINIGKAMAY)" /min cmd /c scripts\frontend.bat 

:wait_vite
netstat -ano | findstr :5173 >nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    goto :wait_vite
)

echo Vite initialised successfully.

:wait_uvicorn
netstat -ano | findstr :8000 >nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    goto :wait_uvicorn
)

echo Uvicorn initialised successfully.

echo.
echo Opening TINIGKAMAY! Do not close Vite or Uvicorn command prompts.

start http://localhost:5173

echo.
echo ==================================================

echo Press any key to close TINIGKAMAY.
pause >nul

taskkill /f /im node.exe
taskkill /f /im python.exe
taskkill /f /im cmd.exe