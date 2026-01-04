
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, TripPreferences, TravelItinerary, SavedTrip } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import PlannerForm from './components/PlannerForm';
import LoadingState from './components/LoadingState';
import ItineraryDisplay from './components/ItineraryDisplay';
import SavedTripsList from './components/SavedTripsList';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import CollaboratedHotels from './components/CollaboratedHotels';
import { generateTripPlan } from './services/geminiService';
import axios from 'axios';

const STORAGE_KEY = 'tripchip_saved_plans';
const AUTH_KEY = 'tripchip_auth';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.Home);
  const [preferences, setPreferences] = useState<TripPreferences | null>(null);
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchTrips = useCallback(async (authToken: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/trips', {
        headers: { 'x-auth-token': authToken }
      });
      // Map MongoDB _id to id for frontend compatibility
      const trips = response.data.map((trip: any) => ({
        ...trip,
        id: trip._id
      }));
      setSavedTrips(trips);
    } catch (err) {
      console.error("Failed to fetch trips", err);
    }
  }, []);

  // Load saved trips and auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth) {
      try {
        const { token, user } = JSON.parse(storedAuth);
        setToken(token);
        setUser(user);
        fetchTrips(token);
      } catch (e) {
        console.error("Failed to load auth", e);
      }
    } else {
      const storedTrips = localStorage.getItem(STORAGE_KEY);
      if (storedTrips) {
        try {
          setSavedTrips(JSON.parse(storedTrips));
        } catch (e) {
          console.error("Failed to load saved trips", e);
        }
      }
    }
  }, [fetchTrips]);

  // Notification timer
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (token: string, user: any) => {
    setToken(token);
    setUser(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
    fetchTrips(token);
    setView(AppView.Home);
    setNotification(`Welcome back, ${user.username}!`);
  };

  const handleSignup = (token: string, user: any) => {
    setToken(token);
    setUser(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
    fetchTrips(token);
    setView(AppView.Home);
    setNotification(`Account created! Welcome, ${user.username}!`);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    setSavedTrips([]); // Clear trips on logout
    setView(AppView.Home);
    setNotification("Logged out successfully.");
  };

  const handleStartPlanning = () => {
    if (!token) {
      setView(AppView.Login);
      setNotification("Please login to start planning your trip.");
      return;
    }
    setPreferences(null);
    setItinerary(null);
    setIsSaved(false);
    setView(AppView.Form);
  };

  const handleSubmitPreferences = async (prefs: TripPreferences) => {
    setPreferences(prefs);
    setView(AppView.Loading);
    setError(null);
    setIsSaved(false);

    try {
      const result = await generateTripPlan(prefs);
      setItinerary(result);
      setView(AppView.Result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate your trip plan. Please try again.");
      setView(AppView.Form);
    }
  };

  const handleSaveTrip = async () => {
    if (!itinerary || !preferences) return;
    
    if (token) {
      try {
        const response = await axios.post('http://localhost:5000/api/trips', {
          preferences,
          itinerary
        }, {
          headers: { 'x-auth-token': token }
        });
        
        const newSavedTrip: SavedTrip = {
          ...response.data,
          id: response.data._id
        };
        
        setSavedTrips([newSavedTrip, ...savedTrips]);
        setIsSaved(true);
        setNotification("Trip saved to your account!");
      } catch (err: any) {
        console.error("Failed to save trip to database", err);
        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);
        }
        setNotification(`Failed to save trip: ${err.response?.data?.message || err.message}`);
      }
    } else {
      const newSavedTrip: SavedTrip = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        preferences,
        itinerary
      };

      const updated = [newSavedTrip, ...savedTrips];
      setSavedTrips(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setIsSaved(true);
      setNotification("Trip saved to your library (locally)!");
    }
  };

  const handleViewSavedTrip = (trip: SavedTrip) => {
    setPreferences(trip.preferences);
    setItinerary(trip.itinerary);
    setIsSaved(true); // Since it's already in the library
    setView(AppView.Result);
  };

  const handleDeleteSavedTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (token) {
      try {
        await axios.delete(`http://localhost:5000/api/trips/${id}`, {
          headers: { 'x-auth-token': token }
        });
        const updated = savedTrips.filter(t => t.id !== id);
        setSavedTrips(updated);
        setNotification("Trip removed from your account.");
      } catch (err) {
        console.error("Failed to delete trip from database", err);
        setNotification("Failed to delete trip. Please try again.");
      }
    } else {
      const updated = savedTrips.filter(t => t.id !== id);
      setSavedTrips(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setNotification("Trip removed from library.");
    }
  };

  const handleReset = () => {
    setPreferences(null);
    setItinerary(null);
    setIsSaved(false);
    setView(AppView.Home);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header 
        onHomeClick={handleReset} 
        onSavedClick={() => {
          if (!token) {
            setView(AppView.Login);
            setNotification("Please login to view your saved trips.");
          } else {
            setView(AppView.SavedList);
          }
        }} 
        onAboutClick={() => setView(AppView.About)}
        onLoginClick={() => setView(AppView.Login)}
        onNewTripClick={handleStartPlanning}
        onLogout={handleLogout}
        isLoggedIn={!!token}
        username={user?.username}
      />
      
      {/* Custom Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-[100] animate-bounce">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 border border-slate-700">
            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {notification}
          </div>
        </div>
      )}

      <main className="flex-grow">
        {view === AppView.Home && (
          <>
            <Hero onStart={handleStartPlanning} />
            <CollaboratedHotels />
            {savedTrips.length > 0 && (
              <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-3xl font-black text-slate-900">Your Saved Adventures</h2>
                  <button 
                    onClick={() => setView(AppView.SavedList)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <SavedTripsList 
                  trips={savedTrips.slice(0, 3)} 
                  onView={handleViewSavedTrip} 
                  onDelete={handleDeleteSavedTrip}
                />
              </div>
            )}
          </>
        )}

        {view === AppView.Login && (
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setView(AppView.Signup)} 
          />
        )}

        {view === AppView.Signup && (
          <Signup 
            onSignup={handleSignup} 
            onSwitchToLogin={() => setView(AppView.Login)} 
          />
        )}

        {view === AppView.SavedList && (
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-12">
              <button onClick={() => setView(AppView.Home)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-4xl font-black text-slate-900">Saved Library</h2>
            </div>
            {savedTrips.length > 0 ? (
              <SavedTripsList 
                trips={savedTrips} 
                onView={handleViewSavedTrip} 
                onDelete={handleDeleteSavedTrip}
              />
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-500 mb-6">No saved trips yet.</p>
                <button onClick={handleStartPlanning} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl">Start Planning</button>
              </div>
            )}
          </div>
        )}

        {view === AppView.About && (
          <About onBack={() => setView(AppView.Home)} />
        )}

        {view === AppView.Form && (
          <div className="container mx-auto px-4 py-8">
            <PlannerForm onSubmit={handleSubmitPreferences} initialData={preferences} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg max-w-4xl mx-auto">
                {error}
              </div>
            )}
          </div>
        )}

        {view === AppView.Loading && (
          <LoadingState destination={preferences?.destination || 'your destination'} />
        )}

        {view === AppView.Result && itinerary && (
          <ItineraryDisplay 
            itinerary={itinerary}
            preferences={preferences}
            onBack={() => setView(AppView.Form)} 
            onSave={handleSaveTrip}
            isSaved={isSaved}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="font-bold text-xl mb-4" onClick={handleReset} style={{cursor: 'pointer'}}>Trip<span className="text-indigo-600">Chip</span></div>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
           AI travel planner, specifically tuned for adventures in the Himalayas and beyond.
          </p>
          <div className="flex justify-center gap-6 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <button onClick={() => setView(AppView.About)} className="hover:text-indigo-600 transition-colors">About Us</button>
            <button onClick={handleReset} className="hover:text-indigo-600 transition-colors">Privacy</button>
            <button onClick={handleReset} className="hover:text-indigo-600 transition-colors">Terms</button>
          </div>
          <p className="text-slate-400 text-xs">© 2025 TripChip. Built with passion for NCCS Hackathon.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
