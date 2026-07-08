import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useApp } from '../context/AppContext';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return (R * c).toFixed(1); 
};

export default function MechanicDashboardView() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp(); 
  
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mechanicData, setMechanicData] = useState({ companyName: '', phoneNumber: '' });

  // 1. Fetch Mechanic's saved profile data & GPS
  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, 'users', currentUser.uid)).then(docSnap => {
        if (docSnap.exists()) {
          setMechanicData({
            companyName: docSnap.data().companyName || 'Independent Technician',
            phoneNumber: docSnap.data().phoneNumber || ''
          });
        }
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMechanicLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLocating(false);
        },
        () => {
          setMechanicLocation({ lat: -1.3000, lng: 36.8200 }); 
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [currentUser]);

  // 2. Listen to Firebase for pending broadcasts
  useEffect(() => {
    const q = query(collection(db, 'incidents'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setIncomingRequests(requestsData);
    });
    return () => unsubscribe(); 
  }, []);

  // 3. Handle Accept Request
  const handleAcceptRequest = async (request) => {
    try {
      const incidentRef = doc(db, 'incidents', request.id);
      
      // 🚨 FIX: Now sends the real Name, Phone, and Company to the Motorist!
      await updateDoc(incidentRef, { 
        status: 'accepted',
        mechanicId: currentUser?.uid,
        mechanicName: currentUser?.displayName || 'Verified Mechanic',
        mechanicPhone: mechanicData.phoneNumber,
        mechanicCompany: mechanicData.companyName
      });
      navigate('/mechanic-routing', { state: { targetIncident: request } });
    } catch (error) {
      console.error("Failed to accept job:", error);
      alert("Error accepting job. Another mechanic may have claimed it.");
    }
  };

  const handleDeclineRequest = (requestId) => {
    setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 font-sans antialiased relative">
      
      {/* THE MECHANIC NAVIGATION DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-64 h-full bg-slate-950 border-r border-slate-800 text-white flex flex-col shadow-2xl animate-[slideRight_0.2s_ease-out]">
            <div className="p-6 font-black text-2xl tracking-tighter text-white">MechNomads</div>
            <div className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Technician Portal</div>
            
            <nav className="flex-1 px-4 mt-4 space-y-2">
              <button onClick={() => setIsDrawerOpen(false)} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 font-bold text-sm flex items-center gap-3 transition-colors shadow-inner text-white">
                📡 Dispatch Radar
              </button>
              
              <div className="pt-4 mt-4 border-t border-slate-800"></div>
              <button onClick={() => navigate('/mechanic-setup')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 font-bold text-sm flex items-center gap-3 transition-colors text-slate-300">
                ⚙️ Workshop Profile
              </button>
            </nav>
            
            <div className="p-4">
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-900/50 font-bold text-sm flex items-center gap-3 transition-colors bg-slate-900 text-red-400">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl shadow-md border border-slate-700 font-bold transition-all text-sm">
            ☰ Menu
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Dispatch Terminal</h1>
            <p className="text-slate-400 mt-1">Monitoring grid for distress beacons.</p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isLocating ? 'bg-amber-900/30 border-amber-500/50 text-amber-500' : 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'}`}>
          <span className={`w-2 h-2 rounded-full ${isLocating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-ping'}`}></span>
          {isLocating ? 'Calibrating Radar...' : 'Radar Active'}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {incomingRequests.length === 0 && !isLocating ? (
          <div className="col-span-1 md:col-span-2 py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="text-6xl mb-4 opacity-50">📡</div>
            <h3 className="text-xl font-bold text-slate-400">No active distress calls.</h3>
            <p className="text-slate-500 text-sm mt-2">Waiting for local broadcasts...</p>
          </div>
        ) : (
          incomingRequests.map((req) => {
            const distanceStr = mechanicLocation && req.coordinates 
              ? calculateDistance(mechanicLocation.lat, mechanicLocation.lng, req.coordinates.lat, req.coordinates.lng)
              : '...';

            return (
              <div key={req.id} className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full blur-2xl animate-pulse pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                      {req.subsystem || 'Emergency'} Issue
                    </span>
                    <h3 className="text-xl font-black mt-3">{req.carModel || 'Unknown Vehicle'}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400">{distanceStr} <span className="text-sm">km</span></div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Away</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-700/50 flex-1">
                  <div className="flex justify-between items-start mb-3 border-b border-slate-700/50 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Motorist</span>
                      <p className="text-sm font-semibold">{req.motoristName || 'Anonymous Driver'}</p>
                    </div>
                    {/* 🚨 NEW: Motorist Phone Number is now visible to the mechanic! */}
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Contact Number</span>
                      <p className="text-sm font-bold text-blue-400">{req.motoristPhone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Location Pinned</span>
                    <p className="text-sm font-semibold text-emerald-300">{req.locationName || 'Coordinates Received'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Diagnostics Notes</span>
                    <p className="text-sm text-slate-300 italic">"{req.issueSummary || 'No details provided.'}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button onClick={() => handleDeclineRequest(req.id)} className="p-4 rounded-xl border border-slate-700 text-slate-400 font-bold text-sm uppercase tracking-wider hover:bg-slate-800 transition-all">Ignore</button>
                  <button onClick={() => handleAcceptRequest(req)} className="p-4 rounded-xl bg-red-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all">Accept Dispatch</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <style jsx>{`@keyframes slideRight { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }`}</style>
    </div>
  );
}