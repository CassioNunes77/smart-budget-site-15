
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, logout, onAuthStateChange, createUserDocument } from '@/services/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Inicializando auth state listener...');
    
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email || 'No user');
      
      try {
        setUser(firebaseUser);
        setError(null);
        
        // Se o usuário acabou de fazer login, criar documento no Firestore
        if (firebaseUser) {
          await createUserDocument(firebaseUser);
        }
        
        setLoading(false);
        
      } catch (err) {
        console.error('Erro ao processar mudança de estado de auth:', err);
        setError('Erro interno de autenticação');
        setLoading(false);
      }
    });

    return () => {
      console.log('Limpando auth state listener...');
      unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      console.log('Tentando fazer login com Google...');
      
      const result = await signInWithGoogle();
      console.log('Login concluído com sucesso:', result?.email);
      
      // Não precisamos definir o user aqui, pois o onAuthStateChange vai fazer isso
      return result;
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Erro no login com Google';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'Domínio não autorizado. Configure o domínio no Firebase Console.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login cancelado pelo usuário';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup bloqueado pelo navegador. Permita popups para este site.';
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      console.log('Fazendo logout...');
      await logout();
      // O onAuthStateChange vai limpar o user automaticamente
    } catch (error: any) {
      console.error('Erro no logout:', error);
      setError(error.message || 'Erro no logout');
      throw error;
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
