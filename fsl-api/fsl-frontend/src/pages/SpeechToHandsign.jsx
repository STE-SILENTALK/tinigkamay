import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mic, MicOff, Volume2, Video, RotateCcw } from 'lucide-react';

// ============================================================================
// PHONETIC CORRECTION DICTIONARY
// 👉 EDIT HERE: If the microphone mishears a Tagalog or English word/letter,
// add it inside this list!
// Format: "WHAT_THE_MIC_HEARD": "WHAT_YOU_ACTUALLY_MEANT" (Always use ALL CAPS)
// Example: If you say "Salamat" and the mic types "SALAMA", add: "SALAMA": "SALAMAT",
// ============================================================================
const phoneticCorrections = {
  "SI": "C", "EY": "A", "BI": "B", "DI": "D", "EE": "E",
  "EF": "F", "DYI": "G", "EYTS": "H", "DJEY": "J", "KEY": "K", 
  "EL": "L", "EM": "M", "EN": "N", "PI": "P", "KYU": "Q", 
  "AR": "R", "ES": "S", "TI": "T", "YU": "U", "VI": "V", 
  "WAY": "Y", "ZI": "Z",
  "JAY": "J", "TEA": "T", "BEE": "B", "CEE": "C", "DEE": "D", 
  "PEE": "P", "VEE": "V", "EX": "X", "WHY": "Y", "ZEE": "Z",
  "AY": "I", "OU": "O", "OH": "O", "YOU": "U", "SEA": "C", "EYE": "I"
};

