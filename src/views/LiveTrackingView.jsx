import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useApp } from '../context/AppContext';
import ChatWindow from '../components/ChatWindow'; // 🚨 IMPORTED THE CHAT WINDOW

export default function LiveTrackingView() {
  const navigate = useNavigate();
  const { activeIncident } = useApp(); 
  
  const [liveStatus, setLiveStatus] = useState('pending');
  const [mechanicData, setMechanicData] = useState(null);
  
  // 🚨 State to control if the chat window is visible
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!activeIncident || !activeIncident.id) {
      navigate('/');
      return;
    }
    const incidentRef = doc(db, 'incidents', activeIncident.id);
    const unsubscribe = onSnapshot(incidentRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLiveStatus(data.status); 
        if (data.status === 'accepted') {
          setMechanicData({
            name: data.mechanicName,
            id: data.mechanicId,
            phone: data.mechanicPhone,
            company: data.mechanicCompany
          });
        }
      }
    });
    return () => unsubscribe(); 
  }, [activeIncident, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 antialiased font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        {liveStatus === 'pending' && (
          <div className="text-center w-full flex flex-col items-center">
            <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-red-500/30 rounded-full animate-ping opacity-50"></div>
              <div className="absolute inset-4 border border-red-500/20 rounded-full animate-pulse opacity-70"></div>
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl shadow-[0_0_40px_rgba(220,38,38,0.8)]">📡</div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Broadcasting...</h2>
            <p className="text-slate-400 text-sm mb-8 px-4">Transmitting your breakdown coordinates to verified mechanics within a 5km radius. Please stay with your vehicle.</p>
            <div className="w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                <span>Incident Ref</span><span className="text-red-400">{activeIncident?.id?.substring(0, 8)}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full w-1/3 animate-[slide_2s_ease-in-out_infinite_alternate]"></div>
              </div>
            </div>
          </div>
        )}

        {liveStatus === 'accepted' && (
          <div className="text-center w-full flex flex-col items-center animate-fade-in-up">
            <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse blur-xl"></div>
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-4xl text-white shadow-[0_0_40px_rgba(16,185,129,0.8)]">✓</div>
            </div>

            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">Match Confirmed</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Help is on the way.</h2>
            <p className="text-slate-400 text-sm mb-10">Keep your phone nearby. Your mechanic is tracking your coordinates.</p>

            <div className="w-full bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
              
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Dispatched Technician</p>
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                {mechanicData?.name || 'Verified Technician'}
                <span className="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-600/30 uppercase tracking-wider">Pro</span>
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 mb-6">{mechanicData?.company || 'Independent Workshop'}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-emerald-400 font-bold text-sm">En Route 🚗</p>
                </div>
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-white font-bold text-sm truncate">{mechanicData?.phone || 'Unavailable'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <a href={`tel:${mechanicData?.phone}`} className="py-3 rounded-xl bg-slate-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-600 transition-colors flex justify-center items-center gap-2">
                  📞 Call
                </a>
                
                {/* 🚨 THE CHAT BUTTON TRIGGERS THE WINDOW */}
                <button onClick={() => setIsChatOpen(true)} className="py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider hover:bg-red-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-red-600/20">
                  💬 Live Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🚨 RENDER THE CHAT WINDOW IF TRUE */}
      {isChatOpen && activeIncident && (
        <ChatWindow incidentId={activeIncident.id} onClose={() => setIsChatOpen(false)} />
      )}

      <style jsx>{`
        @keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(200%); } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}