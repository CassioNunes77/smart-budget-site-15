import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Eye, EyeOff, Clock, Crown, Lightbulb, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import TransactionModal from '@/components/TransactionModal';
import TransactionsList from '@/components/TransactionsList';
import FinancialCharts from '@/components/FinancialCharts';
import Sidebar from '@/components/Sidebar';
import DownloadManager from '@/components/DownloadManager';
import Settings from '@/components/Settings';
import UserProfile from '@/components/UserProfile';
import CategoryManager from '@/components/CategoryManager';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';
import CsvUpload from '@/components/CsvUpload';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useFirebaseTransactions } from '@/hooks/useFirebaseTransactions';
import { useFirebaseCategories } from '@/hooks/useFirebaseCategories';
import { migrateLocalData } from '@/services/migrationService';
import DashboardPeriodFilter, { PeriodType } from '@/components/DashboardPeriodFilter';
import MonthlySummary from '@/components/MonthlySummary';

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

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

const formatCurrency = (amount: number, currencyCode: string): string => {
  const currencies = {
    BRL: { locale: 'pt-BR', currency: 'BRL' },
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    BTC: { locale: 'en-US', currency: 'BTC', customFormat: true }
  };

  const config = currencies[currencyCode as keyof typeof currencies];
  
  if (currencyCode === 'BTC') {
    return `₿ ${amount.toFixed(8)}`;
  }
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency
  }).format(amount);
};

