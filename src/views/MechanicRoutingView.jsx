import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { db } from '../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import ChatWindow from '../components/ChatWindow'; // 🚨 IMPORTED THE CHAT WINDOW

export default function MechanicRoutingView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useApp();
  
  const targetIncident = location.state?.targetIncident || {};
  const [isCompleting, setIsCompleting] = useState(false);
  
  // 🚨 State to control if the chat window is visible
  const [isChatOpen, setIsChatOpen] = useState(false);

  const mechanicName = currentUser?.displayName || 'Verified Mechanic';
  const mechanicInitials = mechanicName.substring(0, 2).toUpperCase();
  const incidentRef = targetIncident.id || 'REQ-PENDING';
  const motoristPhone = targetIncident.motoristPhone || '';
  const motoristName = targetIncident.motoristName || 'Motorist';

  const handleCompleteJob = async () => {
    if (!targetIncident.id) return;
    setIsCompleting(true);
    try {
      const incidentDoc = doc(db, 'incidents', targetIncident.id);
      await updateDoc(incidentDoc, { status: 'resolved' });
      navigate('/mechanic-dashboard', { replace: true });
    } catch (error) {
      console.error("Failed to complete job:", error);
      alert(`Error completing the job: ${error.message}`);
      setIsCompleting(false);
    }
  };

  const handleContactMotorist = (e) => {
    if (!motoristPhone || motoristPhone === 'No Phone') {
      e.preventDefault();
      alert("The motorist did not provide a valid emergency contact number.");
    }
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex font-sans antialiased relative">
      
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-white shadow-2xl flex flex-col p-8 z-10 shrink-0 border-r border-slate-200">
        <h2 className="text-xl font-black text-slate-900 mt-4 mb-8 tracking-tight">ACTIVE DISPATCH</h2>

        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-black flex items-center justify-center text-lg shrink-0">
            {mechanicInitials}
          </div>
          <div className="overflow-hidden">
            <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
              {incidentRef}
            </span>
            <p className="font-bold text-slate-900 mt-1 truncate">{mechanicName}</p>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          
          {/* 🚨 UPDATED: Call & Chat Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <a
              href={`tel:${motoristPhone}`}
              onClick={handleContactMotorist}
              className="py-4 rounded-xl bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider flex justify-center items-center gap-2 hover:bg-slate-200 transition-colors"
            >
              📞 Call
            </a>
            
            <button
              onClick={() => setIsChatOpen(true)}
              className="py-4 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
              💬 Chat
            </button>
          </div>

          <button
            onClick={handleCompleteJob}
            disabled={isCompleting}
            className="w-full py-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider flex justify-center items-center hover:bg-red-700 transition-colors shadow-lg shadow-red-200 mt-4"
          >
            {isCompleting ? 'Finalizing Record...' : 'Complete Job ✓'}
          </button>
        </div>
      </div>

      {/* RIGHT MAP AREA */}
      <div className="flex-1 relative bg-slate-200 overflow-hidden" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}>
         <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-4 h-4 bg-blue-500 border-4 border-white rounded-full shadow-lg"></div>
            <div className="mt-2 bg-slate-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md">
                Target: {motoristName}
            </div>
         </div>
         
         <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md mb-1 flex items-center gap-1 shadow-red-500/30">
                🚗 Transit Route
            </div>
            <div className="w-3 h-3 bg-red-600 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
         </div>
      </div>

      {/* 🚨 RENDER THE CHAT WINDOW IF TRUE */}
      {isChatOpen && targetIncident.id && (
        <ChatWindow incidentId={targetIncident.id} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}