
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, TrendingUp, TrendingDown, CheckCircle, Clock, Upload } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PeriodFilter from './PeriodFilter';
import { Category } from '@/services/categoryService';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
}

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => void;
  showFilters?: boolean;
  categories?: Category[];
  showUpload?: boolean;
  onUploadCSV?: (file: File) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  onEdit, 
  onDelete,
  onUpdateStatus,
  showFilters = false,
  categories = [],
  showUpload = false,
  onUploadCSV
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadCSV) {
      onUploadCSV(file);
    }
  };

  const getCategoryData = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      return {
        color: category.color,
        icon: category.icon
      };
    }
    
    // Fallback para categorias não encontradas
    return {
      color: '#64748b',
      icon: 'Tag'
    };
  };

  const getCategoryIcon = (categoryName: string) => {
    const { icon } = getCategoryData(categoryName);
    const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Tag;
    return IconComponent;
  };

  const getCategoryColor = (categoryName: string) => {
    const { color } = getCategoryData(categoryName);
    // Converter cor hex para classes do Tailwind
    const colorMap: { [key: string]: string } = {
      '#22c55e': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      '#3b82f6': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      '#f59e0b': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      '#8b5cf6': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      '#f97316': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      '#06b6d4': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      '#ef4444': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      '#ec4899': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      '#6b7280': 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300',
      '#64748b': 'bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-300'
    };
    
    return colorMap[color] || 'bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-300';
  };

  const getStatusColor = (transaction: Transaction) => {
    if (!transaction.status) return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    
    const isPositiveStatus = transaction.status === 'paid' || transaction.status === 'received';
    return isPositiveStatus 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  };

  const getStatusText = (transaction: Transaction) => {
    if (!transaction.status) return 'Confirmado';
    
    const statusMap = {
      'paid': 'Pago',
      'unpaid': 'Não Pago',
      'received': 'Recebido',
      'unreceived': 'Não Recebido'
    };
    return statusMap[transaction.status];
  };

  const getStatusIcon = (transaction: Transaction) => {
    if (!transaction.status) return <CheckCircle className="w-3 h-3" />;
    
    const isPositiveStatus = transaction.status === 'paid' || transaction.status === 'received';
    return isPositiveStatus 
      ? <CheckCircle className="w-3 h-3" />
      : <Clock className="w-3 h-3" />;
  };

  const toggleStatus = (transaction: Transaction) => {
    if (!onUpdateStatus) return;
    
    let newStatus: 'paid' | 'unpaid' | 'received' | 'unreceived';
    
    if (transaction.type === 'income') {
      newStatus = transaction.status === 'received' ? 'unreceived' : 'received';
    } else {
      newStatus = transaction.status === 'paid' ? 'unpaid' : 'paid';
    }
    
    onUpdateStatus(transaction.id, newStatus);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      if (statusFilter === 'confirmed') {
        filtered = filtered.filter(t => !t.status || t.status === 'paid' || t.status === 'received');
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(t => t.status === 'unpaid' || t.status === 'unreceived');
      }
    }

    // Filtro por categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Filtro por período
    if (periodFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (periodFilter) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          if (startDate && endDate) {
            filtered = filtered.filter(t => {
              const transactionDate = new Date(t.date);
              return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
            });
          }
          break;
      }
      
      if (periodFilter !== 'custom') {
        filtered = filtered.filter(t => new Date(t.date) >= startDate);
      }
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <PeriodFilter
                periodFilter={periodFilter}
                setPeriodFilter={setPeriodFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
              {showUpload && (
                <div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('csv-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          const CategoryIcon = getCategoryIcon(transaction.category);
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-border/60 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium text-foreground truncate">
                      {transaction.description}
                    </h3>
                    <Badge className={`text-xs flex items-center gap-1 ${getCategoryColor(transaction.category)}`}>
                      <CategoryIcon className="w-3 h-3" />
                      {transaction.category}
                    </Badge>
                    <Badge 
                      className={`text-xs cursor-pointer transition-colors ${getStatusColor(transaction)}`}
                      onClick={() => toggleStatus(transaction)}
                    >
                      {getStatusIcon(transaction)}
                      <span className="ml-1">{getStatusText(transaction)}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold text-lg ${
                    transaction.type === 'income' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
                      onDelete(transaction.id);
                    }
                  }}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionsList;
