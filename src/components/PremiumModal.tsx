import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Crown } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-yellow-500" />
            <CardTitle className="text-2xl">Fluxo Fácil Premium</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Desbloqueie todo o potencial do seu controle financeiro
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recursos Premium:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Relatórios financeiros avançados</li>
              <li>Alertas e notificações personalizadas</li>
              <li>Suporte prioritário</li>
              <li>Remoção de anúncios</li>
              <li>Acesso antecipado a novos recursos</li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200 relative">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Plano Mensal</CardTitle>
                <div className="text-3xl font-bold text-blue-600">R$ 19,90</div>
                <p className="text-sm text-muted-foreground">por mês</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Assinar Mensal
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 relative bg-green-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Mais Popular
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Plano Anual</CardTitle>
                <div className="text-3xl font-bold text-green-600">R$ 99,90</div>
                <p className="text-sm text-muted-foreground">por ano</p>
                <p className="text-xs text-green-600 font-medium">Economize R$ 138,90!</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Assinar Anual
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Version and guarantee */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>Versão 0.3.3 Beta • Garantia de 7 dias • Cancele quando quiser</p>
            <p className="mt-2">🔒 Pagamento seguro via Stripe</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumModal;
