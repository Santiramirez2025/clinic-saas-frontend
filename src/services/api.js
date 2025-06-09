// services/api.js - MEJORADO Y OPTIMIZADO
const API_BASE_URL = 'http://localhost:3000/api/v1';

class ApiService {
  constructor() {
    this.accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    this.refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    
    // ✅ Rate limiting y cache mejorados
    this.pendingRequests = new Map();
    this.requestTimestamps = new Map();
    this.requestCounts = new Map(); // Contador por minuto
    this.isRefreshing = false;
    this.refreshPromise = null;
    
    // ✅ Configuración optimizada
    this.rateLimitConfig = {
      maxRequestsPerMinute: 30, // Límite por minuto más realista
      minTimeBetweenSameRequests: 1000,
      retryDelay: 1500, // Reducido para mejor UX
      maxRetries: 3, // Aumentado para mayor resiliencia
      timeWindow: 60000 // 1 minuto
    };

    // ✅ Auto-cleanup cada 5 minutos
    this.setupCleanupTimer();
  }

  // ✅ Cleanup automático para evitar memory leaks
  setupCleanupTimer() {
    setInterval(() => {
      this.cleanupOldRequests();
    }, 300000); // 5 minutos
  }

  cleanupOldRequests() {
    const now = Date.now();
    const cutoff = now - this.rateLimitConfig.timeWindow * 2; // 2 minutos atrás
    
    let cleaned = 0;
    for (const [key, timestamp] of this.requestTimestamps) {
      if (timestamp < cutoff) {
        this.requestTimestamps.delete(key);
        this.requestCounts.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} old request entries`);
    }
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    
    // ✅ Limpiar todo el cache
    this.pendingRequests.clear();
    this.requestTimestamps.clear();
    this.requestCounts.clear();
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  // ✅ Generar clave única más específica
  generateRequestKey(endpoint, options = {}) {
    const method = options.method || 'GET';
    const body = options.body || '';
    const userId = this.getCurrentUser()?.id || 'anonymous';
    return `${method}:${endpoint}:${userId}:${body}`;
  }

  // ✅ Rate limiting mejorado con ventana deslizante
  shouldThrottleRequest(requestKey, endpoint) {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.timeWindow;
    
    // Verificar rate limiting por tipo de request
    const baseKey = endpoint.split('?')[0]; // Sin query params
    
    // Contar requests en la ventana actual
    let requestsInWindow = 0;
    for (const [key, timestamp] of this.requestTimestamps) {
      if (key.includes(baseKey) && timestamp > windowStart) {
        requestsInWindow++;
      }
    }
    
    if (requestsInWindow >= this.rateLimitConfig.maxRequestsPerMinute) {
      console.warn(`🚫 Rate limit exceeded for ${baseKey}: ${requestsInWindow} requests in last minute`);
      return true;
    }
    
    // Verificar tiempo mínimo entre requests idénticos
    const lastRequestTime = this.requestTimestamps.get(requestKey);
    if (lastRequestTime && (now - lastRequestTime) < this.rateLimitConfig.minTimeBetweenSameRequests) {
      console.warn(`🚫 Too soon for identical request: ${requestKey}`);
      return true;
    }
    
    return false;
  }

  // ✅ Retry mejorado con jitter
  async retryWithBackoff(fn, retries = 0, endpoint = '') {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error.message.includes('429') || 
                         error.message.includes('Too Many Requests') ||
                         error.message.includes('Demasiadas solicitudes');
      
      if (isRateLimit && retries < this.rateLimitConfig.maxRetries) {
        // Jitter para evitar thundering herd
        const baseDelay = this.rateLimitConfig.retryDelay * Math.pow(1.5, retries);
        const jitter = Math.random() * 1000; // 0-1000ms de jitter
        const delay = baseDelay + jitter;
        
        console.warn(`⏰ Rate limited on ${endpoint}, retrying in ${Math.round(delay)}ms (attempt ${retries + 1}/${this.rateLimitConfig.maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryWithBackoff(fn, retries + 1, endpoint);
      }
      
      // Si no es rate limiting o se agotaron los reintentos
      if (isRateLimit && retries >= this.rateLimitConfig.maxRetries) {
        console.error(`❌ Max retries exceeded for ${endpoint} due to rate limiting`);
        throw new Error('Servicio temporalmente ocupado. Intenta en unos minutos.');
      }
      
      throw error;
    }
  }

  async request(endpoint, options = {}) {
    const requestKey = this.generateRequestKey(endpoint, options);
    
    // ✅ Verificar si hay una petición idéntica en curso
    if (this.pendingRequests.has(requestKey)) {
      console.log('📋 Reusing pending request for:', endpoint);
      return this.pendingRequests.get(requestKey);
    }
    
    // ✅ Verificar rate limiting
    if (this.shouldThrottleRequest(requestKey, endpoint)) {
      const error = new Error('Demasiadas solicitudes de citas');
      error.isRateLimit = true;
      throw error;
    }
    
    // ✅ Crear la promesa de la petición
    const requestPromise = this.executeRequest(endpoint, options);
    
    // ✅ Guardar en cache
    this.pendingRequests.set(requestKey, requestPromise);
    this.requestTimestamps.set(requestKey, Date.now());
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      // ✅ Limpiar cache al completar
      this.pendingRequests.delete(requestKey);
    }
  }

