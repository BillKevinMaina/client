import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MechanicRoutingView() {
  const navigate = useNavigate();
  const { activeIncident, clearIncident } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayIncident = activeIncident || {
    id: "REQ-990812", motoristName: "Alex Maina", carModel: "2019 Honda Fit Hybrid", location: "Mombasa Road", distance: "1.2 km away"
  };

  const handleJobCompletion = () => {
    alert(`Service record ${displayIncident.id} resolved.`);
    clearIncident();
    navigate('/mechanic-dashboard');
  };

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden antialiased relative">
      
      {/* QUICK ACCESS MENU */}
      <div className="absolute top-4 left-4 z-40">
        <button onClick={() => setIsMenuOpen(true)} className="bg-slate-900 text-white p-3 rounded-xl shadow-lg font-bold text-sm">☰ Menu</button>
      </div>

      {isMenuOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-64 bg-slate-900 text-white h-full shadow-2xl flex flex-col p-5 border-r border-slate-800">
            <div className="flex justify-between items-center pb-5 border-b border-slate-800 mb-5">
              <span className="text-sm font-black text-amber-500 uppercase">Pro Terminal</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 text-lg font-bold">✕</button>
            </div>
            <nav className="space-y-2 text-sm font-bold flex-1">
              <button onClick={() => navigate('/mechanic-dashboard')} className="w-full text-left p-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-all">🎛️ Live Radar</button>
              <button onClick={() => navigate('/mechanic-routing')} className="w-full text-left p-3 rounded-xl bg-slate-800 text-white transition-all">🗺️ Active Routing</button>
              <button onClick={() => navigate('/mechanic-setup')} className="w-full text-left p-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-all">⚙️ Profile Setup</button>
            </nav>
            <div className="border-t border-slate-800 pt-4">
              <button onClick={() => navigate('/')} className="w-full text-left p-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-all">🚪 Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 md:flex-[2] lg:flex-[3] bg-slate-200 relative md:order-2 overflow-hidden" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}>
        <div className="absolute top-[60%] left-[45%] z-10 text-center animate-pulse">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white mx-auto"></div>
          <div className="mt-1 bg-slate-900 text-white text-[9px] font-black uppercase px-2 py-1 rounded">Target: {displayIncident.motoristName}</div>
        </div>
        <div className="absolute top-[35%] left-[50%] z-10 text-center">
          <div className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded flex items-center gap-1"><span>🏍️</span> Transit Route</div>
          <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white mx-auto -mt-1"></div>
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 border-t md:border-t-0 md:border-r border-slate-100 relative z-20 shrink-0 space-y-6 md:w-[380px] lg:w-[450px] md:order-1 flex flex-col justify-center overflow-y-auto">
        <div className="hidden md:block">
          <h2 className="text-2xl font-black text-slate-900 uppercase">Active Dispatch</h2>
        </div>
        <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
          <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-full flex justify-center items-center font-black">{displayIncident.motoristName.substring(0,2).toUpperCase()}</div>
          <div className="flex-1">
            <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded font-mono">{displayIncident.id}</span>
            <h4 className="text-base font-black mt-1">{displayIncident.motoristName}</h4>
          </div>
        </div>
        <a href="tel:0712345678" className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-xl text-sm font-black uppercase flex justify-center items-center">📞 Contact Motorist</a>
        <button onClick={handleJobCompletion} className="w-full bg-red-600 text-white font-black text-sm uppercase py-4 rounded-xl shadow-lg">Complete Job ✓</button>
      </div>
    </div>
  );
}