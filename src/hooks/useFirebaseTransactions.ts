
import { useState, useEffect } from 'react';
import { 
  getUserTransactions, 
  addTransaction as addTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
  updateTransactionStatus as updateTransactionStatusService
} from '@/services/transactionService';
import { useFirebaseAuth } from './useFirebaseAuth';

interface Transaction {
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
}

export const useFirebaseTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useFirebaseAuth();

  // Carregar transações quando o usuário estiver autenticado
  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Carregando transações do Firestore...');
        const data = await getUserTransactions();
        setTransactions(data);
        console.log(`${data.length} transações carregadas`);
      } catch (err) {
        console.error('Erro ao carregar transações:', err);
        setError('Erro ao carregar transações');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  // Adicionar transação
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      console.log('Adicionando nova transação:', transactionData);
      const newId = await addTransactionService(transactionData);
      
      // Atualizar estado local imediatamente
      const newTransaction = { ...transactionData, id: newId };
      setTransactions(prev => [newTransaction, ...prev]);
      
      return newId;
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      throw err;
    }
  };

  // Atualizar transação
  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      console.log('Atualizando transação:', transactionId, updates);
      await updateTransactionService(transactionId, updates);
      
      // Atualizar estado local imediatamente
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? { ...t, ...updates } : t)
      );
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      throw err;
    }
  };

  // Excluir transação
  const deleteTransaction = async (transactionId: string) => {
    try {
      console.log('Excluindo transação:', transactionId);
      await deleteTransactionService(transactionId);
      
      // Atualizar estado local imediatamente
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      throw err;
    }
  };

  // Atualizar status da transação
  const updateTransactionStatus = async (
    transactionId: string, 
    status: 'paid' | 'unpaid' | 'received' | 'unreceived'
  ) => {
    try {
      console.log('Atualizando status da transação:', transactionId, status);
      await updateTransactionStatusService(transactionId, status);
      
      // Atualizar estado local imediatamente
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? { ...t, status } : t)
      );
    } catch (err) {
      console.error('Erro ao atualizar status da transação:', err);
      throw err;
    }
  };

  // Recarregar transações
  const refreshTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Erro ao recarregar transações:', err);
      setError('Erro ao recarregar transações');
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateTransactionStatus,
    refreshTransactions
  };
};
