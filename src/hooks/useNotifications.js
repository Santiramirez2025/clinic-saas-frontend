// src/hooks/useNotifications.js - VERSIÓN ACTUALIZADA
import { useState, useEffect } from 'react';
import { useNotificationContext } from '../context/NotificationContext';
// import ApiService from '../services/api'; // Descomenta cuando tengas ApiService

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([
    // Datos de ejemplo - reemplazar con datos reales del API
    {
      id: 1,
      message: "✅ Cita agendada para 15/06/2025 a las 10:00",
      type: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      category: "appointment"
    },
    {
      id: 2,
      message: "🌟 ¡Bienvenido a VIP! Tu suscripción está activa",
      type: "success",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      category: "vip"
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotificationContext();
  
  // const api = new ApiService(); // Descomenta cuando tengas ApiService
  // const currentUser = api.getCurrentUser(); // Descomenta cuando tengas ApiService

  // Calcular contador de no leídas
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Cargar historial de notificaciones
  const loadNotifications = async (page = 1, limit = 20) => {
    // TODO: Implementar cuando tengas el API
    /*
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const response = await api.getNotificationHistory(currentUser.id, page, limit);
      if (response.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      showToast('Error al cargar notificaciones', 'error');
    } finally {
      setLoading(false);
    }
    */
  };

  // Enviar recordatorio manual
  const sendManualReminder = async (appointmentId) => {
    try {
      // TODO: Implementar cuando tengas el API
      // const response = await api.sendManualReminder(appointmentId);
      // if (response.success) {
        showToast('📨 Recordatorio enviado correctamente', 'success');
        return { success: true, message: 'Recordatorio enviado correctamente' };
      // }
    } catch (error) {
      console.error('Error sending manual reminder:', error);
      showToast('❌ Error al enviar recordatorio', 'error');
      return { success: false, message: 'Error al enviar recordatorio' };
    }
  };

  // Probar notificaciones
  const testNotifications = async () => {
    try {
      // TODO: Implementar cuando tengas el API
      // const response = await api.testNotifications();
      // if (response.success) {
        showToast('✅ Test de notificaciones exitoso', 'success');
        return true;
      // }
    } catch (error) {
      console.error('Error testing notifications:', error);
      showToast('❌ Error en test de notificaciones', 'error');
      return false;
    }
  };

  // Mostrar notificación en el historial (sin toast)
  const addNotification = (message, type = 'info', category = 'system') => {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      category,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);
    return notification.id;
  };

  // Descartar notificación del historial
  const dismissNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Marcar como leída
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Limpiar todas las notificaciones
  const clearAll = () => {
    setNotifications([]);
  };

  // TODO: Descomenta cuando tengas el API
  /*
  useEffect(() => {
    if (currentUser?.id) {
      loadNotifications();
    }
  }, [currentUser?.id]);
  */

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    sendManualReminder,
    testNotifications,
    addNotification,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};

// Hook para integrar notificaciones automáticas en flujos existentes
export const useAutoNotifications = () => {
  const { showToast } = useNotificationContext();
  const { addNotification } = useNotifications();

  // Notificaciones para citas
  const notifyAppointmentCreated = (appointment) => {
    const message = `✅ Cita agendada para ${new Date(appointment.date).toLocaleDateString()} a las ${appointment.time}`;
    showToast(message, 'success');
    addNotification(message, 'success', 'appointment');
  };

  const notifyAppointmentUpdated = (appointment) => {
    const message = `📅 Cita actualizada para ${new Date(appointment.date).toLocaleDateString()} a las ${appointment.time}`;
    showToast(message, 'info');
    addNotification(message, 'info', 'appointment');
  };

  const notifyAppointmentCancelled = (appointment) => {
    const message = `❌ Cita cancelada del ${new Date(appointment.date).toLocaleDateString()}`;
    showToast(message, 'warning');
    addNotification(message, 'warning', 'appointment');
  };

  // Notificaciones para VIP
  const notifyVipActivated = (subscription) => {
    const message = `🌟 ¡Bienvenido a VIP! Tu suscripción está activa por ${subscription.months} mes(es)`;
    showToast(message, 'success');
    addNotification(message, 'success', 'vip');
  };

  const notifyVipExpiring = (daysLeft) => {
    const message = `⏰ Tu suscripción VIP expira en ${daysLeft} día(s)`;
    showToast(message, 'warning');
    addNotification(message, 'warning', 'vip');
  };

  // Notificaciones de sistema
  const notifyError = (message) => {
    showToast(`❌ ${message}`, 'error');
  };

  const notifySuccess = (message) => {
    showToast(`✅ ${message}`, 'success');
  };

  const notifyInfo = (message) => {
    showToast(`ℹ️ ${message}`, 'info');
  };

  return {
    notifyAppointmentCreated,
    notifyAppointmentUpdated,
    notifyAppointmentCancelled,
    notifyVipActivated,
    notifyVipExpiring,
    notifyError,
    notifySuccess,
    notifyInfo
  };
};