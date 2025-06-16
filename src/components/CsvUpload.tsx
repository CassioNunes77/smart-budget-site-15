
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

    console.log('=== INÍCIO DA IMPORTAÇÃO CSV ===');
    console.log('Arquivo selecionado:', file.name, 'Tamanho:', file.size);

    if (!file.name.endsWith('.csv')) {
      setResult({ success: false, message: 'Por favor, selecione um arquivo CSV válido.' });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      console.log('Lendo conteúdo do arquivo...');
      const text = await file.text();
      console.log('Conteúdo do arquivo lido. Tamanho do texto:', text.length);
      console.log('Primeiras 500 caracteres:', text.substring(0, 500));
      
      const lines = text.split('\n').filter(line => line.trim());
      console.log('Total de linhas após filtrar vazias:', lines.length);
      
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
      console.log('Processando cabeçalho...');
      const rawHeader = lines[0].split(',');
      console.log('Cabeçalho bruto:', rawHeader);
      
      const header = rawHeader.map(h => normalizeText(h));
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
      console.log('Mapeando colunas...');
      Object.entries(expectedColumns).forEach(([key, variations]) => {
        const index = header.findIndex(h => variations.includes(h));
        if (index !== -1) {
          columnMapping[key] = index;
          console.log(`✓ Coluna ${key} encontrada no índice ${index}: ${header[index]} (original: ${rawHeader[index]})`);
        } else {
          console.log(`✗ Coluna ${key} NÃO encontrada. Variações procuradas:`, variations);
        }
      });

      console.log('Mapeamento final de colunas:', columnMapping);

      // Verificar se as colunas essenciais existem
      const missingColumns = [];
      if (columnMapping.date === undefined) missingColumns.push('Data');
      if (columnMapping.amount === undefined) missingColumns.push('Valor');
      if (columnMapping.description === undefined) missingColumns.push('Descrição');
      
      if (missingColumns.length > 0) {
        const errorMessage = `Colunas obrigatórias não encontradas: ${missingColumns.join(', ')}. 
        
Colunas disponíveis no arquivo: ${rawHeader.join(', ')}
Colunas normalizadas: ${header.join(', ')}

Para corrigir, certifique-se de que o CSV contenha pelo menos as colunas: Data, Valor e Descrição.`;
        
        console.error('ERRO - Colunas obrigatórias faltando:', errorMessage);
        setResult({ success: false, message: errorMessage });
        setIsProcessing(false);
        return;
      }

      console.log('Processando linhas de dados...');
      let processedCount = 0;
      let skippedCount = 0;

      // Processar cada linha
      for (let i = 1; i < lines.length; i++) {
        console.log(`\n--- Processando linha ${i} ---`);
        console.log('Linha bruta:', lines[i]);
        
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, '').replace(/'/g, ''));
        console.log('Valores extraídos:', values);
        
        if (values.length < Math.max(...Object.values(columnMapping)) + 1) {
          console.log(`Linha ${i} pulada: número insuficiente de colunas (${values.length} vs ${Math.max(...Object.values(columnMapping)) + 1})`);
          skippedCount++;
          continue;
        }

        const dateStr = values[columnMapping.date];
        const amountStr = values[columnMapping.amount];
        const description = values[columnMapping.description];
        
        console.log('Dados extraídos:', { dateStr, amountStr, description });

        if (!dateStr || !amountStr || !description) {
          console.log(`Linha ${i} pulada: dados essenciais faltando`);
          skippedCount++;
          continue;
        }

        // Processar data
        let date: Date;
        try {
          if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else if (dateStr.includes('-')) {
            date = new Date(dateStr);
          } else {
            throw new Error('Formato não reconhecido');
          }

          if (isNaN(date.getTime())) {
            throw new Error('Data inválida');
          }
          console.log('Data processada:', date.toISOString());
        } catch (error) {
          console.log(`Linha ${i} pulada: erro na data - ${error}`);
          skippedCount++;
          continue;
        }

        // Processar valor
        let amount: number;
        try {
          amount = parseFloat(amountStr.replace(/[^\d.,-]/g, '').replace(',', '.'));
          if (isNaN(amount)) {
            throw new Error('Valor inválido');
          }
          console.log('Valor processado:', amount);
        } catch (error) {
          console.log(`Linha ${i} pulada: erro no valor - ${error}`);
          skippedCount++;
          continue;
        }

        // Determinar tipo
        let type: 'income' | 'expense' = 'expense';
        if (columnMapping.type !== undefined) {
          const typeValue = values[columnMapping.type].toLowerCase();
          if (typeValue.includes('receita') || typeValue.includes('income') || typeValue.includes('entrada')) {
            type = 'income';
          }
        } else {
          type = amount >= 0 ? 'income' : 'expense';
        }
        console.log('Tipo determinado:', type);

        // Categoria
        let category = 'Sem categoria';
        if (columnMapping.category !== undefined && values[columnMapping.category]) {
          const csvCategory = values[columnMapping.category];
          const existingCategory = categories.find(cat => 
            cat.toLowerCase() === csvCategory.toLowerCase()
          );
          category = existingCategory || 'Sem categoria';
        }
        console.log('Categoria determinada:', category);

        const transaction: Transaction = {
          id: `csv-${Date.now()}-${i}`,
          type,
          amount: Math.abs(amount),
          description,
          category,
          date: date.toISOString()
        };

        transactions.push(transaction);
        processedCount++;
        console.log(`✓ Transação ${i} processada com sucesso:`, transaction);
      }

      console.log(`\n=== RESUMO DO PROCESSAMENTO ===`);
      console.log(`Total de linhas processadas: ${lines.length - 1}`);
      console.log(`Transações válidas: ${processedCount}`);
      console.log(`Linhas ignoradas: ${skippedCount}`);

      if (transactions.length === 0) {
        setResult({ success: false, message: 'Nenhuma transação válida foi encontrada no arquivo CSV.' });
        setIsProcessing(false);
        return;
      }

      console.log('Chamando onTransactionsImported com', transactions.length, 'transações...');
      console.log('Transações a serem importadas:', transactions);

      try {
        await onTransactionsImported(transactions);
        console.log('✓ onTransactionsImported executado com sucesso');
        setResult({ 
          success: true, 
          message: `${transactions.length} transações importadas com sucesso!`,
          count: transactions.length
        });
      } catch (importError) {
        console.error('ERRO na função onTransactionsImported:', importError);
        setResult({ 
          success: false, 
          message: `Erro ao salvar as transações: ${importError instanceof Error ? importError.message : 'Erro desconhecido'}` 
        });
      }

    } catch (error) {
      console.error('=== ERRO GERAL NO PROCESSAMENTO CSV ===', error);
      setResult({ 
        success: false, 
        message: `Erro ao processar o arquivo CSV: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
      console.log('=== FIM DA IMPORTAÇÃO CSV ===');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Upload className="w-6 h-6" />
          </div>
          Importar Transações via CSV
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-help ml-auto">
                  <Info className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-4 bg-white border shadow-xl">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800 text-sm">Formato esperado do CSV:</h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div><strong className="text-green-700">Data:</strong> DD/MM/AAAA ou AAAA-MM-DD</div>
                    <div><strong className="text-green-700">Valor:</strong> Números com ponto ou vírgula decimal</div>
                    <div><strong className="text-green-700">Descrição:</strong> Texto descritivo da transação</div>
                    <div><strong className="text-green-700">Tipo:</strong> "receita/income/entrada" ou "despesa/expense/saída" (opcional)</div>
                    <div><strong className="text-green-700">Categoria:</strong> Nome da categoria existente (opcional)</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-xs font-semibold text-green-800 mb-1">Exemplo de cabeçalho:</div>
                    <code className="text-xs text-green-700 bg-white px-2 py-1 rounded">Data,Tipo,Valor,Descrição,Categoria</code>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Label htmlFor="csv-upload" className="text-base font-medium text-gray-700 block">
              Selecione seu arquivo CSV
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
                className="w-full h-16 text-lg font-medium border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-300 hover:border-green-400 hover:shadow-md disabled:opacity-60"
                variant="outline"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8" />
                  <span>
                    {isProcessing ? 'Processando arquivo...' : 'Clique para selecionar arquivo CSV'}
                  </span>
                </div>
              </Button>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Arraste e solte ou clique para selecionar um arquivo CSV com suas transações financeiras
            </p>
          </div>

          {isProcessing && (
            <Alert className="border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600 animate-pulse" />
                <AlertDescription className="text-blue-700 font-medium">
                  Processando arquivo CSV... Aguarde enquanto analisamos seus dados.
                </AlertDescription>
              </div>
            </Alert>
          )}

          {result && (
            <Alert className={`border-2 rounded-lg ${result.success 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
                )}
                <AlertDescription className={`font-medium whitespace-pre-line ${result.success 
                  ? 'text-green-700' 
                  : 'text-red-700'
                }`}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvUpload;
