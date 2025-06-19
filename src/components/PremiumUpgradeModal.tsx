
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Crown, Star, Building, Users, Phone } from 'lucide-react';

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
    phone: ''
  });

  const handlePremiumClick = () => {
    setShowPaymentModal(true);
  };

  const handleExclusiveClick = () => {
    setShowContactModal(true);
  };

  const handleContactSubmit = () => {
    console.log('Formulário de contato enviado:', contactForm);
    setContactForm({ company: '', users: '', phone: '' });
    setShowContactModal(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showPaymentModal && !showContactModal} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              PINEE Premium
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              Escolha o plano ideal para suas necessidades
            </p>
            <p className="text-center text-xs text-muted-foreground">
              v0.4.2 Beta
            </p>
          </DialogHeader>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Plano Free */}
            <Card className="border-2 border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Free</CardTitle>
                <div className="text-3xl font-bold">R$ 0</div>
                <p className="text-sm text-muted-foreground">Ideal para teste</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    5 transações/mês
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Relatórios básicos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Suporte por email
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/signup?plan=free'}
                >
                  Usar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="border-2 border-green-500 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
                Mais Popular
              </Badge>
              <CardHeader className="text-center pt-6">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Premium
                </CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">R$ 9,90</div>
                  <p className="text-sm text-muted-foreground">/mês</p>
                  <p className="text-xs text-green-600">ou R$ 99,90/ano (16% OFF)</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Relatórios avançados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Transações ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Categorias personalizadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Backup na nuvem
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Suporte prioritário
                  </li>
                </ul>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handlePremiumClick}
                >
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Licença Exclusiva */}
            <Card className="border-2 border-purple-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Licença Exclusiva
                </CardTitle>
                <div className="text-2xl font-bold text-purple-600">Fale Conosco</div>
                <p className="text-sm text-muted-foreground">Solução para empresas e governo</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Todos os recursos Premium
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Usuários ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Integração personalizada
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Suporte dedicado
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Valores especiais para contratos corporativos
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={handleExclusiveClick}
                >
                  Solicitar Cotação
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pagamento Premium */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha seu plano Premium</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card 
                className={`cursor-pointer border-2 ${selectedPlan === 'monthly' ? 'border-green-500' : 'border-border'}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Mensal</h3>
                      <p className="text-2xl font-bold">R$ 9,90<span className="text-sm font-normal">/mês</span></p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${selectedPlan === 'monthly' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer border-2 ${selectedPlan === 'yearly' ? 'border-green-500' : 'border-border'} relative`}
                onClick={()=> setSelectedPlan('yearly')}
              >
                <Badge className="absolute -top-2 right-4 bg-green-500">16% OFF</Badge>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Anual</h3>
                      <p className="text-2xl font-bold">R$ 99,90<span className="text-sm font-normal">/ano</span></p>
                      <p className="text-sm text-muted-foreground">R$ 8,32/mês</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${selectedPlan === 'yearly' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                Voltar
              </Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600">
                Pagar {selectedPlan === 'monthly' ? 'R$ 9,90' : 'R$ 99,90'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Contato Comercial */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Cotação - Licença Exclusiva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Nome da Empresa/Órgão</Label>
              <Input
                id="company"
                value={contactForm.company}
                onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                placeholder="Digite o nome da sua empresa ou órgão"
              />
            </div>
            
            <div>
              <Label htmlFor="users">Número de Usuários</Label>
              <Input
                id="users"
                value={contactForm.users}
                onChange={(e) => setContactForm({...contactForm, users: e.target.value})}
                placeholder="Quantos usuários utilizarão o sistema?"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowContactModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleContactSubmit} 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={!contactForm.company || !contactForm.users || !contactForm.phone}
              >
                Enviar Solicitação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumUpgradeModal;
