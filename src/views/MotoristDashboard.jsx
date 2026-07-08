import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { db, auth } from '../config/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export default function MasterDashboardView() {
  const navigate = useNavigate();
  const { currentUser, activeIncident, logout } = useApp();
  
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, active: 0 });
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Default fallback avatar
  const displayName = currentUser?.displayName || 'Bill Kevin Maina';
  const avatarUrl = currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1e293b&color=fff`;

  useEffect(() => {
    const fetchAllData = async () => {
      if (!currentUser) return;

      try {
        // 1. Fetch User Profile Data
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().phoneNumber) {
          setPhone(userDoc.data().phoneNumber);
        }

        // 2. Fetch User History
        const q = query(collection(db, 'incidents'), where('motoristId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const logs = querySnapshot.docs.map(d => ({ firebaseId: d.id, ...d.data() }));
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // 3. Calculate Analytics
        const resolvedCount = logs.filter(log => log.status === 'resolved').length;
        const activeCount = logs.filter(log => log.status === 'pending' || log.status === 'accepted').length;

        setStats({ total: logs.length, resolved: resolvedCount, active: activeCount });
        setHistory(logs);
      } catch (error) {
        console.error("Dashboard Sync Failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [currentUser]);

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigate('/');
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-slate-50 flex flex-col antialiased overflow-hidden relative">
      
      {/* --- RED NAVIGATION TASKBAR --- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-64 h-full bg-[#da292e] text-white flex flex-col shadow-2xl animate-[slideRight_0.2s_ease-out]">
            <div className="p-6 font-black text-2xl tracking-tighter">MechNomads</div>
            <div className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-red-200">Command Center</div>
            <nav className="flex-1 px-4 mt-4 space-y-2">
              <button onClick={() => navigate('/motorist-home')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-700/50 font-bold text-sm flex items-center gap-3 transition-colors">📍 Home Map</button>
              <button onClick={() => setIsDrawerOpen(false)} className="w-full text-left px-4 py-3 rounded-xl bg-red-700 font-bold text-sm flex items-center gap-3 transition-colors shadow-inner">📊 Full Dashboard</button>
              <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-700/50 font-bold text-sm flex items-center gap-3 transition-colors">⚙️ Edit Profile</button>
            </nav>
            <div className="p-4">
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-950/50 font-bold text-sm flex items-center gap-3 transition-colors bg-red-950/30 text-red-200">🚪 Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER PROFILE SECTION --- */}
      <div className="bg-slate-900 text-white pt-8 pb-16 px-6 shadow-xl shrink-0 relative z-10 rounded-b-[2.5rem]">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <button onClick={() => setIsDrawerOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors font-bold border border-white/10">☰</button>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-slate-800 shadow-lg overflow-hidden bg-slate-200 mb-3">
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">{displayName}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              {currentUser?.email} {phone && <span className="text-emerald-400 border-l border-slate-700 pl-2">{phone}</span>}
            </p>
          </div>
          
          {/* Invisible spacer to perfectly center the profile data */}
          <div className="w-10"></div>
        </div>
      </div>

      {/* --- MAIN SCROLLING CONTENT --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* 1. ANALYTICS CARDS */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Total Requests</span>
              <span className="text-2xl md:text-4xl font-black text-slate-900">{isLoading ? '-' : stats.total}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Rescues</span>
              <span className="text-2xl md:text-4xl font-black text-emerald-500">{isLoading ? '-' : stats.resolved}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Active</span>
              <span className="text-2xl md:text-4xl font-black text-amber-500">{isLoading ? '-' : stats.active}</span>
            </div>
          </div>

          {/* 2. LIVE ACTIVE DISPATCH (Only visible if they have an active emergency) */}
          {activeIncident && (
            <div className="bg-red-600 rounded-3xl p-6 text-white shadow-xl shadow-red-600/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full blur-2xl animate-pulse pointer-events-none"></div>
              <div className="relative z-10 w-full md:w-auto">
                <span className="bg-white/20 px-3 py-1 rounded border border-white/30 text-[10px] font-black uppercase tracking-wider mb-2 inline-block">LIVE SIGNAL ACTIVE</span>
                <h2 className="text-xl md:text-2xl font-black mb-1">{activeIncident.carModel || 'Vehicle Breakdown'}</h2>
                <p className="text-red-200 text-sm font-bold uppercase tracking-widest">Status: {activeIncident.status}</p>
              </div>
              <button onClick={() => navigate('/tracking')} className="w-full md:w-auto relative z-10 bg-white text-red-600 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 transition-colors shadow-md flex items-center justify-center gap-2">
                Open Radar View 📡
              </button>
            </div>
          )}

          {/* 3. CONDENSED RECENT HISTORY */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Activity Ledger</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Showing latest</span>
            </div>
            
            <div className="divide-y divide-slate-50">
              {isLoading ? (
                <div className="p-10 text-center text-slate-400 font-bold animate-pulse text-sm">Syncing Cloud Records...</div>
              ) : history.length === 0 ? (
                <div className="p-10 text-center text-slate-500 font-bold text-sm">No recorded service requests.</div>
              ) : (
                history.slice(0, 5).map((log) => ( // Only shows the 5 most recent
                  <div key={log.firebaseId} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between gap-4 md:items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${log.status === 'resolved' ? 'bg-emerald-500' : log.status === 'accepted' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.id || log.firebaseId.substring(0,8)}</span>
                        <span className="text-[10px] text-slate-300 ml-2">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{log.carModel || 'Unknown Vehicle'}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">{log.issueSummary || 'No diagnostic notes.'}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Technician</p>
                      <p className="text-sm font-bold text-slate-700">{log.mechanicName || 'Pending'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {history.length > 5 && (
              <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ {history.length - 5} Older Records Hidden</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <style jsx>{`@keyframes slideRight { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }`}</style>
    </div>
  );
}