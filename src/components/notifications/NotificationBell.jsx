// src/components/notifications/NotificationBell.jsx
import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  CheckCheck, 
  Trash2, 
  Calendar, 
  Star, 
  Settings, 
  Clock,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

const NotificationBell = ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onDelete, onClearAll }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [filter, setFilter] = useState('all');

  const getNotificationConfig = (type) => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      },
      error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      }
    };
    return configs[type] || configs.info;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      appointment: Calendar,
      vip: Star,
      system: Settings,
      reminder: Clock
    };
    return icons[category] || Bell;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.category === filter);
  };

  return (
    <>
      {/* Botón de campana */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-200"
        >
          <Bell size={20} className="text-gray-700" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* Panel de notificaciones */}
      {showPanel && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-16 right-0 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 max-h-[600px] overflow-hidden">
            {/* Header del panel */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Notificaciones</h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Filtros */}
              <div className="flex space-x-2 mb-4">
                {[
                  { key: 'all', label: 'Todas' },
                  { key: 'unread', label: 'No leídas' },
                  { key: 'appointment', label: 'Citas' },
                  { key: 'vip', label: 'VIP' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                      filter === filterOption.key
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>

              {/* Acciones */}
              {notifications.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onMarkAllAsRead();
                      setShowPanel(false);
                    }}
                    disabled={unreadCount === 0}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCheck size={14} />
                    <span>Marcar todas</span>
                  </button>
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowPanel(false);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Limpiar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Lista de notificaciones */}
            <div className="max-h-96 overflow-y-auto">
              {getFilteredNotifications().length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay notificaciones</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {getFilteredNotifications().map((notification) => {
                    const config = getNotificationConfig(notification.type);
                    const CategoryIcon = getCategoryIcon(notification.category);
                    const NotificationIcon = config.icon;

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-md group ${
                          notification.read
                            ? 'bg-gray-50 border-gray-200'
                            : `${config.bgColor} ${config.borderColor}`
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-xl ${config.bgColor} flex-shrink-0`}>
                            <NotificationIcon size={16} className={config.iconColor} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : config.textColor} font-medium`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <CategoryIcon size={12} className="text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                title="Marcar como leída"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => onDelete(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationBell;