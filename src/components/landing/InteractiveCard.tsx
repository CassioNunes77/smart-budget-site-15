
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InteractiveCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  glowColor?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  icon: Icon,
  title,
  description,
  className = '',
  glowColor = 'blue'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'group relative p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20',
        'transition-all duration-500 ease-out cursor-pointer',
        'hover:scale-105 hover:bg-white/15 hover:border-white/30',
        'hover:shadow-2xl hover:-translate-y-2',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? `0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)`
          : 'none'
      }}
    >
      {/* Glow effect */}
      <div 
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500',
          'bg-gradient-to-r from-blue-400/20 to-purple-400/20',
          isHovered && 'opacity-100'
        )}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={cn(
          'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4',
          'bg-gradient-to-br from-blue-500 to-purple-600',
          'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3'
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className={cn(
          'text-lg font-bold text-white mb-2',
          'transition-colors duration-300 group-hover:text-blue-200'
        )}>
          {title}
        </h3>
        
        <p className="text-blue-100/80 text-sm leading-relaxed group-hover:text-blue-100 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Corner accent */}
      <div className={cn(
        'absolute top-0 right-0 w-20 h-20 opacity-0 transition-opacity duration-500',
        'bg-gradient-to-bl from-white/10 to-transparent rounded-2xl',
        isHovered && 'opacity-100'
      )} />
    </div>
  );
};

export default InteractiveCard;
