
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Crown, Building, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({ isOpen, onClose }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [contactForm, setContactForm] = useState({
    company: '',
    users: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 'R$ 0',
      period: '',
      description: 'Ideal para teste',
      features: [
        '5 transações/mês',
        'Relatórios básicos',
        'Suporte por email',
        'Dados locais'
      ],
      buttonText: 'Usar Grátis',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 9,90',
      period: '/mês',
      yearlyPrice: 'R$ 99,90',
      yearlyPeriod: '/ano',
      discount: '16% OFF',
      description: 'Mais popular',
      features: [
        'Transações ilimitadas',
        'Relatórios avançados',
        'Backup automático',
        'Suporte prioritário',
        'Categorias personalizadas',
        'Exportação de dados'
      ],
      buttonText: 'Assinar Agora',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      id: 'exclusive',
      name: 'Licença Exclusiva',
      price: 'Fale Conosco',
      period: '',
      description: 'Solução para empresas e governo',
      features: [
        'Usuários ilimitados',
        'Instalação local',
        'Customização completa',
        'Suporte 24/7',
        'Treinamento incluso',
        'Valores especiais para contratos corporativos'
      ],
      buttonText: 'Solicitar Cotação',
      buttonVariant: 'secondary' as const,
      popular: false
    }
  ];

  const handleFreePlan = () => {
    window.location.href = '/signup?plan=free';
  };

  const handlePremiumPlan = () => {
    setShowPaymentModal(true);
  };

  const handleExclusivePlan = () => {
    setShowContactModal(true);
  };

  const handleContactSubmit = () => {
    if (!contactForm.company || !contactForm.users || !contactForm.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Solicitação enviada!",
      description: "Nossa equipe comercial entrará em contato em até 24 horas.",
    });

    setContactForm({ company: '', users: '', phone: '', message: '' });
    setShowContactModal(false);
    onClose();
  };

  const getButtonAction = (planId: string) => {
    switch (planId) {
      case 'free':
        return handleFreePlan;
      case 'premium':
        return handlePremiumPlan;
      case 'exclusive':
        return handleExclusivePlan;
      default:
        return () => {};
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">PINEE Premium</DialogTitle>
                <p className="text-muted-foreground mt-1">v0.4.1 Beta - Escolha o melhor plano para você</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-green-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                    {plan.yearlyPrice && (
                      <div className="text-sm text-muted-foreground mt-1">
                        ou {plan.yearlyPrice}{plan.yearlyPeriod}
                        {plan.discount && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {plan.discount}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.buttonVariant}
                    className="w-full"
                    onClick={getButtonAction(plan.id)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha seu plano Premium</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer ${selectedPlan === 'monthly' ? 'border-green-500' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold">Mensal</h3>
                  <p className="text-2xl font-bold">R$ 9,90</p>
                  <p className="text-sm text-muted-foreground">/mês</p>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer ${selectedPlan === 'yearly' ? 'border-green-500' : ''}`}
                onClick={() => setSelectedPlan('yearly')}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold">Anual</h3>
                  <p className="text-2xl font-bold">R$ 99,90</p>
                  <p className="text-sm text-muted-foreground">/ano</p>
                  <Badge variant="secondary" className="mt-1">16% OFF</Badge>
                </CardContent>
              </Card>
            </div>
            <Button className="w-full" onClick={() => {
              toast({
                title: "Redirecionando para pagamento",
                description: "Você será redirecionado para completar sua assinatura.",
              });
              setShowPaymentModal(false);
              onClose();
            }}>
              Continuar para Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Solicitar Cotação Empresarial
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Nome da Empresa/Órgão *</Label>
              <Input
                id="company"
                value={contactForm.company}
                onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Digite o nome da sua empresa ou órgão"
              />
            </div>
            <div>
              <Label htmlFor="users">Número de Usuários *</Label>
              <Input
                id="users"
                value={contactForm.users}
                onChange={(e) => setContactForm(prev => ({ ...prev, users: e.target.value }))}
                placeholder="Quantos usuários utilizarão o sistema?"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label htmlFor="message">Mensagem Adicional</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Conte-nos mais sobre suas necessidades..."
              />
            </div>
            <Button className="w-full" onClick={handleContactSubmit}>
              Enviar Solicitação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumUpgradeModal;
