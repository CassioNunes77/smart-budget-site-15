
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
export const db = getFirestore(app);

// Google provider com configurações adicionais
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export const createUserDocument = async (user: User) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    
    // Verificar se o documento já existe
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Criar o documento apenas se não existir
      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp()
      });
      
      console.log('Documento do usuário criado com sucesso:', user.uid);
    } else {
      console.log('Documento do usuário já existe:', user.uid);
    }
  } catch (error) {
    console.error('Erro ao criar documento do usuário:', error);
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log('Iniciando login com Google...');
    console.log('Auth domain:', firebaseConfig.authDomain);
    console.log('Project ID:', firebaseConfig.projectId);
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Login bem-sucedido:', result.user);
    return result.user;
  } catch (error: any) {
    console.error('Erro detalhado no login com Google:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem do erro:', error.message);
    
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Configuração do Firebase Authentication não encontrada. Verifique se o Authentication está habilitado no Console do Firebase.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login cancelado pelo usuário');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup bloqueado pelo navegador. Permita popups para este site.');
    }
    
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('Logout realizado com sucesso');
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
