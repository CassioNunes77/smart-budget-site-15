import { useState, useEffect } from 'react';
import { 
  getUserCategories,
  saveUserCategories,
  addCategory as addCategoryService,
  removeCategory as removeCategoryService
} from '@/services/categoryService';
import { useFirebaseAuth } from './useFirebaseAuth';
import { DEFAULT_CATEGORIES } from '@/components/CategoryIcon';

export const useFirebaseCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useFirebaseAuth();

  // Carregar categorias quando o usuário estiver autenticado
  useEffect(() => {
    const loadCategories = async () => {
      if (!user) {
        console.log('Usuário não autenticado, usando categorias padrão');
        const defaultCategoryNames = DEFAULT_CATEGORIES.map(cat => cat.name);
        setCategories(defaultCategoryNames);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Carregando categorias do Firestore para usuário:', user.uid);
        const data = await getUserCategories();
        console.log('Categorias carregadas do Firebase:', data);
        setCategories(data);
        console.log(`${data.length} categorias carregadas com sucesso`);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
        // Fallback para categorias padrão em caso de erro
        const defaultCategoryNames = DEFAULT_CATEGORIES.map(cat => cat.name);
        setCategories(defaultCategoryNames);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user]);

  // Recarregar categorias
  const reloadCategories = async () => {
    if (!user) return;
    
    try {
      const data = await getUserCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao recarregar categorias:', err);
    }
  };

  // Salvar todas as categorias
  const updateCategories = async (newCategories: string[]) => {
    try {
      console.log('Atualizando categorias:', newCategories);
      await saveUserCategories(newCategories);
      setCategories(newCategories);
    } catch (err) {
      console.error('Erro ao atualizar categorias:', err);
      throw err;
    }
  };

  // Adicionar categoria
  const addCategory = async (categoryName: string) => {
    try {
      console.log('Adicionando categoria:', categoryName);
      await addCategoryService(categoryName);
      await reloadCategories(); // Recarregar após adicionar
      console.log('Categoria adicionada e lista recarregada');
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      throw err;
    }
  };

  // Remover categoria
  const removeCategory = async (categoryName: string) => {
    try {
      console.log('Removendo categoria:', categoryName);
      await removeCategoryService(categoryName);
      await reloadCategories(); // Recarregar após remover
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
    updateCategories,
    addCategory,
    removeCategory
  };
};
