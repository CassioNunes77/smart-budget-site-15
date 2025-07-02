import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, TrendingUp, TrendingDown, CheckCircle, Clock, Upload, Search, DollarSign } from 'lucide-react';
import CategoryIcon, { getCategoryBadgeColor } from '@/components/CategoryIcon';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
  createdAt?: string; // Campo de timestamp de criação
}

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => void;
  showFilters?: boolean;
  categories?: string[];
  showUpload?: boolean;
  onUploadCSV?: (file: File) => void;
  showTotals?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  onEdit, 
  onDelete,
  onUpdateStatus,
  showFilters = false,
  categories = [],
  showUpload = false,
  onUploadCSV,
  showTotals = true
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('dateAdded');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    // Usar split para evitar problemas de timezone
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('pt-BR');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadCSV) {
      onUploadCSV(file);
    }
  };

  const getCategoryColor = (category: string) => {
    return getCategoryBadgeColor(category);
  };

  const getCategoryIcon = (category: string) => {
    return CategoryIcon;
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

  const sortTransactions = (transactionList: Transaction[]) => {
    return [...transactionList].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dateAdded':
          // Usar createdAt se disponível, caso contrário usar a data da transação como fallback
          if (a.createdAt && b.createdAt) {
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } else {
            // Fallback para data da transação (mais recentes primeiro)
            comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          break;
        case 'transactionDate':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'amount':
          comparison = b.amount - a.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        default:
          // Por padrão, ordenar por data da transação (mais recentes primeiro)
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      return comparison;
    });
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

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return sortTransactions(filtered);
  };

  const filteredTransactions = filterTransactions();

  // Calcular totais
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const projectedBalance = totalIncome - totalExpense;

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTotals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Projetada</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Despesa Projetada</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Projetado</p>
                  <p className={`text-2xl font-bold ${projectedBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(projectedBalance)}</p>
                </div>
                <DollarSign className={`w-8 h-8 ${projectedBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showFilters && (
        <div className="space-y-4">
          {/* Barra de Filtros com Labels */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
            {/* Busca */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>

            {/* Filtro de Tipo */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Status */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Categoria */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ordenação */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Ordenar por</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAdded">Data de Adição</SelectItem>
                  <SelectItem value="transactionDate">Data da Transação</SelectItem>
                  <SelectItem value="amount">Valor</SelectItem>
                  <SelectItem value="description">Descrição</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {showUpload && (
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Importar</Label>
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
                    CSV
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          const CategoryIconComponent = getCategoryIcon(transaction.category);
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
                      <CategoryIconComponent categoryName={transaction.category} className="w-3 h-3" />
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
