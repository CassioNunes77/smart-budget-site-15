
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';

interface PeriodFilterProps {
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  showLabel?: boolean;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  periodFilter,
  setPeriodFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showLabel = true
}) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {showLabel && <Label className="text-sm font-medium">Filtro</Label>}
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
            <SelectItem value="quarter">Últimos 3 meses</SelectItem>
            <SelectItem value="year">Último ano</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
        
        {periodFilter === 'custom' && (
          <>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-auto"
              placeholder="Data inicial"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-auto"
              placeholder="Data final"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodFilter;
