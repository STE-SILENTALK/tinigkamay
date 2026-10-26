import { Link, useLocation } from 'react-router-dom';
import { Settings, Hand, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

// ============================================================================
// TOP NAVIGATION BAR (Navbar.jsx)
// This is the header bar at the very top of your website.
// ============================================================================
export default function Navbar() {
  // Checks which page the user is currently looking at (e.g., '/admin', '/translate')
  const location = useLocation();

  // --------------------------------------------------------------------------
  // 👉 EDIT HERE: Default Status Text & Colors (when on the Home Menu '/')
  // --------------------------------------------------------------------------
  let statusText = "Workspace Idle";      // Change text inside quotes to rename status
  let statusColor = "text-stone-500";     // Text color (Tailwind CSS class)
  let dotColor = "bg-stone-300";          // Little circle dot color

  // --------------------------------------------------------------------------
  // 👉 EDIT HERE: Status Text & Colors when inside the Admin Page ('/admin')
  // --------------------------------------------------------------------------
  if (location.pathname === '/admin') {
    statusText = "Secure Portal";         // Text shown when in Admin page
    statusColor = "text-amber-600";       // Orange/Amber text color
    dotColor = "bg-amber-400";            // Orange/Amber dot color
  } 
  // --------------------------------------------------------------------------
  // 👉 EDIT HERE: Status Text & Colors when using Camera or Mic ('/translate' or '/speech')
  // --------------------------------------------------------------------------
  else if (location.pathname === '/translate' || location.pathname === '/speech') {
    statusText = "Translating Live";      // Text shown when translating
    statusColor = "text-emerald-600";     // Green text color
    dotColor = "bg-emerald-400";          // Green dot color
  }

  // --------------------------------------------------------------------------
  // 🍀 Dark Mode Toggle
  // --------------------------------------------------------------------------

  // useState to check darkMode status
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);


  // useState for 500ms button cooldown
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setTimeout(() => {
      setCooldown(cooldown - 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [cooldown]);

  
  // dark mode toggler
  const toggleDarkMode = () => {
    if (cooldown > 0) return;
    document.documentElement.classList.toggle('dark');
    setCooldown(1);
  };

  return (
    // 👉 EDIT HERE: Change bg-[#FAF8F5] to change the background color of the whole top bar
    <nav className="w-full bg-[#FAF8F5] h-[80px] flex items-center justify-between px-8 border-b-4 border-white shadow-sm z-10 relative">
      
      {/* ================= LEFT SIDE: LOGO & WEBSITE TITLE ================= */}
      <div className="flex items-center gap-6">
        
        <Link to="/" className="flex items-center gap-4 hover:bg-blue-200 p-5" title="Return to Workspace">

        {/* 👉 EDIT HERE: Green Hand Icon Box. Change 'bg-emerald-600' to change the icon box color */}
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md rotate-0  ">
          <Hand size={28} strokeWidth={2.5} />  
        </div>

        {/* 👉 EDIT HERE: Website Main Title & Small Subtitle */}
        <div>
          <h1 className="text-stone-800 font-black text-2xl tracking-tight leading-tight">
            TINIGKAMAY
          </h1>
          <p className="text-stone-500 text-[10px] font-black tracking-[0.2em] uppercase">
            MAY TINIG KA!
          </p>
        </div>

        </Link>

        {/* Dark Mode Button */}
        <button onClick={toggleDarkMode} className={`text-stone-900 font-black text-sm flex items-center bg-stone-200 px-6 py-3 rounded-full hover:bg-stone-300 transition-colors shadow-sm group overflow-hidden ${cooldown > 0 ? 'cursor-not-allowed opacity-50' : ''}`}>
          {isDarkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          <span className="max-w-0 opacity-0 whitespace-nowrap transition-all duration-500 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2x group-hover:pl-2">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

      </div>

      {/* ================= RIGHT SIDE: STATUS PILL & ADMIN BUTTON ================= */}
  
      <div className="flex items-center gap-6">
        
        {/* Status Box (Shows "Workspace Idle", "Translating Live", etc.) */}
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-full shadow-sm border-2 border-stone-100">
          <div className="text-right hidden md:block">
            {/* 👉 EDIT HERE: Small label above the status text */}
            <p className="text-stone-400 text-[10px] font-black tracking-widest uppercase">
              System Status
            </p>
            <p className={`${statusColor} font-black text-sm tracking-wide`}>
              {statusText}
            </p>
          </div>

          {/* Blinking circle dot (Only blinks when NOT on the home page '/') */}
          <div className="relative flex h-3 w-3">
            {location.pathname !== '/' && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`}></span>
          </div>
        </div>

        <Link to="/about" className="text-stone-900 font-black text-sm flex items-center gap-2 bg-stone-200 px-6 py-3 rounded-full hover:bg-stone-300 transition-colors shadow-sm">
        ABOUT
        </Link>

        {/* 👉 EDIT HERE: "ADMIN" Button. 
            - Change to="/admin" if you rename the admin URL route.
            - Change 'bg-emerald-200' to change the button background color.
            - Change <span>ADMIN</span> to rename the button text. */}
        <Link to="/admin" className="text-emerald-900 font-black text-sm flex items-center bg-emerald-200 px-6 py-3 rounded-full hover:bg-emerald-300 transition-colors shadow-sm group overflow-hidden">
          <Settings size={18} strokeWidth={2.5} />
          <span className="max-w-0 opacity-0 whitespace-nowrap transition-all duration-500 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2x group-hover:pl-2">
          ADMIN
          </span>
        </Link>

      </div>
    </nav>
  );
}