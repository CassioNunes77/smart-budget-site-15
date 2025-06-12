import React, { useState, useEffect } from 'react';
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
import PremiumModal from '@/components/PremiumModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
}

const Index = () => {
  // Initialize theme
  useTheme();
  
  const [user, setUser] = useLocalStorage<User | null>('financial_user', null);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('financial_transactions', []);
  const [categories, setCategories] = useLocalStorage<string[]>('financial_categories', [
    'Sem categoria',
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Outros'
  ]);
  const [showAuthModal, setShowAuthModal] = useState(!user);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);
  const [notificationSettings, setNotificationSettings] = useLocalStorage('notification_settings', {
    billReminders: true
  });

  // Calcular totais separando por status
  const getFinancialSummary = () => {
    const consolidatedIncome = transactions
      .filter(t => t.type === 'income' && (!t.status || t.status === 'received'))
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'unreceived')
      .reduce((sum, t) => sum + t.amount, 0);

    const consolidatedExpenses = transactions
      .filter(t => t.type === 'expense' && (!t.status || t.status === 'paid'))
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingExpenses = transactions
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
    setCurrentPage('dashboard'); // Sempre iniciar no dashboard após login
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo ao Fluxo Fácil, ${userData.name}!`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    setShowAuthModal(true);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleUpdateUser = (userData: { name: string; email: string }) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const handleUpdateTransactionStatus = (id: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, status } : t
    ));
    toast({
      title: "Status atualizado!",
      description: "O status da transação foi alterado.",
    });
  };

  const createRecurringTransactions = (baseTransaction: Omit<Transaction, 'id'>, endDate: string) => {
    const transactions: Transaction[] = [];
    const startDate = new Date(baseTransaction.date);
    const finalDate = new Date(endDate + '-01');
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= finalDate) {
      const newTransaction: Transaction = {
        ...baseTransaction,
        id: `${Date.now()}-${Math.random()}`,
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

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (transaction.isRecurring && transaction.recurringEndDate) {
      const recurringTransactions = createRecurringTransactions(transaction, transaction.recurringEndDate);
      setTransactions([...recurringTransactions, ...transactions]);
      toast({
        title: "Transações recorrentes criadas!",
        description: `${recurringTransactions.length} transações foram adicionadas.`,
      });
    } else {
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      setTransactions([newTransaction, ...transactions]);
      toast({
        title: "Transação adicionada!",
        description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} registrada.`,
      });
    }
    setShowTransactionModal(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    setEditingTransaction(null);
    setShowTransactionModal(false);
    toast({
      title: "Transação atualizada!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transação removida",
      description: "A transação foi excluída com sucesso.",
    });
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  if (showAuthModal) {
    return <AuthModal onLogin={handleLogin} />;
  }

  const handleUpdateCategories = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  const handleCategoryDeleted = (deletedCategory: string) => {
    // Atualizar todas as transações que usam a categoria deletada para "Sem categoria"
    const updatedTransactions = transactions.map(transaction => 
      transaction.category === deletedCategory 
        ? { ...transaction, category: 'Sem categoria' }
        : transaction
    );
    setTransactions(updatedTransactions);
  };

  const toggleNotificationSetting = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {getGreeting()}, {user?.name}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">Aqui está um resumo das suas finanças</p>
              </div>
              <div className="flex gap-2">
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
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.consolidatedIncome)}</div>
                  <p className="text-xs opacity-80 mt-1">Valores recebidos</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Receitas Pendentes</CardTitle>
                  <Clock className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.pendingIncome)}</div>
                  <p className="text-xs opacity-80 mt-1">A receber</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Despesas Pagas</CardTitle>
                  <TrendingDown className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.consolidatedExpenses)}</div>
                  <p className="text-xs opacity-80 mt-1">Valores pagos</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-400 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Despesas Pendentes</CardTitle>
                  <Clock className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialSummary.pendingExpenses)}</div>
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
                    {showBalance ? formatCurrency(financialSummary.consolidatedBalance) : '••••••'}
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
                    {showBalance ? formatCurrency(financialSummary.totalBalance) : '••••••'}
                  </div>
                  <p className="text-xs opacity-80 mt-1">Incluindo valores pendentes</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <FinancialCharts transactions={transactions} />

            {/* Lista de Transações Recentes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsList 
                  transactions={transactions.slice(0, 5)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTransaction}
                  onUpdateStatus={handleUpdateTransactionStatus}
                  categories={categories}
                />
                {transactions.length === 0 && (
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

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Todas as Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsList 
                  transactions={transactions}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTransaction}
                  onUpdateStatus={handleUpdateTransactionStatus}
                  showFilters={true}
                  categories={categories}
                  showUpload={true}
                  onUploadCSV={handleUploadCSV}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatórios</h1>
              <p className="text-muted-foreground mt-1">Análise detalhada das suas finanças</p>
            </div>

            <FinancialCharts transactions={transactions} detailed={true} />

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
                      <span className="font-semibold text-emerald-600">{formatCurrency(financialSummary.consolidatedIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Despesas Consolidadas:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(financialSummary.consolidatedExpenses)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium">Saldo Consolidado:</span>
                      <span className={`font-bold text-xl ${financialSummary.consolidatedBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(financialSummary.consolidatedBalance)}
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
                      <span className="font-semibold text-emerald-400">{formatCurrency(financialSummary.pendingIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Despesas a Pagar:</span>
                      <span className="font-semibold text-red-400">{formatCurrency(financialSummary.pendingExpenses)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium">Saldo Projetado:</span>
                      <span className={`font-bold text-xl ${financialSummary.totalBalance >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                        {formatCurrency(financialSummary.totalBalance)}
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
            categories={categories} 
            onUpdateCategories={handleUpdateCategories}
            onCategoryDeleted={handleCategoryDeleted}
          />
        );

      case 'settings':
        return <Settings user={user} />;

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
          onShowPremiumModal={() => setShowPremiumModal(true)}
        />
        
        <main className="flex-1 ml-0 lg:ml-64 p-3 md:p-4 lg:p-8">
          {renderContent()}
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
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  );
};

export default Index;
