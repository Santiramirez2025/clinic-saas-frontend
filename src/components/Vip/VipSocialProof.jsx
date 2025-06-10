import React from 'react';

const VipSocialProof = ({ vipStats = {} }) => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-3xl p-8 mt-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Por qué elegir VIP?</h3>
        <p className="text-gray-600">Más de 1,200 clientas VIP confían en nosotros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">98%</div>
          <p className="text-gray-700 font-medium">Satisfacción garantizada</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            ${vipStats?.totalSavings 
              ? Math.round(vipStats.totalSavings / 12).toLocaleString() 
              : '3,200'
            }
          </div>
          <p className="text-gray-700 font-medium">Ahorro promedio mensual</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <p className="text-gray-700 font-medium">Soporte premium</p>
        </div>
      </div>
    </div>
  );
};

export default VipSocialProof;