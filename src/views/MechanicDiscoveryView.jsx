import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MechanicDiscoveryView() {
  const navigate = useNavigate();
  const { createIncidentPayload } = useApp();
  const [carModel, setCarModel] = useState('2019 Honda Fit Hybrid');
  const [issueSummary, setIssueSummary] = useState('');
  const [subsystem, setSubsystem] = useState('hybrid'); 
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcastSubmission = (e) => {
    e.preventDefault();
    if (!carModel.trim() || !issueSummary.trim()) return;
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      createIncidentPayload({
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        motoristName: "Alex Maina",
        carModel: carModel,
        issueSummary: issueSummary,
        subsystem: subsystem,
        location: "Ngong Road, near Coptic Hospital",
        distance: "2.4 km away",
        status: "pending"
      });
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
            <button onClick={() => navigate(-1)} className="mb-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold">←</button>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Broadcast Diagnostics</h3>
          </div>
          <form onSubmit={handleBroadcastSubmission} className="space-y-4 md:space-y-5">
            <div className="text-left">
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1.5">Vehicle Asset Model</label>
              <input type="text" required value={carModel} onChange={(e) => setCarModel(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 shadow-sm" />
            </div>
            <div className="text-left">
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-2">Primary Faulting Subsystem</label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {[{ id: 'mechanical', label: '⚙️ Mechanical' }, { id: 'electrical', label: '⚡ Electrical' }, { id: 'hybrid', label: '🔋 Hybrid' }, { id: 'brakes', label: '🛑 Suspension' }].map((sys) => (
                  <button key={sys.id} type="button" onClick={() => setSubsystem(sys.id)} className={`p-3 text-left border rounded-xl text-xs font-bold shadow-sm ${subsystem === sys.id ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-600'}`}>{sys.label}</button>
                ))}
              </div>
            </div>
            <div className="text-left">
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1.5">Narrative Symptom Summary</label>
              <textarea required rows="3" value={issueSummary} onChange={(e) => setIssueSummary(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 resize-none shadow-sm"></textarea>
            </div>
            <button type="submit" disabled={isBroadcasting} className="w-full bg-red-600 text-white font-black text-sm uppercase py-4 rounded-xl shadow-lg mt-2">
              {isBroadcasting ? '📡 Initializing Cell Broadcast...' : 'Broadcast Request ⚡'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}