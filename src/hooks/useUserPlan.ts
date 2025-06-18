
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import planService, { UserPlan, AccountType } from '@/services/planService';
import { toast } from '@/hooks/use-toast';

export const useUserPlan = (user: User | null) => {
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPlan(null);
      setLoading(false);
      return;
    }

    loadUserPlan();
  }, [user]);

  const loadUserPlan = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Carregando plano do usuário:', user.uid);
      
      let userPlan = await planService.getUserPlan(user.uid);
      
      // Se não tem plano, criar um gratuito
      if (!userPlan) {
        console.log('Usuário sem plano, criando plano gratuito');
        await planService.createUserPlan({
          userId: user.uid,
          accountType: 'free',
          paymentStatus: 'active'
        });
        
        userPlan = await planService.getUserPlan(user.uid);
      }

      setPlan(userPlan);
      console.log('Plano carregado:', userPlan);

    } catch (err) {
      console.error('Erro ao carregar plano:', err);
      setError('Erro ao carregar informações do plano');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as informações do seu plano",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (planId: string, updates: Partial<UserPlan>) => {
    try {
      await planService.updateUserPlan(planId, updates);
      await loadUserPlan(); // Recarregar plano após atualização
      
      toast({
        title: "Plano atualizado",
        description: "As informações do plano foram atualizadas com sucesso"
      });
    } catch (err) {
      console.error('Erro ao atualizar plano:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o plano",
        variant: "destructive"
      });
      throw err;
    }
  };

  const upgradePlan = async (newAccountType: AccountType, expirationDate?: string) => {
    if (!plan) return;

    try {
      await updatePlan(plan.id, {
        accountType: newAccountType,
        expirationDate,
        paymentStatus: 'active'
      });

      toast({
        title: "Plano atualizado!",
        description: `Seu plano foi atualizado para ${newAccountType}`
      });
    } catch (err) {
      console.error('Erro ao fazer upgrade:', err);
      throw err;
    }
  };

  const checkAccess = (resource: string) => {
    return planService.checkAccess(plan, resource);
  };

  return {
    plan,
    loading,
    error,
    updatePlan,
    upgradePlan,
    checkAccess,
    refetch: loadUserPlan
  };
};
