
import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label,
  color = 'bg-green-500' 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{label}</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-2000 ease-out rounded-full relative`}
          style={{ width: `${animatedProgress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