  async executeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    // ✅ Wrapper para retry con backoff
    return this.retryWithBackoff(async () => {
      try {
        console.log('🔥 Making request to:', url);
        
        // ✅ Timeout para evitar requests colgados
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // ✅ Manejo específico de códigos de error
          if (response.status === 429) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.error || 'Demasiadas solicitudes de citas');
            error.isRateLimit = true;
            error.retryAfter = response.headers.get('Retry-After');
            throw error;
          }
          
          if (response.status === 401) {
            const refreshSuccess = await this.tryRefreshToken();
            if (refreshSuccess) {
              // Retry con nuevo token
              config.headers.Authorization = `Bearer ${this.accessToken}`;
              const retryResponse = await fetch(url, config);
              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            }
            
            this.clearTokens();
            const error = new Error('Sesión expirada. Inicia sesión nuevamente.');
            error.isAuthError = true;
            throw error;
          }
          
          if (response.status === 403) {
            const error = new Error('No tienes permisos para realizar esta acción.');
            error.isForbidden = true;
            throw error;
          }
          
          if (response.status >= 500) {
            const error = new Error('Error del servidor. Intenta más tarde.');
            error.isServerError = true;
            throw error;
          }
          
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || `Error HTTP: ${response.status}`);
        }

        return await response.json();
        
      } catch (error) {
        // ✅ Logging mejorado
        if (error.name === 'AbortError') {
          console.error('⏰ Request timeout for:', url);
          throw new Error('La solicitud tardó demasiado. Intenta nuevamente.');
        }
        
        if (error.isRateLimit) {
          console.warn('⚠️ Rate limit hit for:', url);
        } else if (error.isAuthError) {
          console.warn('🔐 Auth error for:', url);
        } else if (error.isServerError) {
          console.error('🔥 Server error for:', url);
        } else {
          console.error('❌ Request failed for:', url, error.message);
        }
        
        throw error;
      }
    }, 0, endpoint);
  }

  // ✅ Refresh token mejorado
  async tryRefreshToken() {
    if (!this.refreshToken) {
      console.log('❌ No refresh token available');
      return false;
    }
    
    if (this.isRefreshing && this.refreshPromise) {
      console.log('⏳ Waiting for existing token refresh...');
      return await this.refreshPromise;
    }
    
    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async performTokenRefresh() {
    try {
      console.log('🔄 Refreshing access token...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos para refresh
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          this.setTokens(data.data.accessToken, data.data.refreshToken || this.refreshToken);
          console.log('✅ Token refreshed successfully');
          return true;
        }
      }
      
      console.warn('⚠️ Token refresh failed - invalid response');
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('⏰ Token refresh timeout');
      } else {
        console.error('❌ Token refresh error:', error.message);
      }
    }
    
    return false;
  }

  // 🎯 Auth methods
  async login(email, password) {
    this.clearCache();
    
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.tokens) {
      this.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      console.log('✅ Login successful');
    }
    
    return response;
  }

  async register(userData) {
    this.clearCache();
    
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data?.tokens) {
      this.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      console.log('✅ Registration successful');
    }
    
    return response;
  }

  // ✅ Appointment methods mejorados
  async getUserAppointments(userId, filters = {}) {
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.warn('⚠️ Invalid userId for getUserAppointments:', userId);
      throw new Error('ID de usuario inválido');
    }
    
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = `/appointments/${userId}${queryString ? `?${queryString}` : ''}`;
    
    console.log('📅 Fetching appointments for user:', userId);
    
    const response = await this.request(endpoint);
    
    // ✅ Validar respuesta
    if (response.success && response.data) {
      console.log(`✅ Loaded ${response.data.appointments?.length || 0} appointments`);
    }
    
    return response;
  }

  async createAppointment(appointmentData) {
    // ✅ Validación previa
    if (!appointmentData.userId) {
      throw new Error('ID de usuario requerido para crear cita');
    }
    
    const response = await this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    
    if (response.success) {
      this.invalidateAppointmentCache();
      console.log('✅ Appointment created successfully');
    }
    
    return response;
  }

  // ✅ VIP methods mejorados
  async getVipStatus(userId) {
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.warn('⚠️ Invalid userId for getVipStatus:', userId);
      throw new Error('ID de usuario inválido');
    }
    
    console.log('👑 Fetching VIP status for user:', userId);
    
    const response = await this.request(`/vip/${userId}`);
    
    if (response.success) {
      console.log('✅ VIP status loaded successfully');
    }
    
    return response;
  }

  async subscribeVip(months = 1) {
    if (months < 1 || months > 12) {
      throw new Error('Los meses deben estar entre 1 y 12');
    }
    
    const response = await this.request('/vip/subscribe', {
      method: 'POST',
      body: JSON.stringify({ months }),
    });
    
    if (response.success) {
      this.invalidateVipCache();
      console.log(`✅ VIP subscription for ${months} months successful`);
    }
    
    return response;
  }

  // ✅ Cache management mejorado
  invalidateAppointmentCache() {
    console.log('🗑️ Invalidating appointment cache');
    const keysToDelete = [];
    
    for (const [key] of this.pendingRequests) {
      if (key.includes('/appointments/')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.pendingRequests.delete(key);
      this.requestTimestamps.delete(key);
    });
    
    console.log(`🗑️ Cleared ${keysToDelete.length} appointment cache entries`);
  }

  invalidateVipCache() {
    console.log('🗑️ Invalidating VIP cache');
    const keysToDelete = [];
    
    for (const [key] of this.pendingRequests) {
      if (key.includes('/vip/')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.pendingRequests.delete(key);
      this.requestTimestamps.delete(key);
    });
    
    console.log(`🗑️ Cleared ${keysToDelete.length} VIP cache entries`);
  }

  clearCache() {
    console.log('🧹 Clearing all request cache');
    this.pendingRequests.clear();
    this.requestTimestamps.clear();
    this.requestCounts.clear();
  }

  // ✅ Debug methods mejorados
  getCacheStatus() {
    return {
      pendingRequests: this.pendingRequests.size,
      requestTimestamps: this.requestTimestamps.size,
      isRefreshing: this.isRefreshing,
      hasTokens: !!(this.accessToken && this.refreshToken)
    };
  }

  getRequestStats() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    let recentRequests = 0;
    for (const [key, timestamp] of this.requestTimestamps) {
      if (timestamp > oneMinuteAgo) {
        recentRequests++;
      }
    }
    
    return {
      recentRequests,
      rateLimitHit: recentRequests >= this.rateLimitConfig.maxRequestsPerMinute,
      cacheSize: this.pendingRequests.size
    };
  }

  // Utility methods
  isAuthenticated() {
    return !!this.accessToken;
  }

  logout() {
    console.log('🚪 API Service logout');
    this.clearTokens();
  }

  getCurrentUser() {
    if (!this.accessToken) return null;
    
    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        isVIP: payload.isVIP,
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // ✅ Health check
  async healthCheck() {
    try {
      const response = await this.request('/health');
      return response.success;
    } catch (error) {
      console.error('❌ API health check failed:', error);
      return false;
    }
  }
}

export default ApiService;