import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, CheckCircle, XCircle, Search, Upload, Calendar, Filter, Tag } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Label } from '@/components/ui/label';
import CsvUpload from './CsvUpload';
import PeriodFilter from './PeriodFilter';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  userId?: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: 'paid' | 'unpaid' | 'received' | 'unreceived') => void;
  showFilters?: boolean;
  categories: Category[];
  showUpload?: boolean;
  onUploadCSV?: (file: File) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onUpdateStatus,
  showFilters = false,
  categories,
  showUpload = false,
  onUploadCSV
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Get category info by name
  const getCategoryInfo = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return {
      icon: category?.icon || 'Tag',
      color: category?.color || '#64748b'
    };
  };

  const getStatusBadge = (transaction: Transaction) => {
    if (!transaction.status) {
      return transaction.type === 'income' ? (
        <Badge variant="secondary" className="bg-green-100 text-green-800">Recebido</Badge>
      ) : (
        <Badge variant="secondary" className="bg-red-100 text-red-800">Pago</Badge>
      );
    }

    const statusMap = {
      paid: <Badge variant="secondary" className="bg-red-100 text-red-800">Pago</Badge>,
      unpaid: <Badge variant="outline" className="border-red-300 text-red-600">A Pagar</Badge>,
      received: <Badge variant="secondary" className="bg-green-100 text-green-800">Recebido</Badge>,
      unreceived: <Badge variant="outline" className="border-green-300 text-green-600">A Receber</Badge>
    };

    return statusMap[transaction.status];
  };

  const getStatusIcon = (transaction: Transaction) => {
    const isCompleted = !transaction.status || 
      transaction.status === 'paid' || 
      transaction.status === 'received';
    
    return isCompleted ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-orange-500" />
    );
  };

  const handleStatusToggle = (transaction: Transaction) => {
    let newStatus: 'paid' | 'unpaid' | 'received' | 'unreceived';
    
    if (transaction.type === 'expense') {
      newStatus = (!transaction.status || transaction.status === 'paid') ? 'unpaid' : 'paid';
    } else {
      newStatus = (!transaction.status || transaction.status === 'received') ? 'unreceived' : 'received';
    }
    
    onUpdateStatus(transaction.id, newStatus);
  };

  const renderCategoryIcon = (categoryName: string) => {
    const { icon, color } = getCategoryInfo(categoryName);
    const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<any>;
    
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" style={{ color }} />;
    }
    return <Tag className="w-4 h-4" style={{ color }} />;
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      if (statusFilter === 'completed') {
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

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
                <Label>Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          {renderCategoryIcon(category.name)}
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
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
                    <SelectItem value="completed">Concluídos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <PeriodFilter
              periodFilter={periodFilter}
              setPeriodFilter={setPeriodFilter}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              showLabel={false}
            />

            {showUpload && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(true)}
                  className="w-full md:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar CSV
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction)}
                  {renderCategoryIcon(transaction.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(transaction.date)}
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {renderCategoryIcon(transaction.category)}
                      {transaction.category}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  {getStatusBadge(transaction)}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusToggle(transaction)}
                    className="h-8 w-8 p-0"
                  >
                    {getStatusIcon(transaction)}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showUploadModal && (
        <CsvUpload
          onClose={() => setShowUploadModal(false)}
          onImport={() => {
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TransactionsList;
