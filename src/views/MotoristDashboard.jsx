import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';

export default function MotoristDashboard() {
  const navigate = useNavigate();
  const { currentUser, activeIncident } = useApp();
  
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(collection(db, 'incidents'));
        const querySnapshot = await getDocs(q);
        
        const logs = querySnapshot.docs.map(doc => ({
          firebaseId: doc.id,
          ...doc.data()
        }));

        setHistory(logs.reverse());
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="w-full h-[100dvh] bg-slate-50 flex flex-col antialiased overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="bg-slate-900 text-white p-6 shadow-md shrink-0 flex items-center gap-4 relative z-20">
        <button 
          onClick={() => navigate('/motorist-home')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors font-bold"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight">Full Dashboard</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Transaction Log Archive</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">

          {activeIncident && (
            <div className="bg-red-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-red-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full blur-2xl animate-pulse pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-white/20 px-3 py-1 rounded border border-white/30 text-[10px] font-black uppercase tracking-wider mb-3 inline-block">
                    Active Emergency
                  </span>
                  <h2 className="text-2xl font-black">{activeIncident.carModel || 'Vehicle Breakdown'}</h2>
                </div>
                <button 
                  onClick={() => navigate('/tracking')}
                  className="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 transition-colors shadow-md"
                >
                  View Radar 📡
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-700/50 rounded-xl p-4 border border-red-500/50">
                  <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-bold text-sm capitalize">{activeIncident.status}</p>
                </div>
                <div className="bg-red-700/50 rounded-xl p-4 border border-red-500/50">
                  <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest mb-1">Location</p>
                  <p className="font-bold text-sm truncate">{activeIncident.locationName || 'GPS Coordinates Locked'}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4 px-2">Past Service Requests</h3>
            
            {isLoading ? (
              <div className="text-center p-12 text-slate-400 font-bold animate-pulse">
                Decrypting Archive Data...
              </div>
            ) : history.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <span className="text-4xl opacity-50 block mb-4">🗄️</span>
                <p className="text-slate-500 font-bold">No historical records found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((log) => (
                  <div key={log.firebaseId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${log.status === 'resolved' ? 'bg-emerald-500' : log.status === 'accepted' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {log.id || log.firebaseId.substring(0,8)}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{log.carModel || 'Unknown Vehicle'}</h4>
                      <p className="text-sm text-slate-500 mt-1">{log.issueSummary || 'No details provided.'}</p>
                    </div>
                    <div className="flex flex-col md:items-end justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mechanic Assigned</p>
                      <p className="text-sm font-bold text-slate-700">{log.mechanicName || 'Pending Assignment'}</p>
                      <p className="text-xs text-slate-400 mt-1 capitalize">{log.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}