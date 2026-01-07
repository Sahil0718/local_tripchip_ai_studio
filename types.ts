
export interface TripPreferences {
  origin: string;
  destination: string;
  duration: string;
  budget: 'budget' | 'moderate' | 'luxury';
  groupSize: string;
  interests: string[];
  travelStyle: string;
  otherDetails: string;
  emergencyContact: string;
  refinementPrompt?: string;
}

export interface Accommodation {
  name: string;
  priceNPR: string;
  category: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  estimatedCostNPR: string;
  activities: {
    time: string;
    description: string;
    location: string;
    type: 'sightseeing' | 'dining' | 'activity' | 'travel';
  }[];
}

export interface TravelItinerary {
  overview: string;
  highlights: string[];
  totalEstimatedCostNPR: string;
  practicalityNote?: string;
  permitsAndLogistics: string[];
  itinerary: ItineraryDay[];
  accommodations: Accommodation[];
  groundingSources?: { title: string; uri: string }[];
}

export interface SavedTrip {
  id: string;
  createdAt: string;
  preferences: TripPreferences;
  itinerary: TravelItinerary;
}

export enum AppView {
  Home = 'HOME',
  Form = 'FORM',
  Loading = 'LOADING',
  Result = 'RESULT',
  SavedList = 'SAVED_LIST',
  About = 'ABOUT',
  Login = 'LOGIN',
  Signup = 'SIGNUP'
}
