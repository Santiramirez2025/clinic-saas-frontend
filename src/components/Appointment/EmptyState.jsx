import React from 'react';
import { Calendar, Plus, ArrowRight, Clock, CheckCircle, X } from 'lucide-react';

const EmptyState = ({ 
  type = 'upcoming', 
  onNewAppointment 
}) => {
  const emptyStateConfig = {
    upcoming: {
      icon: Calendar,
      title: 'No tienes citas próximas',
      description: '¡Reserva tu primera cita y comienza a cuidar tu salud!',
      showButton: true,
      buttonText: 'Reservar Primera Cita',
      buttonIcon: Plus,
      color: 'indigo',
      gradient: 'from-indigo-600 to-purple-600'
    },
    past: {
      icon: CheckCircle,
      title: 'No tienes citas en el historial',
      description: 'Aquí aparecerán tus citas completadas una vez que comiences a usar nuestros servicios.',
      showButton: false,
      color: 'green',
      gradient: 'from-green-600 to-emerald-600'
    },
    cancelled: {
      icon: X,
      title: 'No tienes citas canceladas',
      description: 'Aquí aparecerán las citas que canceles. Esperamos que no necesites usar esta sección.',
      showButton: false,
      color: 'red',
      gradient: 'from-red-600 to-pink-600'
    }
  };

  const config = emptyStateConfig[type] || emptyStateConfig.upcoming;
  const IconComponent = config.icon;

  return (
    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
      {/* Icono principal */}
      <div className={`w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-105`}>
        <IconComponent size={32} className="text-gray-400" />
      </div>
      
      {/* Título principal */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {config.title}
      </h3>
      
      {/* Descripción */}
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {config.description}
      </p>
      
      {/* Botón de acción (solo para upcoming) */}
      {config.showButton && (
        <button
          onClick={onNewAppointment}
          className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto group`}
        >
          <config.buttonIcon size={18} />
          <span>{config.buttonText}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      )}

      {/* Información adicional para estados específicos */}
      {type === 'upcoming' && (
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock size={16} className="text-blue-600" />
            <span className="font-semibold text-blue-900">¿Sabías que...</span>
          </div>
          <p className="text-sm text-blue-700">
            Reservar citas regulares ayuda a mantener una mejor salud preventiva. 
            ¡Comienza hoy mismo!
          </p>
        </div>
      )}

      {type === 'past' && (
        <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="font-semibold text-green-900">Historial de citas</span>
          </div>
          <p className="text-sm text-green-700">
            Una vez que completes tus primeras citas, podrás ver todo tu historial 
            médico aquí para un mejor seguimiento.
          </p>
        </div>
      )}

      {type === 'cancelled' && (
        <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Calendar size={16} className="text-yellow-600" />
            <span className="font-semibold text-yellow-900">Política de cancelación</span>
          </div>
          <p className="text-sm text-yellow-700">
            Recuerda que puedes cancelar o reprogramar tus citas hasta 24 horas 
            antes sin costo alguno.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyState;