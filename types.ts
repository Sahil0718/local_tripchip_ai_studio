
export interface TripPreferences {
  destination: string;
  duration: string;
  budget: 'budget' | 'moderate' | 'luxury';
  groupSize: string;
  interests: string[];
  travelStyle: string;
  otherDetails: string;
  emergencyContact: string;
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
  About = 'ABOUT'
}
