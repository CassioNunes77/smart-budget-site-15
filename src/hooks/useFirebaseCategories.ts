
import { useState, useEffect } from 'react';
import { 
  getUserCategories,
  addCategory as addCategoryService,
  removeCategory as removeCategoryService,
  updateCategory as updateCategoryService,
  getCategoryNames,
  Category
} from '@/services/categoryService';
import { useFirebaseAuth } from './useFirebaseAuth';

export const useFirebaseCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
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
        
        setCategoriesData(data);
        setCategories(getCategoryNames(data));
        
        console.log(`${data.length} categorias carregadas com sucesso`);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
        setCategoriesData([]);
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
      setCategoriesData(data);
      setCategories(getCategoryNames(data));
    } catch (err) {
      console.error('Erro ao recarregar categorias:', err);
    }
  };

  // Adicionar categoria com ícone e cor
  const addCategory = async (categoryName: string, icon: string = 'Tag', color: string = '#64748b') => {
    try {
      console.log('Adicionando categoria:', { categoryName, icon, color });
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

  // Obter dados completos de uma categoria pelo nome
  const getCategoryData = (categoryName: string): Category | undefined => {
    return categoriesData.find(cat => cat.name === categoryName);
  };

  return {
    categories,
    categoriesData,
    loading,
    error,
    addCategory,
    updateCategory,
    removeCategory,
    getCategoryData,
    reloadCategories
  };
};
