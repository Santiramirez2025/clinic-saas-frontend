import React from 'react';
import { Crown, Star, Calendar, Gift, Shield, Sparkles } from 'lucide-react';

const VIPPromotion = ({ onUpgrade, primaryColor }) => {
  const benefits = [
    { icon: Star, text: '20% descuento en todos los servicios' },
    { icon: Calendar, text: 'Acceso prioritario a citas' },
    { icon: Gift, text: 'Tratamientos exclusivos' },
    { icon: Shield, text: 'Garantía extendida' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-3xl p-6 border-2 border-yellow-200">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Crown size={64} className="text-yellow-600 transform rotate-12" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl">
            <Crown size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              ¡Únete al Club VIP!
            </h3>
            <p className="text-gray-600 text-sm">
              Beneficios exclusivos te esperan
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="p-1 bg-yellow-100 rounded-lg">
                <benefit.icon size={12} className="text-yellow-600" />
              </div>
              <span className="text-sm text-gray-700">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onUpgrade}
          className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles size={18} />
            <span>Activar VIP - Desde $2,999/mes</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VIPPromotion;