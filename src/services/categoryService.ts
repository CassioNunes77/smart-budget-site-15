
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
      color: cat.color
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
      
      // Recarregar após criar as categorias padrão
      const newCategories = await firestoreService.listDocuments(
        'categories', 
        [['userId', '==', user.uid]]
      );
      return newCategories;
    }
    
    // Verificar se todas as categorias base estão presentes
    const categoryNames = categories.map(cat => cat.name);
    const defaultCategoryNames = DEFAULT_CATEGORIES.map(cat => cat.name);
    const missingCategories = defaultCategoryNames.filter(name => !categoryNames.includes(name));
    
    // Se faltam categorias base, adicionar as que estão faltando
    if (missingCategories.length > 0) {
      console.log('Categorias base faltando, adicionando:', missingCategories);
      for (const categoryName of missingCategories) {
        const defaultCategory = DEFAULT_CATEGORIES.find(cat => cat.name === categoryName);
        if (defaultCategory) {
          await firestoreService.saveDocument('categories', {
            name: categoryName,
            userId: user.uid,
            icon: defaultCategory.icon.name,
            color: defaultCategory.color
          });
        }
      }
      // Recarregar categorias após adicionar as faltantes
      const updatedCategories = await firestoreService.listDocuments(
        'categories', 
        [['userId', '==', user.uid]]
      );
      return updatedCategories;
    }
    
    console.log(`${categories.length} categorias processadas`);
    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    // Em caso de erro, retornar categorias padrão
    return DEFAULT_CATEGORIES.map((cat, index) => ({
      id: `default-${index}`,
      name: cat.name,
      userId: '',
      icon: cat.icon.name,
      color: cat.color
    }));
  }
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
        icon: defaultCategory.icon.name,
        color: defaultCategory.color
      });
      console.log('Categoria base criada:', defaultCategory.name);
    }
  } catch (error) {
    console.error('Erro ao inicializar categorias padrão:', error);
    throw error;
  }
};

// Adicionar nova categoria
export const addCategory = async (categoryName: string, icon?: string, color?: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Adicionando categoria:', categoryName);

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

// Atualizar categoria existente
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
      await firestoreService.deleteDocument('categories', category.id);
      console.log('Categoria removida do Firestore:', category.id);
    }
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    throw error;
  }
};