// ============================================================================
// SPEECH TO HANDSIGN PAGE (SpeechToHandsign.jsx)
// Listens to your voice through the microphone, converts it into text, fixes
// common misheard words, and plays the matching .mp4 sign language video!
// ============================================================================
export default function SpeechToHandsign() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const [playlist, setPlaylist] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoError, setVideoError] = useState(false); // Tracks if a video file is missing
  
  // References for controlling the microphone and the HTML <video> player
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  // --------------------------------------------------------------------------
  // TEXT-TO-FILENAME CONVERTER
  // Turns spoken words (e.g., "Magandang gabi!") into a video filename ("MAGANDANG-GABI")
  // --------------------------------------------------------------------------
  const processSpeechToSign = (text) => {
    const rawWords = text.toUpperCase().replace(/[^A-Z0-9 ]/g, "").split(" ").filter(Boolean);
    const correctedWords = rawWords.map(word => phoneticCorrections[word] || word);
    const finalFileName = correctedWords.join("-");
    
    if (finalFileName) {
      setVideoError(false);
      setPlaylist([finalFileName]);
      setCurrentVideoIndex(0);
    }
  };

  useEffect(() => {
    // Uses the browser's built-in Speech Recognition (Works best in Google Chrome or Edge)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stops listening automatically after you finish a sentence
      recognition.interimResults = true; // Shows words on screen while you are still talking

      // ----------------------------------------------------------------------
      // 👉 EDIT HERE: Microphone Language
      // - 'fil-PH' = Filipino / Tagalog (also understands English words)
      // - 'en-US'  = American English only
      // ----------------------------------------------------------------------
      recognition.lang = 'fil-PH';

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);

        // Once the user finishes speaking, convert the sentence into a video filename
        if (event.results[0].isFinal) {
          processSpeechToSign(currentText);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  // Turns the microphone ON or OFF when clicking the big circle button
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setPlaylist([]);
      setVideoError(false);
      setCurrentVideoIndex(0);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Moves to the next video if multiple videos are in the playlist
  const handleVideoEnd = () => {
    if (currentVideoIndex < playlist.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    }
  };

  // Rewinds and replays the current sign language video when clicking the Replay icon
  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Rewind to 0 seconds
      videoRef.current.play();          // Play again
    }
  };

  const activeWord = playlist[currentVideoIndex] || '';

  // --------------------------------------------------------------------------
  // 👉 EDIT HERE: Video Folder Location
  // By default, it looks inside `fsl-frontend/public/signs/` for `WORD.mp4`.
  // --------------------------------------------------------------------------
  const currentSignUrl = activeWord && !videoError ? `/signs/${activeWord}.mp4` : null;

  return (
    <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto px-6 py-8">
      
      {/* ================= TOP PAGE HEADER ================= */}
      <div className="text-center mb-8">
        {/* 👉 EDIT HERE: Page Title */}
        <h1 className="text-stone-800 text-3xl font-black mb-2">Speech to Handsign</h1>
        <Link to="/" className="inline-block text-xs font-black text-stone-400 uppercase hover:text-stone-600 transition-colors">
          ← Back to Workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        
        {/* ================================================================== */}
        {/* LEFT COLUMN: MICROPHONE & VOICE INPUT                              */}
        {/* ================================================================== */}
        <div className="bg-[#FAF8F5] border-8 border-white rounded-[3rem] p-8 shadow-sm flex flex-col items-center justify-between min-h-[420px]">
          <div className="w-full text-center">
            {/* 👉 EDIT HERE: Instructions above the microphone button */}
            <span className="text-[11px] font-black tracking-widest text-stone-400 uppercase">Voice Input</span>
            <p className="text-stone-700 text-sm font-semibold mt-1">
              Click the microphone button and speak clearly into your device.
            </p>
          </div>

          {/* Big Microphone Circle Button */}
          {/* 👉 EDIT HERE: Change 'bg-red-500' (recording color) or 'bg-stone-800' (idle color) */}
          <div className="my-6">
            <button
              onClick={toggleListening}
              className={`relative flex items-center justify-center w-28 h-28 rounded-full transition-all shadow-xl ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200' 
                  : 'bg-stone-800 text-white hover:bg-stone-900 hover:scale-105'
              }`}
            >
              {isListening ? <MicOff size={40} /> : <Mic size={40} />}
            </button>
          </div>

          {/* Box showing the spoken words recognized by the microphone */}
          <div className="w-full bg-white border-2 border-stone-200/80 rounded-2xl p-5 text-center shadow-inner">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Volume2 size={16} className="text-stone-400" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Recognized Text</span>
            </div>
            {/* 👉 EDIT HERE: Placeholder text before the user speaks */}
            <p className="text-stone-800 font-bold text-lg min-h-[28px] leading-snug">
              {transcript || (isListening ? "Listening..." : "Your spoken words will appear here")}
            </p>
          </div>
        </div>

        {/* ================================================================== */}
        {/* RIGHT COLUMN: SIGN LANGUAGE VIDEO PLAYER                           */}
        {/* ================================================================== */}
        <div className="bg-[#FAF8F5] border-8 border-white rounded-[3rem] p-8 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black tracking-widest text-stone-400 uppercase">FSL Translation Output</span>
              {/* Green badge showing which word/phrase is currently loaded */}
              {activeWord && (
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Target Sign:</span>
                  <span className="underline decoration-2 underline-offset-2">{activeWord}</span>
                </span>
              )}
            </div>

            {/* Video Player Box */}
            <div className="relative w-full aspect-video bg-stone-900 rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-stone-800 shadow-inner group">
              {currentSignUrl ? (
                <>
                  <video 
                    ref={videoRef}
                    key={currentSignUrl}
                    src={currentSignUrl} 
                    autoPlay 
                    muted 
                    onEnded={handleVideoEnd}
                    onError={() => setVideoError(true)} // Shows "No video file found" if the .mp4 doesn't exist
                    className="w-full h-full object-cover"
                  />
                  {/* Floating Replay Button (Appears when hovering mouse over the video) */}
                  <button
                    onClick={replayVideo}
                    className="absolute bottom-4 right-4 bg-stone-800/80 hover:bg-emerald-500 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                    title="Replay Video"
                  >
                    <RotateCcw size={24} />
                  </button>
                </>
              ) : (
                /* Shown when waiting for speech OR when the .mp4 file is missing from public/signs/ */
                <div className="text-center px-6">
                  <Video size={40} className="text-stone-600 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-stone-400 font-bold text-sm">
                    {playlist.length === 0 ? "Sign video animation will play here" : `No video file found for "${activeWord}"`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Helper Tip reminding developers where to put the .mp4 files */}
          <div className="bg-stone-200/60 rounded-2xl p-4 text-center mt-4">
            <p className="text-stone-600 text-xs font-bold flex flex-col gap-1">
              <span>Ensure your video file is named exactly:</span>
              <code className="bg-white px-2 py-1 rounded text-stone-800 font-mono text-[11px] shadow-sm">
                public/signs/{activeWord || "[phrase]"}.mp4
              </code>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}