
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Crown, Check, Star } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-background max-h-[calc(100vh-2rem)] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">
            <Crown className="w-6 h-6 inline mr-2 text-yellow-500" />
            Planos Fluxo Fácil
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plano Free */}
            <Card className="border-2 border-muted">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Plano Free</CardTitle>
                <div className="text-3xl font-bold text-muted-foreground">R$ 0</div>
                <p className="text-sm text-muted-foreground">Para sempre</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Até 100 transações por mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Categorias básicas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Relatórios básicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Gráficos simples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Suporte por email</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Plano Atual
                </Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Mais Popular
                </div>
              </div>
              <CardHeader className="text-center pt-6">
                <CardTitle className="text-xl text-primary">Plano Premium</CardTitle>
                <div className="text-3xl font-bold text-primary">R$ 9,90</div>
                <p className="text-sm text-muted-foreground">por mês</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Transações ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Categorias personalizadas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Relatórios avançados e detalhados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Gráficos interativos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Transações recorrentes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Exportação de dados (CSV, PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Backup automático</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Notificações personalizadas</span>
                  </li>
                </ul>
                <Button className="w-full premium-button">
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Premium
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  7 dias de teste grátis • Cancele a qualquer momento
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-4">Por que escolher o Premium?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border rounded-lg">
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Sem Limitações</h4>
                <p className="text-muted-foreground">Registre quantas transações quiser, sem restrições</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Recursos Avançados</h4>
                <p className="text-muted-foreground">Acesse ferramentas profissionais de gestão financeira</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Suporte Premium</h4>
                <p className="text-muted-foreground">Atendimento prioritário e especializado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumModal;
