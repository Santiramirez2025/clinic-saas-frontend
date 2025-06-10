import React from 'react';
import { ArrowRight } from 'lucide-react';

const ModernSubmitButton = ({ 
  isLoading = false, 
  isLogin = true, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="group relative w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl hover:shadow-2xl"
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Contenido del botón */}
      <div className="relative z-10 flex items-center justify-center space-x-3">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </div>
    </button>
  );
};

export default ModernSubmitButton;