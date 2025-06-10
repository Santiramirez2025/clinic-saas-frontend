// services/api.js - VERSIÓN OPTIMIZADA COMPLETA
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://clinic-backend-z0d0.onrender.com/api'
  : 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    this.refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    this.requestCount = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.lastRequestTime = null;
  }

  // ===============================
  // CORE METHODS
  // ===============================
  setTokens(accessToken, refreshToken = null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    // Track request
    this.requestCount++;
    this.lastRequestTime = Date.now();
    const startTime = Date.now();

    try {
      console.log('🔥 Making request to:', url);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        this.failureCount++;
        
        if (response.status === 401) {
          // Solo limpiar tokens si NO es un endpoint de login/register
          if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
            this.clearTokens();
            throw new Error('Sesión expirada. Inicia sesión nuevamente.');
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Credenciales inválidas');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      this.successCount++;
      const responseTime = Date.now() - startTime;
      console.log(`✅ Request successful in ${responseTime}ms`);
      
      return await response.json();
    } catch (error) {
      this.failureCount++;
      console.error('❌ Request failed for:', url, error.message);
      throw error;
    }
  }

  // ===============================
  // AUTH METHODS
  // ===============================
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      this.setTokens(response.data.token, null);
      console.log('✅ Login successful');
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data?.token) {
      this.setTokens(response.data.token, null);
      console.log('✅ Registration successful');
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.log('Logout request failed, clearing tokens anyway');
    }
    
    this.clearTokens();
    console.log('🚪 API Service logout');
  }

  async getCurrentUser() {
    const response = await this.request('/auth/profile');
    return response;
  }

  // ===============================
  // USER PROFILE METHODS
  // ===============================
  async updateUserProfile(userData) {
    const response = await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  }

  // ✅ CRÍTICO: Upload de avatar para ProfileView
  async uploadUserAvatar(file) {
    // Validar archivo
    if (!file) {
      throw new Error('No se proporcionó archivo');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      throw new Error('El archivo es demasiado grande. Máximo 5MB.');
    }
    
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen.');
    }
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await this.request('/auth/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it for FormData
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
      },
    });
    return response;
  }

  // ✅ CRÍTICO: Estadísticas para ProfileView
  async getUserStats(period = 'month') {
    const response = await this.request(`/users/stats?period=${period}`);
    return response;
  }

  // ✅ CRÍTICO: Actividad reciente para ProfileView
  async getUserActivity(page = 1, limit = 10) {
    const response = await this.request(`/users/activity?page=${page}&limit=${limit}`);
    return response;
  }

  // ✅ Preferencias de usuario
  async getUserPreferences() {
    const response = await this.request('/users/preferences');
    return response;
  }

  async updateUserPreferences(preferences) {
    const response = await this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
    return response;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    return response;
  }

  // ===============================
  // APPOINTMENT METHODS - CORE
  // ===============================
  async getUserAppointments(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.upcoming) queryParams.append('upcoming', filters.upcoming);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = `/appointments${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request(endpoint);
    return response;
  }

  async getAppointmentById(appointmentId) {
    const response = await this.request(`/appointments/${appointmentId}`);
    return response;
  }

  async createAppointment(appointmentData) {
    // ✅ Validar datos antes de enviar
    const validation = this.validateAppointmentData(appointmentData);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    const response = await this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    return response;
  }

  async updateAppointment(appointmentId, updates) {
    const response = await this.request(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response;
  }

  async cancelAppointment(appointmentId, reason = 'Usuario canceló') {
    const response = await this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response;
  }

  // ✅ CRÍTICO: Horarios disponibles para NewAppointmentForm
  async getAvailableSlots(date, serviceId, options = {}) {
    const queryParams = new URLSearchParams({
      date,
      serviceId,
      ...options
    });
    
    const response = await this.request(`/appointments/available?${queryParams.toString()}`);
    
    // ✅ Extraer solo los slots del response
    if (response?.success && response.data?.availableSlots) {
      return response.data.availableSlots;
    }
    return [];
  }

  async getAppointmentStats(period = 'month') {
    const response = await this.request(`/appointments/stats?period=${period}`);
    return response;
  }

  // ===============================
  // APPOINTMENT METHODS - ADVANCED
  // ===============================
  
  // ✅ CRÍTICO: Enviar recordatorio para AppointmentView
  async sendAppointmentReminder(appointmentId) {
    const response = await this.request(`/appointments/${appointmentId}/reminder`, {
      method: 'POST'
    });
    return response;
  }

  async rescheduleAppointment(appointmentId, newDate, newTime, reason = 'Reprogramación solicitada') {
    const response = await this.request(`/appointments/${appointmentId}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ newDate, newTime, reason })
    });
    return response;
  }

  async confirmAppointment(appointmentId) {
    const response = await this.request(`/appointments/${appointmentId}/confirm`, {
      method: 'POST'
    });
    return response;
  }

  async completeAppointment(appointmentId, notes = '') {
    const response = await this.request(`/appointments/${appointmentId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
    return response;
  }

  // ✅ Crear cita con reintentos automáticos
  async createAppointmentWithRetry(appointmentData, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const validation = this.validateAppointmentData(appointmentData);
        if (!validation.isValid) {
          throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }
        
        const response = await this.createAppointment(appointmentData);
        return response;
      } catch (error) {
        lastError = error;
        console.warn(`Intento ${attempt} falló:`, error.message);
        
        if (attempt < maxRetries) {
          // Backoff exponencial
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError;
  }

  // ===============================
  // VIP METHODS
  // ===============================
  async getVipStatus() {
    const response = await this.request('/vip/status');
    return response;
  }

  async getVipBenefits() {
    const response = await this.request('/vip/benefits');
    return response;
  }

  async subscribeVip(planType = 'monthly') {
    const response = await this.request('/vip/subscribe', {
      method: 'POST',
      body: JSON.stringify({ 
        planType,
        paymentMethod: 'demo' 
      }),
    });
    return response;
  }

  async cancelVipSubscription(reason = 'User request') {
    const response = await this.request('/vip/cancel', {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response;
  }

  async getVipHistory() {
    const response = await this.request('/vip/history');
    return response;
  }

  async getVipStats() {
    const response = await this.request('/vip/stats');
    return response;
  }

  async updateVipPlan(planType) {
    const response = await this.request('/vip/update', {
      method: 'POST',
      body: JSON.stringify({ planType })
    });
    return response;
  }

  // ===============================
  // SERVICES METHODS
  // ===============================
  async getServices() {
    const response = await this.request('/services');
    return response;
  }

  async getServiceById(serviceId) {
    const response = await this.request(`/services/${serviceId}`);
    return response;
  }

  // ✅ Servicios por categoría para NewAppointmentForm
  async getServicesByCategory(category) {
    const response = await this.request(`/services?category=${category}`);
    return response;
  }

  async getServiceReviews(serviceId, page = 1, limit = 10) {
    const response = await this.request(`/services/${serviceId}/reviews?page=${page}&limit=${limit}`);
    return response;
  }

  async createServiceReview(serviceId, rating, comment) {
    const response = await this.request(`/services/${serviceId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        rating,
        comment
      })
    });
    return response;
  }

  // ===============================
  // NOTIFICATIONS METHODS
  // ===============================
  async getNotifications(page = 1, limit = 20) {
    const response = await this.request(`/notifications?page=${page}&limit=${limit}`);
    return response;
  }

  async markNotificationAsRead(notificationId) {
    const response = await this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
    return response;
  }

  async markAllNotificationsAsRead() {
    const response = await this.request('/notifications/read-all', {
      method: 'POST'
    });
    return response;
  }

  async deleteNotification(notificationId) {
    const response = await this.request(`/notifications/${notificationId}`, {
      method: 'DELETE'
    });
    return response;
  }

  async getNotificationSettings() {
    const response = await this.request('/users/notification-settings');
    return response;
  }

  async updateNotificationSettings(settings) {
    const response = await this.request('/users/notification-settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    return response;
  }

  // ===============================
  // CLINIC METHODS
  // ===============================
  async getClinicInfo() {
    const response = await this.request('/clinics/current');
    return response;
  }

  async getClinicSchedule(date) {
    const response = await this.request(`/clinics/schedule?date=${date}`);
    return response;
  }

  // ===============================
  // TIPS METHODS
  // ===============================
  async getTips() {
    const response = await this.request('/tips');
    return response;
  }

  async getTipById(tipId) {
    const response = await this.request(`/tips/${tipId}`);
    return response;
  }

  // ===============================
  // UTILITY METHODS
  // ===============================
  isAuthenticated() {
    return !!this.accessToken;
  }

  getCurrentUserFromToken() {
    if (!this.accessToken) return null;
    
    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      return {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        isVIP: payload.isVIP
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // ✅ CRÍTICO: Validar datos de cita
  validateAppointmentData(appointmentData) {
    const errors = [];
    
    if (!appointmentData.date) {
      errors.push('La fecha es requerida');
    }
    
    if (!appointmentData.time) {
      errors.push('La hora es requerida');
    }
    
    if (!appointmentData.serviceId) {
      errors.push('El servicio es requerido');
    }
    
    // Validar que la fecha sea futura
    if (appointmentData.date && appointmentData.time) {
      const appointmentDate = new Date(`${appointmentData.date}T${appointmentData.time}:00`);
      if (appointmentDate <= new Date()) {
        errors.push('La fecha debe ser futura');
      }
    }
    
    // Validar formato de hora
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (appointmentData.time && !timeRegex.test(appointmentData.time)) {
      errors.push('Formato de hora inválido (HH:MM)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===============================
  // CONNECTION & HEALTH METHODS
  // ===============================
  async healthCheck() {
    try {
      const healthUrl = API_BASE_URL.replace('/api', '') + '/health';
      console.log('🔍 Health check URL:', healthUrl);
      
      const response = await fetch(healthUrl);
      const data = await response.json();
      
      console.log('💓 Health check response:', data);
      return response.ok && data.status === 'OK';
    } catch (error) {
      console.error('❌ API health check failed:', error);
      return false;
    }
  }

  async testConnection() {
    try {
      console.log('🧪 Testing connection to:', API_BASE_URL);
      const isHealthy = await this.healthCheck();
      
      if (isHealthy) {
        console.log('✅ Backend connection successful!');
        return { success: true, message: 'Backend conectado correctamente' };
      } else {
        console.log('❌ Backend health check failed');
        return { success: false, message: 'Backend no responde correctamente' };
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { success: false, message: error.message };
    }
  }

  // ✅ Test completo de conectividad
  async fullConnectionTest() {
    try {
      console.log('🧪 Running full connection test...');
      
      const tests = [
        { name: 'Health Check', test: () => this.healthCheck() },
        { name: 'Services Available', test: () => this.getServices() }
      ];
      
      // Solo agregar tests autenticados si hay token
      if (this.isAuthenticated()) {
        tests.push(
          { name: 'User Profile', test: () => this.getCurrentUser() },
          { name: 'User Appointments', test: () => this.getUserAppointments() },
          { name: 'VIP Status', test: () => this.getVipStatus() }
        );
      }
      
      const results = {};
      
      for (const test of tests) {
        try {
          console.log(`Testing ${test.name}...`);
          const result = await test.test();
          results[test.name] = { success: true, data: result };
          console.log(`✅ ${test.name} passed`);
        } catch (error) {
          results[test.name] = { success: false, error: error.message };
          console.log(`❌ ${test.name} failed:`, error.message);
        }
      }
      
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;
      
      console.log(`🎯 Connection test completed: ${successCount}/${totalCount} passed`);
      
      return {
        success: successCount === totalCount,
        results,
        summary: `${successCount}/${totalCount} tests passed`
      };
    } catch (error) {
      console.error('❌ Full connection test failed:', error);
      return {
        success: false,
        error: error.message,
        summary: 'Connection test failed'
      };
    }
  }

  // ===============================
  // ANALYTICS & STATS METHODS
  // ===============================
  getApiUsageStats() {
    return {
      totalRequests: this.requestCount,
      successfulRequests: this.successCount,
      failedRequests: this.failureCount,
      successRate: this.requestCount > 0 ? ((this.successCount / this.requestCount) * 100).toFixed(2) + '%' : '0%',
      lastRequestTime: this.lastRequestTime ? new Date(this.lastRequestTime).toISOString() : null
    };
  }

  resetApiStats() {
    this.requestCount = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.lastRequestTime = null;
    console.log('📊 API stats reset');
  }

  // ===============================
  // DEMO & TESTING METHODS
  // ===============================
  async demoLogin() {
    return this.login('test@example.com', 'password123');
  }

  // ✅ Test específico para endpoints críticos
  async testCriticalEndpoints() {
    const criticalTests = [];
    
    try {
      // Test endpoints públicos
      const servicesTest = await this.getServices().catch(e => ({ error: e.message }));
      criticalTests.push({ 
        endpoint: 'GET /services', 
        success: !servicesTest.error, 
        result: servicesTest,
        critical: true 
      });
      
      // Test endpoints autenticados si hay token
      if (this.isAuthenticated()) {
        const profileTest = await this.getCurrentUser().catch(e => ({ error: e.message }));
        criticalTests.push({ 
          endpoint: 'GET /auth/profile', 
          success: !profileTest.error, 
          result: profileTest,
          critical: true 
        });
        
        const appointmentsTest = await this.getUserAppointments().catch(e => ({ error: e.message }));
        criticalTests.push({ 
          endpoint: 'GET /appointments', 
          success: !appointmentsTest.error, 
          result: appointmentsTest,
          critical: true 
        });
        
        const vipTest = await this.getVipStatus().catch(e => ({ error: e.message }));
        criticalTests.push({ 
          endpoint: 'GET /vip/status', 
          success: !vipTest.error, 
          result: vipTest,
          critical: false // VIP no es crítico
        });
      }
      
      const criticalPassed = criticalTests.filter(t => t.critical && t.success).length;
      const totalCritical = criticalTests.filter(t => t.critical).length;
      
      return {
        success: criticalPassed === totalCritical,
        results: criticalTests,
        summary: {
          total: criticalTests.length,
          critical: totalCritical,
          criticalPassed,
          allPassed: criticalTests.filter(t => t.success).length,
          status: criticalPassed === totalCritical ? 'HEALTHY' : 'DEGRADED'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: criticalTests,
        summary: { status: 'ERROR' }
      };
    }
  }

  // ===============================
  // MISC UTILITY METHODS
  // ===============================
  
  // ✅ Formatear respuesta para componentes
  formatResponse(response, defaultValue = null) {
    if (!response) return defaultValue;
    
    if (response.success && response.data) {
      return response.data;
    }
    
    if (response.error) {
      console.warn('API Response Error:', response.error);
    }
    
    return defaultValue;
  }

  // ✅ Rate limiting check simple
  canMakeRequest() {
    // Implementación básica - en producción usar librerías especializadas
    return true;
  }

  // ✅ Debug helper
  logEndpointUsage() {
    console.table({
      'Total Requests': this.requestCount,
      'Successful': this.successCount,
      'Failed': this.failureCount,
      'Success Rate': this.getApiUsageStats().successRate,
      'Last Request': this.lastRequestTime ? new Date(this.lastRequestTime).toLocaleTimeString() : 'None'
    });
  }
}

export default ApiService;