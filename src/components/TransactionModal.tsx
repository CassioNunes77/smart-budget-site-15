
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'weekly' | 'yearly';
  recurringEndDate?: string;
}

interface TransactionModalProps {
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  editingTransaction?: Transaction | null;
  categories: string[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  onClose,
  onSave,
  editingTransaction,
  categories
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'paid' | 'unpaid' | 'received' | 'unreceived'>('unpaid');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    console.log('TransactionModal useEffect triggered', { editingTransaction });
    
    if (editingTransaction) {
      console.log('Setting form data from editing transaction:', editingTransaction);
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setStatus(editingTransaction.status || (editingTransaction.type === 'income' ? 'unreceived' : 'unpaid'));
      setIsRecurring(editingTransaction.isRecurring || false);
      setRecurringFrequency(editingTransaction.recurringFrequency || 'monthly');
      if (editingTransaction.recurringEndDate) {
        setRecurringEndDate(new Date(editingTransaction.recurringEndDate + '-01'));
      } else {
        setRecurringEndDate(undefined);
      }
    } else {
      console.log('Resetting form for new transaction');
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setStatus('unpaid');
      setIsRecurring(false);
      setRecurringFrequency('monthly');
      setRecurringEndDate(undefined);
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission triggered', {
      amount,
      description,
      category,
      editingTransaction
    });
    
    if (!amount || !description || parseFloat(amount) <= 0) {
      console.log('Form validation failed');
      return;
    }

    const finalCategory = category || 'Sem categoria';

    const transactionData: any = {
      type,
      amount: parseFloat(amount),
      description,
      category: finalCategory,
      date,
      status,
      isRecurring
    };

    // Só incluir campos de recorrência se a transação for recorrente
    if (isRecurring) {
      transactionData.recurringFrequency = recurringFrequency;
      if (recurringEndDate) {
        transactionData.recurringEndDate = format(recurringEndDate, 'yyyy-MM');
      }
    }

    console.log('Transaction data to save:', transactionData);

    if (editingTransaction) {
      // Para edição, incluir o ID
      onSave({ ...transactionData, id: editingTransaction.id });
    } else {
      // Para nova transação, não incluir ID
      onSave(transactionData);
    }
  };

  const availableCategories = categories.includes('Sem categoria') 
    ? categories 
    : ['Sem categoria', ...categories];

  const getStatusBoolean = () => {
    if (type === 'expense') {
      return status === 'paid';
    } else {
      return status === 'received';
    }
  };

  const handleStatusChange = (checked: boolean) => {
    if (type === 'expense') {
      setStatus(checked ? 'paid' : 'unpaid');
    } else {
      setStatus(checked ? 'received' : 'unreceived');
    }
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    // Resetar status baseado no novo tipo, sempre iniciando em off
    if (newType === 'expense') {
      setStatus('unpaid');
    } else {
      setStatus('unreceived');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-background max-h-[calc(100vh-2rem)] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('expense')}
                className={`w-full ${type === 'expense' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-600 text-red-600 hover:bg-red-50'}`}
              >
                Despesa
              </Button>
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('income')}
                className={`w-full ${type === 'income' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
              >
                Receita
              </Button>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Almoço no restaurante"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Status como Switch */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-sm font-medium">
                  {type === 'expense' ? 'Pago' : 'Recebido'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {type === 'expense' 
                    ? 'Marque se a despesa já foi paga' 
                    : 'Marque se a receita já foi recebida'
                  }
                </p>
              </div>
              <Switch
                checked={getStatusBoolean()}
                onCheckedChange={handleStatusChange}
              />
            </div>

            {/* Transação Recorrente */}
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
              <Label htmlFor="recurring">Transação Recorrente</Label>
            </div>

            {isRecurring && (
              <div className="space-y-4 p-3 border rounded-lg bg-muted/20">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequência</Label>
                  <Select value={recurringFrequency} onValueChange={(value: 'monthly' | 'weekly' | 'yearly') => setRecurringFrequency(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !recurringEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {recurringEndDate ? (
                          format(recurringEndDate, "MMMM 'de' yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione o mês e ano</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="h-80">
                        <Calendar
                          mode="single"
                          selected={recurringEndDate}
                          onSelect={setRecurringEndDate}
                          initialFocus
                          className="pointer-events-auto h-full"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingTransaction ? 'Salvar' : 'Adicionar'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionModal;
