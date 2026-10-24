@echo off
title TINIGKAMAY

taskkill /f /im node.exe
taskkill /f /im python.exe

start "" scripts/backend.bat
start "" scripts/frontend.bat

:wait_loop
netstat -ano | findstr :5173 >nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    goto :wait_loop
)

:wait_loop
netstat -ano | findstr :8000 >nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    goto :wait_loop
)

start http://localhost:5173

taskkill /F /FI "WINDOWTITLE ne TINIGKAMAY" /IM cmd.exe

echo Press any key to close TINIGKAMAY.
pause >nul

taskkill /f /im node.exe
taskkill /f /im python.exe
taskkill /f /im cmd.exe