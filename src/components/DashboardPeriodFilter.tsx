
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export type PeriodType = 'week' | 'month' | 'quarter' | 'year' | 'all';

interface DashboardPeriodFilterProps {
  selectedPeriod: PeriodType;
  selectedYear?: number;
  onPeriodChange: (period: PeriodType, year?: number) => void;
}

const DashboardPeriodFilter: React.FC<DashboardPeriodFilterProps> = ({
  selectedPeriod,
  selectedYear,
  onPeriodChange
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week':
        return 'Semanal';
      case 'month':
        return getCurrentMonthName();
      case 'quarter':
        return 'Trimestral';
      case 'year':
        return `Anual ${selectedYear || currentYear}`;
      case 'all':
        return 'Todo o Período';
      default:
        return getCurrentMonthName();
    }
  };

  const handlePeriodChange = (value: string) => {
    if (value.startsWith('year-')) {
      const year = parseInt(value.split('-')[1]);
      onPeriodChange('year', year);
    } else {
      onPeriodChange(value as PeriodType);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <Select value={selectedPeriod === 'year' ? `year-${selectedYear}` : selectedPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-auto min-w-[160px] h-9 border-input bg-background">
          <SelectValue>
            <span className="text-sm">{getPeriodLabel()}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="week">Semanal</SelectItem>
          <SelectItem value="month">Mensal</SelectItem>
          <SelectItem value="quarter">Trimestral</SelectItem>
          {years.map(year => (
            <SelectItem key={year} value={`year-${year}`}>
              Anual {year}
            </SelectItem>
          ))}
          <SelectItem value="all">Todo o Período</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DashboardPeriodFilter;
