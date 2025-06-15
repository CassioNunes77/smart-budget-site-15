
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [tempYear, setTempYear] = useState(selectedYear || currentYear);

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
    if (value === 'year') {
      onPeriodChange('year', tempYear);
    } else {
      onPeriodChange(value as PeriodType);
    }
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? tempYear - 1 : tempYear + 1;
    setTempYear(newYear);
    if (selectedPeriod === 'year') {
      onPeriodChange('year', newYear);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <Select value={selectedPeriod === 'year' ? 'year' : selectedPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-auto min-w-[160px] h-9 border-input bg-background">
          <SelectValue>
            <span className="text-sm">{getPeriodLabel()}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="week">Semanal</SelectItem>
          <SelectItem value="month">Mensal</SelectItem>
          <SelectItem value="quarter">Trimestral</SelectItem>
          <SelectItem value="year">Anual</SelectItem>
          <SelectItem value="all">Todo o Período</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedPeriod === 'year' && (
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleYearChange('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium min-w-[50px] text-center">
            {tempYear}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleYearChange('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardPeriodFilter;
