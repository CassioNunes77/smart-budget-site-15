import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Calendar,
  PieChart,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  User,
  Download,
  Upload,
  Tags,
  Filter,
  Loader2
} from 'lucide-react';
import TransactionModal from '@/components/TransactionModal';
import TransactionsList from '@/components/TransactionsList';
import FinancialCharts from '@/components/FinancialCharts';
import CategoryManager from '@/components/CategoryManager';
import SettingsComponent from '@/components/Settings';
import UserProfile from '@/components/UserProfile';
import DownloadManager from '@/components/DownloadManager';
import CsvUpload from '@/components/CsvUpload';
import AuthModal from '@/components/AuthModal';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import { Transaction } from '@/services/transactionService';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const calculateTotals = (transactions: Transaction[]) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  const balance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    balance,
  };
};

const getMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyData: { [key: string]: MonthlyData } = {};

  transactions.forEach((transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expenses: 0 };
    }

    if (transaction.type === 'income') {
      monthlyData[month].income += transaction.amount;
    } else {
      monthlyData[month].expenses += transaction.amount;
    }
  });

  return Object.values(monthlyData).sort((a, b) => (a.month > b.month ? 1 : -1));
};

const Index = () => {
  const { user, loading: authLoading, handleLogout } = useFirebaseAuth();
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError,
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    updateTransactionStatus,
    refreshTransactions 
  } = useTransactions();
  
  const [categories, setCategories] = useLocalStorage<string[]>('categories', [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 
    'Entretenimento', 'Roupas', 'Tecnologia', 'Viagem', 'Investimentos',
    'Salário', 'Freelance', 'Vendas'
  ]);
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { theme, toggleTheme } = useTheme();

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTransaction(transactionData);
      setIsTransactionModalOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleEditTransaction = async (transactionData: Transaction) => {
    try {
      await updateTransaction(transactionData);
      setEditingTransaction(null);
      setIsTransactionModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => {
    try {
      await updateTransactionStatus(id, status);
    } catch (error) {
      console.error('Erro ao atualizar status da transação:', error);
    }
  };

  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'> | Transaction) => {
    if ('id' in transactionData) {
      handleEditTransaction(transactionData);
    } else {
      handleAddTransaction(transactionData);
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleAddCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleCsvUpload = async (transactions: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]) => {
    try {
      for (const transaction of transactions) {
        await addTransaction(transaction);
      }
      await refreshTransactions();
    } catch (error) {
      console.error('Erro ao fazer upload do CSV:', error);
    }
  };

  const handleUpdateUser = (userData: { name: string; email: string }) => {
    // Implementar atualização do usuário se necessário
    console.log('Atualizar usuário:', userData);
  };

  const handleCategoryDeleted = (deletedCategory: string) => {
    // Atualizar transações que usam a categoria deletada para "Sem categoria"
    transactions.forEach(async (transaction) => {
      if (transaction.category === deletedCategory) {
        await updateTransaction({
          ...transaction,
          category: 'Sem categoria'
        });
      }
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal onLogin={() => {}} />;
  }

  const { totalIncome, totalExpenses, balance } = calculateTotals(transactions);
  const monthlyData = getMonthlyData(transactions);

  return (
    <div className="min-h-screen bg-background">
      <div className="md:hidden">
        <div className="bg-card p-4 flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Financeiro Simples</CardTitle>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
        </div>
      </div>

      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border">
        <div className="flex items-center justify-center h-16 border-b border-border">
          <CardTitle className="text-lg font-bold">Financeiro Simples</CardTitle>
        </div>
        <div className="flex flex-col flex-grow p-4 space-y-2">
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('overview')}>
            <PieChart className="w-4 h-4 mr-2" />
            Visão Geral
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('transactions')}>
            <DollarSign className="w-4 h-4 mr-2" />
            Transações
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('categories')}>
            <Tags className="w-4 h-4 mr-2" />
            Categorias
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('profile')}>
            <User className="w-4 h-4 mr-2" />
            Perfil
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('settings')}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('download')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
          <Button variant="outline" className="justify-start mt-auto" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
      
      <div className="md:ml-64 flex-1">
        <div className="p-6">
          {transactionsError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {transactionsError}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Visão Geral</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Transações</TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Categorias</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Perfil</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Configurações</TabsTrigger>
              <TabsTrigger value="download" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Exportar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Cards de resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Receitas do Mês
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(totalIncome)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Despesas do Mês
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalExpenses)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Saldo do Mês
                    </CardTitle>
                    <DollarSign className={`h-4 w-4 ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(balance)}
                    </div>
                    <Badge variant={balance >= 0 ? 'default' : 'destructive'} className="mt-2">
                      {balance >= 0 ? 'Positivo' : 'Negativo'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <FinancialCharts transactions={transactions} />

              {/* Lista de transações recentes */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Carregando transações...</span>
                    </div>
                  ) : (
                    <TransactionsList
                      transactions={transactions.slice(0, 5)}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteTransaction}
                      onUpdateStatus={handleUpdateTransactionStatus}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Carregando transações...</span>
                </div>
              ) : (
                <TransactionsList
                  transactions={transactions}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTransaction}
                  onUpdateStatus={handleUpdateTransactionStatus}
                  showFilters={true}
                  categories={categories}
                  showUpload={true}
                  onUploadCSV={(file) => {
                    // Processar arquivo CSV aqui se necessário
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManager 
                categories={categories}
                onUpdateCategories={setCategories}
                onCategoryDeleted={handleCategoryDeleted}
                userId={user.uid}
              />
            </TabsContent>

            <TabsContent value="profile">
              <UserProfile 
                user={{
                  id: user.uid,
                  name: user.displayName || '',
                  email: user.email || ''
                }}
                onUpdateUser={handleUpdateUser}
              />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsComponent 
                user={{
                  id: user.uid,
                  name: user.displayName || '',
                  email: user.email || ''
                }}
                currency="BRL"
                onCurrencyChange={() => {}}
              />
            </TabsContent>

            <TabsContent value="download">
              <DownloadManager 
                transactions={transactions} 
                user={{
                  name: user.displayName || '',
                  email: user.email || ''
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de Transação */}
      {isTransactionModalOpen && (
        <TransactionModal
          onClose={() => {
            setIsTransactionModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          editingTransaction={editingTransaction}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Index;
