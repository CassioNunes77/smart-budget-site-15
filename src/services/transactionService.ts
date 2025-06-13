import firestoreService from './firestoreService';
import { auth } from './firebase';

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
}

// Adicionar nova transação
export const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId'>): Promise<string> => {
  const user = auth.currentUser;
  console.log('Estado do usuário:', user?.uid, user?.email);
  
  if (!user) {
    console.error('Usuário não encontrado no auth.currentUser');
    throw new Error("Usuário não autenticado");
  }

  console.log('Dados da transação a ser salva:', transactionData);
  console.log('User ID:', user.uid);

  try {
    const transactionWithUserId = {
      ...transactionData,
      userId: user.uid
    };
    
    console.log('Transação completa:', transactionWithUserId);
    
    const docId = await firestoreService.saveDocument('transactions', transactionWithUserId);
    console.log('Transação salva com sucesso. ID:', docId);
    
    return docId;
  } catch (error) {
    console.error('Erro detalhado ao salvar transação:', error);
    throw error;
  }
};

// Buscar transações do usuário
export const getUserTransactions = async (): Promise<Transaction[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('Usuário não autenticado, retornando array vazio');
    return [];
  }

  console.log('Buscando transações para usuário:', user.uid);

  try {
    const transactions = await firestoreService.listDocuments(
      'transactions', 
      [['userId', '==', user.uid]],
      'date',
      'desc'
    );
    
    console.log(`${transactions.length} transações encontradas`);
    return transactions as Transaction[];
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }
};

// Atualizar transação existente
export const updateTransaction = async (transactionId: string, updates: Partial<Transaction>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Atualizando transação:', transactionId, updates);

  // Remover campos que não devem ser atualizados
  const { id, userId, ...updateData } = updates;
  
  await firestoreService.updateDocument('transactions', transactionId, updateData);
};

// Excluir transação
export const deleteTransaction = async (transactionId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Removendo transação:', transactionId);

  await firestoreService.deleteDocument('transactions', transactionId);
};

// Atualizar status da transação
export const updateTransactionStatus = async (
  transactionId: string, 
  status: 'paid' | 'unpaid' | 'received' | 'unreceived'
): Promise<void> => {
  await updateTransaction(transactionId, { status });
};

// Buscar transação por ID
export const getTransactionById = async (transactionId: string): Promise<Transaction | null> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const transaction = await firestoreService.getDocument('transactions', transactionId);
  
  if (transaction && transaction.userId === user.uid) {
    return transaction as Transaction;
  }
  
  return null;
};
