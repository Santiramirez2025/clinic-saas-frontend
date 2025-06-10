import React from 'react';
import { Zap } from 'lucide-react';

const DemoCredentials = ({ 
  onDemoLogin, 
  isLoading = false,
  credentials = {
    email: 'test@example.com',
    password: 'password123'
  }
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
        <Zap size={32} className="text-blue-600 transform rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap size={16} className="text-blue-600" />
          </div>
          <h4 className="font-bold text-blue-900">Prueba Rápida</h4>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Email:</span>
            <span className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded text-xs">
              {credentials.email}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Contraseña:</span>
            <span className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded text-xs">
              {credentials.password}
            </span>
          </div>
        </div>

        <button
          onClick={onDemoLogin}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Conectando...</span>
            </>
          ) : (
            <>
              <Zap size={16} />
              <span>Acceso Demo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DemoCredentials;