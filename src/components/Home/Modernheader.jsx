import React, { useState, useEffect } from 'react';
import { Crown, Smile, Star } from 'lucide-react';

const ModernHeader = ({ user, isVIP, vipDaysRemaining }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const firstName = user?.name?.split(' ')[0] || 'Bella';

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white">
      {/* Decoración de fondo animada */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-indigo-100 text-sm font-medium mb-1">
              {getGreeting()}, {firstName} ✨
            </p>
            <h1 className="text-2xl font-bold mb-2">
              ¡Lista para brillar hoy!
            </h1>
            <p className="text-indigo-100 text-sm opacity-90">
              Tu belleza es nuestro arte
            </p>
          </div>
          
          {/* Avatar animado */}
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Smile size={24} className="text-white" />
            </div>
            {isVIP && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown size={12} className="text-yellow-900" />
              </div>
            )}
          </div>
        </div>

        {/* VIP Status Bar */}
        {isVIP && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center space-x-3">
            <div className="p-2 bg-yellow-400 rounded-xl">
              <Star size={16} className="text-yellow-900" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Miembro VIP Activo</p>
              <p className="text-xs text-indigo-100">
                {vipDaysRemaining} días de beneficios exclusivos
              </p>
            </div>
            <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
              -20%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernHeader;