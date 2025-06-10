import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const VipPlanCard = ({ plan, isSelected, onSelect }) => {
  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-105 z-10' : 'hover:scale-102'
      }`}
      onClick={onSelect}
    >
      <div className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
        isSelected
          ? 'border-indigo-400 shadow-2xl shadow-indigo-500/25'
          : 'border-gray-200 shadow-lg hover:border-gray-300 hover:shadow-xl'
      }`}>
        {plan.popular && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
            <Sparkles size={16} className="inline mr-1" />
            Más Popular
          </div>
        )}
        
        <div className={`p-6 ${plan.popular ? 'pt-12' : ''} bg-white`}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-600">{plan.subtitle}</p>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center space-x-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                ${plan.price.toLocaleString()}
              </span>
              <span className="text-gray-600">/{plan.period}</span>
            </div>
            
            {plan.originalPrice && (
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className="text-gray-400 line-through">
                  ${plan.originalPrice.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  -{plan.discount}%
                </span>
              </div>
            )}

            {plan.savings && (
              <p className="text-green-600 font-semibold mt-2 text-sm">
                💰 {plan.savings}
              </p>
            )}
          </div>

          <div className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {plan.id === 'annual' && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-indigo-700 font-medium">Precio anual</p>
                <p className="text-lg font-bold text-indigo-900">
                  ${plan.yearlyPrice?.toLocaleString()} 
                  <span className="text-sm font-normal ml-1">por año</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipPlanCard;