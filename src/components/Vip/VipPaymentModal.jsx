import React from 'react';
import { CheckCircle, Loader } from 'lucide-react';

const VipPaymentModal = ({ 
  show = false, 
  loading = false, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {loading ? (
              <Loader size={32} className="text-white animate-spin" />
            ) : (
              <CheckCircle size={32} className="text-white" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {loading ? 'Procesando Pago' : '¡Pago Procesado!'}
          </h3>
          <p className="text-gray-600 mb-6">
            {loading 
              ? 'Conectando con pasarela segura...' 
              : 'Tu suscripción VIP ha sido activada exitosamente'
            }
          </p>
          
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full animate-pulse" 
                style={{width: '60%'}}
              ></div>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            🔒 {loading 
              ? 'Tu información está protegida con encriptación de nivel bancario' 
              : 'Bienvenida al club VIP'
            }
          </p>
          
          {!loading && (
            <button
              onClick={onClose}
              className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipPaymentModal;