
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, Shield, Download, BarChart3 } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const premiumFeatures = [
    { icon: BarChart3, title: "Relatórios Avançados", description: "Análises detalhadas e gráficos personalizados" },
    { icon: Download, title: "Exportação Ilimitada", description: "Exporte dados em múltiplos formatos" },
    { icon: Shield, title: "Backup Automático", description: "Seus dados sempre seguros na nuvem" },
    { icon: Zap, title: "Notificações Inteligentes", description: "Lembretes personalizados e alertas" },
    { icon: Star, title: "Categorias Personalizadas", description: "Crie categorias ilimitadas com ícones" },
    { icon: Crown, title: "Suporte Premium", description: "Atendimento prioritário 24/7" }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Fluxo Fácil Premium
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plano Mensal */}
            <Card className="border-2 border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Plano Mensal</CardTitle>
                <div className="text-3xl font-bold text-primary">R$ 19,90</div>
                <p className="text-muted-foreground">por mês</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full premium-button" size="lg">
                  Assinar Mensal
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Cancele a qualquer momento
                </p>
              </CardContent>
            </Card>

            {/* Plano Anual */}
            <Card className="border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                Mais Popular
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Plano Anual</CardTitle>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground line-through">R$ 238,80</div>
                  <div className="text-3xl font-bold text-primary">R$ 99,90</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Economize 58%
                  </Badge>
                </div>
                <p className="text-muted-foreground">por ano</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full premium-button" size="lg">
                  Assinar Anual
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Melhor custo-benefício
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recursos Premium */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">O que você ganha com o Premium</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-card rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparação */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Comparação de Planos</h3>
            <div className="space-y-3">
              {[
                "Transações ilimitadas",
                "Categorias personalizadas",
                "Relatórios básicos",
                "Exportação em CSV",
                "Relatórios avançados",
                "Exportação múltiplos formatos",
                "Backup automático",
                "Notificações inteligentes",
                "Suporte premium"
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{feature}</span>
                  <div className="flex gap-8">
                    <div className="w-16 text-center">
                      {index < 4 ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Limitado</span>
                      )}
                    </div>
                    <div className="w-16 text-center">
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm font-medium">
              <span></span>
              <div className="flex gap-8">
                <span className="w-16 text-center">Grátis</span>
                <span className="w-16 text-center text-primary">Premium</span>
              </div>
            </div>
          </div>

          {/* Garantia */}
          <div className="text-center bg-muted/50 rounded-lg p-4">
            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-medium">Garantia de 7 dias</p>
            <p className="text-sm text-muted-foreground">
              Não ficou satisfeito? Devolvemos 100% do seu dinheiro
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
