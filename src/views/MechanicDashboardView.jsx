import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MechanicDashboardView() {
  const navigate = useNavigate();
  const { activeIncident, updateIncidentStatus, clearIncident } = useApp();
  const [isOnline, setIsOnline] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasPendingRequest = activeIncident && activeIncident.status === 'pending';
  const hasActiveJob = activeIncident && activeIncident.status === 'accepted';

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden antialiased">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-40 relative">
        <span className="text-lg font-black tracking-tight">Pro Terminal</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white font-bold">
          {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* PRO TERMINAL SIDEBAR (Desktop Fixed, Mobile Collapsible) */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 bg-slate-900 text-white p-5 md:p-8 shrink-0 md:shadow-[10px_0_40px_rgba(0,0,0,0.2)] border-r border-slate-800 flex flex-col w-64 md:w-[350px] lg:w-[400px] transition-transform duration-300
      `}>
        <div className="flex flex-col md:gap-6 pt-4 md:pt-0">
          <div>
            <span className="hidden md:block text-[10px] uppercase text-slate-400">Terminal</span>
            <h3 className="text-xl md:text-2xl font-black mt-1">John Kamau</h3>
          </div>
          <button onClick={() => setIsOnline(!isOnline)} className={`mt-4 md:mt-0 px-4 py-3 md:px-5 md:py-3 rounded-full text-xs font-black uppercase flex justify-center items-center gap-2 border w-full ${isOnline ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span> {isOnline ? 'Radar Online' : 'Radar Offline'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-6">
          <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Jobs</p><p className="text-lg font-black text-white mt-1">3</p></div>
          <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Rating</p><p className="text-lg font-black text-amber-400 mt-1">★ 4.9</p></div>
          <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">KSh</p><p className="text-lg font-black text-red-400 mt-1">4.5K</p></div>
        </div>

        {/* FULLY POPULATED NAVIGATION */}
        <nav className="mt-8 space-y-2 flex-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Navigation</p>
          <button onClick={() => navigate('/mechanic-dashboard')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white text-sm font-bold text-left transition-all">🎛️ Live Radar</button>
          <button onClick={() => navigate('/mechanic-routing')} className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-bold text-left transition-all">🗺️ Active Routing</button>
          <button onClick={() => navigate('/mechanic-setup')} className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-bold text-left transition-all">⚙️ Profile Setup</button>
        </nav>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-900/30 text-sm font-bold text-left transition-all">🚪 Logout</button>
        </div>
      </div>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className="flex-1 bg-slate-200 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}>
        {isOnline ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            {!hasPendingRequest && !hasActiveJob && (
              <div className="space-y-3 animate-pulse">
                <div className="w-16 h-16 bg-red-100 text-red-600 text-2xl rounded-full flex justify-center items-center mx-auto">🛰️</div>
                <h4 className="text-sm font-black text-slate-800 uppercase">Listening for Payloads</h4>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-100/70 backdrop-blur-sm flex flex-col justify-center items-center">
            <span className="text-4xl opacity-40 mb-3">💤</span>
            <h4 className="text-sm font-black text-slate-500 uppercase">Terminal Sleep Mode</h4>
          </div>
        )}

        {isOnline && hasPendingRequest && (
          <div className="absolute inset-x-4 bottom-4 md:inset-x-auto md:right-8 md:bottom-8 md:w-[450px] z-30 bg-white rounded-[2rem] shadow-2xl p-6 border-t-4 border-t-red-600 space-y-5 animate-[bounce_1s_ease-in-out]">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">⚠️ Immediate Broadcast</span>
                <h4 className="text-lg font-black mt-2">{activeIncident.carModel}</h4>
              </div>
              <span className="text-sm font-black bg-slate-100 px-2 py-1 rounded-lg font-mono">{activeIncident.distance}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => clearIncident()} className="flex-1 bg-slate-100 text-slate-600 font-black text-sm uppercase py-4 rounded-xl">Decline</button>
              <button onClick={() => { updateIncidentStatus('accepted'); navigate('/mechanic-routing'); }} className="flex-[2] bg-red-600 text-white font-black text-sm uppercase py-4 rounded-xl shadow-lg">Accept Job</button>
            </div>
          </div>
        )}

        {isOnline && hasActiveJob && (
          <div className="absolute inset-x-4 bottom-4 md:inset-x-auto md:right-8 md:bottom-8 md:w-[400px] z-30 bg-slate-900 text-white rounded-[2rem] shadow-2xl p-6 text-left">
            <span className="text-xs font-black text-amber-400 uppercase">🔒 Job In Progress</span>
            <button onClick={() => navigate('/mechanic-routing')} className="w-full mt-4 bg-amber-500 text-amber-950 font-black text-sm py-3 rounded-xl uppercase">Go to Routing →</button>
          </div>
        )}
      </div>
    </div>
  );
}