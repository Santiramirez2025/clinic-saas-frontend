import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Send,
  Phone,
  Mail,
  MapPin,
  User
} from 'lucide-react';

const AppointmentCard = ({ 
  appointment, 
  isVIP = false, 
  onEdit, 
  onCancel, 
  onSendReminder, 
  sendingReminder,
  expanded,
  onToggleExpand 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Configuración de estado
  const statusConfig = {
    'SCHEDULED': { 
      color: 'blue', 
      label: 'Programada', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      text: 'text-blue-800' 
    },
    'CONFIRMED': { 
      color: 'green', 
      label: 'Confirmada', 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      text: 'text-green-800' 
    },
    'CANCELLED': { 
      color: 'red', 
      label: 'Cancelada', 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      text: 'text-red-800' 
    },
    'COMPLETED': { 
      color: 'gray', 
      label: 'Completada', 
      bg: 'bg-gray-50', 
      border: 'border-gray-200', 
      text: 'text-gray-800' 
    }
  }[appointment?.status] || statusConfig['SCHEDULED'];

  // Permisos de acciones
  const canEdit = appointment?.status === 'SCHEDULED';
  const canCancel = appointment?.status !== 'CANCELLED' && appointment?.status !== 'COMPLETED';
  const canSendReminder = appointment?.status === 'SCHEDULED' || appointment?.status === 'CONFIRMED';

  // Formateo de fecha
  const formatDisplayDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', { 
        day: '2-digit', 
        month: 'short',
        weekday: 'long'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Datos del servicio
  const serviceName = appointment?.service?.name || appointment?.serviceName || 'Servicio';
  const servicePrice = appointment?.service?.price || appointment?.finalPrice || 0;
  const serviceDuration = appointment?.service?.duration || 60;

  if (!appointment) {
    return null;
  }

  return (
    <div 
      className={`bg-white rounded-3xl shadow-sm border hover:shadow-xl transition-all duration-500 overflow-hidden group ${
        isHovered ? 'scale-[1.02] shadow-2xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header de la card */}
      <div className={`${statusConfig.bg} p-6 relative overflow-hidden`}>
        {/* Decoración de fondo animada */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className={`font-bold text-lg ${statusConfig.text}`}>
                {serviceName}
              </h3>
              
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                {statusConfig.label}
              </div>
              
              {isVIP && (
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-white flex items-center space-x-1 animate-pulse">
                  <Sparkles size={10} />
                  <span>VIP</span>
                </div>
              )}
            </div>
            
            {/* Fecha y hora */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${statusConfig.bg} ${statusConfig.text}`}>
                  <Calendar size={16} />
                </div>
                <div>
                  <div className={`font-semibold ${statusConfig.text}`}>
                    {formatDisplayDate(appointment.date)}
                  </div>
                  <div className={`text-xs opacity-70 ${statusConfig.text}`}>
                    {new Date(appointment.date).toLocaleDateString('es-AR', { 
                      weekday: 'long' 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${statusConfig.bg} ${statusConfig.text}`}>
                  <Clock size={16} />
                </div>
                <div>
                  <div className={`font-semibold ${statusConfig.text}`}>
                    {appointment.time}
                  </div>
                  <div className={`text-xs opacity-70 ${statusConfig.text}`}>
                    {serviceDuration} min
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Acciones flotantes */}
          <div className="flex items-center space-x-2">
            {canSendReminder && (
              <button
                onClick={() => onSendReminder?.(appointment.id)}
                disabled={sendingReminder === appointment.id}
                className="p-3 bg-white/80 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group/btn"
                title="Enviar recordatorio"
              >
                {sendingReminder === appointment.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                ) : (
                  <Send size={16} className="text-blue-600 group-hover/btn:rotate-12 transition-transform duration-300" />
                )}
              </button>
            )}
            
            {canEdit && (
              <button
                onClick={() => onEdit?.(appointment)}
                className="p-3 bg-white/80 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group/btn"
                title="Editar cita"
              >
                <Edit3 size={16} className="text-indigo-600 group-hover/btn:rotate-12 transition-transform duration-300" />
              </button>
            )}
            
            {canCancel && (
              <button
                onClick={() => onCancel?.(appointment.id)}
                className="p-3 bg-white/80 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group/btn"
                title="Cancelar cita"
              >
                <Trash2 size={16} className="text-red-600 group-hover/btn:rotate-12 transition-transform duration-300" />
              </button>
            )}
            
            <button
              onClick={() => onToggleExpand?.(appointment.id)}
              className="p-3 bg-white/80 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
              title={expanded ? "Contraer" : "Expandir"}
            >
              {expanded ? 
                <ChevronUp size={16} className="text-gray-600" /> : 
                <ChevronDown size={16} className="text-gray-600" />
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido expandible */}
      <div className={`overflow-hidden transition-all duration-500 ease-out ${
        expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6 bg-gray-50/50 space-y-4">
          {/* Información detallada */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Paciente</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.user?.name || 'Usuario'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ubicación</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.clinic?.name || 'Clínica Premium'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.user?.phone || '+54 9 11 2345-6789'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.user?.email || 'usuario@email.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Precio */}
          <div className="bg-white rounded-2xl p-4 border">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Precio</p>
            <div className="flex items-center justify-between">
              <div>
                {appointment.vipDiscount > 0 && (
                  <div className="text-sm text-gray-400 line-through">
                    ${appointment.originalPrice?.toLocaleString()}
                  </div>
                )}
                <div className="text-lg font-bold text-gray-900">
                  ${(appointment.finalPrice || servicePrice)?.toLocaleString()}
                </div>
              </div>
              {appointment.vipDiscount > 0 && (
                <div className="text-green-600 text-sm font-semibold">
                  -{appointment.vipDiscount}% VIP
                </div>
              )}
            </div>
          </div>
          
          {/* Notas */}
          {appointment.notes && (
            <div className="bg-white rounded-2xl p-4 border">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Notas</p>
              <p className="text-gray-800">{appointment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;