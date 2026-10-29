@echo off
title TINIGKAMAY
setlocal enabledelayedexpansion

timeout 1 >nul

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
call :spinner 1
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

tasklist /v /fi "imagename eq cmd.exe" | findstr /i /c:"Uvicorn (TINIGKAMAY)" >nul
if %errorlevel% neq 0 (
    echo Critical Error: Uvicorn could not start.
    echo There may have been an error during the installation process, the back-end script, or the directory name was changed.
    echo.
    goto :close
)

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

:close
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

set "frame1=.........."
set "frame2=T........."
set "frame3=TI........"
set "frame4=TIN......."
set "frame5=TINI......"
set "frame6=TINIG....."
set "frame7=TINIGK...."
set "frame8=TINIGKA..."
set "frame9=TINIGKAM.."
set "frame10=TINIGKAMA."
set "frame11=TINIGKAMAY"
set "frame12=.INIGKAMAY"
set "frame13=..NIGKAMAY"
set "frame14=...IGKAMAY"
set "frame15=....GKAMAY"
set "frame16=.....KAMAY"
set "frame17=......AMAY"
set "frame18=.......MAY"
set "frame19=........AY"
set "frame20=.........Y"
set "frame21=.........."


for /f %%a in ('copy /Z "%~dpf0" nul') do set "CR=%%a"

for /l %%i in (1,1,%loopCount%) do (
    for /l %%f in (1,1,21) do (
	ping 127.0.0.1 -n 1 -w 300 >nul
	set "current_frame=!frame%%f!"
        <nul set /p "=  !current_frame! !CR!"       
    )
)
exit /b