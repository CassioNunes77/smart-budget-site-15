
import React, { useState } from 'react';
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
  Trees
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryManagerProps {
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
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
  { name: 'Trees', icon: Trees }
];

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#64748b', '#6b7280', '#374151', '#111827'
];

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onUpdateCategories, onCategoryDeleted }) => {
  // Filtrar "Sem categoria" da lista para não exibir na tela
  const editableCategories = categories.filter(cat => cat !== 'Sem categoria');
  
  const [categoryList, setCategoryList] = useState<Category[]>(
    editableCategories.map((cat, index) => ({
      id: `cat-${index}`,
      name: cat,
      icon: 'Tag',
      color: colorOptions[index % colorOptions.length]
    }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Tag');
  const [newCategoryColor, setNewCategoryColor] = useState(colorOptions[0]);
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleSaveCategory = (category: Category) => {
    const updatedCategories = categoryList.map(cat => 
      cat.id === category.id ? category : cat
    );
    
    setCategoryList(updatedCategories);
    
    // Reconstruir a lista completa de categorias, mantendo "Sem categoria"
    const allCategories = ['Sem categoria', ...updatedCategories.map(cat => cat.name)];
    onUpdateCategories(allCategories);
    
    setEditingId(null);
    toast({
      title: "Categoria atualizada!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categoryList.find(cat => cat.id === id);
    if (!categoryToDelete) return;

    // Notificar que a categoria foi deletada para atualizar transações
    if (onCategoryDeleted) {
      onCategoryDeleted(categoryToDelete.name);
    }
    
    const updatedCategories = categoryList.filter(cat => cat.id !== id);
    setCategoryList(updatedCategories);
    
    // Reconstruir a lista completa de categorias, mantendo "Sem categoria"
    const allCategories = ['Sem categoria', ...updatedCategories.map(cat => cat.name)];
    onUpdateCategories(allCategories);
    
    toast({
      title: "Categoria removida",
      description: "A categoria foi excluída e todas as transações foram movidas para 'Sem categoria'.",
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        icon: newCategoryIcon,
        color: newCategoryColor
      };
      
      const updatedCategories = [...categoryList, newCategory];
      setCategoryList(updatedCategories);
      
      // Reconstruir a lista completa de categorias, mantendo "Sem categoria"
      const allCategories = ['Sem categoria', ...updatedCategories.map(cat => cat.name)];
      onUpdateCategories(allCategories);
      
      setNewCategoryName('');
      setNewCategoryIcon('Tag');
      setNewCategoryColor(colorOptions[0]);
      setShowNewCategory(false);
      
      toast({
        title: "Categoria adicionada!",
        description: "Nova categoria criada com sucesso.",
      });
    }
  };

  const getIcon = (iconName: string) => {
    const iconData = iconOptions.find(opt => opt.name === iconName);
    return iconData ? iconData.icon : Tag;
  };

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
                        <span className="font-medium text-foreground">{category.name}</span>
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
                            if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
                              handleDeleteCategory(category.id);
                            }
                          }}
                          className="text-destructive hover:text-destructive/80"
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
