
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Tag,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Palette,
  DollarSign,
  Home,
  Car,
  ShoppingCart,
  Utensils,
  Gamepad2,
  Plane,
  GraduationCap,
  Heart,
  Shirt,
  Monitor,
  Coffee,
  Gift,
  PiggyBank,
  Briefcase,
  CreditCard,
  TrendingUp,
  Building,
  MapPin,
  Music,
  Book,
  Camera,
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Tv,
  Fuel,
  Bus,
  Train,
  Bike,
  Wallet,
  Receipt,
  Calculator,
  Calendar,
  FileText,
  Target,
  Award,
  Star,
  Crown,
  Zap,
  Leaf,
  Sun,
  Moon,
  Cloud,
  Droplets,
  Wind,
  Flame,
  Mountain,
  Trees,
  MoreHorizontal
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFirebaseCategories } from '@/hooks/useFirebaseCategories';
import { DEFAULT_CATEGORIES } from '@/components/CategoryIcon';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isBase?: boolean;
}

interface CategoryManagerProps {
  onCategoryDeleted?: (deletedCategory: string) => void;
}

const iconOptions = [
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Home', icon: Home },
  { name: 'Car', icon: Car },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Utensils', icon: Utensils },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Plane', icon: Plane },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Heart', icon: Heart },
  { name: 'Shirt', icon: Shirt },
  { name: 'Monitor', icon: Monitor },
  { name: 'Coffee', icon: Coffee },
  { name: 'Gift', icon: Gift },
  { name: 'PiggyBank', icon: PiggyBank },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Building', icon: Building },
  { name: 'MapPin', icon: MapPin },
  { name: 'Music', icon: Music },
  { name: 'Book', icon: Book },
  { name: 'Camera', icon: Camera },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Headphones', icon: Headphones },
  { name: 'Watch', icon: Watch },
  { name: 'Laptop', icon: Laptop },
  { name: 'Tv', icon: Tv },
  { name: 'Fuel', icon: Fuel },
  { name: 'Bus', icon: Bus },
  { name: 'Train', icon: Train },
  { name: 'Bike', icon: Bike },
  { name: 'Wallet', icon: Wallet },
  { name: 'Receipt', icon: Receipt },
  { name: 'Calculator', icon: Calculator },
  { name: 'Calendar', icon: Calendar },
  { name: 'FileText', icon: FileText },
  { name: 'Target', icon: Target },
  { name: 'Award', icon: Award },
  { name: 'Star', icon: Star },
  { name: 'Crown', icon: Crown },
  { name: 'Zap', icon: Zap },
  { name: 'Leaf', icon: Leaf },
  { name: 'Sun', icon: Sun },
  { name: 'Moon', icon: Moon },
  { name: 'Cloud', icon: Cloud },
  { name: 'Droplets', icon: Droplets },
  { name: 'Wind', icon: Wind },
  { name: 'Flame', icon: Flame },
  { name: 'Mountain', icon: Mountain },
  { name: 'Trees', icon: Trees },
  { name: 'MoreHorizontal', icon: MoreHorizontal },
  { name: 'Tag', icon: Tag }
];

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#64748b', '#6b7280', '#374151', '#111827'
];

// Mapear categorias padrão para formato Category
const getDefaultCategoryFormat = (defaultCategory: any, index: number): Category => {
  const iconName = iconOptions.find(opt => opt.icon === defaultCategory.icon)?.name || 'Tag';
  return {
    id: `default-${index}`,
    name: defaultCategory.name,
    icon: iconName,
    color: colorOptions[index % colorOptions.length],
    isBase: true
  };
};

