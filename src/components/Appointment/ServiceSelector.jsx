import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Heart, 
  Shield,
  Loader
} from 'lucide-react';

const ServiceSelector = ({ 
  services = [], 
  selectedService, 
  onServiceSelect, 
  isVIP = false 
}) => {
  return (
    <div className="space-y-8">
      {/* Header elegante */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
          <Heart size={28} className="text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          ¿Qué servicio necesitas hoy?
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Selecciona el tratamiento que mejor se adapte a tus necesidades. 
          Todos nuestros servicios incluyen atención personalizada y tecnología de vanguardia.
        </p>
      </div>

      {/* Loading state para servicios */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <Loader size={32} className="text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando servicios disponibles...</p>
        </div>
      ) : (
        /* Grid de servicios del backend */
        <div className="space-y-4 max-w-md mx-auto">
          {services.map((service) => {
            const discountedPrice = isVIP && service.vipDiscount ? 
              service.price * (1 - service.vipDiscount / 100) : service.price;
            const isSelected = selectedService === service.id;
            
            return (
              <div
                key={service.id}
                className={`relative overflow-hidden transition-all duration-300 ${
                  isSelected ? 'transform scale-[1.02]' : ''
                }`}
              >
                <button
                  onClick={() => onServiceSelect(service.id)}
                  className={`w-full p-6 rounded-3xl border-2 text-left transition-all duration-300 hover:shadow-lg group relative overflow-hidden ${
                    isSelected
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50'
                  }`}
                >
                  {/* Popular badge */}
                  {service.isPopular && (
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full shadow-md">
                      ⭐ Popular
                    </div>
                  )}

                  {/* Layout horizontal optimizado */}
                  <div className="flex items-center space-x-4">
                    {/* Icono del servicio */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100'
                    }`}>
                      {isSelected ? (
                        <CheckCircle size={24} className="text-white" />
                      ) : (
                        <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300">
                          {service.icon || '🦷'}
                        </span>
                      )}
                    </div>
                    
                    {/* Información principal */}
                    <div className="flex-1 min-w-0">
                      {/* Título y categoría */}
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-bold text-lg truncate transition-colors duration-300 ${
                          isSelected ? 'text-indigo-900' : 'text-gray-900 group-hover:text-indigo-800'
                        }`}>
                          {service.name}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 transition-all duration-300 ${
                          isSelected 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                        }`}>
                          {service.category || 'Servicio'}
                        </span>
                      </div>
                      
                      {/* Descripción condensada */}
                      <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-300 ${
                        isSelected ? 'text-indigo-700' : 'text-gray-600 group-hover:text-gray-700'
                      }`}>
                        {service.description || 'Descripción del servicio'}
                      </p>
                      
                      {/* Footer con duración, VIP y precio */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Duración */}
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock size={14} />
                            <span className="text-sm font-medium">{service.duration || 60}min</span>
                          </div>
                          
                          {/* Badge VIP */}
                          {isVIP && service.vipDiscount && (
                            <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                              <Sparkles size={12} />
                              <span className="text-xs font-bold">-{service.vipDiscount}% VIP</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Precio */}
                        <div className="text-right">
                          {isVIP && service.vipDiscount && service.price !== discountedPrice ? (
                            <div>
                              <div className="text-xs text-gray-400 line-through">
                                ${service.price?.toLocaleString()}
                              </div>
                              <div className="text-lg font-bold text-indigo-600">
                                ${discountedPrice?.toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-gray-900">
                              ${service.price?.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicador de selección móvil */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 max-w-4xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Garantía de Calidad</h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              Todos nuestros tratamientos incluyen garantía, seguimiento post-tratamiento y 
              {isVIP && <span className="font-semibold"> atención VIP prioritaria con descuentos exclusivos</span>}.
              Utilizamos equipos de última generación y técnicas certificadas internacionalmente.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ServiceSelector;