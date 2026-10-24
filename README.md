# TINIGKAMAY
Bridging the Communication of Filipino Deaf and Hearing People Using Bidirectional Web-App Translation System
 
* **Handsign-to-Text:** Uses **Google MediaPipe** (126 skeletal hand keypoints), **Scikit-Learn** (Random Forest for static alphabet signs), and **TensorFlow/Keras** (LSTM Neural Network for dynamic phrase sequences).
* **Speech-to-Handsign:** Uses the **Web Speech API** (`fil-PH`) with a custom Tagalog/English phonetic correction engine and dynamic `.mp4` sign video queuing.

---

## Prerequisites
Before setting up the project, ensure you have the following installed:
1. **Node.js** (v18 or higher)
2. **Python** (v3.9 – v3.11 recommended for TensorFlow compatibility)
3. **Google Chrome** or **Microsoft Edge** (Required for Web Speech API support)
4. A working **Webcam** and **Microphone**

## Install Script (Temporary Demo)
```batch
@echo off
echo ========================= Welcome to TINIGKAMAY Installation Portal (DEMO). =========================
echo.
echo Press any key to begin the installation. Please ensure you have a stable internet connection.
pause >nul

echo Beginning directory extraction from GitHub

setlocal enabledelayedexpansion

curl -L -o tinigkamay.zip "https://github.com/STE-SILENTALK/tinigkamay/archive/refs/heads/master.zip"

powershell -Command "Expand-Archive -Path 'tinigkamay.zip' -DestinationPath '.' -Force"

del tinigkamay.zip

ren "tinigkamay-master" "tinigkamay"

echo Extracted from GitHub successfully.
echo Press any key to proceed to download required back-end and front-end dependencies. This step may take a while.
pause >nul

echo Creating virtual environment...

cd %~dp0\tinigkamay\fsl-api
python -m venv venv
call venv\Scripts\activate

echo Downloading back-end dependencies...

pip install -r requirements.txt

echo Back-end dependencies installed. Now installing front-end dependencies...

cd %~dp0\tinigkamay\fsl-api\fsl-frontend
npm install

echo Front-end dependencies installed. Now installing JS utilities...

set "TARGET=%~dp0\tinigkamay\fsl-api\fsl-frontend\public\utils"
if not exist "%TARGET%" mkdir "%TARGET%"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" -o "%TARGET%\camera_utils.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" -o "%TARGET%\drawing_utils.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" -o "%TARGET%\hands.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_packed_assets_loader.js" -o "%TARGET%\hands_solution_packed_assets_loader.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_simd_wasm_bin.js" -o "%TARGET%\hands_solution_simd_wasm_bin.js"

echo Utils installed.
echo.
echo ========================================
echo Installation complete. Press any key to close the installation window.
pause >nul
```