const CategoryManager: React.FC<CategoryManagerProps> = ({ onCategoryDeleted }) => {
  const { categories: firebaseCategories, loading, addCategory, removeCategory, updateCategories } = useFirebaseCategories();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Tag');
  const [newCategoryColor, setNewCategoryColor] = useState(colorOptions[0]);
  const [showNewCategory, setShowNewCategory] = useState(false);

  // Carregar e formatar categorias
  useEffect(() => {
    if (!loading && firebaseCategories.length > 0) {
      console.log('Categorias do Firebase:', firebaseCategories);
      
      // Converter categorias do Firebase para formato Category
      const formattedCategories: Category[] = firebaseCategories
        .filter(cat => cat !== 'Sem categoria') // Excluir "Sem categoria" da exibição
        .map((categoryName, index) => {
          // Verificar se é uma categoria base
          const defaultCategory = DEFAULT_CATEGORIES.find(def => def.name === categoryName);
          
          if (defaultCategory) {
            return getDefaultCategoryFormat(defaultCategory, index);
          } else {
            // Categoria personalizada
            return {
              id: `custom-${index}`,
              name: categoryName,
              icon: 'Tag',
              color: colorOptions[index % colorOptions.length],
              isBase: false
            };
          }
        });
      
      setCategoryList(formattedCategories);
    }
  }, [firebaseCategories, loading]);

  const handleSaveCategory = async (category: Category) => {
    try {
      // Se é categoria base, apenas atualizar localmente (personalização do usuário)
      if (category.isBase) {
        const updatedCategories = categoryList.map(cat => 
          cat.id === category.id ? category : cat
        );
        setCategoryList(updatedCategories);
        
        toast({
          title: "Categoria personalizada!",
          description: "Sua personalização da categoria base foi salva.",
        });
      } else {
        // Categoria personalizada - atualizar no Firebase
        const updatedCategoryNames = categoryList.map(cat => 
          cat.id === category.id ? category.name : cat.name
        );
        await updateCategories(['Sem categoria', ...updatedCategoryNames]);
        
        toast({
          title: "Categoria atualizada!",
          description: "As alterações foram salvas com sucesso.",
        });
      }
      
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a categoria.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const categoryToDelete = categoryList.find(cat => cat.id === id);
      if (!categoryToDelete) return;

      // Categorias base não podem ser deletadas, apenas resetadas
      if (categoryToDelete.isBase) {
        toast({
          title: "Categoria base",
          description: "Categorias base não podem ser excluídas. Use a edição para personalizar.",
          variant: "destructive"
        });
        return;
      }

      if (onCategoryDeleted) {
        onCategoryDeleted(categoryToDelete.name);
      }
      
      await removeCategory(categoryToDelete.name);
      
      toast({
        title: "Categoria removida",
        description: "A categoria foi excluída e todas as transações foram movidas para 'Sem categoria'.",
      });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await addCategory(newCategoryName.trim());
        
        setNewCategoryName('');
        setNewCategoryIcon('Tag');
        setNewCategoryColor(colorOptions[0]);
        setShowNewCategory(false);
        
        toast({
          title: "Categoria adicionada!",
          description: "Nova categoria criada com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a categoria.",
          variant: "destructive"
        });
      }
    }
  };

  const getIcon = (iconName: string) => {
    const iconData = iconOptions.find(opt => opt.name === iconName);
    return iconData ? iconData.icon : Tag;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8 text-muted-foreground">
          <p>Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Categorias</h1>
          <p className="text-muted-foreground mt-1">Personalize suas categorias de transações</p>
        </div>
        <Button 
          onClick={() => setShowNewCategory(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Nova Categoria */}
      {showNewCategory && (
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle>Adicionar Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Categoria</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Digite o nome da categoria"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="grid grid-cols-8 md:grid-cols-12 gap-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Button
                      key={option.name}
                      variant={newCategoryIcon === option.name ? 'default' : 'outline'}
                      size="sm"
                      className="p-2 h-10 w-10"
                      onClick={() => setNewCategoryIcon(option.name)}
                    >
                      <IconComponent className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="sm"
                    className={`w-8 h-8 p-0 border-2 ${newCategoryColor === color ? 'border-foreground' : 'border-border'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategoryColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddCategory}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setShowNewCategory(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryList.map((category) => {
          const IconComponent = getIcon(category.icon);
          const isEditing = editingId === category.id;
          
          return (
            <Card key={category.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {isEditing ? (
                  <CategoryEditForm
                    category={category}
                    onSave={handleSaveCategory}
                    onCancel={() => setEditingId(null)}
                    iconOptions={iconOptions}
                    colorOptions={colorOptions}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{category.name}</span>
                          {category.isBase && (
                            <span className="text-xs text-muted-foreground">Categoria base</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(category.id)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (category.isBase) {
                              toast({
                                title: "Categoria base",
                                description: "Categorias base não podem ser excluídas.",
                                variant: "destructive"
                              });
                              return;
                            }
                            if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
                              handleDeleteCategory(category.id);
                            }
                          }}
                          className="text-destructive hover:text-destructive/80"
                          disabled={category.isBase}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {categoryList.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma categoria encontrada. Adicione sua primeira categoria personalizada!</p>
        </div>
      )}
    </div>
  );
};

interface CategoryEditFormProps {
  category: Category;
  onSave: (category: Category) => void;
  onCancel: () => void;
  iconOptions: Array<{ name: string; icon: any }>;
  colorOptions: string[];
}

const CategoryEditForm: React.FC<CategoryEditFormProps> = ({
  category,
  onSave,
  onCancel,
  iconOptions,
  colorOptions
}) => {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const [color, setColor] = useState(category.color);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ ...category, name: name.trim(), icon, color });
    }
  };

  return (
    <div className="space-y-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome da categoria"
        disabled={category.isBase}
      />
      
      <div className="grid grid-cols-6 gap-1 max-h-20 overflow-y-auto">
        {iconOptions.slice(0, 12).map((option) => {
          const IconComponent = option.icon;
          return (
            <Button
              key={option.name}
              variant={icon === option.name ? 'default' : 'outline'}
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => setIcon(option.name)}
            >
              <IconComponent className="w-3 h-3" />
            </Button>
          );
        })}
      </div>

      <div className="flex gap-1 flex-wrap">
        {colorOptions.slice(0, 8).map((colorOption) => (
          <Button
            key={colorOption}
            variant="outline"
            size="sm"
            className={`w-6 h-6 p-0 border ${color === colorOption ? 'border-foreground' : 'border-border'}`}
            style={{ backgroundColor: colorOption }}
            onClick={() => setColor(colorOption)}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          <Save className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default CategoryManager;
