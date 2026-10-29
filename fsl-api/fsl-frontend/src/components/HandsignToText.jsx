import { useRef, useState, useEffect } from 'react';

// ============================================================================
// CAMERA & AI HAND TRACKING BOX (HandsignToText.jsx)
// This file turns on the webcam, draws the green skeleton lines on your hands,
// and sends the hand positions to the Python backend (main.py) to guess the sign.
// ============================================================================
export default function HandsignToText({ onTelemetryUpdate, onPredictionUpdate, message, setMessage}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("");

  // 👉 EDIT HERE: Default starting mode when opening the camera ('static' for letters, 'dynamic' for moving phrases)
  const [translationMode, setTranslationMode] = useState('static'); 
  
  const frameBuffer = useRef([]);
  const isPredicting = useRef(false);

  // Keeps track of whether the user clicked "STATIC" or "DYNAMIC"
  const currentMode = useRef('static');

  useEffect(() => {
    currentMode.current = translationMode;
    frameBuffer.current = [];
    setPrediction("");
    if (onPredictionUpdate) onPredictionUpdate("");
  }, [translationMode, onPredictionUpdate]);

  useEffect(() => {
    // Loads Google MediaPipe Hands from the internet
    // MODIFIED: Loads from public folder
    const hands = new window.Hands({
      locateFile: (file) => `/utils/${file}`,
    });

    // ------------------------------------------------------------------------
    // 👉 EDIT HERE: Hand Detection Sensitivity
    // - maxNumHands: 2 (Tracks both hands. Change to 1 if you only want 1 hand)
    // - minDetectionConfidence: 0.5 (50% sure it sees a hand. Increase to 0.7 if background objects get mistaken for hands)
    // ------------------------------------------------------------------------
    hands.setOptions({
      maxNumHands: 2, 
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    // Runs on every single camera frame
    hands.onResults((results) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const canvasCtx = canvas.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // DO NOT CHANGE: 126 numbers (63 for Left Hand + 63 for Right Hand) required by the Python AI
      let combinedCoordinates = new Array(126).fill(0);
      let detectedHandLabel = "Waiting...";
      let highestScore = 0;

      // If the camera sees at least 1 hand:
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        let handTypes = [];
        
        results.multiHandLandmarks.forEach((landmarks, index) => {
          // ------------------------------------------------------------------
          // 👉 EDIT HERE: Hand Skeleton Colors & Line Thickness on Camera
          // - #10b981 is the bright green line color (change hex code for different color)
          // - lineWidth: 3 is how thick the lines are
          // - #047857 is the dark green dot color on the finger joints
          // ------------------------------------------------------------------
          if (window.drawConnectors && window.drawLandmarks) {
            window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: "#3888d3", lineWidth: 3 });
            window.drawLandmarks(canvasCtx, landmarks, { color: "#4d4bcf", lineWidth: 2 });
          }

          // Flips Left/Right label because the webcam is mirrored like a selfie
          const rawHand = results.multiHandedness[index]?.label || "Right";
          const actualHand = rawHand === "Left" ? "Right" : "Left";
          handTypes.push(actualHand);
          
          const score = results.multiHandedness[index]?.score || 0;
          if (score > highestScore) highestScore = score;
          
          // DO NOT CHANGE: Math calculation that centers the hand on the wrist (landmark 0)
          const wrist = landmarks[0]; 
          const handCoords = [];

          landmarks.forEach(lm => {
            handCoords.push(lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z);
          });

          if (actualHand === "Left") {
            combinedCoordinates.splice(0, 63, ...handCoords);
          } else {
            combinedCoordinates.splice(63, 63, ...handCoords);
          }
        });

        if (handTypes.length === 2) {
          detectedHandLabel = "Both Hands";
        } else {
          detectedHandLabel = handTypes[0];
        }

        const confidenceScore = Math.round(highestScore * 100);
        if (onTelemetryUpdate) onTelemetryUpdate({ hand: detectedHandLabel, confidence: confidenceScore });

        // Collects 30 frames of movement for Dynamic Phrases
        frameBuffer.current.push(combinedCoordinates);
        if (frameBuffer.current.length > 30) frameBuffer.current.shift();

        // Sends the hand coordinates to the Python backend (main.py)
        if (!isPredicting.current) {
          isPredicting.current = true;

          const runPrediction = async () => {
            try {
              let currentDetected = "";

              // ==============================================================
              // 1. STATIC MODE (Alphabet Letters)
              // 👉 EDIT HERE: If you change your Python server URL/Port, update "http://127.0.0.1:8000" below
              // ==============================================================
              if (currentMode.current === 'static') {
                const staticRes = await fetch("http://127.0.0.1:8000/api/predict-static", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ coordinates: combinedCoordinates }),
                });

                if (staticRes.ok) {
                  const staticData = await staticRes.json();
                  if (staticData.prediction) currentDetected = staticData.prediction;
                }

              } 
              // ==============================================================
              // 2. DYNAMIC MODE (Moving Words / Phrases)
              // ==============================================================
              else if (currentMode.current === 'dynamic') {
                if (frameBuffer.current.length === 30) {
                  const dynamicRes = await fetch("http://127.0.0.1:8000/api/predict-dynamic", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sequence: frameBuffer.current }),
                  });

                  if (dynamicRes.ok) {
                    const dynamicData = await dynamicRes.json();
                    
                    // --------------------------------------------------------
                    // 👉 EDIT HERE: Dynamic AI Strictness (Confidence Threshold)
                    // Currently set to 65 (meaning AI must be at least 65% sure).
                    // - Lower this number (e.g., 50) if the AI is having a hard time showing your phrase.
                    // - Raise this number (e.g., 80) if the AI is guessing random wrong phrases too easily.
                    // --------------------------------------------------------
                    if (dynamicData.prediction && dynamicData.confidence > 45) {
                      currentDetected = dynamicData.prediction;
                    }
                  }
                } else {
                  // 👉 EDIT HERE: Text shown while waiting for 30 frames of hand movement
                  currentDetected = "Tracking motion...";
                }
              }

              if (currentDetected) {
                setPrediction(currentDetected);
                if (onPredictionUpdate) onPredictionUpdate(currentDetected);
              }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
              // Ignores errors if Python backend isn't turned on yet
            } finally {
              isPredicting.current = false; 
            }
          };

          runPrediction();
        }
      } else {
        // When no hands are in front of the camera, clear the text
        setPrediction("");
        if (onPredictionUpdate) onPredictionUpdate("");
        frameBuffer.current = []; 
        if (onTelemetryUpdate) onTelemetryUpdate({ hand: "Waiting...", confidence: 0 });
      }
      canvasCtx.restore();
    });

    // ------------------------------------------------------------------------
    // 👉 EDIT HERE: Camera Resolution (Width & Height)
    // Default is 1280x720 (HD). If the camera lags on a slow laptop, change to 640 and 480.
    // ------------------------------------------------------------------------
    let camera;
    if (videoRef.current) {
      camera = new window.Camera(videoRef.current, {
        onFrame: async () => { 
          if (videoRef.current) await hands.send({ image: videoRef.current }); 
        },
        width: 1280, 
        height: 720,
      });
      camera.start();
    }

    return () => { 
      if (camera) camera.stop(); 
      hands.close(); 
    };
  }, [onTelemetryUpdate, onPredictionUpdate]);


  // ------------------------------------------------------------------------
  // 🍀 KEYBINDS AND SIGN LOGGING
  // ------------------------------------------------------------------------

  const addSignToMessage = () => {
    setMessage(prevMessage => prevMessage + ' ' + prediction.replace(/\s+/g, '_'))
  }

  const removeSignFromMessage = () => {
        setMessage((prevMessage) => {
        const trimmed = prevMessage.trimEnd();
        const lastSpaceIndex = trimmed.lastIndexOf(' ');

        if (lastSpaceIndex === -1) {
          return "";
        }

        return trimmed.substring(0, lastSpaceIndex);
        });
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      // EDIT: event.key === (key to be pressed to log the sign to the message)
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        if (prediction && prediction != 'Tracking motion...') {
          addSignToMessage();
        }

      // EDIT: event.key === (key to be pressed to delete a sign from the message)
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removeSignFromMessage();

       // EDIT: event.key === (key to be pressed to swap modes) 
      } else if (event.key === 'Enter') {
        
        if (currentMode.current == 'static') {
          setTranslationMode('dynamic');
        } else {
          setTranslationMode('static');
        }

      }
    };

    // Attach the event listener to the window object
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [prediction, setMessage]);


  return (
    <div className="relative w-full aspect-[4/3] md:aspect-video bg-stone-900 rounded-[2.2rem] overflow-hidden shadow-inner flex flex-col items-center justify-center">
      {/* Webcam Video & Skeleton Drawing Layer */}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover -scale-x-100" autoPlay playsInline></video>
      <canvas ref={canvasRef} width="1280" height="720" className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none z-10"></canvas>

      {/* ================= TOP-LEFT BADGE: DETECTED SIGN TEXT ================= */}
      <div className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-stone-700 z-20 flex items-center gap-2 shadow-lg">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        {/* 👉 EDIT HERE: Change "Detecting..." to change what it says when no sign is detected */}
        <span className="text-white text-[30px] font-bold tracking-wide uppercase">
          {prediction ? prediction : "Detecting..."}
        </span>
      </div>

      {/* ================= BOTTOM BUTTONS: STATIC vs DYNAMIC SWITCH ================= */}
      <div className="absolute bottom-6 z-20 flex bg-stone-900/80 backdrop-blur-md rounded-full p-1.5 shadow-xl border border-stone-700">
        
        {/* 👉 EDIT HERE: Button 1 (Static Letters). Change 'bg-emerald-500' to change active button color */}
        <button 
          onClick={() => setTranslationMode('static')} 
          className={`px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-all ${translationMode === 'static' ? 'bg-emerald-500 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
        >
          STATIC MODE
        </button>

        {/* 👉 EDIT HERE: Button 2 (Dynamic Phrases). Change 'bg-indigo-500' to change active button color */}
        <button 
          onClick={() => setTranslationMode('dynamic')} 
          className={`px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-all ${translationMode === 'dynamic' ? 'bg-indigo-500 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
        >
          DYNAMIC MODE
        </button>

      </div>
    </div>
  );
}