import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MotoristHomeView() {
  const navigate = useNavigate();
  const { logout } = useApp(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [location, setLocation] = useState(null);
  const [addressName, setAddressName] = useState('Acquiring Satellites...'); 
  const [isLocating, setIsLocating] = useState(true);

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`);
      const data = await response.json();
      const street = data.address.road || '';
      const suburb = data.address.suburb || data.address.neighbourhood || '';
      const city = data.address.city || data.address.town || 'Nairobi';
      const niceAddress = [street, suburb].filter(Boolean).join(', ') || city;
      setAddressName(niceAddress);
    } catch (error) {
      console.error("Geocoding failed", error);
      setAddressName("Unknown Location");
    } finally {
      setIsLocating(false); 
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: -1.3032, lng: 36.8202 }); // Defaults to Nairobi West area
      setAddressName("Nairobi West, Nairobi");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;
        setLocation({ lat: currentLat, lng: currentLng });
        getAddressFromCoords(currentLat, currentLng);
      },
      (error) => {
        setLocation({ lat: -1.3032, lng: 36.8202 }); 
        setAddressName("Nairobi West, Nairobi");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const quickCategories = [
    { label: "Engine Failure", icon: "🔧", id: 'mechanical' },
    { label: "Electrical / Battery", icon: "⚡", id: 'electrical' },
    { label: "Flat Tire / Suspension", icon: "🚗", id: 'brakes' },
    { label: "Brake Diagnostic", icon: "🛑", id: 'brakes' }
  ];

  const handleScanRadius = () => {
    navigate('/discovery', { 
      state: { 
        liveLocation: location,
        liveAddress: addressName, 
        preSelectedIssue: searchQuery 
      } 
    });
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 md:bg-white flex items-center justify-center p-4 md:p-0 antialiased relative">
      
      {/* THE RED NAVIGATION TASKBAR (DRAWER) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-64 h-full bg-[#da292e] text-white flex flex-col shadow-2xl animate-[slideRight_0.2s_ease-out]">
            <div className="p-6 font-black text-2xl tracking-tighter">MechNomads</div>
            <div className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-red-200">Motorist Portal</div>
            
            <nav className="flex-1 px-4 mt-4 space-y-2">
              <button onClick={() => setIsDrawerOpen(false)} className="w-full text-left px-4 py-3 rounded-xl bg-red-700 font-bold text-sm flex items-center gap-3 transition-colors shadow-inner">
                📍 Home Map
              </button>
              <button onClick={() => navigate('/motorist-dashboard')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-700/50 font-bold text-sm flex items-center gap-3 transition-colors">
                📊 Full Dashboard
              </button>
              <button onClick={() => navigate('/tracking')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-700/50 font-bold text-sm flex items-center gap-3 transition-colors">
                📡 Live Tracking
              </button>
              
              <div className="pt-4 mt-4 border-t border-red-700/50"></div>
              <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-700/50 font-bold text-sm flex items-center gap-3 transition-colors text-white">
                ⚙️ Edit Profile
              </button>
            </nav>
            
            <div className="p-4">
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-950/50 font-bold text-sm flex items-center gap-3 transition-colors bg-red-950/30 text-red-200">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Map View */}
      <div className="w-full max-w-md md:max-w-full bg-white border border-slate-200 md:border-none rounded-[2.5rem] md:rounded-none shadow-2xl md:shadow-none relative overflow-hidden flex flex-col md:flex-row h-[700px] md:h-screen">
        
        <div className="flex-1 md:flex-[2] lg:flex-[3] bg-slate-200 relative md:order-2" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}>
          
          <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-20 flex justify-between items-center">
            <button onClick={() => setIsDrawerOpen(true)} className="bg-white hover:bg-slate-50 text-slate-800 p-3 md:p-4 rounded-xl shadow-md border border-slate-200 font-bold transition-all text-sm flex items-center gap-2">
              <span className="text-lg leading-none">☰</span> 
              <span className="hidden md:inline text-xs font-black uppercase tracking-wider">Menu</span>
            </button>
            
            <div className={`text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 md:gap-2 border ${isLocating ? 'bg-amber-500 border-amber-600' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${isLocating ? 'bg-white animate-pulse' : 'bg-emerald-500 animate-ping'}`}></span>
              {isLocating ? 'Locating...' : 'GPS Core Locked'}
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-full border-4 border-white shadow-2xl animate-pulse mx-auto"></div>
            <div className="mt-1.5 bg-slate-900 text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded shadow-md whitespace-nowrap border border-slate-800 flex flex-col">
              <span>My Breakdown Site</span>
              <span className="text-[9px] text-emerald-400 font-bold mt-0.5 capitalize">{addressName}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-t-[2rem] md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[10px_0_40px_rgba(0,0,0,0.1)] p-5 md:p-8 border-t md:border-t-0 md:border-r border-slate-100 relative z-20 shrink-0 md:w-[380px] lg:w-[450px] md:order-1 md:flex md:flex-col md:justify-center">
          
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-2xl font-black text-slate-900 tracking-tight">Emergency Dispatch</h3>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-2">Instantly map verified local mechanics within 5km.</p>
          </div>

          <div className="relative mb-4 md:mb-6">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type problem details..." className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-600" />
            <span className="absolute left-3.5 top-3.5 text-sm text-slate-400">🔍</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 md:mb-8">
            {quickCategories.map((cat, idx) => (
              <button key={idx} type="button" onClick={() => setSearchQuery(cat.label)} className={`p-2.5 bg-slate-50 border rounded-xl text-[11px] font-bold flex items-center gap-2 transition-all text-left shadow-sm ${searchQuery === cat.label ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-700'}`}>
                <span>{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>

          <button onClick={handleScanRadius} disabled={isLocating} className={`w-full text-white font-black text-xs md:text-sm uppercase tracking-wider py-4 rounded-xl transition-all text-center ${isLocating ? 'bg-slate-400 cursor-wait' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'}`}>
            {isLocating ? 'Translating GPS Data...' : 'Scan Spatial Radius'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}