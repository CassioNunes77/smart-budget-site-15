
import firestoreService from './firestoreService';
import { auth } from './firebase';
import { DEFAULT_CATEGORIES } from '@/components/CategoryIcon';

export interface Category {
  id: string;
  name: string;
  userId: string;
  icon?: string;
  color?: string;
}

// Buscar categorias do usuário
export const getUserCategories = async (): Promise<Category[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('Usuário não autenticado, retornando categorias padrão');
    return DEFAULT_CATEGORIES.map((cat, index) => ({
      id: `default-${index}`,
      name: cat.name,
      userId: '',
      icon: cat.icon.name,
      color: getDefaultColor(cat.name)
    }));
  }

  try {
    console.log('Buscando categorias para usuário:', user.uid);
    
    const categories = await firestoreService.listDocuments(
      'categories', 
      [['userId', '==', user.uid]]
    );
    
    console.log('Categorias encontradas no Firestore:', categories);
    
    if (categories.length === 0) {
      console.log('Nenhuma categoria encontrada, criando categorias padrão para o usuário');
      await initializeDefaultCategories();
      const newCategories = await firestoreService.listDocuments(
        'categories', 
        [['userId', '==', user.uid]]
      );
      return newCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        userId: cat.userId,
        icon: cat.icon,
        color: cat.color
      }));
    }
    
    const defaultCategoryNames = DEFAULT_CATEGORIES.map(cat => cat.name);
    const existingNames = categories.map(cat => cat.name);
    const missingCategories = defaultCategoryNames.filter(name => !existingNames.includes(name));
    
    if (missingCategories.length > 0) {
      console.log('Categorias base faltando, adicionando:', missingCategories);
      for (const categoryName of missingCategories) {
        const defaultCategory = DEFAULT_CATEGORIES.find(cat => cat.name === categoryName);
        await firestoreService.saveDocument('categories', {
          name: categoryName,
          userId: user.uid,
          icon: defaultCategory?.icon.name || 'Tag',
          color: getDefaultColor(categoryName)
        });
      }
      
      const updatedCategories = await firestoreService.listDocuments(
        'categories', 
        [['userId', '==', user.uid]]
      );
      return updatedCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        userId: cat.userId,
        icon: cat.icon,
        color: cat.color
      }));
    }
    
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      userId: cat.userId,
      icon: cat.icon,
      color: cat.color
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return DEFAULT_CATEGORIES.map((cat, index) => ({
      id: `default-${index}`,
      name: cat.name,
      userId: '',
      icon: cat.icon.name,
      color: getDefaultColor(cat.name)
    }));
  }
};

const getDefaultColor = (categoryName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Sem categoria': '#64748b',
    'Salário': '#059669',
    'Serviços': '#2563eb',
    'Empréstimos': '#ea580c',
    'Casa': '#9333ea',
    'Alimentação': '#dc2626',
    'Transporte': '#4f46e5',
    'Saúde': '#ec4899',
    'Lazer': '#ca8a04',
    'Outros': '#6b7280'
  };
  return colorMap[categoryName] || '#64748b';
};

const initializeDefaultCategories = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Inicializando categorias padrão para usuário:', user.uid);

  try {
    for (const defaultCategory of DEFAULT_CATEGORIES) {
      await firestoreService.saveDocument('categories', {
        name: defaultCategory.name,
        userId: user.uid,
        icon: defaultCategory.icon.name,
        color: getDefaultColor(defaultCategory.name)
      });
      console.log('Categoria base criada:', defaultCategory.name);
    }
  } catch (error) {
    console.error('Erro ao inicializar categorias padrão:', error);
    throw error;
  }
};

export const addCategory = async (categoryName: string, icon?: string, color?: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Adicionando categoria:', categoryName, 'icon:', icon, 'color:', color);

  try {
    const docId = await firestoreService.saveDocument('categories', {
      name: categoryName,
      userId: user.uid,
      icon: icon || 'Tag',
      color: color || '#64748b'
    });
    console.log('Categoria adicionada com sucesso:', categoryName, 'ID:', docId);
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, updates: Partial<Category>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Atualizando categoria:', categoryId, updates);

  try {
    await firestoreService.updateDocument('categories', categoryId, updates);
    console.log('Categoria atualizada com sucesso:', categoryId);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

export const removeCategory = async (categoryName: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Removendo categoria:', categoryName);

  try {
    const categories = await firestoreService.listDocuments(
      'categories',
      [['userId', '==', user.uid], ['name', '==', categoryName]]
    );

    for (const category of categories) {
      await firestoreService.deleteDocument('categories', category.id);
      console.log('Categoria removida do Firestore:', category.id);
    }
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    throw error;
  }
};

export const saveUserCategories = async (categories: string[]): Promise<void> => {
  console.log('saveUserCategories não é mais usado - use addCategory/removeCategory individualmente');
};
