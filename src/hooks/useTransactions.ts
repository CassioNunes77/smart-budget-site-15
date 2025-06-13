
import { useState, useEffect } from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import { 
  Transaction, 
  getUserTransactions, 
  saveTransaction, 
  updateTransaction as updateTransactionService, 
  deleteTransaction as deleteTransactionService,
  updateTransactionStatus as updateTransactionStatusService 
} from '@/services/transactionService';

export const useTransactions = () => {
  const { user } = useFirebaseAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userTransactions = await getUserTransactions(user.uid);
      setTransactions(userTransactions);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Usuário não logado');

    try {
      await saveTransaction(user.uid, transactionData);
      await loadTransactions(); // Recarregar transações
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  };

  const updateTransaction = async (transactionData: Transaction) => {
    try {
      const { id, userId, createdAt, updatedAt, ...updateData } = transactionData;
      await updateTransactionService(id, updateData);
      await loadTransactions(); // Recarregar transações
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransactionService(transactionId);
      await loadTransactions(); // Recarregar transações
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => {
    try {
      await updateTransactionStatusService(transactionId, status);
      await loadTransactions(); // Recarregar transações
    } catch (error) {
      console.error('Erro ao atualizar status da transação:', error);
      throw error;
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
    refreshTransactions: loadTransactions
  };
};
