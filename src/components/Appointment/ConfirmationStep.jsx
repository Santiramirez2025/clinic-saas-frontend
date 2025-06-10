import React from 'react';
import { Bell } from 'lucide-react';

const ConfirmationStep = ({ 
  selectedService, 
  selectedDate, 
  selectedTime, 
  services = [], 
  personalInfo, 
  onPersonalInfoChange, 
  isVIP = false 
}) => {
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleInputChange = (field, value) => {
    onPersonalInfoChange({
      ...personalInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Confirma tu información
        </h3>
        <p className="text-gray-600">
          Revisa los datos antes de confirmar tu cita
        </p>
      </div>

      {/* Resumen de la cita */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 mb-6 border border-indigo-100">
        <h4 className="font-bold text-gray-900 mb-4">Resumen de tu cita</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Servicio:</span>
            <span className="font-semibold text-gray-900">
              {selectedServiceData?.name || 'Servicio seleccionado'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-semibold text-gray-900 capitalize">
              {formatDisplayDate(selectedDate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Hora:</span>
            <span className="font-semibold text-gray-900">{selectedTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Duración:</span>
            <span className="font-semibold text-gray-900">
              {selectedServiceData?.duration || 60} minutos
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Precio:</span>
              <div className="text-right">
                {(() => {
                  const service = selectedServiceData;
                  const discountedPrice = isVIP && service?.vipDiscount ? 
                    service.price * (1 - service.vipDiscount / 100) : service?.price;
                  
                  return isVIP && service?.vipDiscount ? (
                    <div>
                      <span className="text-sm text-gray-400 line-through">
                        ${service.price?.toLocaleString()}
                      </span>
                      <div className="font-bold text-indigo-600">
                        ${discountedPrice?.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">
                        Descuento VIP: -{service.vipDiscount}%
                      </div>
                    </div>
                  ) : (
                    <span className="font-bold text-gray-900">
                      ${service?.price?.toLocaleString()}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información personal */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900">Información personal</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              value={personalInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+54 9 11 1234-5678"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={personalInfo.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Información adicional, alergias, preferencias especiales..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Información sobre notificaciones */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-start space-x-3">
          <Bell className="text-blue-600 mt-1" size={20} />
          <div>
            <h5 className="font-semibold text-blue-900 mb-1">
              Notificaciones automáticas
            </h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Confirmación inmediata por email</li>
              <li>• Recordatorio 24 horas antes por email</li>
              <li>• SMS 2 horas antes de la cita</li>
              {isVIP && <li>• ✨ Notificaciones VIP prioritarias</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Política de cancelación:</strong> Puedes cancelar o reprogramar 
            tu cita hasta 24 horas antes sin costo alguno.
          </p>
          <p>
            Al confirmar, aceptas nuestros términos de servicio y política de privacidad.
            {isVIP && " Como usuario VIP, tienes beneficios especiales en cancelaciones y reprogramaciones."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;