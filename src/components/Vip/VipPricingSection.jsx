import React from 'react';
import { Lock, Loader } from 'lucide-react';
import VipPlanCard from './VipPlanCard';

const VipPricingSection = ({ 
  selectedPlan, 
  onPlanSelect, 
  onSubscribe, 
  loading = false, 
  showPayment = false 
}) => {
  const plans = [
    {
      id: 'monthly',
      name: 'Mensual',
      subtitle: 'Perfecto para probar',
      price: 1500,
      originalPrice: 2000,
      period: 'mes',
      discount: 25,
      popular: false,
      features: ['Todos los beneficios VIP', 'Soporte prioritario', 'Cancelación flexible'],
      color: 'from-gray-100 to-gray-200'
    },
    {
      id: 'annual',
      name: 'Anual',
      subtitle: 'Máximo ahorro',
      price: 1000,
      originalPrice: 1500,
      yearlyPrice: 12000,
      yearlyOriginalPrice: 18000,
      period: 'mes',
      discount: 33,
      popular: true,
      savings: 'Ahorrás $6.000',
      features: ['Todos los beneficios VIP', 'Soporte 24/7', '2 meses GRATIS', 'Garantía de satisfacción'],
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Elige tu Plan VIP</h3>
        <p className="text-gray-600">Comienza tu transformación hoy mismo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map(plan => (
          <VipPlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => onPlanSelect(plan.id)}
          />
        ))}
      </div>

      {/* Subscribe Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onSubscribe}
          disabled={loading || showPayment}
          className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 min-w-64"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader size={20} className="animate-spin" />
              <span>Procesando...</span>
            </div>
          ) : (
            <>
              <Lock size={20} className="inline mr-2" />
              Activar Plan VIP
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          🔒 Pago 100% seguro • Cancela cuando quieras
        </p>
      </div>
    </div>
  );
};

export default VipPricingSection;