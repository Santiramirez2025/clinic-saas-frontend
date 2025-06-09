// store/useAppStore.js - CORREGIDO Y OPTIMIZADO PARA STRICTMODE
import { useState, useEffect, useCallback, useRef } from 'react';
import ApiService from '../services/api.js';

// ✅ RATE LIMITER mejorado
const createRateLimiter = () => {
  const requests = new Map();
  const WINDOW_MS = 60000; // 1 minuto
  const MAX_REQUESTS = 25; // Más conservador

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
    vipStatus: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: false,
    error: null,
    successMessage: null,
    // ✅ Servicios hardcodeados
    services: [
      {
        id: 1,
        name: 'Limpieza Facial',
        duration: 60,
        price: 8500,
        description: 'Limpieza profunda con extracción de comedones y mascarilla hidratante',
        icon: '🧴',
        category: 'Facial',
        popular: true
      },
      {
        id: 2,
        name: 'Botox',
        duration: 30,
        price: 25000,
        description: 'Tratamiento antiedad con toxina botulínica para reducir arrugas',
        icon: '💉',
        category: 'Antienvejecimiento',
        popular: true
      },
      {
        id: 3,
        name: 'Relleno de Labios',
        duration: 45,
        price: 18000,
        description: 'Aumento y definición labial con ácido hialurónico',
        icon: '💋',
        category: 'Estética',
        popular: false
      },
      {
        id: 4,
        name: 'Peeling Químico',
        duration: 90,
        price: 12000,
        description: 'Renovación celular profunda para mejorar textura y luminosidad',
        icon: '✨',
        category: 'Tratamiento',
        popular: false
      },
      {
        id: 5,
        name: 'Microdermoabrasión',
        duration: 75,
        price: 9500,
        description: 'Exfoliación mecánica para eliminar células muertas y imperfecciones',
        icon: '🔄',
        category: 'Exfoliación',
        popular: false
      },
      {
        id: 6,
        name: 'Radiofrecuencia',
        duration: 60,
        price: 15000,
        description: 'Tratamiento tensor y reafirmante con tecnología de radiofrecuencia',
        icon: '⚡',
        category: 'Tensor',
        popular: true
      }
    ],
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

  // ✅ getPendingAppointments - función que faltaba
  const getPendingAppointments = useCallback(() => {
    return state.appointments.filter(apt => 
      apt.status === 'PENDING' || apt.status === 'REQUESTED'
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [state.appointments]);

  // ✅ FUNCIÓN CRÍTICA: loadUserData CON PROTECCIONES STRICTMODE
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
          vipStatus: dataCache.current.vipStatus || null
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
          console.log('📊 Loading user data for:', userId);
          
          const startUserId = userId;
          let appointments = [];
          let vipStatus = null;
          
          // ✅ SECUENCIAL 1: Cargar appointments con retry
          console.log('🔄 Loading appointments...');
          try {
            const appointmentsResponse = await api.getUserAppointments(userId);
            if (appointmentsResponse?.success) {
              appointments = appointmentsResponse.data?.appointments || [];
              console.log(`✅ Loaded ${appointments.length} appointments`);
            }
          } catch (error) {
            console.warn('⚠️ Failed to load appointments (non-critical):', error.message);
            if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
              console.log('⏱️ Rate limited on appointments, waiting longer...');
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }

          // ✅ DELAY obligatorio entre llamadas
          console.log('⏱️ Waiting 2 seconds before VIP call...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // ✅ Verificar si el usuario cambió durante la carga
          if (currentUserIdRef.current !== startUserId || !mountedRef.current) {
            console.log('🚫 User changed or component unmounted during load, discarding results');
            return;
          }

          // ✅ SECUENCIAL 2: Cargar VIP status
          console.log('🔄 Loading VIP status...');
          try {
            const vipResponse = await api.getVipStatus(userId);
            if (vipResponse?.success) {
              vipStatus = vipResponse.data;
              console.log('✅ VIP status loaded');
            }
          } catch (error) {
            console.warn('⚠️ Failed to load VIP status (non-critical):', error.message);
          }

          // ✅ Verificar nuevamente si el usuario cambió
          if (currentUserIdRef.current !== startUserId || !mountedRef.current) {
            console.log('🚫 User changed or component unmounted during load, discarding results');
            return;
          }

          // ✅ Actualizar cache
          dataCache.current = {
            appointments,
            vipStatus,
            lastUpdate: Date.now(),
            ttl: 30000
          };

          // ✅ Actualizar state atómicamente solo si está montado
          if (mountedRef.current) {
            setState(prev => ({
              ...prev,
              appointments,
              vipStatus
            }));
          }

          console.log('✅ User data loaded successfully');
          
        } catch (error) {
          console.error('❌ Critical error loading user data:', error);
          
          // Solo mostrar error si no es rate limiting y el componente está montado
          if (!error.message?.includes('429') && !error.message?.includes('Too Many Requests') && mountedRef.current) {
            setError('Error cargando datos del usuario');
          } else if (error.message?.includes('429')) {
            console.log('⚠️ Rate limiting detected, will retry later');
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
  }, [setLoading, setError]);

  // ✅ Initialize authentication CON PROTECCIÓN STRICTMODE MEJORADA
  const initializeAuth = useCallback(async () => {
    // ✅ Protección global - solo ejecutar UNA VEZ
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
      
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        api.setTokens(accessToken, refreshToken);
        const user = api.getCurrentUser();
        
        if (user?.id && mountedRef.current) {
          console.log('✅ User found in storage:', user.id);
          
          setState(prev => ({
            ...prev,
            user: user,
            isAuthenticated: true
          }));
          
          currentUserIdRef.current = user.id;
          
          // ✅ Cargar datos con delay para evitar race conditions
          setTimeout(() => {
            if (mountedRef.current) {
              loadUserData(user.id, true);
            }
          }, 1000);
        }
      } else {
        console.log('ℹ️ No stored tokens found');
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      globalAuthInitialized = false; // Permitir retry
      logout();
    } finally {
      if (mountedRef.current) {
        setInitializing(false);
      }
    }
  }, [loadUserData, setInitializing]);

  // ✅ Session refresh mejorado
  const refreshUserSession = useCallback(async () => {
    const userId = currentUserIdRef.current;
    
    if (!userId || loadingRef.current || globalDataLoading || !mountedRef.current) {
      console.log('🚫 Cannot refresh session - no user, already loading, or not mounted');
      return;
    }
    
    console.log('🔄 Refreshing user session for:', userId);
    
    // Invalidar cache para forzar recarga
    dataCache.current.lastUpdate = 0;
    await loadUserData(userId, false);
  }, [loadUserData]);

  // ✅ Auth functions mejoradas
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.login(email, password);
      
      if (response.success && response.data && mountedRef.current) {
        const user = response.data.user;
        
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
      
      const response = await api.register(userData);
      
      if (response.success && response.data && mountedRef.current) {
        const user = response.data.user;
        
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
      lastUpdate: 0,
      ttl: 30000
    };
    
    // Limpiar rate limiter
    rateLimiter.clearAll();
    
    if (mountedRef.current) {
      setState(prev => ({
        ...prev,
        user: null,
        appointments: [],
        vipStatus: null,
        isAuthenticated: false,
        error: null,
        successMessage: null
      }));
    }
  }, []);

  // ✅ Appointment functions con protecciones mejoradas
  const addAppointment = useCallback(async (appointmentData) => {
    if (!rateLimiter.canMakeRequest('add-appointment')) {
      throw new Error('Demasiadas solicitudes. Espera un momento.');
    }

    try {
      setLoading(true);
      clearError();
      
      const response = await api.createAppointment(appointmentData);
      
      if (response.success && mountedRef.current) {
        setState(prev => ({
          ...prev,
          appointments: [...prev.appointments, response.data]
        }));
        
        // Invalidar cache
        dataCache.current.lastUpdate = 0;
        setSuccess('Cita agendada exitosamente');
      }
      
      return response;
    } catch (error) {
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
    try {
      setLoading(true);
      clearError();
      
      const response = await api.updateAppointment(appointmentId, updates);
      
      if (response.success && mountedRef.current) {
        setState(prev => ({
          ...prev,
          appointments: prev.appointments.map(apt => 
            apt.id === appointmentId ? response.data : apt
          )
        }));
        
        dataCache.current.lastUpdate = 0;
        setSuccess('Cita actualizada exitosamente');
      }
      
      return response;
    } catch (error) {
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

  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.cancelAppointment(appointmentId);
      
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

  const getAvailableSlots = useCallback(async (date) => {
    try {
      const response = await api.getAvailableSlots(date);
      if (response.success) {
        return response.data.availableSlots;
      }
      return [];
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }, []);

  // ✅ VIP functions con protecciones
  const subscribeVip = useCallback(async (months = 1) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.subscribeVip(months);
      
      if (response.success && mountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          vipStatus: response.data,
          user: { ...prev.user, isVIP: true }
        }));
        
        dataCache.current.lastUpdate = 0;
        setSuccess('¡Suscripción VIP activada exitosamente!');
      }
      
      return response;
    } catch (error) {
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

  const unsubscribeVip = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.unsubscribeVip();
      
      if (response.success && mountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          vipStatus: { ...prev.vipStatus, isVIP: false, active: false },
          user: { ...prev.user, isVIP: false }
        }));
        
        dataCache.current.lastUpdate = 0;
        setSuccess('Suscripción VIP cancelada');
      }
      
      return response;
    } catch (error) {
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

  // ✅ Utility functions
  const getUpcomingAppointments = useCallback(() => {
    const now = new Date();
    return state.appointments.filter(apt => {
      const appointmentDateTime = new Date(`${apt.date}T${apt.time}:00`);
      return appointmentDateTime > now && apt.status === 'SCHEDULED';
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`);
      const dateB = new Date(`${b.date}T${b.time}:00`);
      return dateA - dateB;
    });
  }, [state.appointments]);

  const getPastAppointments = useCallback(() => {
    return state.appointments.filter(apt => 
      apt.status === 'COMPLETED'
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [state.appointments]);

  const getNextAppointment = useCallback(() => {
    const upcoming = getUpcomingAppointments();
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [getUpcomingAppointments]);

  const getLastCompletedAppointment = useCallback(() => {
    const past = getPastAppointments();
    return past.length > 0 ? past[0] : null;
  }, [getPastAppointments]);

  const isVipActive = useCallback(() => {
    return state.vipStatus?.isVIP || state.user?.isVIP || false;
  }, [state.vipStatus?.isVIP, state.user?.isVIP]);

  const getVipDaysRemaining = useCallback(() => {
    if (!state.vipStatus?.daysRemaining) return 0;
    return Math.max(0, state.vipStatus.daysRemaining);
  }, [state.vipStatus?.daysRemaining]);

  // ✅ Initialize auth check on mount - CON PROTECCIÓN STRICTMODE
  useEffect(() => {
    // ✅ Marcar como montado
    mountedRef.current = true;
    
    // ✅ Protección local del store
    if (storeInitialized.current) {
      console.log('🚫 Store already initialized locally, skipping...');
      return;
    }

    // ✅ Protección global para evitar múltiples instancias
    if (globalStoreInstance && globalStoreInstance !== 'current') {
      console.log('🚫 Another store instance exists, skipping...');
      return;
    }

    console.log('🚀 Mounting useAppStore');
    storeInitialized.current = true;
    globalStoreInstance = 'current';
    
    // ✅ Delay mínimo para evitar race conditions en StrictMode
    setTimeout(() => {
      if (mountedRef.current && !globalAuthInitialized) {
        initializeAuth();
      }
    }, 100);
    
    return () => {
      mountedRef.current = false;
      // Solo resetear si esta instancia es la global
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

  // ✅ Debug effect mejorado - solo en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Store state changed:', {
        isAuthenticated: state.isAuthenticated,
        userId: state.user?.id,
        appointmentsCount: state.appointments?.length || 0,
        isLoading: state.isLoading,
        isInitializing: state.isInitializing,
        mounted: mountedRef.current
      });
    }
  }, [state.isAuthenticated, state.user?.id, state.appointments?.length, state.isLoading, state.isInitializing]);

  // ✅ RETURN COMPLETO
  return { 
    // State
    ...state,
    
    // Auth functions
    login,
    register,
    logout,
    initializeAuth,
    refreshUserSession,
    
    // Data functions
    loadUserData,
    
    // Appointment functions
    addAppointment,
    updateAppointment,
    cancelAppointment,
    getAvailableSlots,
    
    // VIP functions
    subscribeVip,
    unsubscribeVip,
    
    // Utility functions
    getUpcomingAppointments,
    getPastAppointments,
    getPendingAppointments, // ✅ Añadida función que faltaba
    getNextAppointment,
    getLastCompletedAppointment,
    isVipActive,
    getVipDaysRemaining,
    
    // Error/Success handling
    setError,
    clearError,
    setSuccess,
    clearSuccess
  };
};

export default useAppStore;