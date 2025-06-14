
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
  ShoppingCart,
  Plane,
  GraduationCap,
  Shirt,
  Monitor,
  Coffee,
  Gift,
  PiggyBank,
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

const iconMap = {
  Tag,
  DollarSign,
  Briefcase,
  CreditCard,
  Home,
  Utensils,
  Car,
  Heart,
  Gamepad2,
  ShoppingCart,
  Plane,
  GraduationCap,
  Shirt,
  Monitor,
  Coffee,
  Gift,
  PiggyBank,
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
};

interface CategoryIconProps {
  iconName: string;
  className?: string;
  color?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = "w-4 h-4", color }) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Tag;
  
  return (
    <IconComponent 
      className={className} 
      style={color ? { color } : undefined}
    />
  );
};

export default CategoryIcon;
