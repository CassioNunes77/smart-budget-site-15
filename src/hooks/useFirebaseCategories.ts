
import { useState, useEffect } from 'react';
import { 
  getUserCategories,
  addCategory as addCategoryService,
  removeCategory as removeCategoryService,
  updateCategory as updateCategoryService,
  Category
} from '@/services/categoryService';
import { useFirebaseAuth } from './useFirebaseAuth';

export const useFirebaseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useFirebaseAuth();

  const loadCategories = async () => {
    if (!user) {
      console.log('Usuário não autenticado, carregando categorias padrão');
      setLoading(true);
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Carregando categorias do Firestore');
      const data = await getUserCategories();
      console.log('Categorias carregadas:', data);
      setCategories(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Erro ao carregar categorias');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [user]);

  const addCategory = async (categoryName: string, icon?: string, color?: string) => {
    try {
      console.log('Adicionando categoria:', categoryName, icon, color);
      await addCategoryService(categoryName, icon, color);
      await loadCategories();
      console.log('Categoria adicionada e lista recarregada');
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      throw err;
    }
  };

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    try {
      console.log('Atualizando categoria:', categoryId, updates);
      await updateCategoryService(categoryId, updates);
      await loadCategories();
      console.log('Categoria atualizada e lista recarregada');
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      throw err;
    }
  };

  const removeCategory = async (categoryName: string) => {
    try {
      console.log('Removendo categoria:', categoryName);
      await removeCategoryService(categoryName);
      await loadCategories();
      console.log('Categoria removida e lista recarregada');
    } catch (err) {
      console.error('Erro ao remover categoria:', err);
      throw err;
    }
  };

  // Retornar apenas os nomes para compatibilidade com código existente
  const categoryNames = categories.map(cat => cat.name);

  return {
    categories: categoryNames,
    categoriesWithDetails: categories,
    loading,
    error,
    addCategory,
    updateCategory,
    removeCategory,
    reloadCategories: loadCategories
  };
};
