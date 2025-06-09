import React from 'react';
import { Heart } from 'lucide-react';

const DailyTip = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-purple-100 rounded-2xl">
          <Heart size={20} className="text-purple-600" />
        </div>
        <h3 className="font-bold text-gray-900">Tip del Día</h3>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
        <p className="text-gray-800 font-medium mb-2">
          💧 Mantén tu piel hidratada
        </p>
        <p className="text-sm text-gray-600">
          Bebe al menos 8 vasos de agua al día y usa crema hidratante por la mañana y noche. 
          Tu piel te lo agradecerá y los resultados de tus tratamientos durarán más tiempo.
        </p>
      </div>
    </div>
  );
};

export default DailyTip;