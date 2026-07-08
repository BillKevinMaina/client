import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../config/firebaseConfig';

export default function MechanicProfileSetupView() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // 🚨 THE FIX: This function now ONLY runs once when the screen loads. Keystrokes are ignored!
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const fallbackName = currentUser.displayName || 'New Mechanic';
        setDisplayName(fallbackName);
        setPhotoURL(currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0f172a&color=fff&size=256`);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
            if (data.companyName) setCompanyName(data.companyName);
            if (data.displayName) {
              setDisplayName(data.displayName);
              if (!currentUser.photoURL) {
                 setPhotoURL(`https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName)}&background=0f172a&color=fff&size=256`);
              }
            }
          }
        } catch (error) {
          console.error("Could not load extended profile data:", error);
        }
      }
    };
    fetchUserData();
  }, [currentUser]); 

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoURL(URL.createObjectURL(file)); 
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: displayName });
      }
      
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName: displayName,
        companyName: companyName,
        phoneNumber: phoneNumber,
        role: 'mechanic',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setIsEditing(false);
      alert("Workshop Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Save Failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col md:flex-row overflow-hidden antialiased">
      
      <div className="hidden md:flex md:w-[45%] bg-slate-950 text-white flex-col justify-center items-center relative overflow-hidden shrink-0 border-r border-slate-800">
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20 font-bold">←</button>
        <div className="relative z-10 flex flex-col items-center">
          <div onClick={handleImageClick} className={`w-64 h-64 rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden bg-slate-200 transition-all duration-300 ${isEditing ? 'cursor-pointer hover:border-red-500/50 hover:scale-105' : ''}`}>
            <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {isEditing && <div className="absolute bottom-6 right-6 bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 pointer-events-none text-xl">📷</div>}
          <h2 className="text-3xl font-black mt-8 text-white tracking-tight">{displayName || 'Loading...'}</h2>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-2">{companyName || 'Independent Technician'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col bg-slate-900 text-white relative">
        <div className="md:hidden h-32 bg-slate-950 relative shrink-0">
          <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 transition-colors z-20">←</button>
        </div>
        <div className="md:hidden flex justify-center -mt-16 relative z-10 mb-6 shrink-0">
          <div className="relative">
            <div onClick={handleImageClick} className={`w-32 h-32 rounded-full border-4 border-slate-800 shadow-lg overflow-hidden bg-slate-200 transition-all ${isEditing ? 'cursor-pointer ring-4 ring-red-500/30' : ''}`}>
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="flex-1 p-6 md:p-16 lg:p-24 flex flex-col max-w-2xl mx-auto w-full justify-center">
          <div className="hidden md:block mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight">Workshop Profile</h1>
            <p className="text-slate-400 mt-2">Manage your public technician identity.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Technician Name</label>
              {isEditing ? (
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-red-500 transition-all" />
              ) : (
                <div className="w-full p-4 bg-slate-800 rounded-xl text-lg font-black text-white">{displayName || 'Not Set'}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Company / Workshop Name</label>
              {isEditing ? (
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-red-500 transition-all" />
              ) : (
                <div className="w-full p-4 bg-slate-800 rounded-xl text-base font-bold text-slate-300">{companyName || "No company added"}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Dispatch Phone Number</label>
              {isEditing ? (
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-red-500 transition-all" />
              ) : (
                <div className="w-full p-4 bg-slate-800 rounded-xl text-base font-bold text-slate-300">{phoneNumber || "No phone number added"}</div>
              )}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800">
            {isEditing ? (
              <div className="flex gap-4">
                <button onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 py-4 rounded-xl border border-slate-700 text-slate-400 font-bold text-sm uppercase tracking-wider hover:bg-slate-800 transition-all">Cancel</button>
                <button onClick={handleSaveProfile} disabled={isSaving} className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black text-sm uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">{isSaving ? 'Saving...' : 'Save Profile ✓'}</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full py-4 rounded-xl bg-white text-slate-900 font-black text-sm uppercase tracking-wider hover:bg-slate-200 transition-all">✏️ Edit Details</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}