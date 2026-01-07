
import React from 'react';
import Snowfall from 'react-snowfall';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      <Snowfall color="#82C3D9" />
      <div className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
              <span className="block">Your Dream Trip,</span>
              <span className="block text-indigo-600">Planned by AI in Seconds.</span>
            </h1>
            <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              From the hidden gems of Mustang and the serene lakes of Pokhara to the bustling streets of Kathmandu, TripChip handles the details.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
              <button
                onClick={onStart}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95"
              >
                Start Planning Now
              </button>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden">
              <img
                className="w-full object-cover h-64 sm:h-96 lg:h-full"
                src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Travel destination"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
