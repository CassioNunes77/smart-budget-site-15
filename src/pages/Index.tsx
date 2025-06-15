
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MonthlySummary from '@/components/MonthlySummary';
import FinancialCharts from '@/components/FinancialCharts';
import TransactionsList from '@/components/TransactionsList';
import TransactionModal from '@/components/TransactionModal';
import { useFirebaseTransactions } from '@/hooks/useFirebaseTransactions';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardCardProps {
  title: string;
  value: string | number;
  isLoading: boolean;
}

const Index = () => {
  const { user } = useFirebaseAuth();
  const { 
    transactions, 
    loading, 
    error, 
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateTransactionStatus,
    refreshTransactions
  } = useFirebaseTransactions();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setShowTransactionModal(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      console.log('Transação excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      alert('Erro ao excluir transação.');
    }
  };

  const handleUpdateTransactionStatus = async (
    id: string, 
    status: 'paid' | 'unpaid' | 'received' | 'unreceived'
  ) => {
    try {
      await updateTransactionStatus(id, status);
      console.log('Status da transação atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar status da transação:', err);
      alert('Erro ao atualizar status da transação.');
    }
  };

  const handleCreateTransaction = async (transactionData) => {
    try {
      await addTransaction(transactionData);
      setShowTransactionModal(false);
      setTransactionToEdit(null);
      console.log('Transação adicionada com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      alert('Erro ao adicionar transação.');
    }
  };

  const handleUpdateTransaction = async (id, updates) => {
    try {
      await updateTransaction(id, updates);
      setShowTransactionModal(false);
      setTransactionToEdit(null);
      console.log('Transação atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      alert('Erro ao atualizar transação.');
    }
  };

  const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, isLoading }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <div className="text-2xl font-bold">{value}</div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Filter transactions by current month
  const getMonthlyTransactions = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
  };

  const monthlyTransactions = getMonthlyTransactions();

  const renderDashboard = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-muted-foreground">
              Olá, {user?.displayName || user?.email || 'Usuário'}! 💰
            </h1>
            <p className="text-muted-foreground">Bem-vindo ao seu painel financeiro</p>
          </div>
          <Button 
            onClick={() => setShowTransactionModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="Receitas Mensais" value="R$ 5,000" isLoading={loading} />
          <DashboardCard title="Despesas Mensais" value="R$ 2,500" isLoading={loading} />
          <DashboardCard title="Saldo Atual" value="R$ 7,500" isLoading={loading} />
          <DashboardCard title="Total de Transações" value={transactions.length} isLoading={loading} />
        </div>

        <MonthlySummary 
          transactions={transactions} 
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          currency="BRL"
        />

        <FinancialCharts transactions={monthlyTransactions} />

        <TransactionsList 
          transactions={monthlyTransactions}
          currentMonth={currentMonth}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onUpdateStatus={handleUpdateTransactionStatus}
        />
      </div>
    );
  };

  if (!isMounted) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <div>Carregando dados...</div>
      ) : (
        renderDashboard()
      )}

      {showTransactionModal && (
        <TransactionModal
          onClose={() => {
            setShowTransactionModal(false);
            setTransactionToEdit(null);
          }}
          onSave={transactionToEdit ? handleUpdateTransaction : handleCreateTransaction}
          editingTransaction={transactionToEdit}
          categories={['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros']}
        />
      )}
    </div>
  );
};

export default Index;
