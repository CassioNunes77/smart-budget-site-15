
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export type PeriodType = 'month' | 'year' | 'all';

interface DashboardPeriodFilterProps {
  selectedPeriod: PeriodType;
  selectedYear?: number;
  selectedMonth?: number;
  onPeriodChange: (period: PeriodType, year?: number, month?: number) => void;
}

const DashboardPeriodFilter: React.FC<DashboardPeriodFilterProps> = ({
  selectedPeriod,
  selectedYear,
  selectedMonth,
  onPeriodChange
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [tempYear, setTempYear] = useState(selectedYear || currentYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth ?? currentMonth);

  const getMonthName = (month: number, year: number) => {
    return new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'month':
        return getMonthName(tempMonth, tempYear);
      case 'year':
        return `Anual ${tempYear}`;
      case 'all':
        return 'Todo o Período';
      default:
        return getMonthName(tempMonth, tempYear);
    }
  };

  const handlePeriodChange = (value: string) => {
    if (value === 'year') {
      onPeriodChange('year', tempYear);
    } else if (value === 'month') {
      onPeriodChange('month', tempYear, tempMonth);
    } else {
      onPeriodChange('all');
    }
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? tempYear - 1 : tempYear + 1;
    setTempYear(newYear);
    if (selectedPeriod === 'year') {
      onPeriodChange('year', newYear);
    } else if (selectedPeriod === 'month') {
      onPeriodChange('month', newYear, tempMonth);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    let newMonth = tempMonth;
    let newYear = tempYear;
    
    if (direction === 'prev') {
      if (tempMonth === 0) {
        newMonth = 11;
        newYear = tempYear - 1;
      } else {
        newMonth = tempMonth - 1;
      }
    } else {
      if (tempMonth === 11) {
        newMonth = 0;
        newYear = tempYear + 1;
      } else {
        newMonth = tempMonth + 1;
      }
    }
    
    setTempMonth(newMonth);
    setTempYear(newYear);
    onPeriodChange('month', newYear, newMonth);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      
      {(selectedPeriod === 'year' || selectedPeriod === 'month') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectedPeriod === 'month' ? handleMonthChange('prev') : handleYearChange('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-auto min-w-[160px] h-9 border-input bg-background">
          <SelectValue>
            <span className="text-sm">{getPeriodLabel()}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="month">Mensal</SelectItem>
          <SelectItem value="year">Anual</SelectItem>
          <SelectItem value="all">Todo o Período</SelectItem>
        </SelectContent>
      </Select>
      
      {(selectedPeriod === 'year' || selectedPeriod === 'month') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectedPeriod === 'month' ? handleMonthChange('next') : handleYearChange('next')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DashboardPeriodFilter;