const Dashboard: React.FC = () => {
  // Initialize theme
  useTheme();
  
  const { user: firebaseUser, loading: firebaseLoading, handleLogout: firebaseLogout, error: firebaseError } = useFirebaseAuth();
  
  // Usar hooks do Firebase para dados persistentes
  const { 
    transactions, 
    loading: transactionsLoading, 
    addTransaction: addFirebaseTransaction,
    updateTransaction: updateFirebaseTransaction,
    deleteTransaction: deleteFirebaseTransaction,
    updateTransactionStatus: updateFirebaseTransactionStatus
  } = useFirebaseTransactions();
  
  const { 
    categories, 
    loading: categoriesLoading,
    updateCategories: updateFirebaseCategories 
  } = useFirebaseCategories();
  
  // Estados locais para interface
  const [user, setUser] = useLocalStorage<User | null>('financial_user', null);
  const [currency, setCurrency] = useLocalStorage<string>('financial_currency', 'BRL');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);
  const [notificationSettings, setNotificationSettings] = useLocalStorage('notification_settings', {
    billReminders: true
  });
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  
  // Estado do filtro de período do Dashboard
  const [dashboardPeriod, setDashboardPeriod] = useState<PeriodType>('month');
  const [dashboardYear, setDashboardYear] = useState<number>(new Date().getFullYear());
  
  // Estado para navegação mensal na tela de transações
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Ref para controlar se já mostrou o toast de login
  const hasShownLoginToast = useRef(false);
  const isInitialized = useRef(false);
  const migrationAttempted = useRef(false);

  // Effect para sincronizar o usuário do Firebase com o estado local
  useEffect(() => {
    if (firebaseLoading) {
      console.log('Firebase ainda carregando...');
      return;
    }

    console.log('Firebase loading concluído, user:', firebaseUser?.email || 'No user');

    if (firebaseUser && !hasShownLoginToast.current) {
      console.log('Usuário logado detectado, sincronizando...');
      
      const userData: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Usuário Google',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined
      };
      
      setUser(userData);
      setShowAuthModal(false);
      setCurrentPage('dashboard');
      
      // Executar migração automática apenas uma vez
      if (!migrationAttempted.current) {
        migrationAttempted.current = true;
        performMigration();
      }
      
      // Mostrar toast apenas uma vez
      if (!hasShownLoginToast.current) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo ao Fluxo Fácil, ${userData.name}!`,
        });
        hasShownLoginToast.current = true;
      }
      
      isInitialized.current = true;
      
    } else if (!firebaseUser && isInitialized.current) {
      console.log('Usuário deslogado, limpando estado...');
      setUser(null);
      setShowAuthModal(true);
      hasShownLoginToast.current = false;
      isInitialized.current = false;
      migrationAttempted.current = false;
    } else if (!firebaseUser && !isInitialized.current) {
      console.log('Nenhum usuário logado, mostrando modal de auth...');
      setShowAuthModal(true);
      isInitialized.current = true;
    }
  }, [firebaseUser, firebaseLoading, setUser]);

  // Função para executar migração
  const performMigration = async () => {
    try {
      setMigrationInProgress(true);
      console.log('Iniciando migração de dados...');
      await migrateLocalData();
      console.log('Migração concluída com sucesso');
    } catch (error) {
      console.error('Erro na migração:', error);
      // Não mostrar erro para o usuário, apenas log
    } finally {
      setMigrationInProgress(false);
    }
  };

  // Função para filtrar transações baseado no período do Dashboard
  const getFilteredTransactions = () => {
    const now = new Date();
    
    switch (dashboardPeriod) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Início da semana (domingo)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Fim da semana (sábado)
        
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= weekStart && transactionDate <= weekEnd;
        });
        
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= monthStart && transactionDate <= monthEnd;
        });
        
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), quarterStart.getMonth() + 3, 0);
        
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= quarterStart && transactionDate <= quarterEnd;
        });
        
      case 'year':
        const yearStart = new Date(dashboardYear, 0, 1);
        const yearEnd = new Date(dashboardYear, 11, 31);
        
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= yearStart && transactionDate <= yearEnd;
        });
        
      case 'all':
      default:
        return transactions;
    }
  };

  // Função para filtrar transações por mês selecionado (apenas para tela de transações)
  const getMonthlyTransactions = () => {
    const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
  };

  const filteredTransactions = getFilteredTransactions();
  const monthlyTransactions = getMonthlyTransactions();

  // Calcular totais separando por status usando transações filtradas
  const getFinancialSummary = () => {
    const consolidatedIncome = filteredTransactions
      .filter(t => t.type === 'income' && (!t.status || t.status === 'received'))
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingIncome = filteredTransactions
      .filter(t => t.type === 'income' && t.status === 'unreceived')
      .reduce((sum, t) => sum + t.amount, 0);

    const consolidatedExpenses = filteredTransactions
      .filter(t => t.type === 'expense' && (!t.status || t.status === 'paid'))
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingExpenses = filteredTransactions
      .filter(t => t.type === 'expense' && t.status === 'unpaid')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: consolidatedIncome + pendingIncome,
      consolidatedIncome,
      pendingIncome,
      totalExpenses: consolidatedExpenses + pendingExpenses,
      consolidatedExpenses,
      pendingExpenses,
      consolidatedBalance: consolidatedIncome - consolidatedExpenses,
      totalBalance: (consolidatedIncome + pendingIncome) - (consolidatedExpenses + pendingExpenses)
    };
  };

  const financialSummary = getFinancialSummary();

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    setCurrentPage('dashboard');
    if (!hasShownLoginToast.current) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo ao Fluxo Fácil, ${userData.name}!`,
      });
      hasShownLoginToast.current = true;
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setUser(null);
      setShowAuthModal(true);
      hasShownLoginToast.current = false;
      isInitialized.current = false;
      migrationAttempted.current = false;
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      // Fallback para logout manual se o Firebase falhar
      setUser(null);
      setShowAuthModal(true);
      hasShownLoginToast.current = false;
      isInitialized.current = false;
      migrationAttempted.current = false;
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    }
  };

  const handleUpdateUser = (userData: { name: string; email: string }) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => {
    try {
      await updateFirebaseTransactionStatus(id, status);
      toast({
        title: "Status atualizado!",
        description: "O status da transação foi alterado.",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da transação.",
        variant: "destructive"
      });
    }
  };

  const createRecurringTransactions = (baseTransaction: Omit<Transaction, 'id'>, endDate: string) => {
    const transactions: Omit<Transaction, 'id'>[] = [];
    const startDate = new Date(baseTransaction.date);
    const finalDate = new Date(endDate + '-01');
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= finalDate) {
      const newTransaction: Omit<Transaction, 'id'> = {
        ...baseTransaction,
        date: currentDate.toISOString().split('T')[0],
      };
      
      transactions.push(newTransaction);
      
      // Increment based on frequency
      if (baseTransaction.recurringFrequency === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (baseTransaction.recurringFrequency === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (baseTransaction.recurringFrequency === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }
    
    return transactions;
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (transaction.isRecurring && transaction.recurringEndDate) {
        const recurringTransactions = createRecurringTransactions(transaction, transaction.recurringEndDate);
        
        // Adicionar todas as transações recorrentes
        for (const recurringTransaction of recurringTransactions) {
          await addFirebaseTransaction(recurringTransaction);
        }
        
        toast({
          title: "Transações recorrentes criadas!",
          description: `${recurringTransactions.length} transações foram adicionadas.`,
        });
      } else {
        await addFirebaseTransaction(transaction);
        toast({
          title: "Transação adicionada!",
          description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de ${formatCurrency(transaction.amount, currency)} registrada.`,
        });
      }
      setShowTransactionModal(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação.",
        variant: "destructive"
      });
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      await updateFirebaseTransaction(transaction.id, transaction);
      setEditingTransaction(null);
      setShowTransactionModal(false);
      toast({
        title: "Transação atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a transação.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteFirebaseTransaction(id);
      toast({
        title: "Transação removida",
        description: "A transação foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleImportTransactions = async (importedTransactions: Transaction[]) => {
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const transaction of importedTransactions) {
        try {
          await addFirebaseTransaction(transaction);
          successCount++;
        } catch (error) {
          console.error('Erro ao importar transação individual:', error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Transações importadas!",
          description: `${successCount} transações foram adicionadas com sucesso.${errorCount > 0 ? ` ${errorCount} falharam.` : ''}`,
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Erro na importação",
          description: "Não foi possível importar as transações. Verifique o formato do arquivo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro geral ao importar transações:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante a importação.",
        variant: "destructive"
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleUploadCSV = (file: File) => {
    // Implementação básica para upload de CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      // Aqui você pode implementar o parser do CSV
      console.log('CSV content:', text);
      toast({
        title: "Arquivo CSV carregado",
        description: "Funcionalidade em desenvolvimento",
      });
    };
    reader.readAsText(file);
  };

  // Mostrar loading enquanto verifica autenticação do Firebase ou migração
  if ((firebaseLoading && !isInitialized.current) || migrationInProgress || transactionsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">
            {migrationInProgress ? 'Sincronizando dados...' : 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  // Mostrar erro do Firebase se houver
  if (firebaseError) {
    console.error('Erro do Firebase:', firebaseError);
  }

  if (showAuthModal && !firebaseUser) {
    return (
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  const handleUpdateCategories = async (newCategories: string[]) => {
    try {
      await updateFirebaseCategories(newCategories);
    } catch (error) {
      console.error('Erro ao atualizar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as categorias.",
        variant: "destructive"
      });
    }
  };

  const handleCategoryDeleted = (deletedCategory: string) => {
    // A atualização das transações será feita automaticamente pelo hook
    console.log(`Categoria ${deletedCategory} foi deletada`);
  };

  const toggleNotificationSetting = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Mostrar notificação sobre o status dos lembretes
    if (setting === 'billReminders') {
      const newValue = !notificationSettings[setting];
      toast({
        title: newValue ? "Lembretes ativados!" : "Lembretes desativados",
        description: newValue ? "Você receberá notificações sobre contas a pagar." : "Você não receberá mais lembretes sobre contas.",
      });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-emerald-600">
                  Olá, {user?.name}! 💰
                </h1>
                <p className="text-muted-foreground mt-1">Aqui está um resumo das suas finanças</p>
              </div>
              <div className="flex items-center gap-3">
                <DashboardPeriodFilter
                  selectedPeriod={dashboardPeriod}
                  selectedYear={dashboardYear}
                  onPeriodChange={(period, year) => {
                    setDashboardPeriod(period);
                    if (year) setDashboardYear(year);
                  }}
                />
                <Button 
                  className="premium-button standard-button-height" 
                  size="sm"
                  onClick={() => setShowPremiumModal(true)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Premium
                </Button>
                <Button 
                  onClick={() => setShowTransactionModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 standard-button-height"
                  size="lg"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Nova Transação</span>
                  <span className="sm:hidden">Nova</span>
                </Button>
              </div>
            </div>

            {/* Dicas Minimalistas */}
            {transactions.length === 0 && (
              <Alert className="border-primary/20 bg-primary/5">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  <strong>Dica:</strong> Comece registrando suas receitas e despesas diárias para ter controle total das suas finanças.
                </AlertDescription>
              </Alert>
            )}

            {transactions.length > 0 && transactions.length < 5 && (
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  <strong>Dica:</strong> Configure transações recorrentes para automatizar o controle de contas fixas mensais.
                </AlertDescription>
              </Alert>
            )}

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Receitas Consolidadas</CardTitle>
                  <TrendingUp className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.consolidatedIncome, currency)}</div>
                  <p className="text-xs opacity-80 mt-1">Valores recebidos</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Receitas Pendentes</CardTitle>
                  <Clock className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.pendingIncome, currency)}</div>
                  <p className="text-xs opacity-80 mt-1">A receber</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Despesas Pagas</CardTitle>
                  <TrendingDown className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.consolidatedExpenses, currency)}</div>
                  <p className="text-xs opacity-80 mt-1">Valores pagos</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-400 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Despesas Pendentes</CardTitle>
                  <Clock className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.pendingExpenses, currency)}</div>
                  <p className="text-xs opacity-80 mt-1">A pagar</p>
                </CardContent>
              </Card>
            </div>

            {/* Cards de Saldo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`bg-gradient-to-br ${financialSummary.consolidatedBalance >= 0 ? 'from-blue-600 to-blue-700' : 'from-orange-500 to-orange-600'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Saldo Consolidado</CardTitle>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 opacity-90" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white hover:bg-white/20 p-1 h-6 w-6"
                    >
                      {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {showBalance ? formatCurrency(financialSummary.consolidatedBalance, currency) : '••••••'}
                  </div>
                  <p className="text-xs opacity-80 mt-1">Apenas valores confirmados</p>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${financialSummary.totalBalance >= 0 ? 'from-purple-600 to-purple-700' : 'from-orange-600 to-orange-700'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Saldo Projetado</CardTitle>
                  <DollarSign className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {showBalance ? formatCurrency(financialSummary.totalBalance, currency) : '••••••'}
                  </div>
                  <p className="text-xs opacity-80 mt-1">Incluindo valores pendentes</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <FinancialCharts transactions={filteredTransactions} />

            {/* Lista de Transações Recentes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsList 
                  transactions={filteredTransactions.slice(0, 5)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTransaction}
                  onUpdateStatus={handleUpdateTransactionStatus}
                  categories={categories}
                />
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Nenhuma transação encontrada</p>
                    <p className="text-sm">Comece adicionando sua primeira transação!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transações</h1>
                <p className="text-muted-foreground mt-1">Gerencie todas as suas movimentações financeiras</p>
              </div>
              <Button 
                onClick={() => setShowTransactionModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                size="lg"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Nova Transação
              </Button>
            </div>

            <MonthlySummary
              transactions={transactions}
              currentMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              currency={currency}
            />

            {/* Seção de Upload CSV */}
            <CsvUpload 
              onTransactionsImported={handleImportTransactions}
              categories={categories}
            />

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <TransactionsList 
                  transactions={monthlyTransactions}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTransaction}
                  onUpdateStatus={handleUpdateTransactionStatus}
                  showFilters={true}
                  categories={categories}
                  showUpload={false}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatórios</h1>
                <p className="text-muted-foreground mt-1">Análise detalhada das suas finanças</p>
              </div>
              <DashboardPeriodFilter
                selectedPeriod={dashboardPeriod}
                selectedYear={dashboardYear}
                onPeriodChange={(period, year) => {
                  setDashboardPeriod(period);
                  if (year) setDashboardYear(year);
                }}
              />
            </div>

            <FinancialCharts transactions={filteredTransactions} detailed={true} />

            <DownloadManager transactions={transactions} user={user} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Resumo Consolidado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Receitas Consolidadas:</span>
                      <span className="font-semibold text-emerald-600">{formatCurrency(financialSummary.consolidatedIncome, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Despesas Consolidadas:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(financialSummary.consolidatedExpenses, currency)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium">Saldo Consolidado:</span>
                      <span className={`font-bold text-xl ${financialSummary.consolidatedBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(financialSummary.consolidatedBalance, currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Valores Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Receitas a Receber:</span>
                      <span className="font-semibold text-emerald-400">{formatCurrency(financialSummary.pendingIncome, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Despesas a Pagar:</span>
                      <span className="font-semibold text-red-400">{formatCurrency(financialSummary.pendingExpenses, currency)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium">Saldo Projetado:</span>
                      <span className={`font-bold text-xl ${financialSummary.totalBalance >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                        {formatCurrency(financialSummary.totalBalance, currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'profile':
        return <UserProfile user={user} onUpdateUser={handleUpdateUser} onShowPremiumModal={() => setShowPremiumModal(true)} />;

      case 'categories':
        return (
          <CategoryManager 
            onCategoryDeleted={handleCategoryDeleted}
          />
        );

      case 'settings':
        return <Settings user={user} currency={currency} onCurrencyChange={setCurrency} />;

      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notificações</h1>
              <p className="text-muted-foreground mt-1">Acompanhe suas atualizações e lembretes</p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Central de Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <span className="font-medium">Lembretes de contas a pagar</span>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações sobre despesas pendentes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.billReminders}
                      onCheckedChange={() => toggleNotificationSetting('billReminders')}
                    />
                  </div>
                  
                  <div className="text-center py-8 text-muted-foreground">
                    <Crown className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Mais funcionalidades Premium</p>
                    <p className="text-sm">Assine o plano Premium para receber notificações personalizadas!</p>
                    <Button 
                      className="mt-4 premium-button"
                      onClick={() => setShowPremiumModal(true)}
                    >
                      Conhecer Premium
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="flex w-full">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
          onLogout={handleLogout}
          userName={user?.name || 'Usuário'}
          userPhotoURL={user?.photoURL}
          onShowPremiumModal={() => setShowPremiumModal(true)}
        />
        
        <main className="flex-1 ml-0 lg:ml-64 p-3 md:p-4 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {/* Modals */}
      {showTransactionModal && (
        <TransactionModal 
          onClose={() => {
            setShowTransactionModal(false);
            setEditingTransaction(null);
          }}
          onSave={editingTransaction ? handleEditTransaction : handleAddTransaction}
          editingTransaction={editingTransaction}
          categories={categories}
        />
      )}
      
      {showPremiumModal && (
        <PremiumUpgradeModal 
          isOpen={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
