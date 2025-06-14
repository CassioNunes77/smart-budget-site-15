
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
}

interface MonthlyTransactionsSummaryProps {
  transactions: Transaction[];
  currency?: string;
}

const formatCurrency = (amount: number, currencyCode: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode
  }).format(amount);
};

const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });
};

const MonthlyTransactionsSummary: React.FC<MonthlyTransactionsSummaryProps> = ({ 
  transactions, 
  currency = 'BRL' 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthlyData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() === month;
    });

    const confirmedIncome = monthTransactions
      .filter(t => t.type === 'income' && (!t.status || t.status === 'received'))
      .reduce((sum, t) => sum + t.amount, 0);

    const confirmedExpenses = monthTransactions
      .filter(t => t.type === 'expense' && (!t.status || t.status === 'paid'))
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = confirmedIncome - confirmedExpenses;

    return {
      income: confirmedIncome,
      expenses: confirmedExpenses,
      balance,
      transactionsCount: monthTransactions.length
    };
  }, [transactions, currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return currentDate.getFullYear() === now.getFullYear() && 
           currentDate.getMonth() === now.getMonth();
  };

  const isFutureMonth = () => {
    const now = new Date();
    return currentDate > now;
  };

  return (
    <Card className="shadow-lg mb-6">
      <CardContent className="p-6">
        {/* Header com navegação */}
        <div className="flex items-center justify-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="mr-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <h2 className="text-2xl font-bold text-center text-foreground capitalize min-w-[200px]">
            {getMonthName(currentDate)}
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="ml-4"
            disabled={isFutureMonth()}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Resumo financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Receitas
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(monthlyData.income, currency)}
            </div>
          </div>

          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Despesas
              </span>
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(monthlyData.expenses, currency)}
            </div>
          </div>

          <div className={`text-center p-4 rounded-lg border ${
            monthlyData.balance >= 0 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
              : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
          }`}>
            <div className="flex items-center justify-center mb-2">
              <DollarSign className={`w-5 h-5 mr-2 ${
                monthlyData.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`} />
              <span className={`text-sm font-medium ${
                monthlyData.balance >= 0 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-orange-700 dark:text-orange-300'
              }`}>
                Saldo
              </span>
            </div>
            <div className={`text-2xl font-bold ${
              monthlyData.balance >= 0 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {formatCurrency(monthlyData.balance, currency)}
            </div>
          </div>
        </div>

        {/* Indicador de período */}
        {isCurrentMonth() && (
          <div className="text-center mt-4">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Mês atual
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyTransactionsSummary;
