
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import TransactionModal from '@/components/TransactionModal';
import TransactionsList from '@/components/TransactionsList';
import FinancialCharts from '@/components/FinancialCharts';
import Sidebar from '@/components/Sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useLocalStorage<User | null>('financial_user', null);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('financial_transactions', []);
  const [showAuthModal, setShowAuthModal] = useState(!user);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo, ${userData.name}!`,
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

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowTransactionModal(false);
    toast({
      title: "Transação adicionada!",
      description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} registrada.`,
    });
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

  if (showAuthModal) {
    return <AuthModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
          onLogout={handleLogout}
          userName={user?.name || 'Usuário'}
        />
        
        <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8">
          {currentPage === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {getGreeting()}, {user?.name}! 👋
                  </h1>
                  <p className="text-gray-600 mt-1">Aqui está um resumo das suas finanças</p>
                </div>
                <Button 
                  onClick={() => setShowTransactionModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Nova Transação
                </Button>
              </div>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Receitas</CardTitle>
                    <TrendingUp className="h-6 w-6 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(totalIncome)}</div>
                    <p className="text-xs opacity-80 mt-1">Total de entradas</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Despesas</CardTitle>
                    <TrendingDown className="h-6 w-6 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(totalExpenses)}</div>
                    <p className="text-xs opacity-80 mt-1">Total de saídas</p>
                  </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-600 to-blue-700' : 'from-orange-500 to-orange-600'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Saldo</CardTitle>
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
                      {showBalance ? formatCurrency(balance) : '••••••'}
                    </div>
                    <p className="text-xs opacity-80 mt-1">
                      {balance >= 0 ? 'Você está no positivo!' : 'Atenção ao saldo negativo'}
                    </p>
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
                  />
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Nenhuma transação encontrada</p>
                      <p className="text-sm">Comece adicionando sua primeira transação!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {currentPage === 'transactions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
                  <p className="text-gray-600 mt-1">Gerencie todas as suas movimentações financeiras</p>
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
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {currentPage === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
                <p className="text-gray-600 mt-1">Análise detalhada das suas finanças</p>
              </div>

              <FinancialCharts transactions={transactions} detailed={true} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Resumo Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total de Receitas:</span>
                        <span className="font-semibold text-emerald-600">{formatCurrency(totalIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total de Despesas:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-medium">Saldo Final:</span>
                        <span className={`font-bold text-xl ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(balance)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total de Transações:</span>
                        <span className="font-semibold">{transactions.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Média por Transação:</span>
                        <span className="font-semibold">
                          {transactions.length > 0 ? formatCurrency((totalIncome + totalExpenses) / transactions.length) : 'R$ 0,00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Categorias Utilizadas:</span>
                        <span className="font-semibold">
                          {new Set(transactions.map(t => t.category)).size}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
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
        />
      )}
    </div>
  );
};

export default Index;
