import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface CsvUploadProps {
  onTransactionsImported: (transactions: Transaction[]) => void;
  categories: string[];
}

const CsvUpload: React.FC<CsvUploadProps> = ({ onTransactionsImported, categories }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setResult({ success: false, message: 'Por favor, selecione um arquivo CSV válido.' });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setResult({ success: false, message: 'O arquivo CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.' });
        setIsProcessing(false);
        return;
      }

      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const transactions: Transaction[] = [];

      // Mapear colunas esperadas
      const expectedColumns = {
        date: ['data', 'date', 'dt'],
        type: ['tipo', 'type', 'categoria_tipo'],
        amount: ['valor', 'amount', 'quantia', 'money'],
        description: ['descricao', 'description', 'desc', 'descricão'],
        category: ['categoria', 'category', 'cat']
      };

      const columnMapping: { [key: string]: number } = {};
      
      // Encontrar índices das colunas
      Object.entries(expectedColumns).forEach(([key, variations]) => {
        const index = header.findIndex(h => variations.includes(h));
        if (index !== -1) {
          columnMapping[key] = index;
        }
      });

      // Verificar se as colunas essenciais existem
      if (!columnMapping.date || columnMapping.amount === undefined || !columnMapping.description) {
        setResult({ 
          success: false, 
          message: 'CSV deve conter pelo menos as colunas: Data, Valor e Descrição. Colunas encontradas: ' + header.join(', ')
        });
        setIsProcessing(false);
        return;
      }

      // Processar cada linha
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length < Math.max(...Object.values(columnMapping)) + 1) {
          continue; // Pular linhas malformadas
        }

        const dateStr = values[columnMapping.date];
        const amountStr = values[columnMapping.amount];
        const description = values[columnMapping.description];
        
        if (!dateStr || !amountStr || !description) {
          continue; // Pular linhas com dados essenciais faltando
        }

        // Processar data
        let date: Date;
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (dateStr.includes('-')) {
          date = new Date(dateStr);
        } else {
          continue; // Formato de data não reconhecido
        }

        if (isNaN(date.getTime())) {
          continue; // Data inválida
        }

        // Processar valor
        const amount = parseFloat(amountStr.replace(/[^\d.,-]/g, '').replace(',', '.'));
        if (isNaN(amount)) {
          continue; // Valor inválido
        }

        // Determinar tipo
        let type: 'income' | 'expense' = 'expense';
        if (columnMapping.type !== undefined) {
          const typeValue = values[columnMapping.type].toLowerCase();
          if (typeValue.includes('receita') || typeValue.includes('income') || typeValue.includes('entrada')) {
            type = 'income';
          }
        } else {
          // Se não há coluna de tipo, assumir positivo = receita, negativo = despesa
          type = amount >= 0 ? 'income' : 'expense';
        }

        // Categoria
        let category = 'Sem categoria';
        if (columnMapping.category !== undefined && values[columnMapping.category]) {
          const csvCategory = values[columnMapping.category];
          // Verificar se a categoria existe na lista atual
          const existingCategory = categories.find(cat => 
            cat.toLowerCase() === csvCategory.toLowerCase()
          );
          category = existingCategory || 'Sem categoria';
        }

        const transaction: Transaction = {
          id: `csv-${Date.now()}-${i}`,
          type,
          amount: Math.abs(amount),
          description,
          category,
          date: date.toISOString()
        };

        transactions.push(transaction);
      }

      if (transactions.length === 0) {
        setResult({ success: false, message: 'Nenhuma transação válida foi encontrada no arquivo CSV.' });
      } else {
        onTransactionsImported(transactions);
        setResult({ 
          success: true, 
          message: `${transactions.length} transações importadas com sucesso!`,
          count: transactions.length
        });
      }
    } catch (error) {
      setResult({ success: false, message: 'Erro ao processar o arquivo CSV. Verifique o formato.' });
    } finally {
      setIsProcessing(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Importar CSV
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Formato esperado do CSV:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Data:</strong> DD/MM/AAAA ou AAAA-MM-DD</li>
                    <li><strong>Valor:</strong> Números com ponto ou vírgula decimal</li>
                    <li><strong>Descrição:</strong> Texto descritivo da transação</li>
                    <li><strong>Tipo:</strong> "receita/income/entrada" ou "despesa/expense/saída" (opcional)</li>
                    <li><strong>Categoria:</strong> Nome da categoria existente (opcional)</li>
                  </ul>
                  <p className="text-xs font-medium">
                    <strong>Exemplo:</strong> Data,Tipo,Valor,Descrição,Categoria
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csv-upload">Selecionar arquivo CSV</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="cursor-pointer"
          />
        </div>

        {isProcessing && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Processando arquivo CSV...
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? 'text-green-700' : 'text-red-700'}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CsvUpload;
