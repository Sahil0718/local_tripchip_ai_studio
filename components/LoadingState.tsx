
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Scouting the best local gems...",
  "Consulting local travel experts...",
  "Checking for the latest permit regulations...",
  "Finding hidden eateries just for you...",
  "Mapping out your perfect route...",
  "Finalizing your personalized itinerary..."
];

interface LoadingStateProps {
  destination: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ destination }) => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Planning your trip to {destination}</h2>
      <p className="text-slate-500 animate-pulse transition-opacity duration-500">{MESSAGES[msgIdx]}</p>
      <p className="mt-12 text-xs text-slate-400 uppercase tracking-widest font-semibold">Powered by Gemini 2.5 Flash</p>
    </div>
  );
};

export default LoadingState;
