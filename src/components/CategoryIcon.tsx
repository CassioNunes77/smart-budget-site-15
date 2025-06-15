
import React from 'react';
import { 
  Tag, 
  DollarSign, 
  Briefcase, 
  CreditCard, 
  Home, 
  Utensils, 
  Car, 
  Heart, 
  Gamepad2, 
  MoreHorizontal 
} from 'lucide-react';

export interface CategoryConfig {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  hidden?: boolean;
}

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { name: 'Sem categoria', icon: Tag, color: 'text-slate-600', hidden: true },
  { name: 'Salário', icon: DollarSign, color: 'text-emerald-600' },
  { name: 'Serviços', icon: Briefcase, color: 'text-blue-600' },
  { name: 'Empréstimos', icon: CreditCard, color: 'text-orange-600' },
  { name: 'Casa', icon: Home, color: 'text-purple-600' },
  { name: 'Alimentação', icon: Utensils, color: 'text-red-600' },
  { name: 'Transporte', icon: Car, color: 'text-indigo-600' },
  { name: 'Saúde', icon: Heart, color: 'text-pink-600' },
  { name: 'Lazer', icon: Gamepad2, color: 'text-yellow-600' },
  { name: 'Outros', icon: MoreHorizontal, color: 'text-gray-600' }
];

// Mapeamento de nomes de ícones para componentes
export const ICON_MAP: { [key: string]: React.ComponentType<any> } = {
  'Tag': Tag,
  'DollarSign': DollarSign,
  'Briefcase': Briefcase,
  'CreditCard': CreditCard,
  'Home': Home,
  'Utensils': Utensils,
  'Car': Car,
  'Heart': Heart,
  'Gamepad2': Gamepad2,
  'MoreHorizontal': MoreHorizontal
};

interface CategoryIconProps {
  categoryName?: string;
  iconName?: string;
  color?: string;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  categoryName, 
  iconName, 
  color, 
  className = "w-4 h-4" 
}) => {
  // Se temos iconName, usamos ele diretamente
  if (iconName && ICON_MAP[iconName]) {
    const IconComponent = ICON_MAP[iconName];
    return <IconComponent className={`${className} ${color || 'text-slate-600'}`} />;
  }

  // Caso contrário, procuramos pela categoria padrão
  const categoryConfig = DEFAULT_CATEGORIES.find(cat => cat.name === categoryName);
  
  if (categoryConfig) {
    const IconComponent = categoryConfig.icon;
    return <IconComponent className={`${className} ${color || categoryConfig.color}`} />;
  }
  
  // Fallback para ícone padrão
  return <Tag className={`${className} ${color || 'text-slate-600'}`} />;
};

export const getCategoryColor = (categoryName: string): string => {
  const categoryConfig = DEFAULT_CATEGORIES.find(cat => cat.name === categoryName);
  return categoryConfig?.color || 'text-slate-600';
};

export const getCategoryBadgeColor = (categoryName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Sem categoria': 'bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-300',
    'Salário': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Serviços': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Empréstimos': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'Casa': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Alimentação': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Transporte': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'Saúde': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'Lazer': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Outros': 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
  };
  
  return colorMap[categoryName] || 'bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-300';
};

export const getCategoryChartColor = (categoryName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Sem categoria': '#64748b',
    'Salário': '#059669',
    'Serviços': '#2563eb',
    'Empréstimos': '#ea580c',
    'Casa': '#9333ea',
    'Alimentação': '#dc2626',
    'Transporte': '#4f46e5',
    'Saúde': '#ec4899',
    'Lazer': '#ca8a04',
    'Outros': '#6b7280'
  };
  
  return colorMap[categoryName] || '#64748b';
};

export default CategoryIcon;
