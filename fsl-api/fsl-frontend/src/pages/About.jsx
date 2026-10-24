import { Link } from 'react-router-dom';
import { Video, Mic } from 'lucide-react';

// ============================================================================
// HOME PAGE / MAIN MENU (MainMenu.jsx)
// This is the very first screen users see when they open the website.
// It shows the two big selection cards: "Handsign to Text" and "Speech to Handsign".
// ============================================================================
export default function MainMenu() {
  return (
    <div className="flex flex-col items-center flex-1 w-full mt-12 px-6">
      <div className="w-full max-w-5xl">
        
        {/* ================= TOP WELCOME HEADING ================= */}
        {/* 👉 EDIT HERE: Main welcome question and small instruction text */}
        <div className="mb-10 text-center">
          <h2 className="text-stone-800 text-5xl font-black tracking-tight mb-3">
            TINIGKAMAY
          </h2>
          <p className="text-stone-500 font-medium">
            Bridging the Communication of Filipino Deaf and Hearing People Using Bidirectional Web-App Translation System
          </p>
        </div>

        {/* 👉 EDIT HERE: Main Cream Container Box. Change bg-[#FAF8F5] to change the outer container background color */}
        <div className="bg-[#FAF8F5] w-full rounded-[3.5rem] shadow-[0_20px_40px_rgba(168,162,158,0.2)] border-8 border-white flex flex-col items-center justify-center p-12 gap-8">
        </div>
      </div>
    </div>
  );
}