// store/useAppStore.js - COMPLETO CON FUNCIONES VIP
import { useState, useEffect, useCallback, useRef } from 'react';
import ApiService from '../services/api.js';

// ✅ RATE LIMITER mejorado
const createRateLimiter = () => {
  const requests = new Map();
  const WINDOW_MS = 60000; // 1 minuto
  const MAX_REQUESTS = 20; // Más conservador para Render

  return {
    canMakeRequest: (key) => {
      const now = Date.now();
      const windowStart = now - WINDOW_MS;
      
      if (!requests.has(key)) {
        requests.set(key, []);
      }
      
      const userRequests = requests.get(key).filter(time => time > windowStart);
      requests.set(key, userRequests);
      
      if (userRequests.length >= MAX_REQUESTS) {
        console.warn(`🚫 Rate limit exceeded for ${key}. Max ${MAX_REQUESTS} requests per minute.`);
        return false;
      }
      
      userRequests.push(now);
      return true;
    },
    
    resetUser: (key) => {
      requests.delete(key);
    },
    
    clearAll: () => {
      requests.clear();
    }
  };
};

const rateLimiter = createRateLimiter();

// ✅ GLOBAL FLAGS MEJORADOS para StrictMode
let globalAuthInitialized = false;
let globalDataLoading = false;
let globalInitPromise = null;
let globalStoreInstance = null;

