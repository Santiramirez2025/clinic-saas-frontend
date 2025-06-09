import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  AlertCircle,
  CheckCircle,
  Filter,
  RefreshCw,
  Bell,
  Send,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Loader,
  Heart,
  Zap,
  Shield
} from 'lucide-react';

// 🎨 COMPONENTE 1: Header con acciones principales
const AppointmentHeader = ({ onNewAppointment, onRefresh, isLoading, upcomingCount }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Mis Citas</h1>
          <p className="text-indigo-100 opacity-90">
            {upcomingCount > 0 
              ? `Tienes ${upcomingCount} cita${upcomingCount > 1 ? 's' : ''} próxima${upcomingCount > 1 ? 's' : ''}`
              : "No hay citas programadas"
            }
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={onNewAppointment}
            className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>
      
      {/* Quick stats con animación */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Este mes", value: "12", icon: Calendar },
          { label: "Completadas", value: "24", icon: CheckCircle },
          { label: "VIP Activo", value: "✨", icon: Star }
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-2 mb-1">
              <stat.icon size={16} className="text-white/80" />
              <span className="text-sm text-white/80">{stat.label}</span>
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎨 COMPONENTE 2: Tabs modernos con indicadores animados
const ModernTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { key: 'upcoming', label: 'Próximas', count: counts.upcoming, color: 'bg-blue-500' },
    { key: 'past', label: 'Historial', count: counts.past, color: 'bg-green-500' },
    { key: 'cancelled', label: 'Canceladas', count: counts.cancelled, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-gray-50 rounded-2xl p-2 relative">
      {/* Indicador animado de fondo */}
      <div 
        className="absolute top-2 bottom-2 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
        style={{
          left: `${2 + (tabs.findIndex(t => t.key === activeTab) * 33.333)}%`,
          width: '31.333%'
        }}
      />
      
      <div className="grid grid-cols-3 relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeTab === tab.key
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <div className={`${tab.color} text-white text-xs px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center`}>
                {tab.count}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// 🎨 COMPONENTE 3: Card de cita moderna con microinteracciones
const AppointmentCard = ({ 
  appointment, 
  isVIP, 
  onEdit, 
  onCancel, 
  onSendReminder, 
  sendingReminder,
  expanded,
  onToggleExpand 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusConfig = {
    'SCHEDULED': { color: 'blue', label: 'Programada', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    'CONFIRMED': { color: 'green', label: 'Confirmada', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    'CANCELLED': { color: 'red', label: 'Cancelada', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    'COMPLETED': { color: 'gray', label: 'Completada', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' }
  }[appointment.status] || statusConfig['SCHEDULED'];

  const canEdit = appointment.status === 'SCHEDULED';
  const canCancel = appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED';
  const canSendReminder = appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';

  return (
    <div 
      className={`bg-white rounded-3xl shadow-sm border hover:shadow-xl transition-all duration-500 overflow-hidden group ${
        isHovered ? 'scale-[1.02] shadow-2xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header de la card con gradiente sutil */}
      <div className={`${statusConfig.bg} p-6 relative overflow-hidden`}>
        {/* Decoración de fondo animada */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className={`font-bold text-lg ${statusConfig.text}`}>
                {appointment.service}
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
            
            {/* Fecha y hora con iconos */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${statusConfig.bg} ${statusConfig.text}`}>
                  <Calendar size={16} />
                </div>
                <div>
                  <div className={`font-semibold ${statusConfig.text}`}>
                    {new Date(appointment.date).toLocaleDateString('es-AR', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
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
                    60 min
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Acciones flotantes */}
          <div className="flex items-center space-x-2">
            {canSendReminder && (
              <button
                onClick={() => onSendReminder(appointment.id)}
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
                onClick={() => onEdit(appointment)}
                className="p-3 bg-white/80 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group/btn"
              >
                <Edit3 size={16} className="text-indigo-600 group-hover/btn:rotate-12 transition-transform duration-300" />
              </button>
            )}
            
            {canCancel && (
              <button
                onClick={() => onCancel(appointment.id)}
                className="p-3 bg-white/80 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group/btn"
              >
                <Trash2 size={16} className="text-red-600 group-hover/btn:rotate-12 transition-transform duration-300" />
              </button>
            )}
            
            <button
              onClick={() => onToggleExpand(appointment.id)}
              className="p-3 bg-white/80 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
            >
              {expanded ? 
                <ChevronUp size={16} className="text-gray-600" /> : 
                <ChevronDown size={16} className="text-gray-600" />
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido expandible con animación suave */}
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
                  <p className="font-semibold text-gray-900">María González</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ubicación</p>
                  <p className="font-semibold text-gray-900">Consultorio 2</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
                  <p className="font-semibold text-gray-900">+54 9 11 2345-6789</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-semibold text-gray-900">maria@email.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notas */}
          {appointment.notes && (
            <div className="bg-white rounded-2xl p-4 border">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Notas</p>
              <p className="text-gray-800">{appointment.notes}</p>
            </div>
          )}
          
          {/* Estado de notificaciones */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <Bell size={16} className="text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">Notificaciones Activas</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Email confirmación", status: "sent" },
                { label: "Recordatorio 24h", status: "pending" },
                { label: "SMS 2h antes", status: "pending" },
                { label: "VIP prioritario", status: isVIP ? "active" : "inactive" }
              ].map((notif, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    notif.status === 'sent' ? 'bg-green-400' :
                    notif.status === 'pending' ? 'bg-yellow-400' :
                    notif.status === 'active' ? 'bg-blue-400' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-xs text-blue-700">{notif.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 COMPONENTE 4: Formulario de nueva cita moderno
const NewAppointmentForm = ({ onClose, isVIP }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [personalInfo, setPersonalInfo] = useState({
    name: 'María González',
    email: 'maria@email.com',
    phone: '+54 9 11 2345-6789',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock services data
  const services = [
    {
      id: 1,
      name: "Limpieza Dental",
      duration: 60,
      price: 8500,
      description: "Limpieza profunda con ultrasonido y pulido",
      icon: "🦷",
      category: "Preventiva",
      popular: true
    },
    {
      id: 2,
      name: "Consulta General",
      duration: 30,
      price: 5000,
      description: "Revisión completa y diagnóstico",
      icon: "👨‍⚕️",
      category: "Consulta",
      popular: false
    },
    {
      id: 3,
      name: "Blanqueamiento",
      duration: 90,
      price: 25000,
      description: "Blanqueamiento profesional con luz LED",
      icon: "✨",
      category: "Estética",
      popular: true
    },
    {
      id: 4,
      name: "Ortodoncia",
      duration: 45,
      price: 12000,
      description: "Consulta y seguimiento ortodóntico",
      icon: "🦷",
      category: "Especializada",
      popular: false
    },
    {
      id: 5,
      name: "Implante Dental",
      duration: 120,
      price: 85000,
      description: "Colocación de implante con corona",
      icon: "🔩",
      category: "Cirugía",
      popular: false
    },
    {
      id: 6,
      name: "Endodoncia",
      duration: 90,
      price: 35000,
      description: "Tratamiento de conducto",
      icon: "🩺",
      category: "Especializada",
      popular: false
    }
  ];

  // Generate available slots when date changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      generateAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const generateAvailableSlots = () => {
    setLoadingSlots(true);
    
    // Simulate API call
    setTimeout(() => {
      const slots = [];
      const startHour = 9;
      const endHour = 18;
      const service = services.find(s => s.id === selectedService);
      const duration = service?.duration || 60;
      const slotInterval = 30; // 30 minutes between slots

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotInterval) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Skip lunch time (13:00-14:00)
          if (hour === 13) continue;
          
          // Randomly make some slots unavailable
          if (Math.random() > 0.7) continue;
          
          slots.push(timeSlot);
        }
      }
      
      setAvailableSlots(slots);
      setLoadingSlots(false);
    }, 1000);
  };

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
    return new Date(dateString).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

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

  // Success screen
  if (showSuccess) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle size={40} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Cita Reservada Exitosamente! 🎉
          </h2>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Servicio:</span>
                <span className="font-semibold text-gray-900">
                  {services.find(s => s.id === selectedService)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-semibold text-gray-900">
                  {formatDisplayDate(selectedDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hora:</span>
                <span className="font-semibold text-gray-900">{selectedTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="text-blue-600" size={20} />
              <div className="text-left">
                <p className="font-semibold text-blue-900">Notificaciones Enviadas</p>
                <p className="text-sm text-blue-700">
                  Te hemos enviado la confirmación por email y SMS
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            Cerrando automáticamente en 3 segundos...
          </p>
        </div>
      </div>
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

      {/* Step Content */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        {/* STEP 1: Service Selection - DISEÑO PROFESIONAL */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Header elegante */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
                <Heart size={28} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Qué servicio necesitas hoy?
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Selecciona el tratamiento que mejor se adapte a tus necesidades. 
                Todos nuestros servicios incluyen atención personalizada y tecnología de vanguardia.
              </p>
            </div>

            {/* Grid de servicios optimizado para móvil */}
            <div className="space-y-4 max-w-md mx-auto">
              {services.map((service) => {
                const discountedPrice = isVIP ? service.price * 0.8 : service.price;
                const isSelected = selectedService === service.id;
                
                return (
                  <div
                    key={service.id}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      isSelected ? 'transform scale-[1.02]' : ''
                    }`}
                  >
                    <button
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full p-6 rounded-3xl border-2 text-left transition-all duration-300 hover:shadow-lg group relative overflow-hidden ${
                        isSelected
                          ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-indigo-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50'
                      }`}
                    >
                      {/* Popular badge optimizado para móvil */}
                      {service.popular && (
                        <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full shadow-md">
                          ⭐ Popular
                        </div>
                      )}

                      {/* Layout horizontal optimizado */}
                      <div className="flex items-center space-x-4">
                        {/* Icono del servicio */}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100'
                        }`}>
                          {isSelected ? (
                            <CheckCircle size={24} className="text-white" />
                          ) : (
                            <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300">
                              {service.icon}
                            </span>
                          )}
                        </div>
                        
                        {/* Información principal */}
                        <div className="flex-1 min-w-0">
                          {/* Título y categoría */}
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-bold text-lg truncate transition-colors duration-300 ${
                              isSelected ? 'text-indigo-900' : 'text-gray-900 group-hover:text-indigo-800'
                            }`}>
                              {service.name}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 transition-all duration-300 ${
                              isSelected 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                            }`}>
                              {service.category}
                            </span>
                          </div>
                          
                          {/* Descripción condensada */}
                          <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-300 ${
                            isSelected ? 'text-indigo-700' : 'text-gray-600 group-hover:text-gray-700'
                          }`}>
                            {service.description}
                          </p>
                          
                          {/* Footer con duración, VIP y precio */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Duración */}
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Clock size={14} />
                                <span className="text-sm font-medium">{service.duration}min</span>
                              </div>
                              
                              {/* Badge VIP */}
                              {isVIP && (
                                <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                  <Sparkles size={12} />
                                  <span className="text-xs font-bold">-20% VIP</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Precio */}
                            <div className="text-right">
                              {isVIP && service.price !== discountedPrice ? (
                                <div>
                                  <div className="text-xs text-gray-400 line-through">
                                    ${service.price.toLocaleString()}
                                  </div>
                                  <div className="text-lg font-bold text-indigo-600">
                                    ${discountedPrice.toLocaleString()}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-lg font-bold text-gray-900">
                                  ${service.price.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Indicador de selección móvil */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle size={16} className="text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Información adicional */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Garantía de Calidad</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Todos nuestros tratamientos incluyen garantía, seguimiento post-tratamiento y 
                    {isVIP && <span className="font-semibold"> atención VIP prioritaria con descuentos exclusivos</span>}.
                    Utilizamos equipos de última generación y técnicas certificadas internacionalmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Date Selection */}
        {currentStep === 2 && (
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
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full p-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              
              {selectedDate && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-2xl">
                  <div className="text-center">
                    <Calendar size={24} className="text-indigo-600 mx-auto mb-2" />
                    <p className="font-semibold text-indigo-900">
                      {formatDisplayDate(selectedDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Time Selection */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿A qué hora prefieres?
              </h3>
              <p className="text-gray-600">
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
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:shadow-md ${
                      selectedTime === time
                        ? 'border-indigo-500 bg-indigo-600 text-white ring-2 ring-indigo-200'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Clock size={16} className="mx-auto mb-1" />
                    <span className="font-semibold">{time}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  No hay horarios disponibles
                </h4>
                <p className="text-gray-600 mb-6">
                  Intenta seleccionar otra fecha
                </p>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Cambiar Fecha
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirma tu información
              </h3>
              <p className="text-gray-600">
                Revisa los datos antes de confirmar tu cita
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">Resumen de tu cita</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-semibold text-gray-900">
                    {services.find(s => s.id === selectedService)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold text-gray-900">
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
                    {services.find(s => s.id === selectedService)?.duration} minutos
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <div className="text-right">
                      {isVIP ? (
                        <div>
                          <span className="text-sm text-gray-400 line-through">
                            ${services.find(s => s.id === selectedService)?.price.toLocaleString()}
                          </span>
                          <div className="font-bold text-indigo-600">
                            ${(services.find(s => s.id === selectedService)?.price * 0.8).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">
                          ${services.find(s => s.id === selectedService)?.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Información personal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={personalInfo.notes}
                    onChange={(e) => setPersonalInfo({...personalInfo, notes: e.target.value})}
                    rows={3}
                    placeholder="Información adicional..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Notifications info */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <Bell className="text-blue-600 mt-1" size={20} />
                <div>
                  <h5 className="font-semibold text-blue-900 mb-1">
                    Notificaciones automáticas
                  </h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Confirmación inmediata por email</li>
                    <li>• Recordatorio 24 horas antes</li>
                    <li>• SMS 2 horas antes de la cita</li>
                    {isVIP && <li>• ✨ Notificaciones VIP prioritarias</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
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
              onClick={() => setCurrentStep(currentStep + 1)}
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

// 🎨 COMPONENTE PRINCIPAL: AppointmentView conectado con store
const AppointmentView = ({ store }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedCard, setExpandedCard] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  
  // ✅ CORRECCIÓN: Obtener datos del store correctamente
  const appointments = store?.appointments || [];
  const isVIP = store?.isVipActive?.() || false;
  const isLoading = store?.isLoading || false;
  
  // ✅ Filtros de citas corregidos
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(`${apt.date}T${apt.time}:00`);
    const now = new Date();
    return appointmentDate > now && (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
  });
  
  const pastAppointments = appointments.filter(apt => apt.status === 'COMPLETED');
  const cancelledAppointments = appointments.filter(apt => apt.status === 'CANCELLED');
  
  const counts = {
    upcoming: upcomingAppointments.length,
    past: pastAppointments.length,
    cancelled: cancelledAppointments.length
  };
  
  const getFilteredAppointments = () => {
    switch(activeTab) {
      case 'upcoming': return upcomingAppointments;
      case 'past': return pastAppointments;
      case 'cancelled': return cancelledAppointments;
      default: return upcomingAppointments;
    }
  };
  
  // ✅ Handlers corregidos con store
  const handleSendReminder = async (appointmentId) => {
    setSendingReminder(appointmentId);
    try {
      // Aquí iría la lógica del store para enviar recordatorio
      console.log('Enviando recordatorio para cita:', appointmentId);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
    } finally {
      setSendingReminder(null);
    }
  };
  
  const handleEdit = (appointment) => {
    console.log('Editando cita:', appointment);
    // Aquí iría la lógica para editar
  };
  
  const handleCancel = async (appointmentId) => {
    if (confirm('¿Estás segura de que quieres cancelar esta cita?')) {
      try {
        await store?.cancelAppointment?.(appointmentId);
      } catch (error) {
        console.error('Error cancelando cita:', error);
      }
    }
  };
  
  const handleRefresh = async () => {
    try {
      await store?.refreshUserSession?.();
    } catch (error) {
      console.error('Error actualizando citas:', error);
    }
  };
  
  const filteredAppointments = getFilteredAppointments();
  
  if (showNewAppointment) {
    return (
      <NewAppointmentForm 
        onClose={() => setShowNewAppointment(false)} 
        isVIP={isVIP}
        store={store}
      />
    );
  }
  
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header moderno */}
      <AppointmentHeader 
        onNewAppointment={() => setShowNewAppointment(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        upcomingCount={counts.upcoming}
      />
      
      {/* Tabs modernos */}
      <ModernTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />
      
      {/* Lista de citas */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {activeTab === 'upcoming' && 'No tienes citas próximas'}
              {activeTab === 'past' && 'No tienes citas en el historial'}
              {activeTab === 'cancelled' && 'No tienes citas canceladas'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {activeTab === 'upcoming' && '¡Reserva tu primera cita y comienza a cuidar tu salud!'}
              {activeTab === 'past' && 'Aquí aparecerán tus citas completadas'}
              {activeTab === 'cancelled' && 'Aquí aparecerán las citas que canceles'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => setShowNewAppointment(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
              >
                <Plus size={18} />
                <span>Reservar Primera Cita</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <div 
              key={appointment.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-fade-in-up"
            >
              <AppointmentCard
                appointment={appointment}
                isVIP={isVIP}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onSendReminder={handleSendReminder}
                sendingReminder={sendingReminder}
                expanded={expandedCard === appointment.id}
                onToggleExpand={(id) => setExpandedCard(expandedCard === id ? null : id)}
              />
            </div>
          ))
        )}
      </div>
      
      {/* Footer con información de notificaciones */}
      {filteredAppointments.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Sistema de Notificaciones Inteligente</h3>
              <p className="text-gray-600 text-sm">
                Recibirás recordatorios automáticos por email y SMS. 
                {isVIP && " Como usuario VIP, tienes notificaciones prioritarias."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{filteredAppointments.length}</div>
              <div className="text-sm text-gray-600">Citas activas</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AppointmentView;