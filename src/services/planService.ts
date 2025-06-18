
import firestoreService from './firestoreService';

export type AccountType = 'free' | 'premium' | 'lifetime' | 'enterprise';
export type PaymentStatus = 'active' | 'inactive' | 'pending' | 'canceled';

export interface UserPlan {
  id: string;
  userId: string;
  accountType: AccountType;
  paymentStatus: PaymentStatus;
  expirationDate?: string; // ISO string para Premium e Enterprise
  licenseKey?: string; // Apenas para Enterprise
  maxUsers?: number; // Licença Exclusiva - NULL = ilimitado
  contractDuration?: number; // Duração em meses
  isTrial: boolean;
  autoRenew?: boolean; // Para implementação futura
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanData {
  userId: string;
  accountType: AccountType;
  paymentStatus?: PaymentStatus;
  expirationDate?: string;
  maxUsers?: number;
  contractDuration?: number;
  isTrial?: boolean;
}

class PlanService {
  private readonly collectionName = 'user_plans';

  // Gerar license key único
  generateLicenseKey(orgPrefix: string = 'PINEE'): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${orgPrefix}-${year}-${random}`;
  }

  // Criar plano para usuário
  async createUserPlan(data: CreatePlanData): Promise<string> {
    try {
      console.log('=== CRIANDO PLANO DE USUÁRIO ===');
      console.log('Dados do plano:', data);

      const planData: Partial<UserPlan> = {
        userId: data.userId,
        accountType: data.accountType,
        paymentStatus: data.paymentStatus || 'active',
        isTrial: data.isTrial || false,
        expirationDate: data.expirationDate,
        maxUsers: data.maxUsers,
        contractDuration: data.contractDuration
      };

      // Gerar license key apenas para enterprise
      if (data.accountType === 'enterprise') {
        planData.licenseKey = this.generateLicenseKey();
      }

      const planId = await firestoreService.saveDocument(this.collectionName, planData);
      console.log('Plano criado com sucesso:', planId);
      
      return planId;
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      throw error;
    }
  }

  // Buscar plano do usuário
  async getUserPlan(userId: string): Promise<UserPlan | null> {
    try {
      console.log('=== BUSCANDO PLANO DO USUÁRIO ===');
      console.log('User ID:', userId);

      const plans = await firestoreService.listDocuments(
        this.collectionName,
        [['userId', '==', userId]],
        'createdAt',
        'desc',
        1
      );

      if (plans.length > 0) {
        const plan = plans[0] as UserPlan;
        console.log('Plano encontrado:', plan);
        return plan;
      }

      console.log('Nenhum plano encontrado para o usuário');
      return null;
    } catch (error) {
      console.error('Erro ao buscar plano do usuário:', error);
      throw error;
    }
  }

  // Atualizar plano
  async updateUserPlan(planId: string, updates: Partial<UserPlan>): Promise<void> {
    try {
      console.log('=== ATUALIZANDO PLANO ===');
      console.log('Plan ID:', planId);
      console.log('Updates:', updates);

      // Gerar nova license key se mudando para enterprise
      if (updates.accountType === 'enterprise' && !updates.licenseKey) {
        updates.licenseKey = this.generateLicenseKey();
      }

      await firestoreService.updateDocument(this.collectionName, planId, updates);
      console.log('Plano atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      throw error;
    }
  }

  // Listar todos os planos (para admin)
  async listAllPlans(filters: [string, any, any][] = []): Promise<UserPlan[]> {
    try {
      console.log('=== LISTANDO TODOS OS PLANOS ===');
      console.log('Filtros:', filters);

      const plans = await firestoreService.listDocuments(
        this.collectionName,
        filters,
        'createdAt',
        'desc'
      );

      return plans as UserPlan[];
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      throw error;
    }
  }

  // Verificar se licença está válida
  isLicenseValid(plan: UserPlan): boolean {
    if (!plan.expirationDate) return true; // Sem data de expiração = válido

    const expirationDate = new Date(plan.expirationDate);
    const now = new Date();
    
    return expirationDate > now;
  }

  // Middleware de verificação (sem restrições por enquanto)
  checkAccess(plan: UserPlan | null, resource: string): { allowed: boolean; reason?: string } {
    console.log('=== VERIFICANDO ACESSO ===');
    console.log('Plano:', plan?.accountType);
    console.log('Recurso:', resource);

    // Por enquanto, liberar tudo (como solicitado)
    // Futuro: implementar restrições baseadas no plano
    
    if (!plan) {
      console.log('Sem plano definido, criando plano gratuito');
      return { allowed: true };
    }

    // Verificar se licença não expirou (apenas para enterprise e premium)
    if ((plan.accountType === 'enterprise' || plan.accountType === 'premium') && 
        plan.expirationDate && !this.isLicenseValid(plan)) {
      console.log('Licença expirada, mas permitindo acesso por enquanto');
      // return { allowed: false, reason: 'Licença expirada' };
    }

    console.log('Acesso permitido');
    return { allowed: true };
  }

  // Migrar usuários existentes para plano gratuito
  async migrateExistingUsers(userIds: string[]): Promise<void> {
    try {
      console.log('=== MIGRANDO USUÁRIOS EXISTENTES ===');
      console.log('Total de usuários:', userIds.length);

      for (const userId of userIds) {
        const existingPlan = await this.getUserPlan(userId);
        
        if (!existingPlan) {
          await this.createUserPlan({
            userId,
            accountType: 'free',
            paymentStatus: 'active'
          });
          console.log(`Usuário ${userId} migrado para plano gratuito`);
        }
      }

      console.log('Migração concluída');
    } catch (error) {
      console.error('Erro na migração:', error);
      throw error;
    }
  }
}

export default new PlanService();
