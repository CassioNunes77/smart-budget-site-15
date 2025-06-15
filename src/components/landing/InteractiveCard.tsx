
import React, { useState } from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: boolean;
  glowEffect?: boolean;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ 
  children, 
  className = '',
  hoverScale = true,
  glowEffect = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative transition-all duration-500 ease-out cursor-pointer
        ${hoverScale ? 'hover:scale-105' : ''}
        ${glowEffect && isHovered ? 'shadow-2xl shadow-green-500/20' : 'shadow-lg'}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {glowEffect && isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-lg blur-xl -z-10" />
      )}
      {children}
    </div>
  );
};

export default InteractiveCard;
