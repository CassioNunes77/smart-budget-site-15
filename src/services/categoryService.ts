
import firestoreService from './firestoreService';
import { auth } from './firebase';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  isDefault?: boolean;
}

const getDefaultCategories = (): Omit<Category, 'id' | 'userId'>[] => [
  { name: 'Sem categoria', icon: 'Tag', color: '#64748b', isDefault: true },
  { name: 'Salário', icon: 'DollarSign', color: '#10b981', isDefault: true },
  { name: 'Serviços', icon: 'Briefcase', color: '#3b82f6', isDefault: true },
  { name: 'Empréstimos', icon: 'CreditCard', color: '#f59e0b', isDefault: true },
  { name: 'Casa', icon: 'Home', color: '#8b5cf6', isDefault: true },
  { name: 'Alimentação', icon: 'Utensils', color: '#ef4444', isDefault: true },
  { name: 'Transporte', icon: 'Car', color: '#06b6d4', isDefault: true },
  { name: 'Saúde', icon: 'Heart', color: '#ec4899', isDefault: true },
  { name: 'Lazer', icon: 'Gamepad2', color: '#84cc16', isDefault: true },
  { name: 'Outros', icon: 'Tag', color: '#6b7280', isDefault: true }
];

// Buscar categorias do usuário
export const getUserCategories = async (): Promise<Category[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('Usuário não autenticado, retornando categorias padrão');
    return getDefaultCategories().map((cat, index) => ({
      ...cat,
      id: `default-${index + 1}`,
      userId: 'default'
    }));
  }

  try {
    const categories = await firestoreService.listDocuments(
      'categories', 
      [['userId', '==', user.uid]],
      'name',
      'asc'
    );
    
    // Se não há categorias no Firestore, criar as padrão para este usuário
    if (categories.length === 0) {
      const defaultCategories = getDefaultCategories();
      const createdCategories: Category[] = [];
      
      for (const defaultCat of defaultCategories) {
        const docRef = await firestoreService.saveDocument('categories', {
          ...defaultCat,
          userId: user.uid
        });
        createdCategories.push({
          ...defaultCat,
          id: docRef,
          userId: user.uid
        });
      }
      
      console.log(`${createdCategories.length} categorias padrão criadas`);
      return createdCategories;
    }
    
    console.log(`${categories.length} categorias encontradas`);
    return categories as Category[];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return getDefaultCategories().map((cat, index) => ({
      ...cat,
      id: `default-${index + 1}`,
      userId: 'default'
    }));
  }
};

// Salvar categorias do usuário
export const saveUserCategories = async (categories: Category[]): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Salvando categorias:', categories);

  // Primeiro, buscar categorias existentes para identificar quais remover
  const existingCategories = await firestoreService.listDocuments(
    'categories',
    [['userId', '==', user.uid]]
  );

  // Remover categorias que não estão mais na lista
  for (const existingCategory of existingCategories) {
    if (!categories.find(cat => cat.id === existingCategory.id)) {
      await firestoreService.deleteDocument('categories', existingCategory.id);
    }
  }

  // Adicionar ou atualizar categorias
  for (const category of categories) {
    const existingCategory = existingCategories.find(cat => cat.id === category.id);
    
    if (existingCategory) {
      // Atualizar categoria existente
      await firestoreService.updateDocument('categories', category.id, {
        name: category.name,
        icon: category.icon,
        color: category.color,
        isDefault: category.isDefault || false,
        userId: user.uid
      });
    } else if (!category.id.startsWith('default-')) {
      // Criar nova categoria (ignorar IDs temporários default-)
      await firestoreService.saveDocument('categories', {
        name: category.name,
        icon: category.icon,
        color: category.color,
        isDefault: category.isDefault || false,
        userId: user.uid
      });
    }
  }
};

// Adicionar nova categoria
export const addCategory = async (categoryData: Omit<Category, 'id' | 'userId'>): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Adicionando categoria:', categoryData);

  const docRef = await firestoreService.saveDocument('categories', {
    ...categoryData,
    userId: user.uid
  });

  return docRef;
};

// Remover categoria
export const removeCategory = async (categoryId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Removendo categoria:', categoryId);

  // Não permitir remoção de categorias padrão
  if (categoryId.startsWith('default-')) {
    throw new Error('Não é possível remover categorias padrão');
  }

  await firestoreService.deleteDocument('categories', categoryId);
};
