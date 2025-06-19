
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, TrendingUp, PieChart, Receipt } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DashboardTipsProps {
  showTips: boolean;
}

const DashboardTips: React.FC<DashboardTipsProps> = ({ showTips }) => {
  const [tipsVisible, setTipsVisible] = useLocalStorage('dashboard-tips-visible', true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = [
    {
      icon: Receipt,
      title: "Adicione sua primeira transação",
      description: "Comece registrando suas receitas e despesas para ter controle total de suas finanças.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: PieChart,
      title: "Organize por categorias",
      description: "Use categorias para classificar seus gastos e ter uma visão clara de onde seu dinheiro está sendo usado.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: TrendingUp,
      title: "Acompanhe seus relatórios",
      description: "Visualize gráficos e relatórios para entender melhor seus padrões financeiros.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  useEffect(() => {
    if (tips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [tips.length]);

  if (!showTips || !tipsVisible) {
    return null;
  }

  const currentTip = tips[currentTipIndex];
  const TipIcon = currentTip.icon;

  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${currentTip.bgColor}`}>
              <TipIcon className={`w-5 h-5 ${currentTip.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <h3 className="font-medium text-foreground">Dica: {currentTip.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{currentTip.description}</p>
              {tips.length > 1 && (
                <div className="flex space-x-1 mt-2">
                  {tips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTipIndex ? 'bg-yellow-600' : 'bg-yellow-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTipsVisible(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTips;
