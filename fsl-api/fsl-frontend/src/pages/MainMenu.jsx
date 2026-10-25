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
          <h2 className="text-stone-800 text-5xl font-black tracking-tight mb-3
                        dark:text-mist-200">
            Welcome to TINIGKAMAY!
          </h2>
          <p className="text-stone-500 font-medium
                        dark:text-mist-400">
            Select a translation module below to get started.
          </p>
        </div>

        {/* 👉 EDIT HERE: Main Cream Container Box. Change bg-[#FAF8F5] to change the outer container background color */}
        <div className="bg-[#FAF8F5] w-full rounded-[3.5rem] shadow-[0_20px_40px_rgba(168,162,158,0.2)] border-8 border-white flex flex-col items-center justify-center p-12 gap-8`
                        dark:bg-mist-800 dark:border-mist-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            
            {/* ============================================================== */}
            {/* CARD 1: HANDSIGN TO TEXT (Camera Module)                       */}
            {/* 👉 EDIT HERE: Change to="/translate" only if you change the URL route in App.jsx */}
            {/* ============================================================== */}
            <Link to="/translate" className="bg-white border-4 border-white p-10 w-full rounded-[2.5rem] shadow-[0_10px_25px_rgba(168,162,158,0.15)] hover:-translate-y-2 hover:shadow-[0_20px_35px_rgba(168,162,158,0.25)] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center
                                            dark:bg-mist-700 dark:border-mist-500">
              
              {/* 👉 EDIT HERE: Green Video Camera Icon Circle. Change 'bg-emerald-100' and 'text-emerald-700' to change colors */}
              <div className="text-emerald-700 mb-6 bg-emerald-100 w-20 h-20 flex items-center justify-center rounded-full group-hover:rotate-12 transition-all shadow-inner
                              dark:text-emerald-50 dark:bg-emerald-600">
                <Video size={36} strokeWidth={2.5} />
              </div>

              {/* 👉 EDIT HERE: Card 1 Title and Description */}
              <h3 className="text-stone-800 font-black text-2xl mb-3 tracking-tight
                            dark:text-mist-300">
                Handsign to Text
              </h3>
              <p className="text-stone-500 text-sm mb-8 font-medium leading-relaxed
                            dark:text-mist-400">
                Use your camera to translate FSL to text in real-time.
              </p>

              {/* 👉 EDIT HERE: Card 1 Button Text & Color ('bg-emerald-200') */}
              <div className="mt-auto bg-emerald-200 text-emerald-900 text-sm font-black tracking-wide px-8 py-4 rounded-full group-hover:bg-emerald-300 transition-colors w-full shadow-sm
                              dark:text-emerald-100 dark:bg-emerald-700 dark:group-hover:bg-emerald-800 dark:group-hover:text-emerald-50">
                Open Module
              </div>
            </Link>

            {/* ============================================================== */}
            {/* CARD 2: SPEECH TO HANDSIGN (Microphone Module)                 */}
            {/* 👉 EDIT HERE: Change to="/speech" only if you change the URL route in App.jsx */}
            {/* ============================================================== */}
            <Link to="/speech" className="bg-white border-4 border-white p-10 w-full rounded-[2.5rem] shadow-[0_10px_25px_rgba(168,162,158,0.15)] hover:-translate-y-2 hover:shadow-[0_20px_35px_rgba(168,162,158,0.25)] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center
                                          dark:bg-mist-700 dark:border-mist-500">
              
              {/* 👉 EDIT HERE: Yellow/Amber Microphone Icon Circle. Change 'bg-amber-100' and 'text-amber-700' to change colors */}
              <div className="text-amber-700 mb-6 bg-amber-100 w-20 h-20 flex items-center justify-center rounded-full group-hover:-rotate-12 transition-all shadow-inner
                              dark:bg-amber-500 dark:text-amber-50">
                <Mic size={36} strokeWidth={2.5} />
              </div>

              {/* 👉 EDIT HERE: Card 2 Title and Description */}
              <h3 className="text-stone-800 font-black text-2xl mb-3 tracking-tight
                            dark:text-mist-300">
                Speech to Handsign
              </h3>
              <p className="text-stone-500 text-sm mb-8 font-medium leading-relaxed
                            dark:text-mist-400">
                Convert spoken words into animated sign language.
              </p>

              {/* 👉 EDIT HERE: Card 2 Button Text & Color ('bg-amber-200') */}
              <div className="mt-auto bg-amber-200 text-amber-900 text-sm font-black tracking-wide px-8 py-4 rounded-full group-hover:bg-amber-300 transition-colors w-full shadow-sm
                              dark:bg-amber-600 dark:text-amber-100 dark:group-hover:bg-amber-700 dark:group-hover:text-amber-50">
                Open Module
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}