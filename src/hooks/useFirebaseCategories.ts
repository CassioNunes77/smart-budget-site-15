
import { useState, useEffect } from 'react';
import { 
  getUserCategories,
  saveUserCategories,
  addCategory as addCategoryService,
  removeCategory as removeCategoryService
} from '@/services/categoryService';
import { useFirebaseAuth } from './useFirebaseAuth';

export const useFirebaseCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useFirebaseAuth();

  // Carregar categorias quando o usuário estiver autenticado
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Carregando categorias do Firestore...');
        const data = await getUserCategories();
        setCategories(data);
        console.log(`${data.length} categorias carregadas`);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
        // Fallback para categorias padrão
        setCategories([
          'Sem categoria',
          'Alimentação',
          'Transporte',
          'Moradia',
          'Saúde',
          'Educação',
          'Lazer',
          'Outros'
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user]);

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
      setCategories(prev => [...prev, categoryName]);
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
      setCategories(prev => prev.filter(cat => cat !== categoryName));
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
