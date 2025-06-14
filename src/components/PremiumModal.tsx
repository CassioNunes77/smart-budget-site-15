import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <Crown className="w-8 h-8 text-purple-600" />
                Fluxo Fácil Premium
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">Desbloqueie todo o potencial do seu controle financeiro</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Seletor de Planos */}
          <div className="flex justify-center">
            <div className="bg-muted p-1 rounded-lg flex">
              <Button
                variant={selectedPlan === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPlan('monthly')}
                className="relative"
              >
                Mensal
              </Button>
              <Button
                variant={selectedPlan === 'annual' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPlan('annual')}
                className="relative"
              >
                Anual
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                  -30%
                </Badge>
              </Button>
            </div>
          </div>

          {/* Preços */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-foreground">
              {selectedPlan === 'monthly' ? 'R$ 14,90' : 'R$ 99,90'}
              <span className="text-lg text-muted-foreground font-normal">
                /{selectedPlan === 'monthly' ? 'mês' : 'ano'}
              </span>
            </div>
            {selectedPlan === 'annual' && (
              <p className="text-sm text-green-600">
                Economia de R$ 78,90 por ano
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {selectedPlan === 'monthly' 
                ? 'Cancele a qualquer momento' 
                : 'Equivale a R$ 8,32 por mês'
              }
            </p>
          </div>

          {/* Lista de Funcionalidades */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Funcionalidades Premium</h3>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Relatórios financeiros avançados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Alertas e notificações personalizadas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Suporte prioritário
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Acesso ilimitado a todas as ferramentas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Remova os anúncios
              </li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button 
              className="w-full premium-button text-lg py-6"
              size="lg"
              onClick={() => {
                toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "O sistema de pagamentos será implementado em breve!",
                });
              }}
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Premium
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onClose}
            >
              Continuar com Plano Gratuito
            </Button>
          </div>

          {/* Garantia */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Shield className="w-4 h-4" />
              Garantia de 7 dias - cancele sem custos
            </p>
            <p>Seus dados sempre seguros e protegidos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { CheckCircle } from 'lucide-react';

export default PremiumModal;
