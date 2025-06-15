
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 600
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransformClasses = () => {
    const baseClasses = `transition-all duration-${duration} ease-out`;
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${baseClasses} translate-y-8 opacity-0`;
        case 'down':
          return `${baseClasses} -translate-y-8 opacity-0`;
        case 'left':
          return `${baseClasses} translate-x-8 opacity-0`;
        case 'right':
          return `${baseClasses} -translate-x-8 opacity-0`;
        case 'fade':
          return `${baseClasses} opacity-0`;
        default:
          return `${baseClasses} translate-y-8 opacity-0`;
      }
    }
    
    return `${baseClasses} translate-y-0 translate-x-0 opacity-100`;
  };

  return (
    <div
      ref={elementRef}
      className={cn(getTransformClasses(), className)}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
