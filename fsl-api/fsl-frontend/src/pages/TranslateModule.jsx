import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Copy, ChevronDown } from 'lucide-react';
import HandsignToText from '../components/HandsignToText';

// ============================================================================
// CAMERA TRANSLATION WORKSPACE PAGE (TranslateModule.jsx)
// This page holds the webcam screen (HandsignToText.jsx) on the left side,
// and the "Model Telemetry" (confidence % and hand indicator) + "Cheat Sheet"
// on the right side.
// ============================================================================
export default function TranslateModule() {
  // 👉 EDIT HERE: Change `false` to `true` if you want the FSL Cheat Sheet open automatically when the page loads
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // 👉 EDIT HERE: Change `true` to `false` if you want the camera turned OFF when first opening the page
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Stores the live hand name ("Left", "Right", "Both Hands") and confidence % sent up from HandsignToText.jsx
  const [telemetry, setTelemetry] = useState({ hand: 'Waiting...', confidence: 0 });
  const [currentPredictionText, setCurrentPredictionText] = useState("");

  // Copies the currently detected sign/word to the user's clipboard when clicking "Copy Text"
  const handleCopy = () => {
    if (!currentPredictionText) return;
    navigator.clipboard.writeText(currentPredictionText);
    setCopied(true);
    // Resets the "Copied!" button text back to "Copy Text" after 2000ms (2 seconds)
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center mt-6 w-full px-6 max-w-7xl mx-auto mb-12">
       
       {/* ================= TOP PAGE HEADER & BACK BUTTON ================= */}
       <div className="flex w-full justify-between items-center mb-4">
         <div>
           {/* 👉 EDIT HERE: Page Title and Subtitle */}
           <h2 className="text-stone-800 text-3xl font-black tracking-tight">Camera Translation Workspace</h2>
           <p className="text-stone-500 text-xs font-medium">Real-time FSL recognition and telemetry control panel.</p>
         </div>
         <Link to="/" className="bg-white border-2 border-stone-200 text-stone-700 hover:text-stone-900 font-black tracking-widest uppercase text-xs px-6 py-2.5 rounded-full transition-colors shadow-sm">
           ← Back to Workspace
         </Link>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
         
         {/* ================================================================ */}
         {/* LEFT COLUMN: WEBCAM BOX & BOTTOM ACTION BUTTONS                  */}
         {/* ================================================================ */}
         <div className="lg:col-span-7 flex flex-col gap-4">
           
           {/* Webcam Container Box */}
           <div className="w-full bg-[#FAF8F5] p-5 rounded-[2.5rem] shadow-[0_15px_30px_rgba(168,162,158,0.15)] border-8 border-white flex justify-center">
              {isCameraActive ? (
                <HandsignToText 
                  onTelemetryUpdate={setTelemetry} 
                  onPredictionUpdate={setCurrentPredictionText} 
                />
              ) : (
                /* 👉 EDIT HERE: Message shown inside the black box when the camera is turned off */
                <div className="w-full aspect-[4/3] md:aspect-video bg-stone-900 rounded-[2.2rem] shadow-inner flex items-center justify-center text-stone-400 font-bold">
                  Camera Paused
                </div>
              )}
           </div>

           {/* Bottom Toolbar under the Camera (Turn Off Camera & Copy Text buttons) */}
           <div className="bg-[#FAF8F5] px-6 py-4 rounded-[1.8rem] shadow-sm border-4 border-white flex items-center justify-between gap-4">
             
             {/* Button 1: Turn Camera On / Off */}
             <button 
               onClick={() => setIsCameraActive(!isCameraActive)}
               className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-black tracking-wider uppercase px-5 py-3 rounded-full transition-colors shadow-sm cursor-pointer"
             >
               <Camera size={16} />
               <span>{isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}</span>
             </button>

             {/* Button 2: Copy Translated Text */}
             {/* 👉 EDIT HERE: Change 'bg-emerald-200' to change the Copy button color */}
             <button 
               onClick={handleCopy}
               className="flex items-center gap-2 bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-xs font-black tracking-wider uppercase px-5 py-3 rounded-full transition-colors shadow-sm cursor-pointer"
             >
               <Copy size={16} />
               <span>{copied ? 'Copied!' : 'Copy Text'}</span>
             </button>
           </div>
         </div>

         {/* ================================================================ */}
         {/* RIGHT COLUMN: MODEL TELEMETRY & QUICK REFERENCE CHEAT SHEET      */}
         {/* ================================================================ */}
         <div className="lg:col-span-5 flex flex-col gap-4">
           
           {/* Box 1: Model Telemetry Card */}
           <div className="bg-[#FAF8F5] p-6 rounded-[2.5rem] shadow-[0_15px_35px_rgba(168,162,158,0.15)] border-4 border-white flex flex-col gap-4">
             <div>
               {/* 👉 EDIT HERE: Telemetry Card Title & Subtitle */}
               <h3 className="text-stone-800 font-black text-base tracking-tight mb-0.5">Model Telemetry</h3>
               <p className="text-stone-500 text-[11px] font-medium">Live metrics from tracking pipeline.</p>
             </div>
             
             {/* Confidence Score Progress Bar */}
             <div className="bg-white p-4 rounded-2xl border-2 border-stone-100 flex flex-col gap-1.5 shadow-inner">
               <div className="flex justify-between text-xs font-black">
                 <span className="text-stone-500 text-[11px]">Confidence Score Meter</span>
                 <span className="text-emerald-700 text-xs">{telemetry.confidence}%</span>
               </div>
               <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                 {/* 👉 EDIT HERE: Change 'bg-emerald-500' to change the moving progress bar color */}
                 <div 
                   className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out" 
                   style={{ width: `${telemetry.confidence}%` }}
                 ></div>
               </div>
             </div>

             {/* Detected Hand Badge ("Waiting...", "Left", "Right", or "Both Hands") */}
             <div className="bg-white p-4 rounded-2xl border-2 border-stone-100 flex items-center justify-between shadow-inner">
               <span className="text-stone-500 text-[11px] font-black">Detected Hand Indicator</span>
               <span className={`${telemetry.hand === 'Waiting...' ? 'text-stone-500 bg-stone-100' : 'text-emerald-800 bg-emerald-100'} text-[11px] font-black px-3 py-1 rounded-xl uppercase tracking-wider transition-colors`}>
                 {telemetry.hand}
               </span>
             </div>
           </div>

           {/* Box 2: Expandable Quick Reference Guide (Accordion) */}
           <div className="bg-[#FAF8F5] p-5 rounded-[2.5rem] shadow-[0_15px_35px_rgba(168,162,158,0.15)] border-4 border-white flex flex-col">
             <button 
               onClick={() => setIsAccordionOpen(!isAccordionOpen)}
               className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-stone-100 text-stone-800 font-black text-xs tracking-wide shadow-inner transition-colors cursor-pointer"
             >
               {/* 👉 EDIT HERE: Dropdown Button Title */}
               <span>Quick Reference Guide (FSL Cheat Sheet)</span>
               <ChevronDown size={16} className={`transition-transform duration-300 ${isAccordionOpen ? 'rotate-180' : ''}`} />
             </button>

             {/* ------------------------------------------------------------ */}
             {/* 👉 EDIT HERE: Cheat Sheet Bullet Points                      */}
             {/* Add more <li>...</li> lines below to list the letters or     */}
             {/* phrases you trained so users know what signs to try!         */}
             {/* ------------------------------------------------------------ */}
             {isAccordionOpen && (
               <div className="mt-3 p-4 bg-white rounded-2xl border-2 border-stone-100 text-[11px] text-stone-600 font-medium flex flex-col gap-2 shadow-inner">
                 <p className="font-bold text-stone-700">Supported Signs / Letters:</p>
                 <ul className="list-disc list-inside space-y-1 text-stone-500">
                   <li>A</li>
                   <li>B</li>
                   <li>C</li>
                   <li>D</li>
                   <li>E</li>
                   <li>F</li>
                   <li>G</li>
                   <li>H</li>
                   <li>I</li>
                   <li>J</li>
                   <li>K</li>
                   <li>L</li>
                   <li>M</li>
                   <li>N</li>
                   <li>NG</li>
                   <li>O</li>
                   <li>P</li>
                   <li>Q</li>
                   <li>R</li>
                   <li>S</li>
                   <li>T</li>
                   <li>U</li>
                   <li>V</li>
                   <li>W</li>
                   <li>X</li>
                   <li>Y</li>
                   <li>Z</li>
                   <li>1</li>
                   <li>2</li>
                   <li>3</li>
                   <li>MAHAL KITA</li>

                 </ul>
               </div>
             )}
           </div>

         </div>
       </div>
    </div>
  );
}