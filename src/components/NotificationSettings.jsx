import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Check, X, Settings, Send } from 'lucide-react';
import ApiService from '../services/api';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    reminderEnabled: true,
    vipNotificationsEnabled: true,
    appointmentConfirmation: true,
    reminderHours: 24
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [testingNotifications, setTestingNotifications] = useState(false);
  
  const api = new ApiService();
  const currentUser = api.getCurrentUser();

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      const response = await api.getNotificationSettings(currentUser?.id);
      if (response.success) {
        setSettings({
          ...settings,
          ...response.data
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      const response = await api.updateNotificationSettings(currentUser?.id, newSettings);
      if (response.success) {
        setMessage({ type: 'success', text: 'Configuración actualizada correctamente' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar configuración' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const testNotifications = async () => {
    try {
      setTestingNotifications(true);
      const response = await api.testNotifications();
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: '¡Notificaciones de prueba enviadas! Revisa tu email y SMS.' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error al enviar notificaciones de prueba' 
      });
    } finally {
      setTestingNotifications(false);
    }
    
    setTimeout(() => setMessage(null), 5000);
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración de Notificaciones</h1>
                <p className="text-gray-600">Personaliza cómo y cuándo recibir notificaciones</p>
              </div>
            </div>
            
            <button
              onClick={testNotifications}
              disabled={testingNotifications}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{testingNotifications ? 'Enviando...' : 'Probar'}</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <Check className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones por Email</h2>
            </div>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.emailEnabled}
                onChange={(value) => updateSetting('emailEnabled', value)}
                label="Activar Email"
                description="Recibir notificaciones por correo electrónico"
              />
              
              <ToggleSwitch
                enabled={settings.appointmentConfirmation}
                onChange={(value) => updateSetting('appointmentConfirmation', value)}
                label="Confirmación de Citas"
                description="Email automático al agendar una cita"
              />
            </div>
          </div>

          {/* SMS Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones por SMS</h2>
            </div>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.smsEnabled}
                onChange={(value) => updateSetting('smsEnabled', value)}
                label="Activar SMS"
                description="Recibir notificaciones por mensaje de texto"
              />
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Nota:</strong> Las notificaciones SMS pueden tener costo adicional según tu plan.
                </p>
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Recordatorios</h2>
            </div>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.reminderEnabled}
                onChange={(value) => updateSetting('reminderEnabled', value)}
                label="Recordatorios Automáticos"
                description="Recordatorios antes de tus citas programadas"
              />
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de recordatorio
                </label>
                <select
                  value={settings.reminderHours}
                  onChange={(e) => updateSetting('reminderHours', Number(e.target.value))}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={2}>2 horas antes</option>
                  <option value={4}>4 horas antes</option>
                  <option value={24}>24 horas antes</option>
                  <option value={48}>48 horas antes</option>
                </select>
              </div>
            </div>
          </div>

          {/* VIP Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones VIP</h2>
            </div>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.vipNotificationsEnabled}
                onChange={(value) => updateSetting('vipNotificationsEnabled', value)}
                label="Notificaciones VIP"
                description="Recibir ofertas exclusivas y actualizaciones VIP"
              />
              
              {currentUser?.isVIP && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 font-medium">
                    ✨ Status VIP Activo - Recibirás notificaciones prioritarias
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">¿Cómo funcionan las notificaciones?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Confirmación:</strong> Al agendar una cita recibes confirmación inmediata</li>
            <li>• <strong>Recordatorios:</strong> Te avisamos según el tiempo que configures</li>
            <li>• <strong>Cancelaciones:</strong> Notificación automática si se cancela una cita</li>
            <li>• <strong>VIP:</strong> Acceso prioritario y ofertas exclusivas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;