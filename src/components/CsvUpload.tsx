
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

    console.log('Iniciando importação CSV:', file.name);

    if (!file.name.endsWith('.csv')) {
      setResult({ success: false, message: 'Selecione um arquivo CSV válido.' });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setResult({ success: false, message: 'O arquivo deve conter pelo menos uma linha de dados.' });
        setIsProcessing(false);
        return;
      }

      // Processar cabeçalho
      const header = lines[0].split(',').map(h => 
        h.trim()
          .toLowerCase()
          .replace(/[áàâãä]/g, 'a')
          .replace(/[éèêë]/g, 'e')
          .replace(/[íìîï]/g, 'i')
          .replace(/[óòôõö]/g, 'o')
          .replace(/[úùûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/"/g, '')
      );

      console.log('Cabeçalho processado:', header);

      // Mapear colunas
      const expectedColumns = {
        date: ['data', 'date'],
        amount: ['valor', 'amount'],
        description: ['descricao', 'description', 'desc'],
        type: ['tipo', 'type'],
        category: ['categoria', 'category']
      };

      const columnMapping: { [key: string]: number } = {};
      Object.entries(expectedColumns).forEach(([key, variations]) => {
        const index = header.findIndex(h => variations.includes(h));
        if (index !== -1) {
          columnMapping[key] = index;
        }
      });

      // Verificar colunas obrigatórias
      if (columnMapping.date === undefined || columnMapping.amount === undefined || columnMapping.description === undefined) {
        setResult({ 
          success: false, 
          message: `Colunas obrigatórias não encontradas. Certifique-se de que o CSV tenha: Data, Valor e Descrição.` 
        });
        setIsProcessing(false);
        return;
      }

      const transactions: Transaction[] = [];
      let successCount = 0;

      // Processar dados
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length < Math.max(...Object.values(columnMapping)) + 1) {
          continue;
        }

        const dateStr = values[columnMapping.date];
        const amountStr = values[columnMapping.amount];
        const description = values[columnMapping.description];

        if (!dateStr || !amountStr || !description) {
          continue;
        }

        try {
          // Processar data
          let date: Date;
          if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            date = new Date(dateStr);
          }

          if (isNaN(date.getTime())) {
            continue;
          }

          // Processar valor
          const amount = parseFloat(amountStr.replace(/[^\d.,-]/g, '').replace(',', '.'));
          if (isNaN(amount)) {
            continue;
          }

          // Determinar tipo
          let type: 'income' | 'expense' = 'expense';
          if (columnMapping.type !== undefined) {
            const typeValue = values[columnMapping.type].toLowerCase();
            if (typeValue.includes('receita') || typeValue.includes('income')) {
              type = 'income';
            }
          } else {
            type = amount >= 0 ? 'income' : 'expense';
          }

          // Categoria
          let category = 'Sem categoria';
          if (columnMapping.category !== undefined && values[columnMapping.category]) {
            const csvCategory = values[columnMapping.category];
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
          successCount++;
        } catch (error) {
          console.log(`Erro na linha ${i}:`, error);
          continue;
        }
      }

      if (transactions.length === 0) {
        setResult({ success: false, message: 'Nenhuma transação válida encontrada no arquivo.' });
        setIsProcessing(false);
        return;
      }

      // Tentar importar uma por uma com fallback
      let importedCount = 0;
      let errors = 0;

      for (const transaction of transactions) {
        try {
          await onTransactionsImported([transaction]);
          importedCount++;
        } catch (error) {
          console.error('Erro ao importar transação:', error);
          errors++;
          
          // Se for erro de permissão, continuar tentando as outras
          if (error instanceof Error && error.message.includes('permission')) {
            continue;
          }
        }
      }

      if (importedCount > 0) {
        setResult({ 
          success: true, 
          message: `${importedCount} transações importadas com sucesso!`,
          count: importedCount
        });
      } else {
        setResult({ 
          success: false, 
          message: 'Erro ao salvar as transações. Verifique suas permissões.' 
        });
      }

    } catch (error) {
      console.error('Erro geral:', error);
      setResult({ 
        success: false, 
        message: 'Erro ao processar o arquivo CSV.' 
      });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-medium text-gray-800">
            Importar CSV
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('csv-upload')?.click()}
              disabled={isProcessing}
              className="w-full h-12 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 hover:border-gray-400"
              variant="outline"
            >
              <Upload className="w-5 h-5 mr-2" />
              {isProcessing ? 'Processando...' : 'Selecionar arquivo'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Formato: Data, Valor, Descrição
          </p>

          {result && (
            <Alert className={`${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CsvUpload;
