import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, TrendingUp, Shield } from 'lucide-react';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              PINEE Premium
            </DialogTitle>
          </div>
          <p className="text-muted-foreground">
            Desbloqueie todo o potencial do PINEE e transforme sua gestão financeira
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              v0.4.3 Beta
            </Badge>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Oferta Limitada
            </Badge>
          </div>
        </DialogHeader>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30">
            <Check className="w-5 h-5 text-green-500" />
            <div>
              <h4 className="font-medium text-foreground">Transações Ilimitadas</h4>
              <p className="text-sm text-muted-foreground">
                Adicione quantas transações precisar, sem limites
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30">
            <Star className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="font-medium text-foreground">Relatórios Avançados</h4>
              <p className="text-sm text-muted-foreground">
                Visualize seus dados com gráficos detalhados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/30">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <h4 className="font-medium text-foreground">Suporte Prioritário</h4>
              <p className="text-sm text-muted-foreground">
                Obtenha respostas rápidas para suas dúvidas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/30">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <div>
              <h4 className="font-medium text-foreground">Planejamento Financeiro</h4>
              <p className="text-sm text-muted-foreground">
                Defina metas e acompanhe seu progresso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/30">
            <Shield className="w-5 h-5 text-orange-500" />
            <div>
              <h4 className="font-medium text-foreground">Segurança Reforçada</h4>
              <p className="text-sm text-muted-foreground">
                Proteção extra para seus dados financeiros
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30">
            <Crown className="w-5 h-5 text-red-500" />
            <div>
              <h4 className="font-medium text-foreground">Recursos Exclusivos</h4>
              <p className="text-sm text-muted-foreground">
                Acesso antecipado a novas funcionalidades
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="px-6 py-8">
          <h3 className="text-xl font-semibold text-center mb-4 text-foreground">
            Escolha o plano ideal para você
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-lg font-medium text-foreground mb-2">Mensal</h4>
              <p className="text-4xl font-bold text-foreground">R$ 19,90</p>
              <p className="text-muted-foreground mb-4">
                Acesso completo por um mês
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Transações ilimitadas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Relatórios avançados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Suporte prioritário
                </li>
              </ul>
              <Button className="w-full mt-4">Assinar Mensal</Button>
            </div>

            <div className="p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-lg font-medium text-foreground mb-2">Anual</h4>
              <p className="text-4xl font-bold text-foreground">R$ 179,90</p>
              <p className="text-muted-foreground mb-4">
                Economize 25% em relação ao plano mensal
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Transações ilimitadas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Relatórios avançados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Suporte prioritário
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Recursos exclusivos
                </li>
              </ul>
              <Button className="w-full mt-4">Assinar Anual</Button>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-muted p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-4 text-foreground">
            O que nossos clientes estão dizendo
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background border border-border">
              <p className="text-sm text-muted-foreground italic">
                "O PINEE Premium transformou a forma como gerencio minhas
                finanças. Os relatórios avançados me dão insights valiosos!"
              </p>
              <p className="text-foreground font-medium mt-2">- João Silva</p>
            </div>

            <div className="p-4 rounded-lg bg-background border border-border">
              <p className="text-sm text-muted-foreground italic">
                "O suporte prioritário é incrível! Sempre que tenho dúvidas, sou
                atendido rapidamente."
              </p>
              <p className="text-foreground font-medium mt-2">- Maria Oliveira</p>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-semibold text-foreground">
              Garantia de Satisfação
            </h3>
          </div>
          <p className="text-muted-foreground">
            Estamos tão confiantes de que você vai amar o PINEE Premium, que
            oferecemos uma garantia de 7 dias. Se você não estiver satisfeito,
            reembolsaremos seu dinheiro.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Comece agora e transforme suas finanças!
          </h2>
          <p className="text-muted-foreground mb-6">
            Assine o PINEE Premium e tenha acesso a todos os recursos exclusivos
          </p>
          <Button size="lg">Assinar PINEE Premium</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;
