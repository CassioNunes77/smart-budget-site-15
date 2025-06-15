
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const features = [
    'Relatórios avançados com exportação',
    'Categorias ilimitadas personalizadas',
    'Backup automático na nuvem',
    'Análises preditivas de gastos',
    'Lembretes inteligentes de contas',
    'Suporte prioritário 24/7',
    'Sincronização entre dispositivos',
    'Metas financeiras personalizadas'
  ];

  const limitedFeatures = [
    'Máximo 5 categorias personalizadas',
    'Exportação básica de dados',
    'Sem backup automático',
    'Relatórios limitados'
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
            Fluxo Fácil Premium
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            Desbloqueie todo o potencial do seu controle financeiro
          </DialogDescription>
          <div className="text-sm text-muted-foreground mt-1">
            Versão 0.3.5 Beta
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Plano Gratuito */}
          <Card className="border-2 border-muted">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-muted-foreground">Plano Gratuito</h3>
                <div className="text-3xl font-bold text-muted-foreground mt-2">
                  R$ 0
                  <span className="text-base font-normal">/mês</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Controle básico de transações</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Categorias padrão</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Gráficos básicos</span>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Limitações:</p>
                  {limitedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 mb-2">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6" disabled>
                Plano Atual
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="border-2 border-yellow-500 relative overflow-hidden premium-card">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-yellow-600 text-white px-3 py-1 text-xs font-bold">
              RECOMENDADO
            </div>
            
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-yellow-600">Plano Premium</h3>
                <div className="text-3xl font-bold text-yellow-600 mt-2">
                  R$ 99,90
                  <span className="text-base font-normal">/ano</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Apenas R$ 8,33/mês
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Tudo do plano gratuito</span>
                </div>
                
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 premium-button">
                <Crown className="w-4 h-4 mr-2" />
                Assinar Premium
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-3">
                30 dias de garantia de satisfação
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🔒 Pagamento seguro • ✨ Ativação instantânea • 📞 Suporte dedicado
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
