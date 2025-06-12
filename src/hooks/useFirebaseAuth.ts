
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, logout, onAuthStateChange } from '@/services/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Inicializando auth state listener...');
    const unsubscribe = onAuthStateChange((user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Tentando fazer login com Google...');
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro no login com Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
    } catch (error: any) {
      console.error('Erro no logout:', error);
      setError(error.message || 'Erro no logout');
    }
  };

  return {
    user,
    loading,
    error,
    handleGoogleLogin,
    handleLogout
  };
};
