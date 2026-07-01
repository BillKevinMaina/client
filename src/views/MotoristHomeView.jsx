import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MotoristHomeView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const quickCategories = [
    { label: "Engine Failure", icon: "🔧" },
    { label: "Electrical / Battery", icon: "⚡" },
    { label: "Flat Tire / Suspension", icon: "🚗" },
    { label: "Brake Diagnostic", icon: "🛑" }
  ];

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden antialiased">
      <div className="flex-1 md:flex-[2] lg:flex-[3] bg-slate-200 relative md:order-2" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}>
        <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-20 flex justify-between items-center">
          <button onClick={() => setIsDrawerOpen(true)} className="bg-white text-slate-800 p-3 rounded-xl shadow-md font-bold text-sm hover:bg-slate-50 transition-all">☰ Menu</button>
          <div className="bg-slate-900 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> GPS: Nairobi Locked
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
          <div className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-2xl animate-pulse mx-auto"></div>
          <div className="mt-1.5 bg-slate-900 text-white text-[9px] md:text-[10px] font-black uppercase px-2 py-1 rounded">My Breakdown Site</div>
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 border-t md:border-t-0 md:border-r border-slate-100 relative z-20 shrink-0 md:w-[380px] lg:w-[450px] md:order-1 flex flex-col md:justify-center overflow-y-auto">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4 md:hidden"></div>
        <div className="mb-4 md:mb-6 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Emergency Dispatch</h3>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Map verified local mechanics within 5km.</p>
        </div>
        <div className="relative mb-4 md:mb-6">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type problem details..." className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 transition-all shadow-sm" />
          <span className="absolute left-3.5 top-3.5 text-sm">🔍</span>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-8">
          {quickCategories.map((cat, idx) => (
            <button key={idx} type="button" onClick={() => setSearchQuery(cat.label)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] md:text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm text-left hover:bg-red-50 hover:text-red-600 transition-all">
              <span className="text-sm md:text-base">{cat.icon}</span><span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => navigate('/discovery')} className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all text-center">
          Scan Spatial Radius
        </button>
      </div>

      {/* FULLY POPULATED NAVIGATION DRAWER */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div onClick={() => setIsDrawerOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="relative w-64 md:w-80 bg-slate-900 text-white h-full shadow-2xl flex flex-col p-5 border-r border-slate-800">
            <div className="flex justify-between items-center pb-5 border-b border-slate-800 mb-5">
              <span className="text-sm font-black text-red-500 uppercase">Motorist Portal</span>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>
            
            <nav className="space-y-2 text-sm font-bold flex-1">
              <button onClick={() => { setIsDrawerOpen(false); navigate('/motorist-home'); }} className="w-full text-left p-3 rounded-xl bg-slate-800 text-white flex items-center gap-3">📍 Home Map</button>
              <button onClick={() => { setIsDrawerOpen(false); navigate('/motorist-dashboard'); }} className="w-full text-left p-3 rounded-xl hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-3">🎛️ Full Dashboard</button>
              <button onClick={() => { setIsDrawerOpen(false); navigate('/discovery'); }} className="w-full text-left p-3 rounded-xl hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-3">🚨 Broadcast Rescue</button>
              <button onClick={() => { setIsDrawerOpen(false); navigate('/tracking'); }} className="w-full text-left p-3 rounded-xl hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-3">📡 Live Tracking</button>
            </nav>

            <div className="border-t border-slate-800 pt-4">
              <button onClick={() => navigate('/')} className="w-full text-left p-3 rounded-xl hover:bg-red-900/30 text-red-400 transition-all flex items-center gap-3 font-bold text-sm">🚪 Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}