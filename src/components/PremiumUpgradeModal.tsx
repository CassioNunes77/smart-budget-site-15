
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Crown, X, Building, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: (plan: 'free' | 'premium' | 'enterprise') => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    company: '',
    users: '',
    phone: '',
    email: ''
  });

  const handleContactSubmit = () => {
    console.log('Formulário de contato enviado:', contactForm);
    toast({
      title: "Solicitação enviada!",
      description: "Entraremos em contato em até 24 horas."
    });
    setShowContactModal(false);
    setContactForm({ company: '', users: '', phone: '', email: '' });
  };

  const handleUpgrade = (planType: 'free' | 'premium' | 'enterprise') => {
    if (onUpgrade) {
      onUpgrade(planType);
    }
    onClose();
  };

  if (showContactModal) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Cotação - Licença Exclusiva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa/Órgão</Label>
              <Input
                id="company"
                value={contactForm.company}
                onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Ex: Prefeitura Municipal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="users">Número de Usuários</Label>
              <Input
                id="users"
                type="number"
                value={contactForm.users}
                onChange={(e) => setContactForm(prev => ({ ...prev, users: e.target.value }))}
                placeholder="Ex: 50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contato@empresa.com"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowContactModal(false)}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleContactSubmit}
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar Solicitação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <Crown className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600">
            PINEE Premium
          </DialogTitle>
          <p className="text-muted-foreground">
            Desbloqueie todo o potencial do seu controle financeiro
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mt-2">
            Versão 0.4 Beta
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Plano Gratuito */}
          <Card className="relative">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">Plano Gratuito</h3>
                <div className="text-3xl font-bold text-muted-foreground mb-1">
                  R$ 0<span className="text-sm font-normal">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Ideal para teste</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Até 5 transações/mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Categorias básicas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Relatórios simples</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-red-600">
                <p>Limitações:</p>
                <p>✗ Máximo 5 categorias personalizadas</p>
                <p>✗ Exportação básica de dados</p>
                <p>✗ Sem backup automático</p>
                <p>✗ Relatórios limitados</p>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleUpgrade('free')}
              >
                Plano Atual
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="relative border-green-500 border-2">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-600 text-white px-4 py-1">
                RECOMENDADO
              </Badge>
            </div>

            <CardContent className="p-6 pt-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">Plano Premium</h3>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-green-600">
                    R$ {selectedPlan === 'yearly' ? '99,90' : '9,90'}
                    <span className="text-sm font-normal">
                      /{selectedPlan === 'yearly' ? 'ano' : 'mês'}
                    </span>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="text-sm text-green-600">
                      Apenas R$ 8,33/mês
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Mais popular</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Transações ilimitadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Relatórios avançados com exportação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Categorias ilimitadas personalizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Backup automático na nuvem</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Análises preditivas de gastos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Lembretes inteligentes de contas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Suporte prioritário 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Sincronização entre dispositivos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Metas financeiras personalizadas</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Seleção de plano */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    Mensal
                  </Button>
                  <Button
                    variant={selectedPlan === 'yearly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPlan('yearly')}
                    className="relative"
                  >
                    Anual
                    {selectedPlan === 'yearly' && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                        16% OFF
                      </Badge>
                    )}
                  </Button>
                </div>

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    console.log('Iniciando processo de pagamento...', { plano: selectedPlan });
                    toast({
                      title: "Em breve!",
                      description: "Sistema de pagamento será integrado em breve."
                    });
                    handleUpgrade('premium');
                  }}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Premium
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  30 dias de garantia de satisfação
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Licença Exclusiva */}
          <Card className="relative">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="mx-auto mb-2">
                  <Building className="w-8 h-8 text-green-600 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Licença Exclusiva</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  Fale Conosco
                </div>
                <p className="text-sm text-muted-foreground">
                  Solução para empresas e governo
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Multi-usuários</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Customizações exclusivas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Suporte dedicado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Treinamento incluso</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">API de integração</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Relatórios corporativos</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground mb-4">
                Valores especiais para contratos corporativos
              </p>

              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => setShowContactModal(true)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Solicitar Cotação
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;
