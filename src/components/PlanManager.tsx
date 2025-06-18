
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Calendar,
  Key,
  CheckCircle,
  AlertCircle,
  Star,
  Building,
  Phone,
  Mail
} from 'lucide-react';
import { UserPlan, AccountType } from '@/services/planService';
import { useUserPlan } from '@/hooks/useUserPlan';
import { User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

interface PlanManagerProps {
  user: User | null;
}

const PlanManager: React.FC<PlanManagerProps> = ({ user }) => {
  const { plan, loading, upgradePlan } = useUserPlan(user);
  const [upgrading, setUpgrading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    company: '',
    users: '',
    phone: '',
    email: ''
  });

  const handleUpgrade = async (newPlan: AccountType) => {
    setUpgrading(true);
    try {
      let expirationDate;
      
      if (newPlan === 'premium' || newPlan === 'enterprise') {
        const expiration = new Date();
        expiration.setFullYear(expiration.getFullYear() + 1);
        expirationDate = expiration.toISOString();
      }

      await upgradePlan(newPlan, expirationDate);
    } catch (error) {
      console.error('Erro no upgrade:', error);
    } finally {
      setUpgrading(false);
    }
  };

  const handleContactSubmit = async () => {
    console.log('Formulário de contato enviado:', contactForm);
    toast({
      title: "Solicitação enviada!",
      description: "Entraremos em contato em até 24 horas."
    });
    setShowContactModal(false);
    setContactForm({ company: '', users: '', phone: '', email: '' });
  };

  const isLicenseExpired = () => {
    if (!plan?.expirationDate) return false;
    return new Date(plan.expirationDate) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
          <Star className="w-4 h-4" />
          Versão 0.4 Beta
        </div>
        <h2 className="text-3xl font-bold text-foreground">Escolha seu Plano</h2>
        <p className="text-muted-foreground mt-2">Selecione o plano ideal para suas necessidades financeiras</p>
      </div>

      {/* Plano Atual */}
      {plan && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Seu Plano Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600 text-white">
                {plan.accountType === 'free' ? 'Gratuito' : 
                 plan.accountType === 'premium' ? 'PINEE Premium' : 
                 plan.accountType === 'enterprise' ? 'Licença Exclusiva' : 'Vitalício'}
              </Badge>
              <Badge variant={plan.paymentStatus === 'active' ? 'default' : 'destructive'}>
                {plan.paymentStatus}
              </Badge>
              {plan.isTrial && (
                <Badge variant="outline">Trial</Badge>
              )}
            </div>

            {plan.expirationDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Expira em: {new Date(plan.expirationDate).toLocaleDateString('pt-BR')}
                </span>
                {isLicenseExpired() && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            )}

            {plan.licenseKey && (
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono">{plan.licenseKey}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Planos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plano Free */}
        <Card className={plan?.accountType === 'free' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Gratuito</CardTitle>
            <div className="text-3xl font-bold text-green-600">R$ 0</div>
            <p className="text-sm text-muted-foreground">Ideal para teste</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Até 5 transações/mês
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Categorias básicas
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Relatórios simples
              </li>
            </ul>

            {plan?.accountType !== 'free' ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleUpgrade('free')}
                disabled={upgrading}
              >
                {upgrading ? 'Processando...' : 'Usar Grátis'}
              </Button>
            ) : (
              <Button className="w-full" disabled variant="secondary">
                Plano Atual
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Plano Premium */}
        <Card className={`${plan?.accountType === 'premium' ? 'ring-2 ring-green-500' : ''} relative`}>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-green-600 text-white px-4 py-1">
              Mais Popular
            </Badge>
          </div>
          
          <CardHeader className="text-center pt-6">
            <CardTitle className="text-xl">PINEE Premium</CardTitle>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-green-600">R$ 9,90</div>
              <div className="text-sm text-muted-foreground">/mês</div>
              <div className="text-xs text-green-600">ou R$ 99,90/ano (16% OFF)</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Transações ilimitadas
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Relatórios avançados
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Exportação de dados
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Categorias personalizadas
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Suporte prioritário
              </li>
            </ul>

            {plan?.accountType !== 'premium' ? (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setShowPaymentModal(true)}
                disabled={upgrading}
              >
                Assinar Agora
              </Button>
            ) : (
              <Button className="w-full" disabled variant="secondary">
                Plano Atual
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Licença Exclusiva */}
        <Card className={plan?.accountType === 'enterprise' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">
              <Building className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Licença Exclusiva</CardTitle>
            <div className="text-2xl font-bold text-green-600">Fale Conosco</div>
            <p className="text-sm text-muted-foreground">Solução para empresas e governo</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Multi-usuários
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Customizações exclusivas
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Suporte dedicado
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Treinamento incluso
              </li>
            </ul>

            <p className="text-xs text-center text-muted-foreground">
              Valores especiais para contratos corporativos
            </p>

            {plan?.accountType !== 'enterprise' ? (
              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                variant="outline"
                onClick={() => setShowContactModal(true)}
              >
                Solicitar Cotação
              </Button>
            ) : (
              <Button className="w-full" disabled variant="secondary">
                Plano Atual
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Pagamento Premium */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Assinar PINEE Premium</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:ring-2 hover:ring-green-500">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold">R$ 9,90</div>
                  <div className="text-sm text-muted-foreground">Mensal</div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:ring-2 hover:ring-green-500 border-green-500 bg-green-50">
                <CardContent className="p-4 text-center">
                  <Badge className="bg-green-600 text-white text-xs mb-1">16% OFF</Badge>
                  <div className="text-lg font-bold">R$ 99,90</div>
                  <div className="text-sm text-muted-foreground">Anual</div>
                </CardContent>
              </Card>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Aqui será integrado o sistema de pagamento
                console.log('Iniciando processo de pagamento...');
                toast({
                  title: "Em breve!",
                  description: "Sistema de pagamento será integrado em breve."
                });
                handleUpgrade('premium');
                setShowPaymentModal(false);
              }}
              disabled={upgrading}
            >
              {upgrading ? 'Processando...' : 'Confirmar Assinatura'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Contato Comercial */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Cotação</DialogTitle>
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

            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleContactSubmit}
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Solicitação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanManager;
