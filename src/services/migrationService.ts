
import firestoreService from './firestoreService';
import { auth } from './firebase';
import { addTransaction } from './transactionService';
import { updateUserCategories } from './categoryService';

export const migrateLocalData = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('Usuário não autenticado, não é possível migrar dados');
    return;
  }

  console.log('Iniciando migração de dados locais para Firestore...');

  try {
    // Verificar se já foi feita a migração
    const migrationFlag = localStorage.getItem(`migration_completed_${user.uid}`);
    if (migrationFlag) {
      console.log('Migração já foi realizada para este usuário');
      return;
    }

    // Migrar transações
    const localTransactions = JSON.parse(localStorage.getItem('financial_transactions') || '[]');
    console.log(`Migrando ${localTransactions.length} transações...`);
    
    for (const transaction of localTransactions) {
      try {
        await addTransaction({
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          date: transaction.date,
          status: transaction.status,
          isRecurring: transaction.isRecurring,
          recurringFrequency: transaction.recurringFrequency,
          recurringEndDate: transaction.recurringEndDate
        });
      } catch (error) {
        console.error('Erro ao migrar transação:', transaction, error);
      }
    }

    // Migrar categorias
    const localCategories = JSON.parse(localStorage.getItem('financial_categories') || '[]');
    console.log(`Migrando ${localCategories.length} categorias...`);
    
    if (localCategories.length > 0) {
      await updateUserCategories(localCategories);
    }

    // Migrar configurações de moeda
    const localCurrency = localStorage.getItem('financial_currency');
    if (localCurrency) {
      await firestoreService.saveDocument('user_settings', {
        currency: localCurrency,
        userId: user.uid
      }, user.uid);
    }

    // Migrar configurações de notificação
    const notificationSettings = JSON.parse(localStorage.getItem('notification_settings') || '{}');
    if (Object.keys(notificationSettings).length > 0) {
      await firestoreService.saveDocument('notification_settings', {
        ...notificationSettings,
        userId: user.uid
      }, user.uid);
    }

    // Marcar migração como concluída
    localStorage.setItem(`migration_completed_${user.uid}`, 'true');
    
    console.log('Migração concluída com sucesso!');

    // Limpar dados locais após migração bem-sucedida
    localStorage.removeItem('financial_transactions');
    localStorage.removeItem('financial_categories');
    localStorage.removeItem('financial_currency');
    localStorage.removeItem('notification_settings');
    
    console.log('Dados locais limpos após migração');

  } catch (error) {
    console.error('Erro durante a migração:', error);
    throw error;
  }
};

// Executar migração automaticamente após login
export const setupAutoMigration = () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log('Usuário autenticado, verificando necessidade de migração...');
      try {
        await migrateLocalData();
      } catch (error) {
        console.error('Erro na migração automática:', error);
      }
    }
  });
};
