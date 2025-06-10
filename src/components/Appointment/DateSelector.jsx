import React from 'react';
import { Calendar } from 'lucide-react';

const DateSelector = ({ selectedDate, onDateSelect }) => {
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

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
          ¿Cuándo te gustaría venir?
        </h3>
        <p className="text-gray-600">
          Selecciona la fecha que mejor te convenga
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateSelect(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className="w-full p-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
          />
          
          {/* Custom calendar icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Calendar size={20} className="text-gray-400" />
          </div>
        </div>
        
        {selectedDate && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="text-center">
              <Calendar size={24} className="text-indigo-600 mx-auto mb-2" />
              <p className="font-semibold text-indigo-900 capitalize">
                {formatDisplayDate(selectedDate)}
              </p>
              <p className="text-sm text-indigo-700 mt-1">
                Fecha seleccionada
              </p>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Calendar size={16} className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">
                Horarios disponibles
              </h4>
              <p className="text-sm text-yellow-700">
                Puedes programar citas desde mañana hasta 3 meses en el futuro. 
                Los horarios se muestran en el siguiente paso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;