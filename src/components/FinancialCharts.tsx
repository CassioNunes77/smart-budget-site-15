import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface FinancialChartsProps {
  transactions: Transaction[];
  detailed?: boolean;
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions, detailed = false }) => {
  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados para gráfico de pizza (receitas vs despesas)
  const pieData = [
    {
      name: 'Receitas',
      value: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      color: '#10b981'
    },
    {
      name: 'Despesas',
      value: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      color: '#ef4444'
    }
  ].filter(item => item.value > 0);

  // Dados por categoria
  const categoryData = React.useMemo(() => {
    const categoryMap = new Map<string, { income: number; expense: number }>();
    
    transactions.forEach(transaction => {
      const existing = categoryMap.get(transaction.category) || { income: 0, expense: 0 };
      if (transaction.type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expense += transaction.amount;
      }
      categoryMap.set(transaction.category, existing);
    });

    return Array.from(categoryMap.entries()).map(([category, amounts]) => ({
      category,
      receitas: amounts.income,
      despesas: amounts.expense,
      total: amounts.income - amounts.expense
    }));
  }, [transactions]);

  // Dados mensais
  const monthlyData = React.useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = monthMap.get(monthKey) || { income: 0, expense: 0 };
      if (transaction.type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expense += transaction.amount;
      }
      monthMap.set(monthKey, existing);
    });

    return Array.from(monthMap.entries())
      .map(([month, amounts]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        receitas: amounts.income,
        despesas: amounts.expense,
        saldo: amounts.income - amounts.expense
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-gray-500">Nenhum dado disponível</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Histórico Mensal</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-gray-500">Nenhum dado disponível</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Histórico Mensal */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Histórico Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Análise por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="receitas" fill="#10b981" />
                <Bar dataKey="despesas" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialCharts;
