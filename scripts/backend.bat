@echo off
cd /d %~dp0..\fsl-api
call venv\Scripts\activate.bat
uvicorn main:app --reload

pause