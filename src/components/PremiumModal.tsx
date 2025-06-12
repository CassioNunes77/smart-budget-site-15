
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Crown, Check, Star, Zap } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl bg-background max-h-[calc(100vh-2rem)] overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Plano Mensal */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Mais Popular
                </div>
              </div>
              <CardHeader className="text-center pt-6">
                <CardTitle className="text-xl text-primary">Plano Mensal</CardTitle>
                <div className="text-3xl font-bold text-primary">R$ 9,90</div>
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">R$ 24,90</span> por mês
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  60% de desconto
                </div>
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
                    <span className="text-sm">Relatórios detalhados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Categorização automática</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Previsões financeiras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Exportação de dados (CSV, PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full premium-button">
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Mensal
                </Button>
              </CardContent>
            </Card>

            {/* Plano Anual */}
            <Card className="border-2 border-orange-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Melhor Valor
                </div>
              </div>
              <CardHeader className="text-center pt-6">
                <CardTitle className="text-xl text-orange-600">Plano Anual</CardTitle>
                <div className="text-3xl font-bold text-orange-600">R$ 149</div>
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">R$ 199</span> por ano
                </div>
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                  25% de desconto + 2 meses grátis
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Tudo do plano mensal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">2 meses gratuitos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Backup automático na nuvem</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Acesso antecipado a novos recursos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Consultoria financeira mensal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">API para integrações</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Suporte 24/7</span>
                  </li>
                </ul>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Anual
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Equivale a R$ 12,42/mês
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-4">A versão premium inclui relatórios detalhados, categorização de despesas, previsões e muito mais!</h3>
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
