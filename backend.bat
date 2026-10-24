@echo off
cd /d C:\silentalk\fsl-api
call venv\Scripts\activate.bat
uvicorn main:app --reload

pause