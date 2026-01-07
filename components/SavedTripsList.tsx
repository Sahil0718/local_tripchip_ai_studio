
import React from 'react';
import { SavedTrip } from '../types';
import Snowfall from 'react-snowfall';

interface SavedTripsListProps {
  trips: SavedTrip[];
  onView: (trip: SavedTrip) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const SavedTripsList: React.FC<SavedTripsListProps> = ({ trips, onView, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <Snowfall color="#82C3D9" />
      {trips.map((trip) => (
        <div 
          key={trip.id}
          onClick={() => onView(trip)}
          className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col h-full"
        >
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={(e) => onDelete(trip.id, e)}
              className="p-2 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-red-600 shadow-sm transition-colors border border-slate-100"
              title="Delete trip"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <div className="bg-indigo-600 h-32 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <path d="M0 100 L50 20 L100 100 Z" fill="currentColor" />
                </svg>
             </div>
             <span className="text-white/30 font-black text-6xl uppercase tracking-tighter select-none">
                {trip.preferences.destination.slice(0, 3)}
             </span>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-black text-slate-900 line-clamp-1">
                {trip.preferences.origin} → {trip.preferences.destination}
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                {trip.preferences.duration} • {trip.preferences.budget} {trip.itinerary.totalEstimatedCostNPR ? `• ${trip.itinerary.totalEstimatedCostNPR}` : ''}
              </p>
            </div>
            
            <p className="text-slate-600 text-sm line-clamp-2 mb-6 font-medium flex-grow">
              {trip.itinerary.overview}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                 </div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">View Itinerary</span>
              </div>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                {new Date(trip.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedTripsList;
