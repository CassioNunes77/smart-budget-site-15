
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

      // Função para normalizar texto (remover acentos e caracteres especiais)
      const normalizeText = (text: string) => {
        return text
          .trim()
          .toLowerCase()
          .replace(/[áàâãä]/g, 'a')
          .replace(/[éèêë]/g, 'e')
          .replace(/[íìîï]/g, 'i')
          .replace(/[óòôõö]/g, 'o')
          .replace(/[úùûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[ñ]/g, 'n')
          .replace(/"/g, '')
          .replace(/'/g, '')
          .replace(/\s+/g, '_');
      };

      // Processar cabeçalho com normalização
      const header = lines[0].split(',').map(h => normalizeText(h));
      console.log('Cabeçalho normalizado:', header);
      
      const transactions: Transaction[] = [];

      // Mapear colunas esperadas com variações normalizadas
      const expectedColumns = {
        date: ['data', 'date', 'dt', 'data_transacao', 'data_lancamento'],
        type: ['tipo', 'type', 'categoria_tipo', 'operacao', 'movimento'],
        amount: ['valor', 'amount', 'quantia', 'money', 'montante', 'preco'],
        description: ['descricao', 'description', 'desc', 'historico', 'detalhes'],
        category: ['categoria', 'category', 'cat', 'classificacao']
      };

      const columnMapping: { [key: string]: number } = {};
      
      // Encontrar índices das colunas
      Object.entries(expectedColumns).forEach(([key, variations]) => {
        const index = header.findIndex(h => variations.includes(h));
        if (index !== -1) {
          columnMapping[key] = index;
          console.log(`Coluna ${key} encontrada no índice ${index}: ${header[index]}`);
        }
      });

      console.log('Mapeamento de colunas:', columnMapping);

      // Verificar se as colunas essenciais existem
      if (columnMapping.date === undefined || columnMapping.amount === undefined || columnMapping.description === undefined) {
        const missingColumns = [];
        if (columnMapping.date === undefined) missingColumns.push('Data');
        if (columnMapping.amount === undefined) missingColumns.push('Valor');
        if (columnMapping.description === undefined) missingColumns.push('Descrição');
        
        setResult({ 
          success: false, 
          message: `Colunas obrigatórias não encontradas: ${missingColumns.join(', ')}. Colunas disponíveis: ${header.join(', ')}`
        });
        setIsProcessing(false);
        return;
      }

      // Processar cada linha
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, '').replace(/'/g, ''));
        console.log(`Linha ${i}:`, values);
        
        if (values.length < Math.max(...Object.values(columnMapping)) + 1) {
          console.log(`Linha ${i} pulada: número insuficiente de colunas`);
          continue; // Pular linhas malformadas
        }

        const dateStr = values[columnMapping.date];
        const amountStr = values[columnMapping.amount];
        const description = values[columnMapping.description];
        
        if (!dateStr || !amountStr || !description) {
          console.log(`Linha ${i} pulada: dados essenciais faltando`);
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
          console.log(`Linha ${i} pulada: formato de data não reconhecido`);
          continue; // Formato de data não reconhecido
        }

        if (isNaN(date.getTime())) {
          console.log(`Linha ${i} pulada: data inválida`);
          continue; // Data inválida
        }

        // Processar valor
        const amount = parseFloat(amountStr.replace(/[^\d.,-]/g, '').replace(',', '.'));
        if (isNaN(amount)) {
          console.log(`Linha ${i} pulada: valor inválido`);
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
        console.log(`Transação ${i} processada:`, transaction);
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
      console.error('Erro ao processar CSV:', error);
      setResult({ success: false, message: 'Erro ao processar o arquivo CSV. Verifique o formato.' });
    } finally {
      setIsProcessing(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border-green-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <CardTitle className="flex items-center gap-3 text-lg text-green-700">
          <div className="p-2 bg-green-100 rounded-lg">
            <Upload className="w-5 h-5 text-green-600" />
          </div>
          Importar Transações via CSV
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 hover:bg-green-100 rounded-full transition-colors cursor-help">
                  <Info className="w-4 h-4 text-green-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-4 bg-white border border-green-200 shadow-lg">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800 text-sm">Formato esperado do CSV:</h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div><strong className="text-green-700">Data:</strong> DD/MM/AAAA ou AAAA-MM-DD</div>
                    <div><strong className="text-green-700">Valor:</strong> Números com ponto ou vírgula decimal</div>
                    <div><strong className="text-green-700">Descrição:</strong> Texto descritivo da transação</div>
                    <div><strong className="text-green-700">Tipo:</strong> "receita/income/entrada" ou "despesa/expense/saída" (opcional)</div>
                    <div><strong className="text-green-700">Categoria:</strong> Nome da categoria existente (opcional)</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-xs">
                    <strong className="text-green-800">Exemplo de cabeçalho:</strong><br />
                    <code className="text-green-700">Data,Tipo,Valor,Descrição,Categoria</code>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <Label htmlFor="csv-upload" className="text-sm font-medium text-gray-700">
            Selecionar arquivo CSV
          </Label>
          
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
              className="w-full h-12 border-2 border-dashed border-green-200 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200"
              variant="outline"
            >
              <Upload className="w-5 h-5 mr-3" />
              {isProcessing ? 'Processando arquivo...' : 'Clique para selecionar arquivo CSV'}
            </Button>
          </div>
        </div>

        {isProcessing && (
          <Alert className="border-blue-200 bg-blue-50">
            <FileText className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 font-medium">
              Processando arquivo CSV...
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className={`border-2 ${result.success 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
          }`}>
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <AlertDescription className={`font-medium ${result.success 
              ? 'text-green-700' 
              : 'text-red-700'
            }`}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CsvUpload;
