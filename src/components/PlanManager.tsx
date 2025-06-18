
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crown, 
  Shield, 
  Star, 
  Users, 
  Calendar,
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { UserPlan, AccountType } from '@/services/planService';
import { useUserPlan } from '@/hooks/useUserPlan';
import { User } from 'firebase/auth';

interface PlanManagerProps {
  user: User | null;
}

const PlanManager: React.FC<PlanManagerProps> = ({ user }) => {
  const { plan, loading, upgradePlan } = useUserPlan(user);
  const [upgrading, setUpgrading] = useState(false);

  const getPlanIcon = (accountType: AccountType) => {
    switch (accountType) {
      case 'free': return <Users className="w-5 h-5" />;
      case 'premium': return <Crown className="w-5 h-5" />;
      case 'lifetime': return <Star className="w-5 h-5" />;
      case 'enterprise': return <Shield className="w-5 h-5" />;
    }
  };

  const getPlanColor = (accountType: AccountType) => {
    switch (accountType) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'lifetime': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
    }
  };

  const getPlanName = (accountType: AccountType) => {
    switch (accountType) {
      case 'free': return 'Gratuito';
      case 'premium': return 'Premium';
      case 'lifetime': return 'Vitalício';
      case 'enterprise': return 'Licença Exclusiva';
    }
  };

  const handleUpgrade = async (newPlan: AccountType) => {
    setUpgrading(true);
    try {
      let expirationDate;
      
      // Para premium e enterprise, definir expiração de 1 ano
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gerenciamento de Planos</h2>
        <p className="text-muted-foreground">Gerencie seu plano e recursos disponíveis</p>
      </div>

      {/* Plano Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {plan && getPlanIcon(plan.accountType)}
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan ? (
            <>
              <div className="flex items-center gap-3">
                <Badge className={getPlanColor(plan.accountType)}>
                  {getPlanName(plan.accountType)}
                </Badge>
                <Badge variant={plan.paymentStatus === 'active' ? 'default' : 'destructive'}>
                  {plan.paymentStatus}
                </Badge>
                {plan.isTrial && (
                  <Badge variant="outline">
                    Trial
                  </Badge>
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

              {plan.maxUsers && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Máximo de usuários: {plan.maxUsers}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Nenhum plano encontrado</p>
          )}
        </CardContent>
      </Card>

      {/* Opções de Upgrade */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['free', 'premium', 'lifetime', 'enterprise'] as AccountType[]).map((planType) => {
          const isCurrentPlan = plan?.accountType === planType;
          
          return (
            <Card key={planType} className={isCurrentPlan ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-2">
                  {getPlanIcon(planType)}
                </div>
                <CardTitle className="text-lg">
                  {getPlanName(planType)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {planType === 'free' && (
                    <div className="text-2xl font-bold">Grátis</div>
                  )}
                  {planType === 'premium' && (
                    <div className="text-2xl font-bold">R$ 19,90/mês</div>
                  )}
                  {planType === 'lifetime' && (
                    <div className="text-2xl font-bold">R$ 199,90</div>
                  )}
                  {planType === 'enterprise' && (
                    <div className="text-2xl font-bold">Sob consulta</div>
                  )}
                </div>

                <ul className="text-sm space-y-1">
                  {planType === 'free' && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Funcionalidades básicas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Até 100 transações
                      </li>
                    </>
                  )}
                  {planType === 'premium' && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Transações ilimitadas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Relatórios avançados
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Sincronização na nuvem
                      </li>
                    </>
                  )}
                  {planType === 'lifetime' && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Todos os recursos Premium
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Pagamento único
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Atualizações vitalícias
                      </li>
                    </>
                  )}
                  {planType === 'enterprise' && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Multi-usuários
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Suporte dedicado
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Customizações
                      </li>
                    </>
                  )}
                </ul>

                {!isCurrentPlan && (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(planType)}
                    disabled={upgrading}
                    variant={planType === 'enterprise' ? 'default' : 'outline'}
                  >
                    {upgrading ? 'Processando...' : 'Selecionar'}
                  </Button>
                )}

                {isCurrentPlan && (
                  <Button className="w-full" disabled variant="secondary">
                    Plano Atual
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlanManager;
