
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
  createdAt: string; // Timestamp de quando a transação foi criada
}

// Adicionar nova transação
export const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  const user = auth.currentUser;
  console.log('=== ADD TRANSACTION DEBUG ===');
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
      userId: user.uid,
      createdAt: new Date().toISOString() // Adicionar timestamp de criação
    };
    
    console.log('Transação completa com userId e createdAt:', transactionWithUserId);
    
    const docId = await firestoreService.saveDocument('transactions', transactionWithUserId);
    console.log('Transação salva com sucesso. ID do documento:', docId);
    
    // Teste imediato de leitura
    console.log('=== TESTE DE LEITURA IMEDIATA ===');
    const savedDoc = await firestoreService.getDocument('transactions', docId);
    console.log('Documento salvo recuperado imediatamente:', savedDoc);
    
    return docId;
  } catch (error) {
    console.error('Erro detalhado ao salvar transação:', error);
    throw error;
  }
};

// Buscar transações do usuário - REMOVENDO ORDENAÇÃO TEMPORARIAMENTE
export const getUserTransactions = async (): Promise<Transaction[]> => {
  const user = auth.currentUser;
  
  console.log('=== GET USER TRANSACTIONS DEBUG ===');
  console.log('Auth state check - user:', user?.uid, user?.email);
  console.log('Auth currentUser existe?', !!user);
  
  if (!user) {
    console.log('Usuário não autenticado, retornando array vazio');
    return [];
  }

  console.log('Buscando transações para usuário ID:', user.uid);

  try {
    console.log('Executando query no Firestore SEM ORDENAÇÃO...');
    
    // REMOVENDO ORDENAÇÃO TEMPORARIAMENTE PARA EVITAR ERRO DE ÍNDICE
    const transactions = await firestoreService.listDocuments(
      'transactions', 
      [['userId', '==', user.uid]]
      // Removendo orderBy temporariamente: 'date', 'desc'
    );
    
    console.log(`Query executada com sucesso. ${transactions.length} transações encontradas`);
    console.log('Primeiras 3 transações encontradas:', transactions.slice(0, 3));
    console.log('UserIds das transações:', transactions.map(t => t.userId));
    console.log('UserID atual:', user.uid);
    
    // Ordenar manualmente no lado do cliente
    const sortedTransactions = transactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    console.log('Transações ordenadas no cliente:', sortedTransactions.length);
    
    return sortedTransactions as Transaction[];
  } catch (error) {
    console.error('Erro detalhado ao buscar transações:', error);
    return [];
  }
};

// Função de teste para debug
export const testFirestoreConnection = async (): Promise<void> => {
  const user = auth.currentUser;
  console.log('=== TESTE DE CONEXÃO FIRESTORE ===');
  
  if (!user) {
    console.log('Usuário não autenticado para teste');
    return;
  }

  try {
    // Teste de gravação
    const testData = {
      test: 'connection-test',
      userId: user.uid,
      timestamp: new Date().toISOString()
    };
    
    console.log('Testando gravação...', testData);
    const docId = await firestoreService.saveDocument('test-collection', testData);
    console.log('Teste de gravação bem-sucedido. Doc ID:', docId);
    
    // Teste de leitura imediata
    console.log('Testando leitura imediata...');
    const readDoc = await firestoreService.getDocument('test-collection', docId);
    console.log('Teste de leitura bem-sucedido:', readDoc);
    
    // Teste de query
    console.log('Testando query por userId...');
    const queryResult = await firestoreService.listDocuments(
      'test-collection',
      [['userId', '==', user.uid]]
    );
    console.log('Teste de query bem-sucedido:', queryResult.length, 'documentos');
    
    // Limpeza
    await firestoreService.deleteDocument('test-collection', docId);
    console.log('Documento de teste removido');
    
  } catch (error) {
    console.error('Erro no teste de conexão:', error);
  }
};

// Atualizar transação existente
export const updateTransaction = async (transactionId: string, updates: Partial<Transaction>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Atualizando transação:', transactionId, updates);

  // Remover campos que não devem ser atualizados, incluindo createdAt
  const { id, userId, createdAt, ...updateData } = updates;
  
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
