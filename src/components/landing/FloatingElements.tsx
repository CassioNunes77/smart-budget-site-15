
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingElementsProps {
  className?: string;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const elements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    opacity: Math.random() * 0.3 + 0.1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"
          style={{
            width: element.size,
            height: element.size,
            opacity: element.opacity,
            left: `${(element.id * 15 + 10)}%`,
            top: `${(element.id * 20 + 20)}%`,
            transform: `translate(${mousePosition.x * 0.01 * (element.id + 1)}px, ${mousePosition.y * 0.01 * (element.id + 1)}px)`,
            animation: `float ${element.duration}s ease-in-out infinite ${element.delay}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;
