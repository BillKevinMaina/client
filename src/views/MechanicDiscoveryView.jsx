import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../config/firebaseConfig';

const vehicleData = {
  Honda: ['Fit', 'Civic', 'Accord', 'CR-V'],
  Subaru: ['Legacy', 'Outback', 'Forester', 'Impreza'],
  Toyota: ['Corolla', 'Vitz', 'Prado', 'Harrier', 'Camry'],
  Nissan: ['Note', 'Juke', 'X-Trail', 'Navara'],
  Mazda: ['Demio', 'Axela', 'CX-5', 'Atenza'],
  Volkswagen: ['Golf', 'Polo', 'Passat', 'Tiguan']
};

export default function MechanicDiscoveryView() {
  const navigate = useNavigate();
  const routeLocation = useLocation(); 
  const { createIncidentPayload, currentUser } = useApp();

  // 🚨 NEW: Switched to state so we can update the coordinates if they click the Retarget button
  const [liveCoordinates, setLiveCoordinates] = useState(
    routeLocation.state?.liveLocation || { lat: -1.3032, lng: 36.8202 }
  );
  
  const [motoristPhone, setMotoristPhone] = useState('');
  const [finalLocationName, setFinalLocationName] = useState(routeLocation.state?.liveAddress || "Nairobi West");
  const [brand, setBrand] = useState('Honda');
  const [model, setModel] = useState('Fit');
  const [year, setYear] = useState('2019');
  const [issueSummary, setIssueSummary] = useState('');
  const [subsystem, setSubsystem] = useState('hybrid'); 
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isRefreshingGps, setIsRefreshingGps] = useState(false); // 🚨 NEW: Loading state for GPS button

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, 'users', currentUser.uid)).then(docSnap => {
        if (docSnap.exists()) setMotoristPhone(docSnap.data().phoneNumber || 'No Phone');
      });
    }
  }, [currentUser]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setBrand(newBrand);
    setModel(vehicleData[newBrand][0]); 
  };

  // 🚨 NEW: The Force Retarget Function
  const handleRetargetGPS = () => {
    setIsRefreshingGps(true);
    if (!navigator.geolocation) {
      setIsRefreshingGps(false);
      return;
    }
    
    // Force a high-accuracy ping
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;
        setLiveCoordinates({ lat: currentLat, lng: currentLng });

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLng}&zoom=16`);
          const data = await response.json();
          const street = data.address.road || '';
          const suburb = data.address.suburb || data.address.neighbourhood || '';
          const city = data.address.city || data.address.town || 'Nairobi';
          const niceAddress = [street, suburb].filter(Boolean).join(', ') || city;
          setFinalLocationName(niceAddress || `${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}`);
        } catch (error) {
          console.error("Geocoding failed", error);
        } finally {
          setIsRefreshingGps(false);
        }
      },
      (error) => {
        console.warn("GPS Retarget Failed", error);
        setIsRefreshingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleBroadcastSubmission = (e) => {
    e.preventDefault();
    if (!issueSummary.trim() || !finalLocationName.trim()) return;
    
    setIsBroadcasting(true);
    const fullCarString = `${year} ${brand} ${model}`;

    setTimeout(async () => {
      await createIncidentPayload({
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        motoristName: currentUser?.displayName || "Distressed Motorist", 
        motoristPhone: motoristPhone, 
        carModel: fullCarString,
        issueSummary: issueSummary,
        subsystem: subsystem,
        locationName: finalLocationName, 
        coordinates: { lat: liveCoordinates.lat, lng: liveCoordinates.lng },
        distance: "Calculating...",
        status: "pending"
      });
      setIsBroadcasting(false);
      navigate('/tracking');
    }, 1200); 
  };

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden antialiased">
      <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white flex-col justify-center p-12 lg:p-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0,transparent_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-500/10 rounded-full animate-ping opacity-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-lg space-y-6">
          <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase">Emergency Matchmaker</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">Broadcasting to Local Grid Segments.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Our routing algorithm isolates your vehicle's mechanical signature and pings only the closest, qualified technicians.</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col md:justify-center md:items-center relative bg-white border-l border-slate-100">
        <div className="w-full md:max-w-md space-y-5 mt-8 md:mt-0">
          <div className="text-left border-b border-slate-100 pb-3">
            <button onClick={() => navigate(-1)} className="mb-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold hover:bg-slate-200 transition-colors">←</button>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Broadcast Diagnostics</h3>
          </div>
          
          <form onSubmit={handleBroadcastSubmission} className="space-y-4 md:space-y-5">
            <div className="text-left">
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1.5">Vehicle Asset Details</label>
              <div className="flex gap-2">
                <select value={brand} onChange={handleBrandChange} className="flex-[2] p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 shadow-sm cursor-pointer">
                  {Object.keys(vehicleData).map((b) => (<option key={b} value={b}>{b}</option>))}
                </select>
                <select value={model} onChange={(e) => setModel(e.target.value)} className="flex-[2] p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 shadow-sm cursor-pointer">
                  {vehicleData[brand].map((m) => (<option key={m} value={m}>{m}</option>))}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 shadow-sm cursor-pointer text-center">
                  {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
            </div>
            
            {/* 🚨 UPGRADED LOCATION FIELD WITH BUTTON */}
            <div className="text-left">
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1.5 flex justify-between items-end">
                <span>Confirmed Breakdown Location</span>
                <span className="text-[9px] text-slate-400 capitalize font-normal">Editable</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  value={finalLocationName} 
                  onChange={(e) => setFinalLocationName(e.target.value)} 
                  className="w-full p-3.5 pr-12 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600 shadow-sm transition-all" 
                />
                <button 
                  type="button" 
                  onClick={handleRetargetGPS}
                  disabled={isRefreshingGps}
                  className="absolute right-2 top-2 p-2 bg-emerald-200 text-emerald-800 rounded-lg hover:bg-emerald-300 transition-colors disabled:opacity-50"
                  title="Force Retarget GPS"
                >
                  {isRefreshingGps ? '🔄' : '📍'}
                </button>
              </div>
            </div>

            <div className="text-left">
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-2">Primary Faulting Subsystem</label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {[{ id: 'mechanical', label: '⚙️ Mechanical' }, { id: 'electrical', label: '⚡ Electrical' }, { id: 'hybrid', label: '🔋 Hybrid' }, { id: 'brakes', label: '🛑 Suspension' }].map((sys) => (
                  <button key={sys.id} type="button" onClick={() => setSubsystem(sys.id)} className={`p-3 text-left border rounded-xl text-xs font-bold shadow-sm transition-all ${subsystem === sys.id ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{sys.label}</button>
                ))}
              </div>
            </div>
            <div className="text-left">
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1.5">Narrative Symptom Summary</label>
              <textarea required rows="2" value={issueSummary} onChange={(e) => setIssueSummary(e.target.value)} placeholder="Describe what happened..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 resize-none shadow-sm"></textarea>
            </div>
            <button type="submit" disabled={isBroadcasting} className={`w-full text-white font-black text-sm uppercase py-4 rounded-xl shadow-lg mt-2 transition-all ${isBroadcasting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
              {isBroadcasting ? '📡 Initializing Cell Broadcast...' : 'Broadcast Request ⚡'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}