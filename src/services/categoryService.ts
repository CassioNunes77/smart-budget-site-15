
import firestoreService from './firestoreService';
import { auth } from './firebase';
import { DEFAULT_CATEGORIES } from '@/components/CategoryIcon';

export interface Category {
  id: string;
  name: string;
  userId: string;
  icon?: string;
  color?: string;
  isCustom?: boolean;
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
      icon: getIconName(cat.icon),
      color: cat.color,
      isCustom: false
    }));
  }

  try {
    console.log('Buscando categorias para usuário:', user.uid);
    
    // Buscar categorias do usuário no Firestore
    const categories = await firestoreService.listDocuments(
      'categories', 
      [['userId', '==', user.uid]]
    );
    
    console.log('Categorias encontradas no Firestore:', categories);
    
    // Se não há categorias no Firestore, criar as categorias padrão para este usuário
    if (categories.length === 0) {
      console.log('Nenhuma categoria encontrada, criando categorias padrão para o usuário');
      await initializeDefaultCategories();
      // Buscar novamente após inicializar
      const newCategories = await firestoreService.listDocuments(
        'categories', 
        [['userId', '==', user.uid]]
      );
      return newCategories as Category[];
    }
    
    return categories as Category[];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    // Em caso de erro, retornar categorias padrão
    return DEFAULT_CATEGORIES.map((cat, index) => ({
      id: `default-${index}`,
      name: cat.name,
      userId: '',
      icon: getIconName(cat.icon),
      color: cat.color,
      isCustom: false
    }));
  }
};

// Função auxiliar para obter o nome do ícone
const getIconName = (IconComponent: any): string => {
  // Mapear os componentes de ícone para seus nomes
  const iconMap: { [key: string]: string } = {
    'Tag': 'Tag',
    'DollarSign': 'DollarSign', 
    'Briefcase': 'Briefcase',
    'CreditCard': 'CreditCard',
    'Home': 'Home',
    'Utensils': 'Utensils',
    'Car': 'Car',
    'Heart': 'Heart',
    'Gamepad2': 'Gamepad2',
    'MoreHorizontal': 'MoreHorizontal'
  };
  
  const iconName = IconComponent?.name || 'Tag';
  return iconMap[iconName] || 'Tag';
};

// Inicializar categorias padrão para um usuário
const initializeDefaultCategories = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Inicializando categorias padrão para usuário:', user.uid);

  try {
    for (const defaultCategory of DEFAULT_CATEGORIES) {
      await firestoreService.saveDocument('categories', {
        name: defaultCategory.name,
        userId: user.uid,
        icon: getIconName(defaultCategory.icon),
        color: defaultCategory.color,
        isCustom: false
      });
      console.log('Categoria base criada:', defaultCategory.name);
    }
  } catch (error) {
    console.error('Erro ao inicializar categorias padrão:', error);
    throw error;
  }
};

// Adicionar nova categoria personalizada
export const addCategory = async (categoryName: string, icon: string = 'Tag', color: string = '#64748b'): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Adicionando categoria personalizada:', { categoryName, icon, color });

  try {
    const docId = await firestoreService.saveDocument('categories', {
      name: categoryName,
      userId: user.uid,
      icon: icon,
      color: color,
      isCustom: true
    });
    console.log('Categoria personalizada adicionada com sucesso:', categoryName, 'ID:', docId);
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
};

// Atualizar categoria existente
export const updateCategory = async (categoryId: string, updates: Partial<Category>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Atualizando categoria:', categoryId, updates);

  try {
    await firestoreService.updateDocument('categories', categoryId, {
      ...updates,
      userId: user.uid
    });
    console.log('Categoria atualizada com sucesso:', categoryId);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

// Remover categoria
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
      // Só permitir remoção de categorias personalizadas
      if (category.isCustom) {
        await firestoreService.deleteDocument('categories', category.id);
        console.log('Categoria personalizada removida do Firestore:', category.id);
      }
    }
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    throw error;
  }
};

// Função auxiliar para converter categorias para formato de string (compatibilidade)
export const getCategoryNames = (categories: Category[]): string[] => {
  return categories.map(cat => cat.name);
};
