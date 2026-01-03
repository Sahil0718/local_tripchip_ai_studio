
import React, { useState } from 'react';
import { TripPreferences } from '../types';
import VoiceInput from './VoiceInput';

interface PlannerFormProps {
  onSubmit: (prefs: TripPreferences) => void;
  initialData: TripPreferences | null;
}

const INTEREST_OPTIONS = [
  'Culture & History', 'Nature & Outdoors', 'Adventure Sports', 
  'Food & Dining', 'Photography', 'Nightlife', 'Relaxation', 'Shopping'
];

const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, initialData }) => {
  const [prefs, setPrefs] = useState<TripPreferences>(initialData || {
    destination: '',
    duration: '5 days',
    budget: 'moderate',
    groupSize: '2 people',
    interests: [],
    travelStyle: 'Balanced',
    otherDetails: '',
    emergencyContact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  const toggleInterest = (interest: string) => {
    setPrefs(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleVoiceTranscription = (text: string) => {
    setPrefs(prev => ({ ...prev, otherDetails: (prev.otherDetails ? prev.otherDetails + ' ' : '') + text }));
  };

  const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-slate-900 placeholder-slate-400 shadow-sm font-semibold text-base";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-12 text-white relative">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none p-8">
           <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M10.18 9l-.42-2H4V5h4.79l.42 2H10V9zM19 13l-.42-2H13V9h4.79l.42 2H20v2h-1z" /></svg>
        </div>
        <h2 className="text-4xl font-black tracking-tight mb-2">Build Your Trip</h2>
        <p className="text-indigo-200 font-medium text-lg">Personalized AI itinerary for Nepal and beyond.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-10 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Destination */}
          <div className="col-span-full">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Target Destination</label>
            <input
              type="text"
              required
              className={`${inputClasses} text-2xl border-slate-300`}
              placeholder="e.g. Upper Mustang, Nepal"
              value={prefs.destination}
              onChange={e => setPrefs({ ...prefs, destination: e.target.value })}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">How many days?</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. 7 days"
              value={prefs.duration}
              onChange={e => setPrefs({ ...prefs, duration: e.target.value })}
            />
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Group Composition</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="e.g. 2 adults"
              value={prefs.groupSize}
              onChange={e => setPrefs({ ...prefs, groupSize: e.target.value })}
            />
          </div>

          {/* Emergency Contact */}
          <div className="col-span-full">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Emergency Contact Info</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="Full Name and Phone Number (e.g., John Doe +977-980...)"
              value={prefs.emergencyContact}
              onChange={e => setPrefs({ ...prefs, emergencyContact: e.target.value })}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Expense Level</label>
            <div className="grid grid-cols-3 gap-3">
              {(['budget', 'moderate', 'luxury'] as const).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setPrefs({ ...prefs, budget: b })}
                  className={`py-4 px-3 rounded-2xl border-2 font-black capitalize transition-all text-sm ${
                    prefs.budget === b 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Preferred Pace</label>
            <select
              className={inputClasses}
              value={prefs.travelStyle}
              onChange={e => setPrefs({ ...prefs, travelStyle: e.target.value })}
            >
              <option>Relaxed & Chill</option>
              <option>Balanced</option>
              <option>Fast-paced & Busy</option>
              <option>Luxury Oriented</option>
              <option>Adventure Seeking</option>
            </select>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5">Select Your Focus</label>
          <div className="flex flex-wrap gap-3">
            {INTEREST_OPTIONS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-6 py-3 rounded-full border-2 text-sm font-bold transition-all ${
                  prefs.interests.includes(interest)
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Other Details with Voice */}
        <div className="relative">
          <label className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
            Extra Preferences
            <VoiceInput onTranscription={handleVoiceTranscription} />
          </label>
          <textarea
            className={`${inputClasses} h-48 resize-none leading-relaxed text-lg`}
            placeholder="Dietary needs, specific landmarks you MUST see, or accessibility requirements..."
            value={prefs.otherDetails}
            onChange={e => setPrefs({ ...prefs, otherDetails: e.target.value })}
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Generate Itinerary</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">Takes about 15-30 seconds</p>
        </div>
      </form>
    </div>
  );
};

export default PlannerForm;
