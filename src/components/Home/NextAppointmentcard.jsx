import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';

const NextAppointmentCard = ({ appointment, isVIP, onViewDetails, onBookNew }) => {
  const [timeUntil, setTimeUntil] = useState('');

  useEffect(() => {
    if (!appointment) return;
    
    const updateTimeUntil = () => {
      const now = new Date();
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}:00`);
      const diff = appointmentDate - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
          setTimeUntil(`En ${days} día${days > 1 ? 's' : ''}`);
        } else if (hours > 0) {
          setTimeUntil(`En ${hours} hora${hours > 1 ? 's' : ''}`);
        } else {
          setTimeUntil('¡Muy pronto!');
        }
      }
    };

    updateTimeUntil();
    const timer = setInterval(updateTimeUntil, 60000);
    return () => clearInterval(timer);
  }, [appointment]);

  if (!appointment) {
    return (
      <button
        onClick={onBookNew}
        className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-3xl p-6 text-center hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group"
      >
        <div className="p-4 bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
          <Calendar size={24} className="text-gray-500 group-hover:text-indigo-600 transition-colors duration-300" />
        </div>
        <h3 className="font-bold text-gray-700 mb-2 group-hover:text-indigo-700 transition-colors duration-300">
          No tienes citas programadas
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          ¡Es momento de agendar tu próximo tratamiento de belleza!
        </p>
        <div className="inline-flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700 transition-colors duration-300">
          <Plus size={16} className="mr-1" />
          Reservar ahora
        </div>
      </button>
    );
  }

  const statusConfig = {
    'SCHEDULED': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Calendar },
    'CONFIRMED': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle }
  }[appointment.status] || { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Calendar };

  return (
    <div 
      onClick={() => onViewDetails(appointment)}
      className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-3xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]`}
    >
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full transform rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 ${statusConfig.bg} rounded-2xl border ${statusConfig.border} group-hover:scale-110 transition-transform duration-300`}>
              <statusConfig.icon size={20} className={statusConfig.text} />
            </div>
            <div>
              <h3 className={`font-bold ${statusConfig.text}`}>Próxima Cita</h3>
              <p className={`text-sm ${statusConfig.text} opacity-70`}>{timeUntil}</p>
            </div>
          </div>
          
          {isVIP && (
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={10} />
              <span>VIP</span>
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="space-y-3">
          <h4 className={`text-xl font-bold ${statusConfig.text} group-hover:text-opacity-90 transition-all duration-300`}>
            {appointment.service}
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className={statusConfig.text} />
              <span className={`text-sm font-medium ${statusConfig.text}`}>
                {new Date(appointment.date).toLocaleDateString('es-AR', { 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className={statusConfig.text} />
              <span className={`text-sm font-medium ${statusConfig.text}`}>
                {appointment.time}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <p className={`text-sm ${statusConfig.text} opacity-80 bg-white/50 rounded-xl p-3 group-hover:bg-white/70 transition-all duration-300`}>
              {appointment.notes}
            </p>
          )}

          {/* Información adicional */}
          {appointment.professional && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${statusConfig.text.replace('text-', 'bg-')}`}></div>
              <span className={`text-xs ${statusConfig.text} opacity-70`}>
                Con {appointment.professional}
              </span>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs ${statusConfig.text} opacity-60 group-hover:opacity-80 transition-all duration-300`}>
            Toca para ver detalles
          </span>
          <ChevronRight className={`${statusConfig.text} opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`} size={20} />
        </div>

        {/* Indicador de acción */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-2 h-2 rounded-full ${statusConfig.text.replace('text-', 'bg-')} animate-pulse`}></div>
        </div>
      </div>
    </div>
  );
};

export default NextAppointmentCard;