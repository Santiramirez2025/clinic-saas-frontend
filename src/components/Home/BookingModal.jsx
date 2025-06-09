import React, { useState, useEffect, useCallback } from 'react';
import { X, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  services = [], 
  isVIP, 
  onBookAppointment, 
  isLoading,
  getAvailableSlots,
  primaryColor 
}) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Date helpers
  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  })();

  // Load available slots when date changes
  const loadAvailableSlots = useCallback(async () => {
    if (!selectedDate) return;
    
    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, getAvailableSlots]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate, loadAvailableSlots]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime('');
      setAvailableSlots([]);
    }
  }, [isOpen]);

  const handleBooking = async () => {
    if (selectedService && selectedDate && selectedTime) {
      const service = services.find(s => s.id === selectedService);
      await onBookAppointment({
        serviceId: selectedService,
        service: service.name,
        date: selectedDate,
        time: selectedTime,
        notes: `Servicio: ${service.name} (${service.duration} min)`
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reserva Rápida</h2>
              <p className="text-gray-600">Agenda tu cita en minutos</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Seleccionar Servicio
            </label>
            <div className="space-y-3">
              {services.map(service => {
                const discountedPrice = isVIP ? service.price * 0.8 : service.price;
                
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-md ${
                      selectedService === service.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{service.icon || '✨'}</span>
                          <h3 className="font-bold text-gray-900">{service.name}</h3>
                          {isVIP && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Star size={10} className="mr-1" />
                              VIP -20%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {service.description || `Tratamiento de ${service.name.toLowerCase()}`}
                        </p>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{service.duration} min</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{service.category || 'General'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {isVIP && service.price !== discountedPrice ? (
                          <div>
                            <span className="text-sm text-gray-400 line-through">
                              ${service.price.toLocaleString()}
                            </span>
                            <div className="font-bold text-indigo-600 text-lg">
                              ${discountedPrice.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900 text-lg">
                            ${service.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selection */}
          {selectedService && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Seleccionar Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
              />
            </div>
          )}

          {/* Time Selection */}
          {selectedService && selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Seleccionar Hora
              </label>
              
              {loadingSlots ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">Cargando horarios...</span>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 text-center rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${
                        selectedTime === time
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Clock size={16} className="mx-auto mb-1" />
                      <span className="font-semibold text-sm">{time}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <AlertCircle size={32} className="text-yellow-600 mx-auto mb-2" />
                  <p className="text-yellow-800 font-medium">
                    No hay horarios disponibles para esta fecha
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Intenta con otra fecha
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Button */}
          <div className="pt-4">
            <button
              onClick={handleBooking}
              disabled={!selectedService || !selectedDate || !selectedTime || isLoading}
              style={{ backgroundColor: primaryColor }}
              className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl disabled:hover:shadow-none transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  Reservando...
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Confirmar Reserva</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;