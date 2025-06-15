import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, Settings, Upload } from "lucide-react";
import TransactionModal from "@/components/TransactionModal";
import TransactionsList from "@/components/TransactionsList";
import MonthlySummary from "@/components/MonthlySummary";
import Sidebar from "@/components/Sidebar";
import AuthModal from "@/components/AuthModal";
import UserProfile from "@/components/UserProfile";
import PremiumModal from "@/components/PremiumModal";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useFirebaseTransactions } from "@/hooks/useFirebaseTransactions";
import { useFirebaseCategories } from "@/hooks/useFirebaseCategories";
import { toast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
}

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { user, loading: authLoading, handleLogout } = useFirebaseAuth();
  const { 
    transactions, 
    loading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    updateTransactionStatus
  } = useFirebaseTransactions();
  const { categories } = useFirebaseCategories();

  useEffect(() => {
    if (!user && !authLoading) {
      setIsAuthModalOpen(true);
    }
  }, [user, authLoading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filter transactions by selected month
  const getMonthlyTransactions = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
  };

  const monthlyTransactions = getMonthlyTransactions();

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      await addTransaction(transactionData);
      setIsModalOpen(false);
      setEditingTransaction(null);
      toast({
        title: "Sucesso!",
        description: "Transação adicionada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar transação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (!editingTransaction) return;
    
    try {
      await updateTransaction(editingTransaction.id, transactionData);
      setIsModalOpen(false);
      setEditingTransaction(null);
      toast({
        title: "Sucesso!",
        description: "Transação atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast({
        title: "Sucesso!",
        description: "Transação excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir transação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUploadCSV = (file: File) => {
    console.log('Upload CSV:', file);
    toast({
      title: "Upload realizado",
      description: "Arquivo CSV carregado com sucesso.",
    });
  };

  const handleUpdateUser = (userData: { name: string; email: string }) => {
    console.log('Update user:', userData);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {isAuthModalOpen && (
          <AuthModal 
            onLogin={(user) => {
              console.log('User logged in:', user);
              setIsAuthModalOpen(false);
            }}
          />
        )}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl font-bold">Sistema Financeiro</h1>
            <p className="text-muted-foreground">Faça login para acessar o sistema</p>
            <Button onClick={() => setIsAuthModalOpen(true)}>
              Fazer Login
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="flex">
          <Sidebar 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onLogout={handleLogout}
            userName={user?.displayName || user?.email || 'Usuário'}
            userPhotoURL={user?.photoURL}
            onShowPremiumModal={() => setIsPremiumModalOpen(true)}
          />
          
          <div className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
            <div className="max-w-4xl mx-auto">
              <UserProfile 
                user={user ? {
                  id: user.uid,
                  name: user.displayName || user.email || 'Usuário',
                  email: user.email || ''
                } : null}
                onUpdateUser={handleUpdateUser}
                onShowPremiumModal={() => setIsPremiumModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="flex">
        <Sidebar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
          userName={user?.displayName || user?.email || 'Usuário'}
          userPhotoURL={user?.photoURL}
          onShowPremiumModal={() => setIsPremiumModalOpen(true)}
        />
        
        <div className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Sistema Financeiro</h1>
                  <p className="text-sm font-medium" style={{ color: '#4CAF50' }}>
                    Olá, {user?.displayName || user?.email}! 💰 Seu futuro financeiro começa agora – e vai ser incrível!
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Nova Transação
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Receitas</CardTitle>
                  <TrendingUp className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                  <p className="text-xs opacity-80 mt-1">Total recebido</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Despesas</CardTitle>
                  <TrendingDown className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                  <p className="text-xs opacity-80 mt-1">Total gasto</p>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-600 to-blue-700' : 'from-orange-500 to-orange-600'} text-white border-0 shadow-lg md:col-span-2 lg:col-span-1`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Saldo</CardTitle>
                  <DollarSign className="h-6 w-6 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                  <p className="text-xs opacity-80 mt-1">Diferença atual</p>
                </CardContent>
              </Card>
            </div>

            <MonthlySummary
              transactions={transactions}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              currency="BRL"
            />

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <TransactionsList
                  transactions={monthlyTransactions}
                  onEdit={(transaction) => {
                    setEditingTransaction(transaction);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteTransaction}
                  onUpdateStatus={updateTransactionStatus}
                  showFilters={true}
                  categories={categories}
                  showUpload={true}
                  onUploadCSV={handleUploadCSV}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={editingTransaction ? handleEditTransaction : handleAddTransaction}
          editingTransaction={editingTransaction}
          categories={categories}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          onLogin={(user) => {
            console.log('User logged in:', user);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
};

export default Index;
