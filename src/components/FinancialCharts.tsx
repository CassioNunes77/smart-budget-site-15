
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { Category } from '@/hooks/useFirebaseCategories';
import CategoryIcon from './CategoryIcon';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
}

interface FinancialChartsProps {
  transactions: Transaction[];
  detailed?: boolean;
  categories?: Category[];
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ 
  transactions, 
  detailed = false,
  categories = []
}) => {
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#64748b';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados para gráfico de barras mensal
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expense: number; month: string } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, month: monthName };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  // Dados para gráfico de pizza de receitas
  const getIncomeByCategory = () => {
    const incomeByCategory: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'income')
      .forEach(transaction => {
        incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(incomeByCategory).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: getCategoryColor(category)
    }));
  };

  // Dados para gráfico de pizza de despesas
  const getExpensesByCategory = () => {
    const expensesByCategory: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: getCategoryColor(category)
    }));
  };

  const monthlyData = getMonthlyData();
  const incomeData = getIncomeByCategory();
  const expenseData = getExpensesByCategory();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.payload.name}</p>
          <p style={{ color: data.payload.color }}>
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Gráficos Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <PieChartIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado disponível para análise</p>
            <p className="text-sm">Adicione transações para visualizar os gráficos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Receitas vs Despesas */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Receitas vs Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#10b981" name="Receitas" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Despesas" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Receitas por Categoria */}
      {incomeData.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Receitas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Pizza - Despesas por Categoria */}
      {expenseData.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {detailed && (
        <>
          {/* Cards adicionais para relatórios detalhados */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Análise Detalhada por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total de Receitas</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total de Despesas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <PieChartIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Saldo Líquido</p>
                  <p className={`text-2xl font-bold ${
                    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) >= 0
                      ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(
                      transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                      transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FinancialCharts;
