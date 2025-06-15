
import { useState, useEffect } from 'react';
import { 
  getUserCategories,
  addCategory as addCategoryService,
  removeCategory as removeCategoryService,
  updateCategory as updateCategoryService,
  Category
} from '@/services/categoryService';
import { useFirebaseAuth } from './useFirebaseAuth';
import { DEFAULT_CATEGORIES } from '@/components/CategoryIcon';

export const useFirebaseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useFirebaseAuth();

  // Carregar categorias quando o usuário estiver autenticado
  useEffect(() => {
    const loadCategories = async () => {
      if (!user) {
        console.log('Usuário não autenticado, usando categorias padrão');
        const defaultCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
          id: `default-${index}`,
          name: cat.name,
          userId: '',
          icon: cat.icon.name,
          color: cat.color,
          isBase: true
        }));
        setCategories(defaultCategories);
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
        const defaultCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
          id: `default-${index}`,
          name: cat.name,
          userId: '',
          icon: cat.icon.name,
          color: cat.color,
          isBase: true
        }));
        setCategories(defaultCategories);
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

  // Adicionar categoria
  const addCategory = async (categoryName: string, icon?: string, color?: string) => {
    try {
      console.log('Adicionando categoria:', categoryName, 'ícone:', icon, 'cor:', color);
      await addCategoryService(categoryName, icon, color);
      await reloadCategories(); // Recarregar após adicionar
      console.log('Categoria adicionada e lista recarregada');
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      throw err;
    }
  };

  // Atualizar categoria
  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    try {
      console.log('Atualizando categoria:', categoryId, 'com:', updates);
      await updateCategoryService(categoryId, updates);
      await reloadCategories(); // Recarregar após atualizar
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
    addCategory,
    updateCategory,
    removeCategory
  };
};
