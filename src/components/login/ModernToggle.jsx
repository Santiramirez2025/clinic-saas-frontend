import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

const ModernToggle = ({ 
  isLogin, 
  onToggle 
}) => {
  return (
    <div className="relative bg-gray-100 rounded-2xl p-1 mb-8">
      {/* Indicador deslizante */}
      <div 
        className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-lg transition-all duration-500 ease-out ${
          isLogin ? 'left-1' : 'left-1/2'
        }`}
      />
      
      {/* Botones */}
      <div className="relative z-10 grid grid-cols-2">
        <button
          onClick={() => isLogin || onToggle()}
          className={`py-4 px-6 text-center rounded-xl font-bold transition-all duration-300 ${
            isLogin 
              ? 'text-indigo-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Shield size={18} />
            <span>Iniciar Sesión</span>
          </div>
        </button>
        
        <button
          onClick={() => !isLogin || onToggle()}
          className={`py-4 px-6 text-center rounded-xl font-bold transition-all duration-300 ${
            !isLogin 
              ? 'text-indigo-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles size={18} />
            <span>Registro</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModernToggle;