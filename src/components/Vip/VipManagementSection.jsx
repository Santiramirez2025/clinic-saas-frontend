import React from 'react';
import { TrendingUp, CreditCard, Loader } from 'lucide-react';

const VipManagementSection = ({ 
  vipData = {}, 
  vipStats = {}, 
  vipDaysRemaining = 0, 
  vipExpiresAt = null,
  onUnsubscribe,
  loading = false
}) => {
  const formatExpirationDate = (dateString) => {
    if (!dateString) return 'No definida';
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Gestionar Suscripción</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-green-800">Plan Activo</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            Plan {vipData?.planType === 'annual' ? 'Anual' : 'Mensual'} VIP
          </p>
          <p className="text-green-700">
            Válido hasta: {formatExpirationDate(vipExpiresAt)}
          </p>
          {vipDaysRemaining <= 30 && vipDaysRemaining > 0 && (
            <div className="mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              ⚠️ Quedan {vipDaysRemaining} días
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp size={20} className="text-blue-600" />
            <span className="font-semibold text-blue-800">Ahorro Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            ${vipStats?.totalSavings ? vipStats.totalSavings.toLocaleString() : '0'}
          </p>
          <p className="text-blue-700">Desde que eres VIP</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          disabled={loading}
        >
          <CreditCard size={20} className="inline mr-2" />
          Actualizar Método de Pago
        </button>
        
        <button
          onClick={onUnsubscribe}
          disabled={loading}
          className="flex-1 border-2 border-red-200 text-red-600 py-3 px-6 rounded-2xl font-semibold hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader size={16} className="animate-spin" />
              <span>Procesando...</span>
            </div>
          ) : (
            'Cancelar Suscripción'
          )}
        </button>
      </div>
    </div>
  );
};

export default VipManagementSection;