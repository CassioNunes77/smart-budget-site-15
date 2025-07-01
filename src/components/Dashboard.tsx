
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Clock, Plus } from 'lucide-react';
import TransactionsList from './TransactionsList';
import DashboardPeriodFilter, { PeriodType } from './DashboardPeriodFilter';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
  createdAt?: string;
}

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onUpdateTransactionStatus?: (id: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => void;
  selectedPeriod: PeriodType;
  selectedYear?: number;
  onPeriodChange: (period: PeriodType, year?: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onUpdateTransactionStatus,
  selectedPeriod,
  selectedYear,
  onPeriodChange
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filtrar transações por período baseado na data de adição (createdAt)
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    
    return transactions.filter(transaction => {
      const createdDate = transaction.createdAt ? new Date(transaction.createdAt) : new Date();
      
      switch (selectedPeriod) {
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - 7);
          return createdDate >= weekStart;
          
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return createdDate >= monthStart && createdDate <= monthEnd;
          
        case 'quarter':
          const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
          const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
          const quarterEnd = new Date(now.getFullYear(), quarterMonth + 3, 0);
          return createdDate >= quarterStart && createdDate <= quarterEnd;
          
        case 'year':
          const year = selectedYear || now.getFullYear();
          const yearStart = new Date(year, 0, 1);
          const yearEnd = new Date(year, 11, 31);
          return createdDate >= yearStart && createdDate <= yearEnd;
          
        case 'all':
        default:
          return true;
      }
    });
  }, [transactions, selectedPeriod, selectedYear]);

  // Obter transações recentes ordenadas por data de criação (createdAt)
  const recentTransactions = useMemo(() => {
    console.log('=== DASHBOARD - Calculando transações recentes ===');
    console.log('Total de transações filtradas:', filteredTransactions.length);
    
    const sorted = [...filteredTransactions]
      .sort((a, b) => {
        // Ordenar por data de criação (createdAt) - mais recentes primeiro
        if (a.createdAt && b.createdAt) {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          console.log('Comparando:', {
            a: { id: a.id, createdAt: a.createdAt, timestamp: dateA },
            b: { id: b.id, createdAt: b.createdAt, timestamp: dateB },
            result: dateB - dateA
          });
          return dateB - dateA;
        }
        
        // Fallback para ID se não tiver createdAt
        return b.id.localeCompare(a.id);
      })
      .slice(0, 5);
    
    console.log('Transações recentes ordenadas:', sorted.map(t => ({
      id: t.id,
      description: t.description,
      createdAt: t.createdAt
    })));
    
    return sorted;
  }, [filteredTransactions]);

  // Calcular totais baseados nas transações filtradas
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular saldo consolidado (cumulativo baseado no período selecionado)
  const consolidatedBalance = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        cutoffDate = new Date(now.getFullYear(), quarterMonth, 1);
        break;
      case 'year':
        const year = selectedYear || now.getFullYear();
        cutoffDate = new Date(year, 0, 1);
        break;
      case 'all':
      default:
        cutoffDate = new Date(0); // Incluir todas as transações
        break;
    }
    
    // Para saldo consolidado, incluir todas as transações até a data de corte
    const cumulativeTransactions = transactions.filter(transaction => {
      const createdDate = transaction.createdAt ? new Date(transaction.createdAt) : new Date();
      return createdDate >= cutoffDate;
    });
    
    const cumulativeIncome = cumulativeTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const cumulativeExpenses = cumulativeTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return cumulativeIncome - cumulativeExpenses;
  }, [transactions, selectedPeriod, selectedYear]);

  const getPeriodLabel = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'week':
        return 'desta semana';
      case 'month':
        return 'deste mês';
      case 'quarter':
        return 'deste trimestre';
      case 'year':
        return `de ${selectedYear || now.getFullYear()}`;
      case 'all':
        return 'de todo o período';
      default:
        return 'do período';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com filtro de período */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças {getPeriodLabel()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardPeriodFilter
            selectedPeriod={selectedPeriod}
            selectedYear={selectedYear}
            onPeriodChange={onPeriodChange}
          />
          <Button onClick={onAddTransaction} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Receitas</CardTitle>
            <TrendingUp className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs opacity-80 mt-1">Total {getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Despesas</CardTitle>
            <TrendingDown className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs opacity-80 mt-1">Total {getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${consolidatedBalance >= 0 ? 'from-blue-600 to-blue-700' : 'from-orange-500 to-orange-600'} text-white border-0 shadow-lg`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Saldo Consolidado</CardTitle>
            <DollarSign className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(consolidatedBalance)}</div>
            <p className="text-xs opacity-80 mt-1">Acumulado {getPeriodLabel()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <CardTitle>Transações Recentes</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Últimas 5 adicionadas {getPeriodLabel()}
          </p>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <TransactionsList
              transactions={recentTransactions}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
              onUpdateStatus={onUpdateTransactionStatus}
              showTotals={false}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma transação encontrada {getPeriodLabel()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
