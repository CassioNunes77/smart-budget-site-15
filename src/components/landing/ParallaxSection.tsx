
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  disabled?: boolean;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.5,
  disabled = false
}) => {
  const [offset, setOffset] = useState(0);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!parallaxRef.current) return;
      
      const rect = parallaxRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, disabled]);

  return (
    <div
      ref={parallaxRef}
      className={cn('relative overflow-hidden', className)}
      style={{
        transform: disabled ? 'none' : `translateY(${offset}px)`
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxSection;
