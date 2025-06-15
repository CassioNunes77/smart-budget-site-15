
import React from 'react';
import { TreePine, DollarSign, TrendingUp, Shield } from 'lucide-react';

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 animate-bounce delay-1000">
        <TreePine className="w-8 h-8 text-green-300/30" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse delay-2000">
        <DollarSign className="w-6 h-6 text-green-400/40" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce delay-3000">
        <TrendingUp className="w-7 h-7 text-green-500/30" />
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse delay-4000">
        <Shield className="w-5 h-5 text-green-300/40" />
      </div>
      
      {/* Círculos flutuantes */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400/20 rounded-full animate-ping delay-1000" />
      <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-emerald-500/20 rounded-full animate-ping delay-2000" />
      <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-green-600/20 rounded-full animate-ping delay-3000" />
    </div>
  );
};

export default FloatingElements;
