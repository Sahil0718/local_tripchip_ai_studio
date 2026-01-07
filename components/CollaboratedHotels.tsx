
import React from 'react';
import Snowfall from 'react-snowfall';

interface Hotel {
  id: string;
  name: string;
  location: string;
  discount: string;
  image: string;
  description: string;
}

const HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Hotel Yak & Yeti',
    location: 'Kathmandu',
    discount: '15% OFF',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1170&auto=format&fit=crop',
    description: 'A historic luxury hotel in the heart of Kathmandu, blending heritage with modern comfort.'
  },
  {
    id: '2',
    name: 'Fish Tail Lodge',
    location: 'Pokhara',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop',
    description: 'Unique island resort on Fewa Lake with stunning views of Machhapuchhre.'
  },
  {
    id: '3',
    name: 'Barahi Jungle Lodge',
    location: 'Chitwan',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1170&auto=format&fit=crop',
    description: 'Experience the wild in luxury at the edge of Chitwan National Park.'
  },
  {
    id: '4',
    name: 'Everest View Hotel',
    location: 'Syangboche',
    discount: '10% OFF',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1170&auto=format&fit=crop',
    description: 'The highest placed hotel in the world, offering a 360-degree view of the Himalayas.'
  }
];

const CollaboratedHotels: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Exclusive Partner Stays</h2>
            <p className="text-slate-500 font-medium max-w-2xl">
              We've partnered with Nepal's finest hotels to bring you exclusive discounts when you plan your trip with TripChip.
            </p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
            Limited Time Offers
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Snowfall color="#82C3D9" />
          {HOTELS.map((hotel) => (
            <div key={hotel.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black tracking-tighter shadow-lg">
                    {hotel.discount}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white text-xs font-medium leading-relaxed">
                    {hotel.description}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest">{hotel.location}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{hotel.name}</h3>
                <button className="w-full py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-indigo-600 transition-colors uppercase tracking-widest">
                  Claim Discount
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollaboratedHotels;
