import React from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';

const ModernHeader = ({ 
  clinicName = 'Clínica Estética', 
  isLogin = true 
}) => {
  return (
    <div className="text-center mb-8 relative z-10">
      {/* Logo animado */}
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 relative overflow-hidden group">
          {/* Brillo animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Sparkles size={32} className="text-white relative z-10" />
        </div>
        
        {/* Anillos animados alrededor del logo */}
        <div className="absolute inset-0 rounded-3xl border-2 border-indigo-300/50 animate-ping"></div>
        <div className="absolute inset-0 rounded-3xl border border-purple-300/30 animate-pulse"></div>
      </div>

      {/* Título dinámico */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
        {clinicName}
      </h1>
      
      {/* Subtítulo animado */}
      <p className="text-gray-600 text-lg font-medium">
        {isLogin ? (
          <span className="inline-flex items-center space-x-2">
            <span>¡Bienvenida de vuelta!</span>
            <Heart size={18} className="text-pink-500 animate-pulse" />
          </span>
        ) : (
          <span className="inline-flex items-center space-x-2">
            <span>Tu viaje de belleza comienza aquí</span>
            <Star size={18} className="text-yellow-500 animate-spin" />
          </span>
        )}
      </p>
    </div>
  );
};

export default ModernHeader;