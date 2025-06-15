
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Crown, Star } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const features = [
    "Transações ilimitadas",
    "Relatórios avançados",
    "Backup automático",
    "Suporte prioritário",
    "Categorias personalizadas",
    "Exportação de dados",
    "Análises preditivas",
    "Sincronização multi-dispositivo"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Upgrade para Premium
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              v0.3.4 Beta
            </div>
            <p className="text-muted-foreground">
              Desbloqueie todo o potencial do seu controle financeiro
            </p>
          </div>

          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-3">
            <div className="text-3xl font-bold text-primary">R$ 9,90<span className="text-lg text-muted-foreground">/mês</span></div>
            <p className="text-sm text-muted-foreground">Cancele quando quiser</p>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3">
              <Crown className="w-4 h-4 mr-2" />
              Assinar Premium
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full">
              Continuar com a versão gratuita
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
