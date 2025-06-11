
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, DollarSign, Calendar, Tag, FileText, CheckCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
}

interface TransactionModalProps {
  onClose: () => void;
  onSave: (transaction: Transaction | Omit<Transaction, 'id'>) => void;
  editingTransaction?: Transaction | null;
  categories?: string[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  onClose, 
  onSave, 
  editingTransaction,
  categories = []
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isReceived, setIsReceived] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [recurringEndDate, setRecurringEndDate] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      
      if (editingTransaction.status) {
        setIsReceived(
          editingTransaction.status === 'received' || 
          editingTransaction.status === 'paid'
        );
      } else {
        setIsReceived(true);
      }
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (isRecurring && !recurringEndDate) {
      alert('Por favor, selecione a data final para transações recorrentes.');
      return;
    }

    let status: 'paid' | 'unpaid' | 'received' | 'unreceived';
    if (type === 'income') {
      status = isReceived ? 'received' : 'unreceived';
    } else {
      status = isReceived ? 'paid' : 'unpaid';
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
      status,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      recurringEndDate: isRecurring ? recurringEndDate : undefined,
    };

    if (editingTransaction) {
      onSave({ ...transactionData, id: editingTransaction.id });
    } else {
      onSave(transactionData);
    }
  };

  const formatAmountInput = (value: string) => {
    const numbers = value.replace(/[^\d.,]/g, '');
    return numbers.replace(',', '.');
  };

  const getStatusText = () => {
    if (type === 'income') {
      return isReceived ? 'Recebido' : 'Não Recebido';
    } else {
      return isReceived ? 'Pago' : 'Não Pago';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card border-b">
          <CardTitle className="text-xl">
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Transação */}
            <div className="space-y-3">
              <Label>Tipo de Transação</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={type === 'income' ? 'default' : 'outline'}
                  className={`flex-1 h-11 ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  onClick={() => setType('income')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Receita
                </Button>
                <Button
                  type="button"
                  variant={type === 'expense' ? 'default' : 'outline'}
                  className={`flex-1 h-11 ${type === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setType('expense')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Despesa
                </Button>
              </div>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Valor *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                required
                className="text-lg"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descrição *
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="Descreva a transação..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Categoria *
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Status de Pagamento/Recebimento */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Status
              </Label>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <span className="font-medium">{getStatusText()}</span>
                  <p className="text-sm text-muted-foreground">
                    {type === 'income' 
                      ? 'Marque se já recebeu este valor' 
                      : 'Marque se já pagou esta despesa'
                    }
                  </p>
                </div>
                <Switch
                  checked={isReceived}
                  onCheckedChange={setIsReceived}
                />
              </div>
            </div>

            {/* Transação Recorrente */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Transação Recorrente
              </Label>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <span className="font-medium">Repetir automaticamente</span>
                  <p className="text-sm text-muted-foreground">
                    Cria automaticamente as próximas transações
                  </p>
                </div>
                <Switch
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>
              
              {isRecurring && (
                <div className="ml-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Frequência</Label>
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
                    <Label htmlFor="recurringEndDate">Data Final *</Label>
                    <Input
                      id="recurringEndDate"
                      type="month"
                      value={recurringEndDate}
                      onChange={(e) => setRecurringEndDate(e.target.value)}
                      required={isRecurring}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className={`flex-1 h-11 ${
                  type === 'income' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {editingTransaction ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionModal;
