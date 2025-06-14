
import { useState, useEffect } from 'react';
import { 
  getUserCategories,
  saveUserCategories,
  addCategory as addCategoryService,
  removeCategory as removeCategoryService
} from '@/services/categoryService';
import { useFirebaseAuth } from './useFirebaseAuth';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
}

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
        console.log('Carregando categorias do Firestore...');
        const data = await getUserCategories();
        setCategories(data);
        console.log(`${data.length} categorias carregadas`);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
        // Fallback para categorias padrão
        const defaultCategories: Category[] = [
          { id: 'default-1', name: 'Sem categoria', icon: 'Tag', color: '#64748b', isDefault: true },
          { id: 'default-2', name: 'Salário', icon: 'DollarSign', color: '#10b981', isDefault: true },
          { id: 'default-3', name: 'Serviços', icon: 'Briefcase', color: '#3b82f6', isDefault: true },
          { id: 'default-4', name: 'Empréstimos', icon: 'CreditCard', color: '#f59e0b', isDefault: true },
          { id: 'default-5', name: 'Casa', icon: 'Home', color: '#8b5cf6', isDefault: true },
          { id: 'default-6', name: 'Alimentação', icon: 'Utensils', color: '#ef4444', isDefault: true },
          { id: 'default-7', name: 'Transporte', icon: 'Car', color: '#06b6d4', isDefault: true },
          { id: 'default-8', name: 'Saúde', icon: 'Heart', color: '#ec4899', isDefault: true },
          { id: 'default-9', name: 'Lazer', icon: 'Gamepad2', color: '#84cc16', isDefault: true },
          { id: 'default-10', name: 'Outros', icon: 'Tag', color: '#6b7280', isDefault: true }
        ];
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user]);

  // Salvar todas as categorias
  const updateCategories = async (newCategories: Category[]) => {
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
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      console.log('Adicionando categoria:', categoryData);
      const newId = await addCategoryService(categoryData);
      const newCategory = { ...categoryData, id: newId };
      setCategories(prev => [...prev, newCategory]);
      return newId;
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      throw err;
    }
  };

  // Remover categoria
  const removeCategory = async (categoryId: string) => {
    try {
      console.log('Removendo categoria:', categoryId);
      await removeCategoryService(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
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
