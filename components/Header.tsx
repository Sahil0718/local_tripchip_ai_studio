
import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
  onSavedClick: () => void;
  onAboutClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onHomeClick, 
  onSavedClick, 
  onAboutClick, 
  onLoginClick, 
  onLogout, 
  isLoggedIn, 
  username 
}) => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-200">
            T
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Trip<span className="text-indigo-600">Chip</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <button onClick={onHomeClick} className="hover:text-indigo-600 transition-colors uppercase tracking-widest text-[10px]">Planner</button>
          <button onClick={onSavedClick} className="hover:text-indigo-600 transition-colors uppercase tracking-widest text-[10px]">Saved Trips</button>
          <button onClick={onAboutClick} className="hover:text-indigo-600 transition-colors uppercase tracking-widest text-[10px]">About</button>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-700">Hi, {username}</span>
              <button 
                onClick={onLogout}
                className="px-5 py-2 text-xs font-black text-slate-700 bg-slate-100 rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-5 py-2 text-xs font-black text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
            >
              Login
            </button>
          )}
          <button 
            onClick={onHomeClick}
            className="hidden sm:block px-5 py-2 text-xs font-black text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
          >
            New Trip
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
