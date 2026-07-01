import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdCgOTcjupAsn5gkoc03fS2EOLXptNYrk",
  authDomain: "mechnomads-671bd.firebaseapp.com",
  projectId: "mechnomads-671bd",
  storageBucket: "mechnomads-671bd.firebasestorage.app",
  messagingSenderId: "940336211654",
  appId: "1:940336211654:web:d80df45e37c2b00d4bd9c7"
};

// Initialize Firebase App instance
const app = initializeApp(firebaseConfig);

// Export core operational services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;