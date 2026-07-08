import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../config/firebaseConfig';

export default function ProfileView() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // 🚨 THE FIX APPLIED TO MOTORIST PROFILE
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const fallbackName = currentUser.displayName || 'Motorist Profile';
        setDisplayName(fallbackName);
        setPhotoURL(currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=1e293b&color=fff&size=256`);

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
            if (data.displayName) {
              setDisplayName(data.displayName);
              if (!currentUser.photoURL) {
                setPhotoURL(`https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName)}&background=1e293b&color=fff&size=256`);
              }
            }
          }
        } catch (error) {
          console.error("Could not load profile data:", error);
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
        phoneNumber: phoneNumber,
        role: 'motorist',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setIsEditing(false);
      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Save Failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden antialiased">
      
      <div className="hidden md:flex md:w-[45%] bg-slate-900 text-white flex-col justify-center items-center relative overflow-hidden shrink-0 border-r border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0,transparent_100%)]"></div>
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md z-20 font-bold">←</button>
        <div className="relative z-10 flex flex-col items-center">
          <div onClick={handleImageClick} className={`w-64 h-64 rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden bg-slate-200 transition-all duration-300 ${isEditing ? 'cursor-pointer hover:border-red-500/50 hover:scale-105' : ''}`}>
            <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {isEditing && <div className="absolute bottom-6 right-6 bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 pointer-events-none text-xl">📷</div>}
          <h2 className="text-3xl font-black mt-8 text-white tracking-tight">{displayName || 'Loading...'}</h2>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-2">{currentUser?.email}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col bg-white relative">
        <div className="md:hidden h-40 bg-slate-900 relative shrink-0">
          <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-md">←</button>
        </div>
        <div className="md:hidden flex justify-center -mt-16 relative z-10 mb-6 shrink-0">
          <div className="relative">
            <div onClick={handleImageClick} className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200 transition-all ${isEditing ? 'cursor-pointer ring-4 ring-red-500/30' : ''}`}>
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="flex-1 p-6 md:p-16 lg:p-24 flex flex-col max-w-2xl mx-auto w-full justify-center">
          <div className="hidden md:block mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 mt-2">Manage your identity and contact information.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
              {isEditing ? (
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500 transition-all shadow-sm" />
              ) : (
                <div className="w-full p-4 bg-slate-50 border border-transparent rounded-xl text-base md:text-lg font-black text-slate-900">{displayName || 'Not Set'}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
                <span>Emergency Contact Number</span>
                {!phoneNumber && !isEditing && <span className="text-red-500">Missing</span>}
              </label>
              {isEditing ? (
                <input type="tel" placeholder="+254 700 000 000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500 transition-all shadow-sm" />
              ) : (
                <div className="w-full p-4 bg-slate-50 border border-transparent rounded-xl text-base font-bold text-slate-700">{phoneNumber || "No phone number added"}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Registered Email</label>
              <div className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed">{currentUser?.email || "No email linked"}</div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            {isEditing ? (
              <div className="flex gap-4">
                <button onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 py-4 md:py-5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={handleSaveProfile} disabled={isSaving} className="flex-1 py-4 md:py-5 rounded-xl bg-emerald-500 text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                  {isSaving ? 'Saving Data...' : 'Save Profile ✓'}
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full py-4 md:py-5 rounded-xl bg-slate-900 text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">✏️ Edit Account Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}