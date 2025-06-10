import React from 'react';
import { Crown } from 'lucide-react';

const VipHeader = ({ 
  isVIP = false, 
  vipDaysRemaining = 0, 
  isScrolled = false 
}) => {
  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-2xl transition-all duration-300 ${
              isVIP 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                : 'bg-gray-200'
            }`}>
              <Crown size={24} className={isVIP ? 'text-white' : 'text-gray-500'} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isVIP ? 'Panel VIP' : 'Únete a VIP'}
              </h1>
              <p className="text-sm text-gray-600">
                {isVIP ? 'Miembro Premium Activo' : 'Desbloquea beneficios exclusivos'}
              </p>
            </div>
          </div>
          
          {isVIP && (
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ✨ Activo
              </div>
              {vipDaysRemaining > 0 && vipDaysRemaining <= 30 && (
                <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {vipDaysRemaining}d restantes
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipHeader;