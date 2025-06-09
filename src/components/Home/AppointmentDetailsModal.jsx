import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Star,
  Sparkles,
  MessageCircle,
  Share2
} from 'lucide-react';

const AppointmentDetailsModal = ({ 
  appointment, 
  isOpen, 
  onClose, 
  isVIP,
  onEdit,
  onCancel,
  onReschedule,
  clinic,
  primaryColor = '#6366f1'
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen || !appointment) return null;

  // Configuración de estado
  const statusConfig = {
    'SCHEDULED': { 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      text: 'text-blue-800',
      icon: Calendar,
      label: 'Programada',
      color: 'blue'
    },
    'CONFIRMED': { 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      text: 'text-green-800',
      icon: CheckCircle,
      label: 'Confirmada',
      color: 'green'
    },
    'COMPLETED': { 
      bg: 'bg-gray-50', 
      border: 'border-gray-200', 
      text: 'text-gray-800',
      icon: CheckCircle,
      label: 'Completada',
      color: 'gray'
    },
    'CANCELLED': { 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      text: 'text-red-800',
      icon: AlertCircle,
      label: 'Cancelada',
      color: 'red'
    }
  }[appointment.status] || {
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    text: 'text-blue-800',
    icon: Calendar,
    label: 'Programada',
    color: 'blue'
  };

  // Calcular tiempo hasta la cita
  const getTimeUntil = () => {
    const now = new Date();
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}:00`);
    const diff = appointmentDate - now;
    
    if (diff <= 0) return 'Ya pasó';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `En ${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `En ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return '¡Muy pronto!';
    }
  };

  const handleCancelAppointment = async () => {
    if (cancelReason.trim()) {
      await onCancel(appointment.id, cancelReason);
      setShowCancelConfirm(false);
      setCancelReason('');
      onClose();
    }
  };

  const canModify = appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showCancelConfirm ? (
          // Vista principal de detalles
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-4 ${statusConfig.bg} rounded-2xl border ${statusConfig.border}`}>
                  <statusConfig.icon size={24} className={statusConfig.text} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detalles de la Cita</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                    {isVIP && (
                      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                        <Sparkles size={10} className="mr-1" />
                        VIP
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Información principal */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{appointment.service}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha y hora */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <Calendar size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Fecha</p>
                      <p className="text-gray-600">
                        {new Date(appointment.date).toLocaleDateString('es-AR', { 
                          weekday: 'long',
                          day: '2-digit', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Clock size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Hora</p>
                      <p className="text-gray-600">{appointment.time} hs</p>
                      <p className="text-sm text-gray-500">{getTimeUntil()}</p>
                    </div>
                  </div>
                </div>

                {/* Profesional y duración */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <User size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Profesional</p>
                      <p className="text-gray-600">{appointment.professional || 'Por asignar'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-pink-100 rounded-xl">
                      <Clock size={20} className="text-pink-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Duración</p>
                      <p className="text-gray-600">{appointment.duration || '60'} minutos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Precio */}
              {appointment.price && (
                <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Precio del servicio:</span>
                    <div className="text-right">
                      {isVIP ? (
                        <div>
                          <span className="text-sm text-gray-400 line-through">
                            ${appointment.price.toLocaleString()}
                          </span>
                          <div className="text-xl font-bold text-green-600">
                            ${(appointment.price * 0.8).toLocaleString()}
                            <span className="text-sm ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">
                              -20% VIP
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          ${appointment.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notas */}
            {appointment.notes && (
              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl mt-1">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">Notas adicionales</h4>
                    <p className="text-blue-800 leading-relaxed">{appointment.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Información de la clínica */}
            <div className="bg-gray-50 rounded-3xl p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <MapPin size={20} className="mr-2 text-gray-600" />
                Ubicación
              </h4>
              <div className="space-y-3">
                <p className="text-gray-700">{clinic?.address || 'Dirección no disponible'}</p>
                <div className="flex items-center space-x-4">
                  <a 
                    href={`tel:${clinic?.phone}`}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Phone size={16} />
                    <span className="font-medium">{clinic?.phone}</span>
                  </a>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(clinic?.address || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <MapPin size={16} />
                    <span className="font-medium">Ver en mapa</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Acciones */}
            {canModify && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onReschedule(appointment)}
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-100 text-blue-700 font-semibold rounded-2xl hover:bg-blue-200 transition-all duration-300"
                >
                  <Edit3 size={18} />
                  <span>Reprogramar</span>
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-red-100 text-red-700 font-semibold rounded-2xl hover:bg-red-200 transition-all duration-300"
                >
                  <Trash2 size={18} />
                  <span>Cancelar</span>
                </button>
              </div>
            )}

            {/* Acciones adicionales */}
            <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                <MessageCircle size={16} />
                <span className="text-sm">Contactar clínica</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 size={16} />
                <span className="text-sm">Compartir</span>
              </button>
            </div>
          </div>
        ) : (
          // Vista de confirmación de cancelación
          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Cancelar esta cita?
              </h3>
              <p className="text-gray-600 mb-6">
                Esta acción no se puede deshacer. ¿Estás segura de que quieres cancelar tu cita de {appointment.service}?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de cancelación (opcional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Comparte el motivo de la cancelación..."
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                Mantener cita
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 py-3 px-6 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-all duration-300"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;