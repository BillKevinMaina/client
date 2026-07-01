import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LiveTrackingView() {
  const navigate = useNavigate();
  const { activeIncident, clearIncident } = useApp();

  const displayIncident = activeIncident || {
    id: "REQ-770412", status: "pending", carModel: "2019 Honda Fit Hybrid", location: "Mombasa Road", issueSummary: "Shift lock stuck", distance: "Scanning...", motoristName: "Alex Maina"
  };

  const isAccepted = displayIncident.status === 'accepted';

  const handleCancel = () => {
    clearIncident();
    navigate('/motorist-home');
  };

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden antialiased">
      <div className="flex-1 md:flex-[2] lg:flex-[3] bg-slate-200 relative md:order-2" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}>
        <div className="absolute top-[60%] left-[45%] z-10 text-center">
          <div className="w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-2xl mx-auto"></div>
          <div className="mt-1 bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded">My Breakdown Point</div>
        </div>

        {isAccepted ? (
          <div className="absolute top-[35%] left-[50%] z-10 text-center animate-bounce">
            <div className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1"><span>🛠️</span> Mechanic Approaching</div>
            <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white mx-auto -mt-1"></div>
          </div>
        ) : (
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-32 h-32 border-2 border-red-500/30 rounded-full animate-ping absolute inset-0"></div>
            <div className="w-12 h-12 border border-red-500/40 rounded-full animate-pulse bg-red-500/10 flex justify-center items-center text-lg">📡</div>
          </div>
        )}

        <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 md:top-6 md:left-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border flex justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Network Monitor</span>
            <h4 className="text-xs font-black text-slate-900 mt-0.5 uppercase flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAccepted ? 'bg-blue-600' : 'bg-red-600 animate-pulse'}`}></span> {isAccepted ? 'Technician Secured' : 'Scanning Nearby'}
            </h4>
          </div>
          <span className="text-[10px] font-mono bg-slate-900 text-white px-2 py-1 rounded-md">{displayIncident.id}</span>
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 border-t md:border-t-0 md:border-r border-slate-100 relative z-20 shrink-0 flex flex-col md:w-[380px] lg:w-[450px] md:order-1 overflow-y-auto">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto md:hidden mb-4"></div>
        <div className="hidden md:block mb-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase">Status Uplink</h2>
        </div>

        {isAccepted ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black">JK</div>
              <div className="flex-1">
                <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Responder</span>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">John Kamau</h4>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-blue-600 font-mono">9 Mins</span>
              </div>
            </div>
            <a href="tel:0712345678" className="w-full block bg-slate-900 text-white font-black text-sm uppercase py-4 rounded-xl text-center">📞 Intercom</a>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-black text-slate-900">Transmitting Signal...</h4>
              <p className="text-sm text-slate-400">Broadcasting to verified technicians.</p>
            </div>
            <button onClick={handleCancel} className="w-full bg-red-50 text-red-600 font-black text-sm uppercase py-4 rounded-xl">Cancel Request</button>
          </div>
        )}
      </div>
    </div>
  );
}