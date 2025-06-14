
import firestoreService from './firestoreService';
import { auth } from './firebase';
import { DEFAULT_CATEGORIES } from '@/components/CategoryIcon';

export interface Category {
  id: string;
  name: string;
  userId: string;
}

// Buscar categorias do usuário
export const getUserCategories = async (): Promise<string[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('Usuário não autenticado, retornando categorias padrão');
    return DEFAULT_CATEGORIES.map(cat => cat.name);
  }

  try {
    const categories = await firestoreService.listDocuments(
      'categories', 
      [['userId', '==', user.uid]],
      'name',
      'asc'
    );
    
    const categoryNames = categories.map(cat => cat.name);
    
    // Se não há categorias no Firestore, criar as categorias padrão
    if (categoryNames.length === 0) {
      const defaultCategoryNames = DEFAULT_CATEGORIES.map(cat => cat.name);
      await saveUserCategories(defaultCategoryNames);
      return defaultCategoryNames;
    }
    
    console.log(`${categoryNames.length} categorias encontradas`);
    return categoryNames;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return DEFAULT_CATEGORIES.map(cat => cat.name);
  }
};

// Salvar categorias do usuário
export const saveUserCategories = async (categories: string[]): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Salvando categorias:', categories);

  try {
    // Primeiro, buscar categorias existentes para identificar quais remover
    const existingCategories = await firestoreService.listDocuments(
      'categories',
      [['userId', '==', user.uid]]
    );

    // Remover categorias que não estão mais na lista
    for (const existingCategory of existingCategories) {
      if (!categories.includes(existingCategory.name)) {
        await firestoreService.deleteDocument('categories', existingCategory.id);
      }
    }

    // Adicionar ou manter categorias
    for (const categoryName of categories) {
      const existingCategory = existingCategories.find(cat => cat.name === categoryName);
      
      if (!existingCategory) {
        // Criar nova categoria
        await firestoreService.saveDocument('categories', {
          name: categoryName,
          userId: user.uid
        });
      }
    }
  } catch (error) {
    console.error('Erro ao salvar categorias:', error);
    throw error;
  }
};

// Adicionar nova categoria
export const addCategory = async (categoryName: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Adicionando categoria:', categoryName);

  await firestoreService.saveDocument('categories', {
    name: categoryName,
    userId: user.uid
  });
};

// Remover categoria
export const removeCategory = async (categoryName: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  console.log('Removendo categoria:', categoryName);

  const categories = await firestoreService.listDocuments(
    'categories',
    [['userId', '==', user.uid], ['name', '==', categoryName]]
  );

  for (const category of categories) {
    await firestoreService.deleteDocument('categories', category.id);
  }
};
