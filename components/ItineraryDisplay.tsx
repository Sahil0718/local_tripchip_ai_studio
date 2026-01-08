
import React, { useState } from 'react';
import { TravelItinerary, TripPreferences, ItineraryDay } from '../types';


interface ItineraryDisplayProps {
  itinerary: TravelItinerary;
  preferences: TripPreferences | null;
  onBack: () => void;
  onSave: () => void;
  onUpdateItinerary?: (updated: TravelItinerary) => void;
  onRefineDay?: (dayNumber: number, prompt: string) => Promise<void>;
  isSaved: boolean;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ 
  itinerary, 
  preferences, 
  onBack, 
  onSave, 
  onUpdateItinerary, 
  onRefineDay,
  isSaved 
}) => {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editedDayData, setEditedDayData] = useState<ItineraryDay | null>(null);
  const [dayPrompts, setDayPrompts] = useState<Record<number, string>>({});
  const [refiningDays, setRefiningDays] = useState<Record<number, boolean>>({});

  const handleRefineDayWithAI = async (dayNumber: number) => {
    const prompt = dayPrompts[dayNumber];
    if (!prompt?.trim() || !onRefineDay) return;

    setRefiningDays(prev => ({ ...prev, [dayNumber]: true }));
    try {
      await onRefineDay(dayNumber, prompt);
      setDayPrompts(prev => ({ ...prev, [dayNumber]: '' }));
    } finally {
      setRefiningDays(prev => ({ ...prev, [dayNumber]: false }));
    }
  };

  const handleEditDay = (day: ItineraryDay) => {
    setEditingDay(day.day);
    setEditedDayData(JSON.parse(JSON.stringify(day))); // Deep copy
  };

  const handleSaveDay = () => {
    if (!editedDayData || !onUpdateItinerary) return;
    
    const updatedItinerary = {
      ...itinerary,
      itinerary: itinerary.itinerary.map(d => d.day === editingDay ? editedDayData : d)
    };
    
    onUpdateItinerary(updatedItinerary);
    setEditingDay(null);
    setEditedDayData(null);
  };

  const handleActivityChange = (idx: number, field: string, value: string) => {
    if (!editedDayData) return;
    const newActivities = [...editedDayData.activities];
    newActivities[idx] = { ...newActivities[idx], [field]: value };
    setEditedDayData({ ...editedDayData, activities: newActivities });
  };
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Edit Preferences
        </button>
        
        <div className="flex gap-3">
          {!isSaved && (
            <button 
              onClick={onSave}
              className="px-6 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-black text-xs uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              Save to Library
            </button>
          )}
          {isSaved && (
            <div className="px-6 py-2.5 bg-emerald-50 border-2 border-emerald-100 rounded-xl text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Saved
            </div>
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-[2rem] p-10 mb-8 border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Your Adventure Plan</h1>
            <p className="text-xl text-slate-500 font-medium">
              From <span className="text-indigo-600">{preferences?.origin || 'your location'}</span> to <span className="text-indigo-600">{preferences?.destination || 'Nepal'}</span>
            </p>
          </div>
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-6 text-center min-w-[200px]">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Total Estimated Budget</p>
            <p className="text-3xl font-black text-indigo-700">{itinerary.totalEstimatedCostNPR || 'N/A'}</p>
          </div>
        </div>
        
        <p className="text-lg text-slate-700 leading-relaxed mb-6 border-l-4 border-indigo-500 pl-6 py-2 italic font-medium">{itinerary.overview}</p>
        
        {itinerary.practicalityNote && (
          <div className="mb-10 p-6 bg-amber-50 border-2 border-amber-100 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0 text-amber-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-amber-800 font-black text-sm uppercase tracking-widest mb-1">Expert Practicality Note</h4>
              <p className="text-amber-700 font-bold leading-relaxed">{itinerary.practicalityNote}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-6">Must-Experience Highlights</h3>
            <ul className="space-y-4">
              {itinerary.highlights.map((h, i) => (
                <li key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {i+1}
                  </span>
                  <span className="text-slate-800 font-bold">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>
              </div>
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Logistics & Permits (NPR)</h3>
              <ul className="space-y-5">
                {itinerary.permitsAndLogistics.map((l, i) => (
                  <li key={i} className="flex gap-4 items-start text-slate-300">
                    <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm leading-relaxed font-semibold">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {preferences?.emergencyContact && (
              <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Emergency Contact
                </h3>
                <p className="text-slate-900 font-black text-lg">{preferences.emergencyContact}</p>
                <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-wider">Kept on file for your safety</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <h2 className="text-3xl font-black text-slate-900 mb-8 px-4 flex items-center gap-3">
        <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
        The Daily Itinerary
      </h2>
      <div className="space-y-12 relative mb-20">
        <div className="absolute left-10 top-10 bottom-10 w-1 bg-slate-100 hidden md:block rounded-full"></div>

        {itinerary.itinerary.map((day) => (
          <div key={day.day} className="relative md:pl-24">
            <div className="absolute left-0 top-0 w-20 h-20 bg-white border-4 border-slate-200 rounded-[1.5rem] hidden md:flex items-center justify-center text-slate-900 text-3xl font-black shadow-lg z-10 transition-transform hover:scale-110">
              {day.day}
            </div>

            <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              {editingDay === day.day ? (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <input 
                      className="text-2xl font-black text-slate-900 bg-slate-50 border-2 border-indigo-100 rounded-xl px-6 py-3 w-full outline-none focus:border-indigo-600 transition-all"
                      value={editedDayData?.title}
                      onChange={(e) => setEditedDayData(prev => prev ? {...prev, title: e.target.value} : null)}
                      placeholder="Day Title"
                    />
                    <div className="flex gap-3 shrink-0">
                       <button 
                        onClick={() => setEditingDay(null)}
                        className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveDay}
                        className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 whitespace-nowrap"
                      >
                        Save Day
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {editedDayData?.activities.map((act, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Time</label>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700"
                              value={act.time}
                              onChange={(e) => handleActivityChange(idx, 'time', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location</label>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700"
                              value={act.location}
                              onChange={(e) => handleActivityChange(idx, 'location', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                          <textarea 
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-600 h-24 resize-none"
                            value={act.description}
                            onChange={(e) => handleActivityChange(idx, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-black text-slate-900">{day.title}</h3>
                      <button 
                        onClick={() => handleEditDay(day)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Edit this day"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Daily Est. Cost</span>
                      <span className="text-lg font-black text-slate-700">{day.estimatedCostNPR || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {day.activities.map((act, idx) => (
                      <div key={idx} className="flex gap-8 group">
                        <div className="w-32 text-[10px] font-black text-slate-400 pt-1.5 shrink-0 tracking-widest uppercase leading-loose">{act.time}</div>
                        <div className="flex-grow pb-8 border-b border-slate-50 last:border-0 group-last:pb-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              act.type === 'sightseeing' ? 'bg-sky-100 text-sky-700' :
                              act.type === 'dining' ? 'bg-orange-100 text-orange-700' :
                              act.type === 'travel' ? 'bg-violet-100 text-violet-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {act.type}
                            </span>
                            <h4 className="font-black text-slate-900 text-lg">{act.location}</h4>
                          </div>
                          <p className="text-slate-600 leading-relaxed font-bold">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Day Refinement prompt */}
                  <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <div className="relative">
                        <input 
                          type="text"
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                          placeholder={`Something changed for Day ${day.day}? e.g. "I missed my flight", "It's raining"...`}
                          value={dayPrompts[day.day] || ''}
                          onChange={(e) => setDayPrompts(prev => ({ ...prev, [day.day]: e.target.value }))}
                          disabled={refiningDays[day.day]}
                        />
                        {refiningDays[day.day] && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRefineDayWithAI(day.day)}
                      disabled={!dayPrompts[day.day]?.trim() || refiningDays[day.day]}
                      className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-slate-200 shrink-0 flex items-center gap-2"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 2a.5.5 0 01.9 0l1.5 4.5 4.5 1.5a.5.5 0 010 .9l-4.5 1.5-1.5 4.5a.5.5 0 01-.9 0l-1.5-4.5-4.5-1.5a.5.5 0 010-.9l4.5-1.5 1.5-4.5zM19 10a.4.4 0 01.7 0l.9 2.7 2.7.9a.4.4 0 010 .7l-2.7.9-.9 2.7a.4.4 0 01-.7 0l-.9-2.7-2.7-.9a.4.4 0 010-.7l2.7-.9.9-2.7z" />
                      </svg>
                      {refiningDays[day.day] ? 'Refining...' : 'Refine Day'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Structured Accommodations UI */}
      <div className="mt-20">
        <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
          <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
          Where to Stay in {preferences?.destination.split(',')[0] || 'Nepal'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {itinerary.accommodations.map((stay, i) => (
            <div key={i} className="group bg-white rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest mb-4 border border-white/30 backdrop-blur-sm">
                  {stay.category}
                </span>
                <h4 className="text-2xl font-black leading-tight mb-3 group-hover:translate-x-1 transition-transform">{stay.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{stay.priceNPR}</span>
                  <span className="text-xs opacity-75 font-bold">/ night</span>
                </div>
              </div>
              <div className="p-8 flex-grow bg-white">
                <p className="text-slate-600 text-sm leading-relaxed font-bold">{stay.description}</p>
              </div>
              <div className="px-8 pb-8 bg-white">
                <button className="w-full py-4 bg-slate-900 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                  Book with Local Partners
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grounding Sources */}
      {itinerary.groundingSources && itinerary.groundingSources.length > 0 && (
        <div className="mt-20 p-10 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">Verified Information Sources</h4>
          <div className="flex flex-wrap gap-4">
            {itinerary.groundingSources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-slate-300 hover:text-white flex items-center gap-3 bg-slate-800/50 px-5 py-3 rounded-2xl border border-slate-700/50 transition-all hover:border-indigo-500/50"
              >
                <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"/><path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"/></svg>
                <span className="font-bold">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-20 text-center pb-20">
        {!isSaved ? (
          <button 
            onClick={onSave}
            className="px-12 py-7 bg-indigo-600 text-white font-black rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-110 transition-transform active:scale-95 text-lg uppercase tracking-widest flex items-center gap-4 mx-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
            Save Itinerary
          </button>
        ) : (
          <div className="px-12 py-7 bg-emerald-600 text-white font-black rounded-full shadow-2xl flex items-center gap-4 mx-auto w-fit">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Successfully Saved
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
