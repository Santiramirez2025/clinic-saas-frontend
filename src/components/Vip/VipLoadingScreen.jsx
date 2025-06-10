import React from 'react';
import { Loader } from 'lucide-react';

const VipLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
      <div className="text-center">
        <Loader size={40} className="text-indigo-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Cargando información VIP...</p>
      </div>
    </div>
  );
};

export default VipLoadingScreen;