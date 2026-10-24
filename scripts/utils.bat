@echo off
set "TARGET=fsl-api\fsl-frontend\public\utils"
if not exist "%TARGET%" mkdir "%TARGET%"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" -o "%TARGET%\camera_utils.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" -o "%TARGET%\drawing_utils.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" -o "%TARGET%\hands.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_packed_assets_loader.js" -o "%TARGET%\hands_solution_packed_assets_loader.js"
curl --no-clobber "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_simd_wasm_bin.js" -o "%TARGET%\hands_solution_simd_wasm_bin.js"
pause