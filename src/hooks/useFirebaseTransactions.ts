
import { useState, useEffect } from 'react';
import { 
  getUserTransactions, 
  addTransaction as addTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
  updateTransactionStatus as updateTransactionStatusService,
  testFirestoreConnection
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
      console.log('=== HOOK useFirebaseTransactions - loadTransactions ===');
      console.log('User no hook:', user?.uid, user?.email);
      console.log('Loading state:', loading);
      
      if (!user) {
        console.log('Usuário não está disponível, limpando transações');
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Iniciando carregamento de transações do Firestore...');
        
        // Teste de conexão primeiro
        await testFirestoreConnection();
        
        console.log('Executando getUserTransactions...');
        const data = await getUserTransactions();
        
        console.log(`Dados recebidos: ${data.length} transações`);
        console.log('Transações completas:', data);
        
        setTransactions(data);
        console.log('Estado de transações atualizado no hook');
        
      } catch (err) {
        console.error('Erro detalhado ao carregar transações no hook:', err);
        setError('Erro ao carregar transações');
        setTransactions([]);
      } finally {
        setLoading(false);
        console.log('Loading finalizado');
      }
    };

    // Aguardar um pouco para garantir que o auth está estabilizado
    const timer = setTimeout(() => {
      loadTransactions();
    }, 100);

    return () => clearTimeout(timer);
  }, [user?.uid]); // Dependência específica no UID

  // Adicionar transação
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      console.log('=== HOOK - addTransaction ===');
      console.log('Dados recebidos no hook:', transactionData);
      console.log('Usuário atual no hook:', user?.uid);
      
      if (!user) {
        console.error('Usuário não está autenticado no hook');
        throw new Error('Usuário não autenticado');
      }
      
      const newId = await addTransactionService(transactionData);
      console.log('Transação adicionada com ID:', newId);
      
      // Recarregar transações em vez de atualizar localmente
      console.log('Recarregando todas as transações...');
      const updatedTransactions = await getUserTransactions();
      setTransactions(updatedTransactions);
      console.log('Transações recarregadas:', updatedTransactions.length);
      
      return newId;
    } catch (err) {
      console.error('Erro no hook ao adicionar transação:', err);
      throw err;
    }
  };

  // Atualizar transação
  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      console.log('Atualizando transação:', transactionId, updates);
      await updateTransactionService(transactionId, updates);
      
      // Recarregar transações
      const updatedTransactions = await getUserTransactions();
      setTransactions(updatedTransactions);
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
      
      // Recarregar transações
      const updatedTransactions = await getUserTransactions();
      setTransactions(updatedTransactions);
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
      
      // Recarregar transações
      const updatedTransactions = await getUserTransactions();
      setTransactions(updatedTransactions);
    } catch (err) {
      console.error('Erro ao atualizar status da transação:', err);
      throw err;
    }
  };

  // Recarregar transações
  const refreshTransactions = async () => {
    if (!user) return;
    
    console.log('=== REFRESH TRANSACTIONS ===');
    setLoading(true);
    try {
      const data = await getUserTransactions();
      console.log('Transações recarregadas manualmente:', data.length);
      setTransactions(data);
    } catch (err) {
      console.error('Erro ao recarregar transações:', err);
      setError('Erro ao recarregar transações');
    } finally {
      setLoading(false);
    }
  };

  // Log do estado atual para debug
  useEffect(() => {
    console.log('=== ESTADO ATUAL DO HOOK ===');
    console.log('Transactions:', transactions.length);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('User:', user?.uid);
  }, [transactions, loading, error, user]);

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
