@echo off
title TINIGKAMAY
setlocal enabledelayedexpansion

call :spinner 1
echo ==================== Welcome to TINIGKAMAY ====================
echo.
echo FSL Bidirectional Translation System
echo Bajet-Castillo High School
echo.

taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 echo Vite already running, freeing port 5173...

(call )

taskkill /f /im python.exe >nul 2>&1
if %errorlevel% equ 0 echo Uvicorn already running, freeing port 8000...

echo.
echo Initialising Uvicorn and Vite, please wait.
echo.

start "Uvicorn (TINIGKAMAY)" /min cmd /c scripts\backend.bat
start "Vite (TINIGKAMAY)" /min cmd /c scripts\frontend.bat

:wait_vite

netstat -ano | findstr :5173 >nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    call :spinner 2
    goto :wait_vite
)


echo Vite initialised successfully.
echo.

:wait_uvicorn
netstat -ano | findstr :8000 >nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    call :spinner 2
    goto :wait_uvicorn
)

echo Uvicorn initialised successfully.

echo.
echo.
echo Opening TINIGKAMAY... Do not close Vite or Uvicorn command prompts.

start http://localhost:5173

echo.
echo ==================================================

echo Press any key to close TINIGKAMAY.
pause >nul

taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

call :spinner 2

taskkill /f /im cmd.exe >nul 2>&1


:spinner
set "loopCount=%~1"

set "frame1=__________"
set "frame2=T_________"
set "frame3=TI________"
set "frame4=TIN_______"
set "frame5=TINI______"
set "frame6=TINIG_____"
set "frame7=TINIGK____"
set "frame8=TINIGKA___"
set "frame9=TINIGKAM__"
set "frame10=TINIGKAMA_"
set "frame11=TINIGKAMAY"
set "frame12=_INIGKAMAY"
set "frame13=__NIGKAMAY"
set "frame14=___IGKAMAY"
set "frame15=____GKAMAY"
set "frame16=_____KAMAY"
set "frame17=______AMAY"
set "frame18=_______MAY"
set "frame19=________AY"
set "frame20=_________Y"
set "frame21=__________"


for /f %%a in ('copy /Z "%~dpf0" nul') do set "CR=%%a"

for /l %%i in (1,1,%loopCount%) do (
    for /l %%f in (1,1,21) do (
	set "current_frame=!frame%%f!"
        <nul set /p "=  !current_frame! !CR!"       
    )
)
exit /b