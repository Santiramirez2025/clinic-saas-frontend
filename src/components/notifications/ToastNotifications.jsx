// src/components/notifications/ToastNotifications.jsx
import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastNotifications = ({ notifications, onDismiss }) => {
  const getNotificationConfig = (type) => {
    const configs = {
      success: {
        icon: CheckCircle,
        toastBg: 'bg-green-500'
      },
      error: {
        icon: AlertCircle,
        toastBg: 'bg-red-500'
      },
      warning: {
        icon: AlertTriangle,
        toastBg: 'bg-yellow-500'
      },
      info: {
        icon: Info,
        toastBg: 'bg-blue-500'
      }
    };
    return configs[type] || configs.info;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {notifications.map((toast) => {
        const config = getNotificationConfig(toast.type);
        const ToastIcon = config.icon;

        return (
          <div
            key={toast.id}
            className={`${config.toastBg} text-white p-4 rounded-2xl shadow-xl max-w-sm transform transition-all duration-500 hover:scale-105 animate-slide-in-right`}
          >
            <div className="flex items-center space-x-3">
              <ToastIcon size={20} className="flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotifications;