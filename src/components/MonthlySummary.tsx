
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
}

interface MonthlySummaryProps {
  transactions: Transaction[];
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
  currency: string;
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

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  transactions,
  currentMonth,
  onMonthChange,
  currency
}) => {
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    onMonthChange(newMonth);
  };

  return (
    <Card className="shadow-lg mb-6">
      <CardHeader>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-xl font-bold text-center capitalize">
            {getMonthName(currentMonth)}
          </CardTitle>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Receitas</CardTitle>
              <TrendingUp className="h-6 w-6 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome, currency)}</div>
              <p className="text-xs opacity-80 mt-1">Total recebido</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Despesas</CardTitle>
              <TrendingDown className="h-6 w-6 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses, currency)}</div>
              <p className="text-xs opacity-80 mt-1">Total gasto</p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-600 to-blue-700' : 'from-orange-500 to-orange-600'} text-white border-0 shadow-lg`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Saldo</CardTitle>
              <DollarSign className="h-6 w-6 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance, currency)}</div>
              <p className="text-xs opacity-80 mt-1">Diferença do mês</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySummary;
