
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDpzdJHLP2QXQfnIuvUxOXe2u8l2oysOOs",
  authDomain: "controlesimples-b8931.firebaseapp.com",
  projectId: "controlesimples-b8931",
  storageBucket: "controlesimples-b8931.firebasestorage.app",
  messagingSenderId: "827899432174",
  appId: "1:827899432174:web:a35d9c282c60eb83f237ff",
  measurementId: "G-Z3LCBK7KYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google provider
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Erro no login com Google:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
