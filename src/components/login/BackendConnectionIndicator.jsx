import React from 'react';
import { WifiOff } from 'lucide-react';

const BackendConnectionIndicator = ({ 
  isConnected, 
  isLoading = false 
}) => {
  // Solo mostrar si hay problemas de conexión
  if (isConnected === true) return null;
  
  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 flex items-center space-x-2 z-50">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
        <span className="text-yellow-800 text-sm font-medium">Conectando...</span>
      </div>
    );
  }

  if (isConnected === false) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg px-3 py-2 flex items-center space-x-2 z-50">
        <WifiOff size={16} className="text-red-600" />
        <span className="text-red-800 text-sm font-medium">Sin conexión</span>
      </div>
    );
  }

  return null;
};

export default BackendConnectionIndicator;