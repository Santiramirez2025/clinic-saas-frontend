import React from 'react';
import { Star } from 'lucide-react';

const VipSuccessMessage = ({ 
  isVIP = false, 
  totalSavings = 0, 
  show = false 
}) => {
  if (!show || !isVIP || totalSavings <= 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 mt-8 border border-green-200">
      <div className="text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-green-900 mb-2">
          ¡Excelente decisión! 🎉
        </h3>
        <p className="text-green-700">
          Has ahorrado <span className="font-bold">${totalSavings.toLocaleString()}</span> siendo miembro VIP.
          Sigue disfrutando de todos los beneficios exclusivos.
        </p>
      </div>
    </div>
  );
};

export default VipSuccessMessage;