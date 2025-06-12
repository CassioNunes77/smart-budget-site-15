import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions, detailed = false }) => {
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];
  const GRAY_COLORS = ['#9ca3af', '#6b7280'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filtrar transações por período
  const filterTransactionsByPeriod = () => {
    let filtered = [...transactions];

    if (periodFilter !== 'all') {
      const now = new Date();
      let startFilterDate = new Date();
      
      switch (periodFilter) {
        case 'week':
          startFilterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startFilterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startFilterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startFilterDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          if (startDate && endDate) {
            filtered = filtered.filter(t => {
              const transactionDate = new Date(t.date);
              return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
            });
          }
          return filtered;
      }
      
      filtered = filtered.filter(t => new Date(t.date) >= startFilterDate);
    }

    return filtered;
  };

  const filteredTransactions = filterTransactionsByPeriod();

  // Separar transações por status
  const getTransactionsByStatus = () => {
    const consolidated = {
      income: filteredTransactions.filter(t => 
        t.type === 'income' && (!t.status || t.status === 'received')
      ).reduce((sum, t) => sum + t.amount, 0),
      expense: filteredTransactions.filter(t => 
        t.type === 'expense' && (!t.status || t.status === 'paid')
      ).reduce((sum, t) => sum + t.amount, 0)
    };

    const pending = {
      income: filteredTransactions.filter(t => 
        t.type === 'income' && t.status === 'unreceived'
      ).reduce((sum, t) => sum + t.amount, 0),
      expense: filteredTransactions.filter(t => 
        t.type === 'expense' && t.status === 'unpaid'
      ).reduce((sum, t) => sum + t.amount, 0)
    };

    return { consolidated, pending };
  };

  const { consolidated, pending } = getTransactionsByStatus();

  // Dados para gráfico de receitas por categoria
  const incomeByCategory = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    filteredTransactions
      .filter(t => t.type === 'income')
      .forEach(transaction => {
        const existing = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, existing + transaction.amount);
      });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  }, [filteredTransactions]);

  // Dados para gráfico de despesas por categoria
  const expenseByCategory = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const existing = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, existing + transaction.amount);
      });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  }, [filteredTransactions]);

  // Dados para gráfico de pizza (incluindo pendentes)
  const pieData = [
    {
      name: 'Receitas Consolidadas',
      value: consolidated.income,
      color: '#10b981'
    },
    {
      name: 'Receitas Pendentes',
      value: pending.income,
      color: '#9ca3af'
    },
    {
      name: 'Despesas Consolidadas',
      value: consolidated.expense,
      color: '#ef4444'
    },
    {
      name: 'Despesas Pendentes',
      value: pending.expense,
      color: '#6b7280'
    }
  ].filter(item => item.value > 0);

  // Dados por categoria (separando consolidados e pendentes)
  const categoryData = React.useMemo(() => {
    const categoryMap = new Map<string, { 
      incomeConsolidated: number; 
      incomePending: number;
      expenseConsolidated: number; 
      expensePending: number;
    }>();
    
    filteredTransactions.forEach(transaction => {
      const existing = categoryMap.get(transaction.category) || { 
        incomeConsolidated: 0, 
        incomePending: 0,
        expenseConsolidated: 0, 
        expensePending: 0 
      };
      
      const isConsolidated = !transaction.status || 
        transaction.status === 'received' || 
        transaction.status === 'paid';
      
      if (transaction.type === 'income') {
        if (isConsolidated) {
          existing.incomeConsolidated += transaction.amount;
        } else {
          existing.incomePending += transaction.amount;
        }
      } else {
        if (isConsolidated) {
          existing.expenseConsolidated += transaction.amount;
        } else {
          existing.expensePending += transaction.amount;
        }
      }
      categoryMap.set(transaction.category, existing);
    });

    return Array.from(categoryMap.entries()).map(([category, amounts]) => ({
      category,
      'Receitas Consolidadas': amounts.incomeConsolidated,
      'Receitas Pendentes': amounts.incomePending,
      'Despesas Consolidadas': amounts.expenseConsolidated,
      'Despesas Pendentes': amounts.expensePending,
    }));
  }, [filteredTransactions]);

  // Dados mensais (incluindo pendentes) - com ordenação correta
  const monthlyData = React.useMemo(() => {
    const monthMap = new Map<string, { 
      incomeConsolidated: number; 
      incomePending: number;
      expenseConsolidated: number; 
      expensePending: number;
    }>();
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = monthMap.get(monthKey) || { 
        incomeConsolidated: 0, 
        incomePending: 0,
        expenseConsolidated: 0, 
        expensePending: 0 
      };
      
      const isConsolidated = !transaction.status || 
        transaction.status === 'received' || 
        transaction.status === 'paid';
      
      if (transaction.type === 'income') {
        if (isConsolidated) {
          existing.incomeConsolidated += transaction.amount;
        } else {
          existing.incomePending += transaction.amount;
        }
      } else {
        if (isConsolidated) {
          existing.expenseConsolidated += transaction.amount;
        } else {
          existing.expensePending += transaction.amount;
        }
      }
      monthMap.set(monthKey, existing);
    });

    return Array.from(monthMap.entries())
      .map(([month, amounts]) => ({
        month,
        monthDisplay: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        'Receitas Consolidadas': amounts.incomeConsolidated,
        'Receitas Pendentes': amounts.incomePending,
        'Despesas Consolidadas': amounts.expenseConsolidated,
        'Despesas Pendentes': amounts.expensePending,
        saldoConsolidado: amounts.incomeConsolidated - amounts.expenseConsolidated,
        saldoTotal: (amounts.incomeConsolidated + amounts.incomePending) - (amounts.expenseConsolidated + amounts.expensePending)
      }))
      .sort((a, b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime())
      .slice(-6);
  }, [filteredTransactions]);

  if (filteredTransactions.length === 0) {
    return (
      <div className="space-y-6">
        {detailed && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Filtros de Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mês</SelectItem>
                      <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                      <SelectItem value="year">Último ano</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {periodFilter === 'custom' && (
                  <>
                    <div className="space-y-2">
                      <Label>Data Inicial</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Final</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Nenhum dado disponível</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-gray-500">Nenhum dado para o período selecionado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {detailed && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Filtros de Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mês</SelectItem>
                    <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                    <SelectItem value="year">Último ano</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {periodFilter === 'custom' && (
                <>
                  <div className="space-y-2">
                    <Label>Data Inicial</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Final</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Distribuição por Tipo e Status</CardTitle>
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
                <XAxis dataKey="monthDisplay" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="Receitas Consolidadas" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Receitas Pendentes" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Despesas Consolidadas" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Despesas Pendentes" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="saldoConsolidado" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Receitas por Categoria */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Receitas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Despesas por Categoria */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Análise por Categoria e Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Análise por Categoria e Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="Receitas Consolidadas" fill="#10b981" />
                  <Bar dataKey="Receitas Pendentes" fill="#9ca3af" />
                  <Bar dataKey="Despesas Consolidadas" fill="#ef4444" />
                  <Bar dataKey="Despesas Pendentes" fill="#6b7280" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FinancialCharts;
