// src/App.jsx - OPTIMIZADO FINAL CON STRICTMODE PROTECTION
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Home, Crown, User, Calendar, LogOut } from 'lucide-react';

// Import components
import Login from './components/login/Login';
import HomeView from './components/Home/HomeView';
import AppointmentView from './components/Appointment/AppointmentView';
import VipView from './components/Vip/VipView';
import ProfileView from './components/Profile/ProfileView';
import TabBar from './components/TabBar';
import Header from './components/Header';

// Import notification components
import ToastNotifications from './components/notifications/ToastNotifications';
import NotificationBell from './components/notifications/NotificationBell';
import { NotificationProvider, useNotificationContext } from './context/NotificationContext';

// Import custom hooks
import useAppStore from './store/useAppStore';
import { useNotifications } from './hooks/useNotifications';

// 🎯 GLOBAL FLAGS para protección StrictMode
let globalAppInitialized = false;
let globalInitPromise = null;

// 🎯 Componente principal con notificaciones OPTIMIZADO
const ClinicAppWithNotifications = () => {
  const [activeTab, setActiveTab] = useState('home');
  const store = useAppStore();
  
  // ✅ Referencias para evitar re-renders y doble ejecución
  const initializationDone = useRef(false);
  const focusTimeoutRef = useRef(null);
  const componentMounted = useRef(false);
  
  // 🔔 Hooks de notificaciones
  const { toasts, dismissToast } = useNotificationContext();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll
  } = useNotifications();

  // ✅ Initialize app CON PROTECCIÓN STRICTMODE MEJORADA
  useEffect(() => {
    // ✅ Protección local del componente
    if (initializationDone.current) {
      console.log('🚫 App component already initialized locally, skipping...');
      return;
    }
    
    // ✅ Protección global para StrictMode
    if (globalAppInitialized && !globalInitPromise) {
      console.log('🚫 App already initialized globally, skipping...');
      initializationDone.current = true;
      return;
    }
    
    // ✅ Si ya hay una inicialización en proceso, esperarla
    if (globalInitPromise) {
      console.log('⏳ App initialization in progress, waiting...');
      globalInitPromise.then(() => {
        initializationDone.current = true;
      });
      return;
    }
    
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing ClinicApp...');
        
        // Marcar como inicializado ANTES de la llamada
        globalAppInitialized = true;
        initializationDone.current = true;
        componentMounted.current = true;
        
        await store.initializeAuth();
        console.log('✅ ClinicApp initialized successfully');
        
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        
        // Reset flags en caso de error para permitir retry
        globalAppInitialized = false;
        initializationDone.current = false;
        store.logout();
      } finally {
        globalInitPromise = null;
      }
    };

    // ✅ Crear promesa global para evitar múltiples inicializaciones
    globalInitPromise = initializeApp();
    
    // ✅ Cleanup function
    return () => {
      componentMounted.current = false;
      // No resetear flags globales en cleanup para mantener estado
    };
  }, []); // ✅ Array vacío - SOLO una vez al montar

  // ✅ Handle app focus con protección mejorada
  useEffect(() => {
    const handleFocus = () => {
      // Solo si el componente está montado
      if (!componentMounted.current) return;
      
      // Limpiar timeout anterior
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      
      // Solo si está autenticado y no está cargando
      if (store.isAuthenticated && !store.isLoading && !store.isInitializing) {
        console.log('👁️ App focused - scheduling session refresh...');
        
        focusTimeoutRef.current = setTimeout(() => {
          if (componentMounted.current) {
            store.refreshUserSession();
          }
        }, 1500);
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, [store.isAuthenticated, store.isLoading, store.isInitializing, store.refreshUserSession]);

  // ✅ Memoizar cálculos costosos
  const appointmentCounts = useMemo(() => {
    try {
      const upcoming = store.getUpcomingAppointments?.() || [];
      const pending = store.getPendingAppointments?.() || [];
      
      return {
        upcomingCount: upcoming.length,
        pendingCount: pending.length
      };
    } catch (error) {
      console.warn('Error calculating appointment counts:', error);
      return { upcomingCount: 0, pendingCount: 0 };
    }
  }, [store.appointments]);

  // ✅ Memoizar estado VIP
  const vipStatus = useMemo(() => {
    try {
      return store.isVipActive?.() || false;
    } catch (error) {
      console.warn('Error checking VIP status:', error);
      return false;
    }
  }, [store.vipStatus, store.user?.isVIP]);

  // ✅ Memoizar configuración de tabs
  const tabConfig = useMemo(() => {
    const { upcomingCount, pendingCount } = appointmentCounts;
    
    return [
      {
        id: 'home',
        label: 'Inicio',
        icon: Home,
        badge: pendingCount > 0 ? pendingCount : null
      },
      {
        id: 'appointments',
        label: 'Citas',
        icon: Calendar,
        badge: upcomingCount > 0 ? upcomingCount : null
      },
      {
        id: 'vip',
        label: 'VIP',
        icon: Crown,
        badge: vipStatus ? '★' : null,
        highlight: vipStatus
      },
      {
        id: 'profile',
        label: 'Perfil',
        icon: User,
        badge: null
      }
    ];
  }, [appointmentCounts, vipStatus]);

  // ✅ Memoizar función de render de vista
  const renderView = useCallback(() => {
    const commonProps = { store };
    
    switch (activeTab) {
      case 'home':
        return <HomeView {...commonProps} />;
      case 'appointments':
        return <AppointmentView {...commonProps} />;
      case 'vip':
        return <VipView {...commonProps} />;
      case 'profile':
        return <ProfileView {...commonProps} />;
      default:
        return <HomeView {...commonProps} />;
    }
  }, [activeTab, store]);

  // ✅ Memoizar título de la vista
  const viewTitle = useMemo(() => {
    const titles = {
      home: 'Inicio',
      appointments: 'Mis Citas',
      vip: 'Plan VIP',
      profile: 'Mi Perfil'
    };
    return titles[activeTab] || 'Inicio';
  }, [activeTab]);

  // ✅ Memoizar badge count para FAB
  const fabBadgeCount = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return appointmentCounts.pendingCount;
      case 'appointments':
        return appointmentCounts.upcomingCount;
      case 'vip':
        return vipStatus ? '★' : null;
      default:
        return null;
    }
  }, [activeTab, appointmentCounts, vipStatus]);

  // ✅ Callback para logout memoizado
  const handleLogout = useCallback(() => {
    // Reset de flags para permitir nueva inicialización
    globalAppInitialized = false;
    initializationDone.current = false;
    componentMounted.current = false;
    store.logout();
  }, [store]);

  // ✅ Callback para cambiar tab memoizado
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // ✅ Early returns optimizados
  
  // Show login if not authenticated and not initializing
  if (!store.isAuthenticated && !store.isInitializing) {
    return <Login store={store} />;
  }

  // Show loading state during initialization
  if (store.isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Iniciando aplicación...</p>
        </div>
      </div>
    );
  }

  // Show loading when user is not available but should be authenticated
  if (store.isAuthenticated && !store.user && store.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (store.error && !store.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Error de conexión
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {store.error}
            </p>
            <button
              onClick={() => {
                store.clearError();
                globalAppInitialized = false;
                initializationDone.current = false;
                window.location.reload();
              }}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Render principal optimizado
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen relative pb-20">
        {/* 🎯 Header optimizado */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">{viewTitle}</h1>
              {store.user && (
                <p className="text-sm text-gray-600">
                  Hola, {store.user.name} {vipStatus && '⭐'}
                </p>
              )}
            </div>
            
            {/* 🔔 Campana de notificaciones */}
            <div className="relative">
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={dismissNotification}
                onClearAll={clearAll}
              />
            </div>
          </div>
        </header>
        
        {/* 🎯 Main content */}
        <main className="pt-2">
          {renderView()}
        </main>

        {/* 🎯 TabBar optimizado */}
        <TabBar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          onLogout={handleLogout}
          user={store.user}
          tabs={tabConfig}
        />

        {/* Global loading overlay for actions */}
        {store.isLoading && store.user && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                <span className="text-gray-700">Procesando...</span>
              </div>
            </div>
          </div>
        )}

        {/* Network status indicator */}
        {!navigator.onLine && (
          <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
            Sin conexión a internet
          </div>
        )}

        {/* Quick Action Floating Button - Only on home */}
        {activeTab === 'home' && (
          <button
            onClick={() => handleTabChange('appointments')}
            style={{ backgroundColor: store.clinic.primaryColor }}
            className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all transform hover:scale-110 z-40"
          >
            <Calendar size={24} />
            {fabBadgeCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {fabBadgeCount > 9 ? '9+' : fabBadgeCount}
              </div>
            )}
          </button>
        )}

        {/* 🔔 Toast Notifications */}
        <ToastNotifications
          notifications={toasts}
          onDismiss={dismissToast}
        />

        {/* StrictMode Development Indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-50 opacity-50">
            StrictMode: ON
          </div>
        )}

        {/* 🎨 CSS Styles */}
        <style>{`
          @keyframes slide-in-right {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 0.5s ease-out;
          }

          @keyframes slide-down {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .animate-slide-down {
            animation: slide-down 0.5s ease-out;
          }

          /* ✅ Optimización de rendimiento */
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
        `}</style>
      </div>
    </div>
  );
};

// 🎯 Componente App principal con Provider
const ClinicApp = () => {
  return (
    <NotificationProvider>
      <ClinicAppWithNotifications />
    </NotificationProvider>
  );
};

export default ClinicApp;