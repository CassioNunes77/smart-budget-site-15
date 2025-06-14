
import { useState, useEffect } from 'react';
import { 
  getUserCategories, 
  updateUserCategories, 
  addUserCategory,
  deleteUserCategory,
  Category
} from '@/services/categoryService';
import { useFirebaseAuth } from './useFirebaseAuth';

export const useFirebaseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useFirebaseAuth();

  useEffect(() => {
    const loadCategories = async () => {
      console.log('Carregando categorias do Firestore...');
      
      if (!user) {
        console.log('Usuário não autenticado, retornando categorias padrão');
        const defaultCategories = await getUserCategories();
        setCategories(defaultCategories);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Buscando categorias para usuário:', user.uid);
        const data = await getUserCategories();
        console.log(`${data.length} categorias carregadas`);
        setCategories(data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user?.uid]);

  const updateCategories = async (newCategories: Category[]) => {
    try {
      await updateUserCategories(newCategories);
      setCategories(newCategories);
    } catch (err) {
      console.error('Erro ao atualizar categorias:', err);
      throw err;
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'userId'>) => {
    try {
      const newId = await addUserCategory(category);
      const newCategory = { ...category, id: newId, userId: user?.uid || '' };
      setCategories(prev => [...prev, newCategory]);
      return newId;
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteUserCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      console.error('Erro ao deletar categoria:', err);
      throw err;
    }
  };

  const refreshCategories = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao recarregar categorias:', err);
      setError('Erro ao recarregar categorias');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    updateCategories,
    addCategory,
    deleteCategory,
    refreshCategories
  };
};
