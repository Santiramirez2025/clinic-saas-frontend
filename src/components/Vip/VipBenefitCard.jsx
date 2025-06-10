import React from 'react';
import { Check } from 'lucide-react';

const VipBenefitCard = ({ benefit, index }) => {
  const Icon = benefit.icon;
  
  return (
    <div 
      className={`group relative bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 border transition-all duration-500 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 w-full ${
        benefit.active 
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start space-x-3 lg:space-x-4 w-full">
        <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-gradient-to-r ${benefit.color} shadow-lg flex-shrink-0`}>
          <Icon size={20} className="text-white lg:w-6 lg:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 text-sm lg:text-base leading-tight mb-1">
            {benefit.title}
          </h3>
          <p className="text-xs lg:text-sm text-gray-600 leading-relaxed mb-2">
            {benefit.description}
          </p>
          <div className={`inline-block text-xs font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${benefit.color} text-white`}>
            {benefit.highlight}
          </div>
        </div>
        {benefit.active && (
          <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
            <div className="bg-green-500 text-white rounded-full p-1">
              <Check size={12} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VipBenefitCard;