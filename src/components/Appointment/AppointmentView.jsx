import React, { useState, useMemo } from 'react';
import { Bell } from 'lucide-react';

// Componentes modulares
import AppointmentHeader from './AppointmentHeader';
import ModernTabs from './ModernTabs';
import AppointmentCard from './AppointmentCard';
import NewAppointmentForm from './NewAppointmentForm';
import EmptyState from './EmptyState';

const AppointmentView = ({ store }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedCard, setExpandedCard] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  
  console.log('🔄 AppointmentView render - FINAL FIXED VERSION');
  
  // ✅ Obtener datos del store de forma segura
  const appointments = useMemo(() => {
    return store?.appointments || [];
  }, [store?.appointments]);
  
  const isVIP = useMemo(() => {
    return store?.isVipActive?.() || false;
  }, [store?.vipStatus, store?.user?.isVIP]);
  
  const isLoading = store?.isLoading || false;
  
  // ✅ Filtros de citas memoizados para evitar recálculos
  const upcomingAppointments = useMemo(() => {
    return appointments.filter(apt => {
      try {
        if (!apt.date || !apt.time) return false;
        
        const appointmentDate = new Date(`${apt.date}T${apt.time}:00`);
        const now = new Date();
        return appointmentDate > now && (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
      } catch (error) {
        console.warn('Error filtering upcoming appointment:', error);
        return false;
      }
    });
  }, [appointments]);
  
  const pastAppointments = useMemo(() => {
    return appointments.filter(apt => apt.status === 'COMPLETED');
  }, [appointments]);
  
  const cancelledAppointments = useMemo(() => {
    return appointments.filter(apt => apt.status === 'CANCELLED');
  }, [appointments]);
  
  const counts = useMemo(() => ({
    upcoming: upcomingAppointments.length,
    past: pastAppointments.length,
    cancelled: cancelledAppointments.length
  }), [upcomingAppointments.length, pastAppointments.length, cancelledAppointments.length]);
  
  // ✅ Estadísticas para el header memoizadas
  const monthlyStats = useMemo(() => {
    try {
      const thisMonth = appointments.filter(apt => {
        const appointmentDate = new Date(apt.date);
        const now = new Date();
        return appointmentDate.getMonth() === now.getMonth() && 
               appointmentDate.getFullYear() === now.getFullYear();
      }).length;
      
      return {
        thisMonth,
        completed: pastAppointments.length,
        vipActive: isVIP
      };
    } catch (error) {
      console.warn('Error calculating monthly stats:', error);
      return { thisMonth: 0, completed: 0, vipActive: false };
    }
  }, [appointments, pastAppointments.length, isVIP]);
  
  const getFilteredAppointments = () => {
    switch(activeTab) {
      case 'upcoming': return upcomingAppointments;
      case 'past': return pastAppointments;
      case 'cancelled': return cancelledAppointments;
      default: return upcomingAppointments;
    }
  };
  
  // ✅ Handlers estables
  const handleSendReminder = async (appointmentId) => {
    setSendingReminder(appointmentId);
    try {
      console.log('Enviando recordatorio para cita:', appointmentId);
      await new Promise(resolve => setTimeout(resolve, 2000));
      store?.setSuccess?.('Recordatorio enviado exitosamente');
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      store?.setError?.('Error enviando recordatorio');
    } finally {
      setSendingReminder(null);
    }
  };
  
  const handleEdit = (appointment) => {
    console.log('Editando cita:', appointment);
    store?.setSuccess?.('Función de edición en desarrollo');
  };
  
  const handleCancel = async (appointmentId) => {
    if (confirm('¿Estás segura de que quieres cancelar esta cita?')) {
      try {
        await store?.cancelAppointment?.(appointmentId);
        store?.setSuccess?.('Cita cancelada exitosamente');
      } catch (error) {
        console.error('Error cancelando cita:', error);
        store?.setError?.('Error cancelando la cita');
      }
    }
  };
  
  const handleRefresh = async () => {
    try {
      await store?.refreshUserSession?.();
    } catch (error) {
      console.error('Error actualizando citas:', error);
      store?.setError?.('Error actualizando los datos');
    }
  };
  
  const handleToggleExpand = (appointmentId) => {
    setExpandedCard(expandedCard === appointmentId ? null : appointmentId);
  };
  
  const filteredAppointments = getFilteredAppointments();
  
  // Mostrar formulario de nueva cita
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
        monthlyStats={monthlyStats}
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
          <EmptyState 
            type={activeTab}
            onNewAppointment={() => setShowNewAppointment(true)}
          />
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
                onToggleExpand={handleToggleExpand}
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
              <div className="text-sm text-gray-600">
                {activeTab === 'upcoming' && 'Citas próximas'}
                {activeTab === 'past' && 'Citas completadas'}
                {activeTab === 'cancelled' && 'Citas canceladas'}
              </div>
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