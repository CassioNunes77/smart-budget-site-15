
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

  // Carregar categorias quando o usuário estiver autenticado
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Carregando categorias...');
        const data = await getUserCategories();
        console.log('Categorias carregadas:', data);
        setCategories(data);
        console.log(`${data.length} categorias carregadas com sucesso`);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user]);

  // Recarregar categorias
  const reloadCategories = async () => {
    try {
      const data = await getUserCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao recarregar categorias:', err);
    }
  };

  // Adicionar categoria
  const addCategory = async (categoryName: string, icon?: string, color?: string) => {
    try {
      console.log('Adicionando categoria:', categoryName);
      await addCategoryService(categoryName, icon, color);
      await reloadCategories();
      console.log('Categoria adicionada e lista recarregada');
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      throw err;
    }
  };

  // Atualizar categoria
  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    try {
      console.log('Atualizando categoria:', categoryId, updates);
      await updateCategoryService(categoryId, updates);
      await reloadCategories();
      console.log('Categoria atualizada e lista recarregada');
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      throw err;
    }
  };

  // Remover categoria
  const removeCategory = async (categoryName: string) => {
    try {
      console.log('Removendo categoria:', categoryName);
      await removeCategoryService(categoryName);
      await reloadCategories();
      console.log('Categoria removida e lista recarregada');
    } catch (err) {
      console.error('Erro ao remover categoria:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    removeCategory
  };
};