const useAppStore = () => {
  const [state, setState] = useState({
    user: null,
    appointments: [],
    services: [], // ✅ Ahora del backend
    vipStatus: null,
    notifications: [],
    tips: [],
    isAuthenticated: false,
    isLoading: false,
    isInitializing: false,
    error: null,
    successMessage: null,
    clinic: {
      name: 'Clínica Estética Premium',
      primaryColor: '#6366f1',
      logo: '✨',
      address: 'Av. Corrientes 1234, CABA',
      phone: '+54 11 4567-8900',
      email: 'info@clinicapremium.com'
    }
  });

  // ✅ Referencias para control de ejecución
  const api = useRef(new ApiService()).current;
  const loadingRef = useRef(false);
  const lastLoadTime = useRef(0);
  const currentUserIdRef = useRef(null);
  const storeInitialized = useRef(false);
  const mountedRef = useRef(false);
  
  // ✅ Cache con TTL
  const dataCache = useRef({
    appointments: null,
    vipStatus: null,
    services: null,
    notifications: null,
    lastUpdate: 0,
    ttl: 30000 // 30 segundos
  });

  // ✅ Helper functions mejoradas
  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setInitializing = useCallback((initializing) => {
    setState(prev => ({ ...prev, isInitializing: initializing }));
  }, []);

  const setError = useCallback((error) => {
    console.error('❌ Store Error:', error);
    setState(prev => ({ 
      ...prev, 
      error: error?.message || error || null,
      successMessage: null
    }));
  }, []);

  const setSuccess = useCallback((message) => {
    setState(prev => ({ 
      ...prev, 
      successMessage: message,
      error: null
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSuccess = useCallback(() => {
    setState(prev => ({ ...prev, successMessage: null }));
  }, []);

  // ✅ Test backend connection
  const testBackendConnection = useCallback(async () => {
    try {
      console.log('🧪 Testing backend connection...');
      const result = await api.testConnection();
      
      if (result.success) {
        console.log('✅ Backend connected successfully');
        setSuccess('Backend conectado correctamente');
      } else {
        console.warn('⚠️ Backend connection issues:', result.message);
        setError(`Backend: ${result.message}`);
      }
      
      return result.success;
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      setError('No se puede conectar al servidor');
      return false;
    }
  }, [setSuccess, setError]);

  // ✅ FUNCIÓN CRÍTICA: loadUserData CON BACKEND
  const loadUserData = useCallback(async (userId, forceLoad = false) => {
    if (!userId) {
      console.warn('❌ No userId provided to loadUserData');
      return;
    }
    
    if (!mountedRef.current) {
      console.log('🚫 Store not mounted, skipping load');
      return;
    }
    
    // ✅ Protección global contra múltiples cargas
    if (globalDataLoading && !forceLoad) {
      console.log('🚫 GLOBAL: User data already loading, waiting...');
      if (globalInitPromise) {
        return await globalInitPromise;
      }
      return;
    }
    
    const now = Date.now();
    const timeSinceLastLoad = now - lastLoadTime.current;
    const DEBOUNCE_TIME = 3000; // 3 segundos entre cargas
    
    // ✅ Rate limiting check
    if (!rateLimiter.canMakeRequest(`user-data-${userId}`)) {
      console.warn('🚫 Rate limit: Skipping user data load');
      setError('Demasiadas solicitudes. Espera un momento.');
      return;
    }
    
    if (!forceLoad) {
      if (loadingRef.current) {
        console.log('🚫 Already loading user data locally');
        return;
      }
      
      if (timeSinceLastLoad < DEBOUNCE_TIME) {
        console.log(`🚫 Too soon - ${timeSinceLastLoad}ms < ${DEBOUNCE_TIME}ms`);
        return;
      }
      
      // ✅ Cache válido
      const cacheAge = now - dataCache.current.lastUpdate;
      if (dataCache.current.lastUpdate > 0 && cacheAge < dataCache.current.ttl) {
        console.log(`✅ Using cached data (${Math.round(cacheAge/1000)}s old)`);
        setState(prev => ({
          ...prev,
          appointments: dataCache.current.appointments || [],
          vipStatus: dataCache.current.vipStatus || null,
          services: dataCache.current.services || [],
          notifications: dataCache.current.notifications || []
        }));
        return;
      }
    }
    
    // ✅ Crear promesa de inicialización global
    if (!globalInitPromise) {
      globalInitPromise = (async () => {
        // ✅ Marcar como cargando
        globalDataLoading = true;
        loadingRef.current = true;
        lastLoadTime.current = now;
        currentUserIdRef.current = userId;
        
        try {
          setLoading(true);
          console.log('📊 Loading user data from backend...');
          
          const startUserId = userId;
          let appointments = [];
          let vipStatus = null;
          let services = [];
          let notifications = [];
          
          // ✅ 1. Cargar appointments
          console.log('🔄 Loading appointments...');
          try {
            const appointmentsResponse = await api.getUserAppointments();
            if (appointmentsResponse?.success) {
              appointments = appointmentsResponse.data?.appointments || [];
              console.log(`✅ Loaded ${appointments.length} appointments`);
            }
          } catch (error) {
            console.warn('⚠️ Failed to load appointments:', error.message);
          }

          // ✅ DELAY entre llamadas
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // ✅ Verificar si el usuario cambió
          if (currentUserIdRef.current !== startUserId || !mountedRef.current) {
            console.log('🚫 User changed during load, discarding results');
            return;
          }

          // ✅ 2. Cargar VIP status
          console.log('🔄 Loading VIP status...');
          try {
            const vipResponse = await api.getVipStatus();
            if (vipResponse?.success) {
              vipStatus = vipResponse.data;
              console.log('✅ VIP status loaded');
            }
          } catch (error) {
            console.warn('⚠️ Failed to load VIP status:', error.message);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));

          // ✅ 3. Cargar services
          console.log('🔄 Loading services...');
          try {
            const servicesResponse = await api.getServices();
            if (servicesResponse?.success) {
              services = servicesResponse.data?.services || [];
              console.log(`✅ Loaded ${services.length} services`);
            }
          } catch (error) {
            console.warn('⚠️ Failed to load services:', error.message);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));

          // ✅ 4. Cargar notifications
          console.log('🔄 Loading notifications...');
          try {
            const notificationsResponse = await api.getNotifications();
            if (notificationsResponse?.success) {
              notifications = notificationsResponse.data?.notifications || [];
              console.log(`✅ Loaded ${notifications.length} notifications`);
            }
          } catch (error) {
            console.warn('⚠️ Failed to load notifications:', error.message);
          }

          // ✅ Verificar nuevamente si el usuario cambió
          if (currentUserIdRef.current !== startUserId || !mountedRef.current) {
            console.log('🚫 User changed during load, discarding results');
            return;
          }

          // ✅ Actualizar cache
          dataCache.current = {
            appointments,
            vipStatus,
            services,
            notifications,
            lastUpdate: Date.now(),
            ttl: 30000
          };

          // ✅ Actualizar state atómicamente
          if (mountedRef.current) {
            setState(prev => ({
              ...prev,
              appointments,
              vipStatus,
              services,
              notifications
            }));
          }

          console.log('✅ User data loaded successfully from backend');
          
        } catch (error) {
          console.error('❌ Critical error loading user data:', error);
          
          if (!error.message?.includes('429') && mountedRef.current) {
            setError('Error cargando datos del usuario');
          }
        } finally {
          if (mountedRef.current) {
            setLoading(false);
          }
          loadingRef.current = false;
          globalDataLoading = false;
          globalInitPromise = null;
        }
      })();
    }
    
    return await globalInitPromise;
  }, [setLoading, setError, api]);

  // ✅ Initialize authentication ACTUALIZADO
  const initializeAuth = useCallback(async () => {
    if (globalAuthInitialized) {
      console.log('🚫 GLOBAL: Auth already initialized');
      return;
    }
    
    if (!mountedRef.current) {
      console.log('🚫 Store not mounted, skipping auth init');
      return;
    }
    
    globalAuthInitialized = true;
    setInitializing(true);
    
    try {
      console.log('🔐 Initializing authentication...');
      
      // ✅ Test backend connection first
      const isBackendConnected = await testBackendConnection();
      if (!isBackendConnected) {
        console.warn('⚠️ Backend not available, using offline mode');
        return;
      }
      
      if (api.isAuthenticated()) {
        console.log('✅ Token found, getting user profile...');
        
        try {
          const userResponse = await api.getCurrentUser();
          if (userResponse?.success && userResponse.data?.user && mountedRef.current) {
            const user = userResponse.data.user;
            console.log('✅ User profile loaded:', user.id);
            
            setState(prev => ({
              ...prev,
              user: user,
              isAuthenticated: true
            }));
            
            currentUserIdRef.current = user.id;
            
            // ✅ Cargar datos después de auth
            setTimeout(() => {
              if (mountedRef.current) {
                loadUserData(user.id, true);
              }
            }, 1000);
          } else {
            console.log('⚠️ Invalid user response, clearing tokens');
            api.clearTokens();
          }
        } catch (error) {
          console.warn('⚠️ Failed to get user profile:', error.message);
          api.clearTokens();
        }
      } else {
        console.log('ℹ️ No stored tokens found');
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      globalAuthInitialized = false;
      logout();
    } finally {
      if (mountedRef.current) {
        setInitializing(false);
      }
    }
  }, [loadUserData, setInitializing, testBackendConnection]);

  // ✅ Auth functions ACTUALIZADAS
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('🔐 Attempting login...', email);
      const response = await api.login(email, password);
      
      if (response.success && response.data && mountedRef.current) {
        const user = response.data.user;
        console.log('✅ Login successful:', user.id);
        
        setState(prev => ({
          ...prev,
          user: user,
          isAuthenticated: true
        }));
        
        currentUserIdRef.current = user.id;
        setSuccess('¡Bienvenido de nuevo!');
        
        // Limpiar cache anterior
        dataCache.current.lastUpdate = 0;
        
        // Cargar datos después del login
        setTimeout(() => {
          if (mountedRef.current) {
            loadUserData(user.id, true);
          }
        }, 500);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error);
      setError(error);
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [loadUserData, setLoading, clearError, setSuccess, setError]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📝 Attempting registration...', userData.email);
      const response = await api.register(userData);
      
      if (response.success && response.data && mountedRef.current) {
        const user = response.data.user;
        console.log('✅ Registration successful:', user.id);
        
        setState(prev => ({
          ...prev,
          user: user,
          isAuthenticated: true
        }));
        
        currentUserIdRef.current = user.id;
        setSuccess('¡Cuenta creada exitosamente!');
        
        setTimeout(() => {
          if (mountedRef.current) {
            loadUserData(user.id, true);
          }
        }, 500);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      setError(error);
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [loadUserData, setLoading, clearError, setSuccess, setError]);

  const logout = useCallback(() => {
    console.log('🚪 Logging out user');
    
    api.logout();
    
    // ✅ Reset ALL global flags
    globalAuthInitialized = false;
    globalDataLoading = false;
    globalInitPromise = null;
    globalStoreInstance = null;
    
    loadingRef.current = false;
    lastLoadTime.current = 0;
    currentUserIdRef.current = null;
    dataCache.current = {
      appointments: null,
      vipStatus: null,
      services: null,
      notifications: null,
      lastUpdate: 0,
      ttl: 30000
    };
    
    rateLimiter.clearAll();
    
    if (mountedRef.current) {
      setState(prev => ({
        ...prev,
        user: null,
        appointments: [],
        services: [],
        vipStatus: null,
        notifications: [],
        isAuthenticated: false,
        error: null,
        successMessage: null
      }));
    }
  }, []);

  // ✅ Session refresh
  const refreshUserSession = useCallback(async () => {
    const userId = currentUserIdRef.current;
    
    if (!userId || loadingRef.current || globalDataLoading || !mountedRef.current) {
      console.log('🚫 Cannot refresh session');
      return;
    }
    
    console.log('🔄 Refreshing user session for:', userId);
    dataCache.current.lastUpdate = 0;
    await loadUserData(userId, false);
  }, [loadUserData]);

  // ✅ Appointment functions ACTUALIZADAS
  const addAppointment = useCallback(async (appointmentData) => {
    if (!rateLimiter.canMakeRequest('add-appointment')) {
      throw new Error('Demasiadas solicitudes. Espera un momento.');
    }

    try {
      setLoading(true);
      clearError();
      
      console.log('📅 Creating appointment...', appointmentData);
      const response = await api.createAppointment(appointmentData);
      
      if (response.success && mountedRef.current) {
        const newAppointment = response.data.appointment;
        setState(prev => ({
          ...prev,
          appointments: [...prev.appointments, newAppointment]
        }));
        
        dataCache.current.lastUpdate = 0;
        setSuccess('Cita agendada exitosamente');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Failed to create appointment:', error);
      if (mountedRef.current) {
        setError(error);
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [setLoading, clearError, setSuccess, setError]);

  const updateAppointment = useCallback(async (appointmentId, updates) => {
    if (!rateLimiter.canMakeRequest('update-appointment')) {
      throw new Error('Demasiadas solicitudes. Espera un momento.');
    }

    try {
      setLoading(true);
      clearError();
      
      console.log('✏️ Updating appointment...', appointmentId, updates);
      const response = await api.updateAppointment(appointmentId, updates);
      
      if (response.success && mountedRef.current) {
        const updatedAppointment = response.data.appointment;
        setState(prev => ({
          ...prev,
          appointments: prev.appointments.map(apt => 
            apt.id === appointmentId ? updatedAppointment : apt
          )
        }));
        
        dataCache.current.lastUpdate = 0;
        setSuccess('Cita actualizada exitosamente');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Failed to update appointment:', error);
      if (mountedRef.current) {
        setError(error);
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [setLoading, clearError, setSuccess, setError]);

  const cancelAppointment = useCallback(async (appointmentId, reason = 'Usuario canceló') => {
    try {
      setLoading(true);
      clearError();
      
      console.log('❌ Cancelling appointment:', appointmentId);
      const response = await api.cancelAppointment(appointmentId, reason);
      
      if (response.success && mountedRef.current) {
        setState(prev => ({
          ...prev,
          appointments: prev.appointments.map(apt => 
            apt.id === appointmentId ? { ...apt, status: 'CANCELLED' } : apt
          )
        }));
        
        dataCache.current.lastUpdate = 0;
        setSuccess('Cita cancelada exitosamente');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Failed to cancel appointment:', error);
      if (mountedRef.current) {
        setError(error);
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [setLoading, clearError, setSuccess, setError]);

  const sendAppointmentReminder = useCallback(async (appointmentId) => {
    if (!rateLimiter.canMakeRequest('send-reminder')) {
      throw new Error('Demasiadas solicitudes. Espera un momento.');
    }

    try {
      console.log('📧 Sending appointment reminder...', appointmentId);
      const response = await api.sendAppointmentReminder(appointmentId);
      
      if (response.success) {
        setSuccess('Recordatorio enviado exitosamente');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Failed to send reminder:', error);
      if (mountedRef.current) {
        setError(error);
      }
      throw error;
    }
  }, [setSuccess, setError]);

  const getAvailableSlots = useCallback(async (date, serviceId) => {
    try {
      console.log('🕐 Getting available slots for:', date, serviceId);
      const response = await api.getAvailableSlots(date, serviceId);
      if (response.success) {
        return response.data.availableSlots || [];
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting available slots:', error);
      return [];
    }
  }, []);

  // ✅ VIP functions COMPLETAS
  const subscribeVip = useCallback(async (planType = 'monthly') => {
    if (!rateLimiter.canMakeRequest('vip-subscribe')) {
      throw new Error('Demasiadas solicitudes. Espera un momento.');
    }

    try {
      setLoading(true);
      clearError();
      
      console.log('⭐ Subscribing to VIP:', planType);
      const response = await api.subscribeVip(planType);
      
      if (response.success && mountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          vipStatus: response.data.subscription,
          user: { ...prev.user, isVIP: true }
        }));
        
        // Invalidar cache para forzar recarga
        dataCache.current.lastUpdate = 0;
        
        setSuccess('¡Suscripción VIP activada exitosamente!');
        
        // Recargar datos después de la suscripción
        const userId = currentUserIdRef.current;
        if (userId) {
          setTimeout(() => {
            if (mountedRef.current) {
              loadUserData(userId, true);
            }
          }, 1000);
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Failed to subscribe VIP:', error);
      if (mountedRef.current) {
        setError(error);
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [setLoading, clearError, setSuccess, setError, loadUserData]);

  const cancelVipSubscription = useCallback(async (reason = 'User request') => {
    if (!rateLimiter.canMakeRequest('vip-cancel')) {
      throw new Error('Demasiadas solicitudes. Espera un momento.');
    }

    try {
      setLoading(true);
      clearError();
      
      console.log('❌ Canceling VIP subscription');
      const response = await api.cancelVipSubscription(reason);
      
      if (response.success && mountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          vipStatus: null,
          user: { ...prev.user, isVIP: false }
        }));
        
        // Invalidar cache
        dataCache.current.lastUpdate = 0;
        
        setSuccess('Suscripción VIP cancelada exitosamente');
        
        // Recargar datos después de la cancelación
        const userId = currentUserIdRef.current;
        if (userId) {
          setTimeout(() => {
            if (mountedRef.current) {
              loadUserData(userId, true);
            }
          }, 1000);
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Failed to cancel VIP subscription:', error);
      if (mountedRef.current) {
        setError(error);
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [setLoading, clearError, setSuccess, setError, loadUserData]);

  // ✅ Obtener beneficios VIP
  const getVipBenefits = useCallback(async () => {
    try {
      console.log('🎁 Getting VIP benefits');
      const response = await api.getVipBenefits();
      if (response.success) {
        return response.data.benefits || [];
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting VIP benefits:', error);
      return [];
    }
  }, []);

  // ✅ Obtener historial VIP
  const getVipHistory = useCallback(async () => {
    try {
      console.log('📜 Getting VIP history');
      const response = await api.getVipHistory();
      if (response.success) {
        return response.data.history || [];
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting VIP history:', error);
      return [];
    }
  }, []);

  // ✅ Utility functions VIP MEJORADAS
  const isVipActive = useCallback(() => {
    return state.vipStatus?.isVIP || state.user?.isVIP || false;
  }, [state.vipStatus?.isVIP, state.user?.isVIP]);

  const getVipDaysRemaining = useCallback(() => {
    // Opción 1: Desde stats del backend
    if (state.vipStatus?.stats?.daysRemaining) {
      return Math.max(0, state.vipStatus.stats.daysRemaining);
    }
    
    // Opción 2: Calcular desde endDate
    if (state.vipStatus?.subscription?.endDate) {
      const endDate = new Date(state.vipStatus.subscription.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    
    return 0;
  }, [state.vipStatus?.stats?.daysRemaining, state.vipStatus?.subscription?.endDate]);

  const getVipStats = useCallback(() => {
    return state.vipStatus?.stats || {
      totalSavings: 0,
      appointmentsThisMonth: 0,
      daysRemaining: 0,
      completedAppointments: 0
    };
  }, [state.vipStatus?.stats]);

  const getVipSubscription = useCallback(() => {
    return state.vipStatus?.subscription || null;
  }, [state.vipStatus?.subscription]);

  // ✅ Verificar si el usuario puede acceder a beneficios VIP
  const canAccessVipBenefit = useCallback((benefitType) => {
    const isActive = isVipActive();
    const daysRemaining = getVipDaysRemaining();
    
    switch (benefitType) {
      case 'discounts':
        return isActive && daysRemaining > 0;
      case 'priority_booking':
        return isActive && daysRemaining > 0;
      case 'free_consultations':
        return isActive && daysRemaining > 0;
      case 'premium_treatments':
        return isActive && daysRemaining > 0;
      case 'personal_followup':
        return isActive && daysRemaining > 0;
      case 'exclusive_community':
        return isActive && daysRemaining > 0;
      default:
        return isActive && daysRemaining > 0;
    }
  }, [isVipActive, getVipDaysRemaining]);

  // ✅ Utility functions ACTUALIZADAS
  const getPendingAppointments = useCallback(() => {
    return state.appointments.filter(apt => 
      apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED'
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [state.appointments]);

  const getUpcomingAppointments = useCallback(() => {
    const now = new Date();
    return state.appointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      return appointmentDate > now && (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [state.appointments]);

  const getNextAppointment = useCallback(() => {
    const upcoming = getUpcomingAppointments();
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [getUpcomingAppointments]);

  const getLastCompletedAppointment = useCallback(() => {
    const completed = state.appointments.filter(apt => apt.status === 'COMPLETED')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return completed.length > 0 ? completed[0] : null;
  }, [state.appointments]);

  // ✅ Initialize on mount
  useEffect(() => {
    mountedRef.current = true;
    
    if (storeInitialized.current) {
      console.log('🚫 Store already initialized locally, skipping...');
      return;
    }

    if (globalStoreInstance && globalStoreInstance !== 'current') {
      console.log('🚫 Another store instance exists, skipping...');
      return;
    }

    console.log('🚀 Mounting useAppStore');
    storeInitialized.current = true;
    globalStoreInstance = 'current';
    
    setTimeout(() => {
      if (mountedRef.current && !globalAuthInitialized) {
        initializeAuth();
      }
    }, 100);
    
    return () => {
      mountedRef.current = false;
      if (globalStoreInstance === 'current') {
        globalStoreInstance = null;
        storeInitialized.current = false;
      }
    };
  }, [initializeAuth]);

  // ✅ Auto-clear success messages
  useEffect(() => {
    if (state.successMessage && mountedRef.current) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          clearSuccess();
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.successMessage, clearSuccess]);

  // ✅ Debug effect
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Store state:', {
        isAuthenticated: state.isAuthenticated,
        userId: state.user?.id,
        appointmentsCount: state.appointments?.length || 0,
        servicesCount: state.services?.length || 0,
        isVIP: isVipActive(),
        vipDaysRemaining: getVipDaysRemaining(),
        isLoading: state.isLoading,
        mounted: mountedRef.current
      });
    }
  }, [state.isAuthenticated, state.user?.id, state.appointments?.length, state.services?.length, state.isLoading, isVipActive, getVipDaysRemaining]);

  // ✅ RETURN COMPLETO CON TODAS LAS FUNCIONES VIP
  return { 
    // ✅ State
    ...state,
    
    // ✅ Auth functions
    login,
    register,
    logout,
    initializeAuth,
    refreshUserSession,
    testBackendConnection,
    
    // ✅ Data functions
    loadUserData,
    
    // ✅ Appointment functions COMPLETAS
    addAppointment,
    updateAppointment,
    cancelAppointment,
    sendAppointmentReminder,
    getAvailableSlots,
    
    // ✅ VIP functions COMPLETAS
    subscribeVip,
    cancelVipSubscription,
    getVipBenefits,
    getVipHistory,
    
    // ✅ VIP utility functions
    isVipActive,
    getVipDaysRemaining,
    getVipStats,
    getVipSubscription,
    canAccessVipBenefit,
    
    // ✅ Appointment utility functions
    getUpcomingAppointments,
    getPendingAppointments,
    getNextAppointment,
    getLastCompletedAppointment,
    
    // ✅ Error/Success handling
    setError,
    clearError,
    setSuccess,
    clearSuccess
  };
};

export default useAppStore;