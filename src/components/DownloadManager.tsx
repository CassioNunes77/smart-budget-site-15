
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface DownloadManagerProps {
  transactions: Transaction[];
  user: { name: string; email: string } | null;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ transactions, user }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const downloadExcel = () => {
    const data = transactions.map(transaction => ({
      'Data': new Date(transaction.date).toLocaleDateString('pt-BR'),
      'Tipo': transaction.type === 'income' ? 'Receita' : 'Despesa',
      'Categoria': transaction.category,
      'Descrição': transaction.description,
      'Valor': transaction.amount,
      'Valor Formatado': formatCurrency(transaction.amount)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');

    // Adicionar estatísticas
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const statsData = [
      { 'Resumo': 'Total de Receitas', 'Valor': formatCurrency(totalIncome) },
      { 'Resumo': 'Total de Despesas', 'Valor': formatCurrency(totalExpenses) },
      { 'Resumo': 'Saldo', 'Valor': formatCurrency(balance) },
      { 'Resumo': 'Total de Transações', 'Valor': transactions.length.toString() }
    ];

    const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Resumo');

    const fileName = `financeiro_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const downloadJSON = () => {
    const data = {
      usuario: user,
      exportacao: {
        data: new Date().toISOString(),
        total_transacoes: transactions.length
      },
      transacoes: transactions,
      resumo: {
        total_receitas: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        total_despesas: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        saldo: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
               transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_financeiro_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'];
    const csvData = [
      headers.join(','),
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.type === 'income' ? 'Receita' : 'Despesa',
        t.category,
        `"${t.description}"`,
        t.amount.toString().replace('.', ',')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Downloads e Backup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={downloadExcel}
            variant="outline"
            className="flex items-center gap-2"
            disabled={transactions.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel (.xlsx)
          </Button>

          <Button
            onClick={downloadCSV}
            variant="outline"
            className="flex items-center gap-2"
            disabled={transactions.length === 0}
          >
            <FileText className="w-4 h-4" />
            CSV
          </Button>

          <Button
            onClick={downloadJSON}
            variant="outline"
            className="flex items-center gap-2"
            disabled={transactions.length === 0}
          >
            <Download className="w-4 h-4" />
            Backup (JSON)
          </Button>
        </div>

        {transactions.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Adicione algumas transações para habilitar os downloads
          </p>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Excel:</strong> Relatório completo com gráficos e resumo</p>
          <p><strong>CSV:</strong> Dados simples para importar em outros sistemas</p>
          <p><strong>JSON:</strong> Backup completo dos seus dados</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadManager;
