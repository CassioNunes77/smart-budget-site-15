
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Crown, Check, BarChart3, Tag, TrendingUp, Calendar } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const premiumFeatures = [
    { icon: BarChart3, text: 'Relatórios detalhados e avançados' },
    { icon: Tag, text: 'Categorização inteligente de despesas' },
    { icon: TrendingUp, text: 'Previsões e análises preditivas' },
    { icon: Calendar, text: 'Planejamento financeiro personalizado' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Seja Premium</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">Desbloqueie o poder completo do Fluxo Fácil</h2>
            <p className="text-muted-foreground">
              A versão premium inclui relatórios detalhados, categorização de despesas, previsões e muito mais!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mensal */}
            <Card className="border-2 border-border hover:border-primary/50 transition-colors">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Plano Mensal</CardTitle>
                <div className="text-3xl font-bold text-primary">R$ 24,90</div>
                <p className="text-sm text-muted-foreground">por mês</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Todos os recursos premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Cancele a qualquer momento</span>
                  </li>
                </ul>
                <Button className="w-full premium-button">
                  Assinar Mensal
                </Button>
              </CardContent>
            </Card>

            {/* Anual */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Mais Popular
                </span>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Plano Anual</CardTitle>
                <div className="text-3xl font-bold text-primary">R$ 199,00</div>
                <p className="text-sm text-muted-foreground">por ano</p>
                <p className="text-xs text-emerald-600 font-medium">Economize R$ 99,80!</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Todos os recursos premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">2 meses grátis</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Assinar Anual
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Todos os planos incluem 7 dias de teste gratuito</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumModal;
