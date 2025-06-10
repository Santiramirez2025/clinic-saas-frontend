import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Bell,
  Loader,
  Heart,
  Shield,
  Clock,
  Calendar
} from 'lucide-react';

import ServiceSelector from './ServiceSelector';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import ConfirmationStep from './ConfirmationStep';
import SuccessScreen from './SuccessScreen';

const NewAppointmentForm = ({ onClose, isVIP = false, store }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [personalInfo, setPersonalInfo] = useState({
    name: store?.user?.name || '',
    email: store?.user?.email || '',
    phone: store?.user?.phone || '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Servicios del backend
  const services = store?.services || [];

  // Cargar horarios disponibles
  const generateAvailableSlots = async () => {
    if (!selectedDate || !selectedService) return;
    
    setLoadingSlots(true);
    try {
      const slots = await store?.getAvailableSlots?.(selectedDate, selectedService) || [];
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedService) {
      generateAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  // Validaciones por paso
  const canContinue = (step) => {
    switch(step) {
      case 1: return selectedService !== null;
      case 2: return selectedDate !== '';
      case 3: return selectedTime !== '';
      case 4: return personalInfo.name && personalInfo.email && personalInfo.phone;
      default: return false;
    }
  };

  const getStepTitle = (step) => {
    const titles = {
      1: "Seleccionar Servicio",
      2: "Elegir Fecha",
      3: "Horario Disponible", 
      4: "Confirmar Datos"
    };
    return titles[step];
  };

  // Enviar cita al backend
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        date: selectedDate,
        time: selectedTime,
        serviceId: selectedService,
        notes: personalInfo.notes
      };

      const response = await store?.addAppointment?.(appointmentData);
      
      if (response?.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error(response?.error || 'Error creando cita');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      store?.setError?.(error.message || 'Error creando la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigation = (direction) => {
    if (direction === 'next' && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (direction === 'prev') {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      } else {
        onClose();
      }
    }
  };

  // Pantalla de éxito
  if (showSuccess) {
    return (
      <SuccessScreen 
        selectedService={selectedService}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        services={services}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header con progreso */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onClose}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300"
            >
              <X size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
              <p className="text-gray-600">{getStepTitle(currentStep)}</p>
            </div>
          </div>
          
          {isVIP && (
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl flex items-center space-x-2">
              <Sparkles size={16} />
              <span className="font-semibold">Paciente VIP</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-indigo-600 text-white' 
                    : step === currentStep + 1 && canContinue(currentStep)
                    ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-200'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? <CheckCircle size={16} /> : step}
              </div>
            ))}
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido del paso */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        {currentStep === 1 && (
          <ServiceSelector
            services={services}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            isVIP={isVIP}
          />
        )}

        {currentStep === 2 && (
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}

        {currentStep === 3 && (
          <TimeSelector
            selectedDate={selectedDate}
            availableSlots={availableSlots}
            loadingSlots={loadingSlots}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
            onBackToDate={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <ConfirmationStep
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            services={services}
            personalInfo={personalInfo}
            onPersonalInfoChange={setPersonalInfo}
            isVIP={isVIP}
          />
        )}
      </div>

      {/* Navegación */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigation('prev')}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} />
            <span>{currentStep > 1 ? 'Anterior' : 'Cancelar'}</span>
          </button>
          
          <div className="text-center">
            <span className="text-sm text-gray-500">
              Paso {currentStep} de 4
            </span>
          </div>
          
          {currentStep < 4 ? (
            <button
              onClick={() => handleNavigation('next')}
              disabled={!canContinue(currentStep)}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continuar</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canContinue(currentStep) || isSubmitting}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Confirmando...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Confirmar Cita</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentForm;