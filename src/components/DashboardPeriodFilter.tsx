
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export type PeriodType = 'year';

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
  const displayYear = selectedYear || currentYear;

  const handleYearChange = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? displayYear - 1 : displayYear + 1;
    onPeriodChange('year', newYear);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center gap-1 border rounded-md px-3 py-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleYearChange('prev')}
          className="h-6 w-6 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center">
          {displayYear}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleYearChange('next')}
          className="h-6 w-6 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardPeriodFilter;
