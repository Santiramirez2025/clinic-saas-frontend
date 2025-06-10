import React from 'react';
import { CheckCircle, Bell, Calendar, Clock, MapPin } from 'lucide-react';

const SuccessScreen = ({ 
  selectedService, 
  selectedDate, 
  selectedTime, 
  services = [] 
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center">
        {/* Icono de éxito animado */}
        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle size={40} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Cita Reservada Exitosamente! 🎉
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Tu cita ha sido confirmada y recibirás toda la información por email y SMS
        </p>
        
        {/* Resumen de la cita confirmada */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
          <h3 className="font-bold text-green-900 mb-4">Detalles de tu cita</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <span className="text-green-700">Servicio:</span>
              </div>
              <span className="font-semibold text-green-900">
                {selectedServiceData?.name || 'Servicio seleccionado'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <span className="text-green-700">Fecha:</span>
              </div>
              <span className="font-semibold text-green-900 capitalize">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock size={16} className="text-green-600" />
                </div>
                <span className="text-green-700">Hora:</span>
              </div>
              <span className="font-semibold text-green-900 text-xl">
                {selectedTime}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin size={16} className="text-green-600" />
                </div>
                <span className="text-green-700">Ubicación:</span>
              </div>
              <span className="font-semibold text-green-900">
                Clínica Premium
              </span>
            </div>
          </div>
        </div>

        {/* Información de notificaciones */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="text-blue-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-blue-900">Notificaciones Enviadas</p>
              <p className="text-sm text-blue-700">
                Te hemos enviado la confirmación por email y SMS
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Confirmación enviada por email</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Recordatorio 24 horas antes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>SMS 2 horas antes de la cita</span>
            </div>
          </div>
        </div>

        {/* Instrucciones adicionales */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Próximos pasos</h4>
          <div className="space-y-2 text-sm text-gray-600 text-left">
            <p>• Revisa tu email para más detalles de la cita</p>
            <p>• Si necesitas reprogramar, hazlo con 24 horas de anticipación</p>
            <p>• Llega 10 minutos antes de tu cita</p>
            <p>• Trae tu documento de identidad</p>
          </div>
        </div>

        {/* Contador de cierre automático */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <p className="text-gray-600 mb-2">
            Regresando al panel principal automáticamente...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '66%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;