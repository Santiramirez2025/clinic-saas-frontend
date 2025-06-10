import React from 'react';
import { Loader, AlertCircle } from 'lucide-react';

// Loading Screen Completo
export const ProfileLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
      <div className="text-center">
        <Loader size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    </div>
  );
};

// Error Screen
export const ProfileErrorScreen = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md w-full text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error cargando perfil</h2>
        <p className="text-gray-600 mb-4">No se pudo cargar la información del usuario</p>
        <button
          onClick={onRetry}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
};

// Loading Overlay
export const ProfileLoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <Loader size={24} className="animate-spin text-indigo-600" />
          <span className="text-gray-700">Procesando...</span>
        </div>
      </div>
    </div>
  );
};

const ProfileLoadingStates = {
  LoadingScreen: ProfileLoadingScreen,
  ErrorScreen: ProfileErrorScreen,
  LoadingOverlay: ProfileLoadingOverlay
};

export default ProfileLoadingStates;