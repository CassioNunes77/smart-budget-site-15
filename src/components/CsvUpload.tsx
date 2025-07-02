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
    <div className="w-full flex justify-end mb-2">
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
        variant="ghost"
        className="text-sm text-muted-foreground px-3 h-8"
      >
        Importar CSV
      </Button>
    </div>
  );
};

export default CsvUpload;
