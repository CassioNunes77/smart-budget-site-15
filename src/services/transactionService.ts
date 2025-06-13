
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'weekly' | 'yearly';
  recurringEndDate?: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}

export const saveTransaction = async (userId: string, transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('Salvando transação no Firestore:', transactionData);
    
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Transação salva com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    throw error;
  }
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    console.log('Buscando transações do usuário:', userId);
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      } as Transaction);
    });
    
    console.log('Transações encontradas:', transactions.length);
    return transactions;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    throw error;
  }
};

export const updateTransaction = async (transactionId: string, transactionData: Partial<Transaction>) => {
  try {
    console.log('Atualizando transação:', transactionId, transactionData);
    
    const transactionRef = doc(db, 'transactions', transactionId);
    await updateDoc(transactionRef, {
      ...transactionData,
      updatedAt: serverTimestamp()
    });
    
    console.log('Transação atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId: string) => {
  try {
    console.log('Deletando transação:', transactionId);
    
    const transactionRef = doc(db, 'transactions', transactionId);
    await deleteDoc(transactionRef);
    
    console.log('Transação deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    throw error;
  }
};

export const updateTransactionStatus = async (transactionId: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => {
  try {
    console.log('Atualizando status da transação:', transactionId, status);
    
    const transactionRef = doc(db, 'transactions', transactionId);
    await updateDoc(transactionRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    console.log('Status da transação atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar status da transação:', error);
    throw error;
  }
};
