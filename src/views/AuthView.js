import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { auth, db } from '../config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AuthView() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('motorist'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigateByRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.exists() ? userDoc.data() : { role: 'motorist' };
      
      if (userData.role === 'admin') navigate('/super-admin', { replace: true });
      else if (userData.role === 'mechanic') navigate('/mechanic-dashboard', { replace: true });
      else navigate('/motorist-home', { replace: true });
    } catch (err) {
      navigate('/motorist-home', { replace: true });
    }
  };

  useEffect(() => {
    if (currentUser) navigateByRole(currentUser.uid);
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await navigateByRole(userCredential.user.uid);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          role: role, 
          createdAt: serverTimestamp()
        });
        await navigateByRole(userCredential.user.uid);
      }
    } catch (err) {
      setErrorMessage(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-slate-100 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-[760px] max-h-full">
        <div className="bg-slate-900 pt-12 pb-7 px-6 text-center relative shrink-0">
          <div className="w-14 h-14 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-lg border border-red-500 animate-pulse">🛠️</div>
          <h2 className="text-xl font-black text-white tracking-wider uppercase mt-3">MechNomads</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-200">{errorMessage}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" />
            </div>

            {/* Role buttons always visible */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">User Role:</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('motorist')} className={`p-3 rounded-xl border ${role === 'motorist' ? 'border-red-600 bg-red-50 text-red-600 font-black' : 'border-slate-200 text-slate-500 font-bold'}`}>🚗 Motorist</button>
                <button type="button" onClick={() => setRole('mechanic')} className={`p-3 rounded-xl border ${role === 'mechanic' ? 'border-slate-900 bg-slate-900 text-white font-black' : 'border-slate-200 text-slate-500 font-bold'}`}>🔧 Mechanic</button>
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-black text-xs uppercase py-3.5 rounded-xl shadow-lg">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="w-full text-xs font-bold text-slate-500 underline py-4">
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}