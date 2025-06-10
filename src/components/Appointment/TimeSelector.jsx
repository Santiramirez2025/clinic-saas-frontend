import React from 'react';
import { Clock, AlertCircle, Loader } from 'lucide-react';

const TimeSelector = ({ 
  selectedDate, 
  availableSlots = [], 
  loadingSlots = false, 
  selectedTime, 
  onTimeSelect, 
  onBackToDate 
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          ¿A qué hora prefieres?
        </h3>
        <p className="text-gray-600 capitalize">
          Horarios disponibles para {formatDisplayDate(selectedDate)}
        </p>
      </div>

      {loadingSlots ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader size={32} className="text-indigo-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Cargando horarios disponibles...</p>
          </div>
        </div>
      ) : availableSlots.length > 0 ? (
        <div className="space-y-6">
          {/* Grid de horarios */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {availableSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:shadow-md ${
                  selectedTime === time
                    ? 'border-indigo-500 bg-indigo-600 text-white ring-2 ring-indigo-200 scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <Clock size={16} className="mx-auto mb-1" />
                <span className="font-semibold text-sm">{time}</span>
              </button>
            ))}
          </div>

          {/* Información sobre los horarios */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Clock size={16} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Horarios confirmados
                </h4>
                <p className="text-sm text-blue-700">
                  Todos los horarios mostrados están disponibles y se confirmarán 
                  inmediatamente al completar tu reserva.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-yellow-500" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-lg">
            No hay horarios disponibles
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No encontramos horarios disponibles para esta fecha. 
            Por favor, selecciona otra fecha.
          </p>
          <button
            onClick={onBackToDate}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Cambiar Fecha
          </button>
        </div>
      )}

      {/* Horarios seleccionados preview */}
      {selectedTime && (
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Clock size={20} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-green-900 mb-1">
              Horario seleccionado
            </h4>
            <p className="text-green-700 capitalize">
              {formatDisplayDate(selectedDate)}
            </p>
            <p className="text-xl font-bold text-green-900">
              {selectedTime}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;