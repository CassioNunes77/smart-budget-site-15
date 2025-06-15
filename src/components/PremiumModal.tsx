
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Crown, Check, Zap, Shield, BarChart3, Bell, Calendar, Download, Palette } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Relatórios Avançados",
      description: "Gráficos detalhados e análises profundas das suas finanças"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Notificações Inteligentes",
      description: "Lembretes personalizados para contas, metas e relatórios"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Planejamento Financeiro",
      description: "Ferramentas avançadas para orçamento e projeções futuras"
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Exportação Ilimitada",
      description: "Exporte dados em múltiplos formatos sem restrições"
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Temas Personalizados",
      description: "Personalize a aparência do app com temas exclusivos"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Backup na Nuvem",
      description: "Seus dados seguros e sincronizados em todos os dispositivos"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-background max-h-[calc(100vh-2rem)] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Fluxo Fácil Premium
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Desbloqueie todo o potencial do seu controle financeiro
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Pricing Section */}
          <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border">
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Oferta Especial v0.3.2</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Plano Mensal */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Mensal</h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  R$ 9,90
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">por mês</p>
              </div>
              
              {/* Plano Anual */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg border-2 border-blue-600 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Mais Popular
                  </span>
                </div>
                <h3 className="font-semibold mb-2">Anual</h3>
                <div className="text-3xl font-bold mb-1">
                  R$ 99,90
                </div>
                <p className="text-sm text-blue-100">por ano (2 meses grátis)</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 text-center">O que está incluído</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
              {[
                "Transações ilimitadas",
                "Categorias personalizadas",
                "Gráficos avançados",
                "Exportação de dados",
                "Suporte prioritário",
                "Backup automático"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Começar Teste Grátis
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              size="lg"
            >
              Continuar Gratuito
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Cancele a qualquer momento. Teste grátis por 7 dias, sem compromisso.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumModal;
