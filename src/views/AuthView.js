import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AuthView() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Role is now used to route the user after a successful login OR registration
  const [role, setRole] = useState('motorist'); 
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const routeUser = (selectedRole) => {
    if (selectedRole === 'mechanic') {
      navigate('/mechanic-dashboard');
    } else {
      navigate('/motorist-home');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        // Authenticate the email/password, then instantly route based on the UI toggle
        await signInWithEmailAndPassword(auth, email, password);
        routeUser(role); 
        
      } else {
        // --- REGISTRATION FLOW ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Provision their initial profile in the database
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: serverTimestamp()
        });
        
        routeUser(role);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setErrorMessage('Email already in use.');
      else if (err.code === 'auth/invalid-credential') setErrorMessage('Invalid email or password.');
      else if (err.code === 'auth/weak-password') setErrorMessage('Password must be at least 6 characters.');
      else if (err.message.includes('offline')) setErrorMessage('Network error. Check your connection or disable adblockers.');
      else setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsProcessing(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      // For Google sign-ins, we attempt to save the profile in case it's their first time
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        createdAt: serverTimestamp()
      }, { merge: true }); // 'merge: true' prevents overwriting existing data
      
      routeUser(role);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-slate-100 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-[720px] max-h-full">
        
        <div className="bg-slate-900 pt-12 pb-7 px-6 text-center relative shrink-0">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full"></div>
          <div className="w-14 h-14 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-lg border border-red-500 animate-pulse">🛠️</div>
          <h2 className="text-xl font-black text-white tracking-wider uppercase mt-3">MechNomads</h2>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">
            {isLogin ? 'Secure Gateway Login' : 'Create Cloud Account'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-200">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-red-500 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-red-500 transition-all" />
            </div>

            {/* ROLE SELECTOR: Now visible for both Login and Registration */}
            <div className="pt-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Log in as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('motorist')} className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 ${role === 'motorist' ? 'border-red-600 bg-red-50 text-red-600 font-black' : 'border-slate-200 text-slate-500 font-bold'}`}>
                  <span className="text-lg">🚗</span><span className="text-[10px] uppercase">Motorist</span>
                </button>
                <button type="button" onClick={() => setRole('mechanic')} className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 ${role === 'mechanic' ? 'border-slate-900 bg-slate-900 text-white font-black' : 'border-slate-200 text-slate-500 font-bold'}`}>
                  <span className="text-lg">🔧</span><span className="text-[10px] uppercase">Mechanic</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase py-3.5 rounded-xl shadow-lg mt-3">
              {isProcessing ? 'Authenticating...' : isLogin ? 'Login ✓' : 'Register ✓'}
            </button>
          </form>

          <div className="flex items-center my-2 text-slate-300">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <button type="button" onClick={handleGoogleSignIn} disabled={isProcessing} className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black text-xs uppercase py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.257 1.624 15.467 1 12.24 1c-6.077 0-11 4.923-11 11s4.923 11 11 11c6.346 0 10.565-4.458 10.565-10.757 0-.723-.078-1.276-.173-1.658H12.24z"/></svg>
            Continue with Google
          </button>

          <div className="text-center pt-2 pb-6">
            <button type="button" onClick={() => {setIsLogin(!isLogin); setErrorMessage('');}} className="text-xs font-bold text-slate-500 hover:text-slate-900 underline underline-offset-4">
              {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}