
import React from 'react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  const teamMembers = [
    { name: 'Sahil', role: 'Dreamer & Doer' },
    { name: 'Utsarga', role: 'Dreamer & Doer'},
    { name: 'Hari', role: 'Dreamer & Doer' },
    { name: 'Suman', role: 'Dreamer & Doer' },
     { name:'Bikas', role: 'Dreamer & Doer' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <button 
        onClick={onBack}
        className="mb-12 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight">About TripChip</h1>
          <p className="text-xl text-indigo-100 font-medium max-w-2xl">
            Born from passion, built for the future of travel.
          </p>
        </div>

        <div className="p-12 space-y-12">
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
              The Origin Story
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              TripChip was born out of pure love, late-night brainstorming, and a dash of hackathon madness! 
              Crafted with passion for the <strong>NCCS Business Hackathon 2026</strong>, it’s more than just an idea; 
              it’s our adventure in turning creativity into reality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-black shadow-sm group-hover:scale-110 transition-transform">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{member.name}</h3>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100">
            <p className="text-indigo-800 text-center text-lg font-bold italic leading-relaxed">
              "A team fueled by coffee, code, and big visions. Together, we’re building TripChip to make travel smarter, easier, and way more fun."
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
