// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const toast = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date()
    };

    setToasts(prev => [...prev, toast]);

    // Auto dismiss después de 4 segundos
    setTimeout(() => {
      dismissToast(toast.id);
    }, 4000);

    return toast.id;
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  const value = {
    toasts,
    showToast,
    dismissToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};