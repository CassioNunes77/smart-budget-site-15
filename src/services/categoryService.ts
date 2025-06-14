
import firestoreService from './firestoreService';
import { auth } from './firebase';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  userId?: string;
}

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'userId'>[] = [
  { name: 'Sem categoria', icon: 'Tag', color: '#64748b', isDefault: true },
  { name: 'Salário', icon: 'DollarSign', color: '#22c55e', isDefault: true },
  { name: 'Serviços', icon: 'Briefcase', color: '#3b82f6', isDefault: true },
  { name: 'Empréstimos', icon: 'CreditCard', color: '#f59e0b', isDefault: true },
  { name: 'Casa', icon: 'Home', color: '#8b5cf6', isDefault: true },
  { name: 'Alimentação', icon: 'Utensils', color: '#f97316', isDefault: true },
  { name: 'Transporte', icon: 'Car', color: '#06b6d4', isDefault: true },
  { name: 'Saúde', icon: 'Heart', color: '#ef4444', isDefault: true },
  { name: 'Lazer', icon: 'Gamepad2', color: '#ec4899', isDefault: true },
  { name: 'Outros', icon: 'Tag', color: '#6b7280', isDefault: true }
];

export const getUserCategories = async (): Promise<Category[]> => {
  const user = auth.currentUser;
  
  if (!user) {
    return DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `default-${index}`
    }));
  }

  try {
    // Buscar categorias personalizadas do usuário
    const userCategories = await firestoreService.listDocuments(
      'user_categories',
      [['userId', '==', user.uid]]
    );

    // Se não tem categorias personalizadas, criar as padrão
    if (userCategories.length === 0) {
      console.log('Criando categorias padrão para usuário:', user.uid);
      const createdCategories = [];
      
      for (const defaultCat of DEFAULT_CATEGORIES) {
        const categoryData = {
          ...defaultCat,
          userId: user.uid
        };
        
        const docId = await firestoreService.saveDocument('user_categories', categoryData);
        createdCategories.push({
          ...categoryData,
          id: docId
        });
      }
      
      return createdCategories;
    }

    return userCategories as Category[];
  } catch (error) {
    console.error('Erro ao buscar categorias do usuário:', error);
    return DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `default-${index}`
    }));
  }
};

export const updateUserCategories = async (categories: Category[]): Promise<void> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  try {
    // Deletar todas as categorias existentes do usuário
    const existingCategories = await firestoreService.listDocuments(
      'user_categories',
      [['userId', '==', user.uid]]
    );

    for (const category of existingCategories) {
      await firestoreService.deleteDocument('user_categories', category.id);
    }

    // Criar as novas categorias
    for (const category of categories) {
      const categoryData = {
        name: category.name,
        icon: category.icon,
        color: category.color,
        isDefault: category.isDefault || false,
        userId: user.uid
      };
      
      await firestoreService.saveDocument('user_categories', categoryData);
    }

    console.log('Categorias atualizadas com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar categorias:', error);
    throw error;
  }
};

export const addUserCategory = async (category: Omit<Category, 'id' | 'userId'>): Promise<string> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const categoryData = {
      ...category,
      userId: user.uid,
      isDefault: false
    };
    
    const docId = await firestoreService.saveDocument('user_categories', categoryData);
    console.log('Nova categoria criada:', docId);
    return docId;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
};

export const deleteUserCategory = async (categoryId: string): Promise<void> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  try {
    await firestoreService.deleteDocument('user_categories', categoryId);
    console.log('Categoria deletada:', categoryId);
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }
};

export const getCategoryByName = (categories: Category[], categoryName: string): Category | undefined => {
  return categories.find(cat => cat.name === categoryName);
};

export const getCategoryColor = (categories: Category[], categoryName: string): string => {
  const category = getCategoryByName(categories, categoryName);
  return category?.color || '#64748b';
};

export const getCategoryIcon = (categories: Category[], categoryName: string): string => {
  const category = getCategoryByName(categories, categoryName);
  return category?.icon || 'Tag';
};
