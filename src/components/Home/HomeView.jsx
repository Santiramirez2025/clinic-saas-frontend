import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useAppStore from '../../store/useAppStore';

// Components
import ModernHeader from './Modernheader';
import NextAppointmentCard from './NextAppointmentcard';
import QuickActionsGrid from './QuickActionsGrid';
import StatsAndAchievements from './StatsAndAchievements';
import BookingModal from './BookingModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import VIPPromotion from './VIPPromotion';
import ClinicInfo from './ClinicInfo';
import DailyTip from './DailyTip';
import NotificationMessages from './NotificationMessages';

const HomeView = () => {
  const store = useAppStore();
  
  // Referencias para prevenir llamadas múltiples
  const dataLoadedRef = useRef(false);
  const userIdRef = useRef(null);
  
  // Estados locales para UI
  const [showBooking, setShowBooking] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Memoizar datos derivados para evitar recálculos
  const derivedData = useMemo(() => {
    try {
      return {
        nextAppointment: store.getNextAppointment?.() || null,
        lastAppointment: store.getLastCompletedAppointment?.() || null,
        isVIP: store.isVipActive?.() || false,
        vipDaysRemaining: store.getVipDaysRemaining?.() || 0
      };
    } catch (error) {
      console.warn('Error calculating derived data:', error);
      return {
        nextAppointment: null,
        lastAppointment: null,
        isVIP: false,
        vipDaysRemaining: 0
      };
    }
  }, [store.appointments, store.vipStatus, store.user?.isVIP]);

  // OPTIMIZACIÓN CRÍTICA: Cargar datos SOLO cuando es necesario
  useEffect(() => {
    const currentUserId = store.user?.id;
    
    // Verificar si necesitamos cargar datos
    const shouldLoadData = !!(
      currentUserId && 
      !store.isInitializing && 
      !dataLoadedRef.current &&
      currentUserId !== userIdRef.current
    );
    
    if (shouldLoadData) {
      console.log('📊 HomeView: Loading user data for first time...', currentUserId);
      
      dataLoadedRef.current = true;
      userIdRef.current = currentUserId;
      
      // Usar un pequeño delay para evitar race conditions
      const loadTimeout = setTimeout(() => {
        store.loadUserData(currentUserId, true);
      }, 100);
      
      return () => clearTimeout(loadTimeout);
    }
    
    // Si el usuario cambió, reset flags
    if (currentUserId !== userIdRef.current && currentUserId) {
      dataLoadedRef.current = false;
    }
  }, [store.user?.id, store.isInitializing]);

  // Callbacks memoizados para evitar re-renders
  const handleBookAppointment = useCallback(async (appointmentData) => {
    try {
      const service = store.services.find(s => s.id === appointmentData.serviceId);
      const appointmentDate = new Date(appointmentData.date).toISOString();
      
      await store.addAppointment({
        date: appointmentDate,
        time: appointmentData.time,
        service: service.name,
        notes: appointmentData.notes
      });
      
      setShowBooking(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  }, [store]);

  const handleRepeatLastAppointment = useCallback(async () => {
    if (derivedData.lastAppointment) {
      try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        await store.addAppointment({
          date: nextWeek.toISOString(),
          time: derivedData.lastAppointment.time,
          service: derivedData.lastAppointment.service,
          notes: 'Repetición de último turno'
        });
      } catch (error) {
        console.error('Error repeating appointment:', error);
      }
    }
  }, [derivedData.lastAppointment, store]);

  const handleVIPUpgrade = useCallback(async () => {
    try {
      await store.subscribeVip(1);
    } catch (error) {
      console.error('Error upgrading to VIP:', error);
    }
  }, [store]);

  // Handlers para el modal de detalles de cita
  const handleViewAppointmentDetails = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  }, []);

  const handleCloseAppointmentDetails = useCallback(() => {
    setShowAppointmentDetails(false);
    setSelectedAppointment(null);
  }, []);

  const handleCancelAppointment = useCallback(async (appointmentId, reason) => {
    try {
      await store.cancelAppointment(appointmentId, reason);
      // Mostrar mensaje de éxito
      store.setSuccessMessage('Cita cancelada exitosamente');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      store.setError('Error al cancelar la cita');
    }
  }, [store]);

  const handleRescheduleAppointment = useCallback((appointment) => {
    // Cerrar modal de detalles y abrir modal de booking con datos pre-llenados
    handleCloseAppointmentDetails();
    setShowBooking(true);
    // Aquí podrías pre-llenar el modal con los datos de la cita actual
  }, [handleCloseAppointmentDetails]);

  // Early return si está inicializando
  if (store.isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header moderno */}
      <ModernHeader 
        user={store.user}
        isVIP={derivedData.isVIP}
        vipDaysRemaining={derivedData.vipDaysRemaining}
      />

      {/* Próxima cita */}
      <NextAppointmentCard 
        appointment={derivedData.nextAppointment}
        isVIP={derivedData.isVIP}
        onViewDetails={handleViewAppointmentDetails}
        onBookNew={() => setShowBooking(true)}
      />

      {/* Acciones rápidas */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Acciones Rápidas</h3>
        <QuickActionsGrid
          onNewAppointment={() => setShowBooking(true)}
          onRepeatLast={handleRepeatLastAppointment}
          onVIPUpgrade={handleVIPUpgrade}
          lastAppointment={derivedData.lastAppointment}
          isLoading={store.isLoading}
          primaryColor={store.clinic.primaryColor}
        />
      </div>

      {/* Estadísticas y logros */}
      <StatsAndAchievements 
        appointments={store.appointments}
        isVIP={derivedData.isVIP}
      />

      {/* Información de contacto */}
      <ClinicInfo clinic={store.clinic} />

      {/* Promoción VIP (solo si no es VIP) */}
      {!derivedData.isVIP && (
        <VIPPromotion 
          onUpgrade={handleVIPUpgrade}
          primaryColor={store.clinic.primaryColor}
        />
      )}

      {/* Tips y consejos */}
      <DailyTip />

      {/* Mensajes de éxito/error */}
      <NotificationMessages
        error={store.error}
        successMessage={store.successMessage}
        onClearError={store.clearError}
        onClearSuccess={store.clearSuccess}
      />

      {/* Modal de reserva */}
      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        services={store.services}
        isVIP={derivedData.isVIP}
        onBookAppointment={handleBookAppointment}
        isLoading={store.isLoading}
        getAvailableSlots={store.getAvailableSlots}
        primaryColor={store.clinic.primaryColor}
      />

      {/* Modal de detalles de cita */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={showAppointmentDetails}
        onClose={handleCloseAppointmentDetails}
        isVIP={derivedData.isVIP}
        onCancel={handleCancelAppointment}
        onReschedule={handleRescheduleAppointment}
        clinic={store.clinic}
        primaryColor={store.clinic.primaryColor}
      />

      {/* Estilos CSS */}
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

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }

        /* Optimización de rendimiento */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Animaciones adicionales para el modal */
        @keyframes modal-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .modal-enter {
          animation: modal-fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomeView;