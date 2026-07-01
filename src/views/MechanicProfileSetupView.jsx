import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MechanicProfileSetupView() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [fullName, setFullName] = useState(currentUser?.name || 'John Kamau');
  const [garageName, setGarageName] = useState(currentUser?.garage || 'Kamau Jua Kali Auto Hub');
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/mechanic-dashboard');
    }, 1000);
  };

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden antialiased">
      <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white flex-col justify-center p-12 lg:p-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 z-0"></div>
        <div className="relative z-10 max-w-lg space-y-6">
          <span className="bg-amber-500/20 text-amber-400 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase">Technician Network</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">Establish Your Digital Storefront.</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 flex flex-col md:justify-center md:items-center relative bg-white border-l border-slate-100">
        <div className="w-full md:max-w-md space-y-5">
          <div className="text-left border-b border-slate-100 pb-3"><h3 className="text-lg md:text-2xl font-black tracking-tight">Onboard Profile</h3></div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1.5">Professional Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 shadow-sm" />
            </div>
            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1.5">Garage Name</label>
              <input type="text" required value={garageName} onChange={(e) => setGarageName(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-600 shadow-sm" />
            </div>
            <button type="submit" disabled={isSaving} className="w-full bg-slate-900 text-white font-black text-sm uppercase py-4 rounded-xl shadow-xl mt-2">{isSaving ? 'Saving...' : 'Commit Profile ✓'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}