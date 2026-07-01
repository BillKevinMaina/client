import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MotoristDashboard() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState('Engine Failure');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const issueTypes = ['Engine Failure', 'Tire Replacement', 'Battery Problem', 'Overheating', 'Brake Issue', 'Other Roadside'];

  return (
    <div className="w-full h-[100dvh] bg-slate-50 text-slate-800 flex flex-col md:flex-row overflow-hidden antialiased relative">
      
      <div className="md:hidden bg-red-600 text-white p-4 flex justify-between items-center shadow-md z-20 shrink-0">
        <span className="text-lg font-black tracking-tight">MechNomads</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none font-bold">
          {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* FULLY POPULATED SIDEBAR */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-red-600 text-white flex flex-col justify-between shrink-0 shadow-2xl md:shadow-xl transition-transform duration-300 ease-in-out
      `}>
        <div>
          <div className="hidden md:flex p-6 border-b border-white/10 items-center space-x-2">
            <span className="text-lg font-black tracking-tight">MechNomads</span>
          </div>
          <nav className="p-4 space-y-2 mt-4 md:mt-0">
            <p className="text-[10px] uppercase tracking-wider font-bold text-red-200 px-3 mb-2">Motorist Portal</p>
            <button onClick={() => navigate('/motorist-dashboard')} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white text-left transition-all">🎛️ Full Dashboard</button>
            <button onClick={() => navigate('/motorist-home')} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-100 hover:bg-white/10 text-left transition-all">📍 Home Map</button>
            <button onClick={() => navigate('/discovery')} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-100 hover:bg-white/10 text-left transition-all">🚨 Broadcast Rescue</button>
            <button onClick={() => navigate('/tracking')} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-100 hover:bg-white/10 text-left transition-all">📡 Live Tracking</button>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => navigate('/')} className="w-full py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all">🚪 Logout</button>
        </div>
      </aside>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-4 shrink-0">
          <div className="relative w-full sm:w-96">
            <input type="text" placeholder="Search mechanics, services..." className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500 shadow-sm" />
          </div>
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Motorist Mode</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 w-full">
          <div className="max-w-5xl mx-auto pb-8">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 tracking-tight">Confirm Service Request</h2>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center font-black text-slate-700 text-lg shadow-inner shrink-0">RF</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">Ricardo Fuentes</h3>
                    <span className="text-[9px] font-black bg-red-50 text-red-600 px-2 py-0.5 rounded-md uppercase border border-red-100">Top Rated</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">⭐ 4.9 · 📍 2.3 mi away</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Issue Type</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {issueTypes.map((issue) => (
                      <button key={issue} onClick={() => setSelectedIssue(issue)} className={`p-3.5 rounded-xl text-xs font-bold text-left border transition-all flex justify-between ${selectedIssue === issue ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                        <span>{issue}</span>
                        <span className={`w-4 h-4 rounded-full border flex justify-center items-center ${selectedIssue === issue ? 'border-red-600 bg-red-600' : 'border-slate-300'}`}>
                          {selectedIssue === issue && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase border-b border-slate-100 pb-2">Describe the Problem</h4>
                  <textarea rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-red-600 resize-none shadow-inner" placeholder="Tell the mechanic what happened..."></textarea>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Vehicle Details</h4>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Make & Model</label>
                      <input type="text" defaultValue="2019 Honda Fit Hybrid" className="w-full bg-slate-50 border rounded-xl p-3 font-semibold shadow-sm" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase border-b border-slate-100 pb-2">Your Location</h4>
                  <div className="p-3.5 bg-slate-50 border rounded-xl text-xs font-semibold flex items-start space-x-2.5">
                    <span className="text-red-600 text-lg">📍</span>
                    <span>Ngong Road, near Coptic Hospital</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-sm">
              <div className="text-sm space-y-1.5">
                <p className="font-black text-slate-900 uppercase">Request Summary</p>
                <p className="text-slate-600 font-medium">Issue: <strong className="text-slate-900 font-bold">{selectedIssue}</strong></p>
              </div>
              <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-4">
                <button onClick={() => navigate('/motorist-home')} className="text-xs text-slate-500 font-black uppercase hover:text-slate-700">Cancel</button>
                <button onClick={() => navigate('/tracking')} className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-lg uppercase transition-all">Book Mechanic</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}