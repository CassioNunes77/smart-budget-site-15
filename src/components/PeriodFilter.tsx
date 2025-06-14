
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Filter } from 'lucide-react';

interface PeriodFilterProps {
  value: string;
  onChange: (value: string) => void;
  showLabel?: boolean;
  compact?: boolean;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({ 
  value, 
  onChange, 
  showLabel = true,
  compact = false 
}) => {
  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getDisplayValue = () => {
    switch (value) {
      case 'week':
        return 'Semanal';
      case 'month':
        return `Mensal (${getCurrentMonthYear()})`;
      case 'quarter':
        return 'Trimestral';
      case 'year':
        return 'Anual';
      case 'all':
        return 'Todo o Período';
      default:
        return `Mensal (${getCurrentMonthYear()})`;
    }
  };

  if (compact) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto min-w-[140px] h-9 text-sm border-border/60">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Semanal</SelectItem>
          <SelectItem value="month">Mensal</SelectItem>
          <SelectItem value="quarter">Trimestral</SelectItem>
          <SelectItem value="year">Anual</SelectItem>
          <SelectItem value="all">Todo o Período</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="space-y-2">
      {showLabel && (
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filtro
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getDisplayValue()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Semanal</SelectItem>
          <SelectItem value="month">Mensal</SelectItem>
          <SelectItem value="quarter">Trimestral</SelectItem>
          <SelectItem value="year">Anual</SelectItem>
          <SelectItem value="all">Todo o Período</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PeriodFilter;
