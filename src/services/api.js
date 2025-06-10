// services/api.js - VERSIÓN COMPLETA CON TODAS LAS FUNCIONALIDADES
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://clinic-backend-z0d0.onrender.com/api'
  : 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    this.refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
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

    try {
      console.log('🔥 Making request to:', url);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Solo limpiar tokens si NO es un endpoint de login/register
          if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
            this.clearTokens();
            throw new Error('Sesión expirada. Inicia sesión nuevamente.');
          }
          // Para login/register, usar el mensaje del backend
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Credenciales inválidas');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
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

  // ===============================
  // USER METHODS
  // ===============================
  async getCurrentUser() {
    const response = await this.request('/auth/profile');
    return response;
  }

  async updateUserProfile(userData) {
    const response = await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  }

  // ===============================
  // APPOINTMENT METHODS - BÁSICOS
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
  // APPOINTMENT METHODS - AVANZADOS
  // ===============================

  // 🔔 Enviar recordatorio de cita
  async sendAppointmentReminder(appointmentId) {
    const response = await this.request(`/appointments/${appointmentId}/reminder`, {
      method: 'POST'
    });
    return response;
  }

  // 🔍 Buscar citas con filtros avanzados
  async searchAppointments(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/appointments/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request(endpoint);
    return response;
  }

  // 📊 Estadísticas detalladas
  async getDetailedStats(period = 'month', compareWith = null) {
    const queryParams = new URLSearchParams({ period });
    if (compareWith) queryParams.append('compareWith', compareWith);
    
    const response = await this.request(`/appointments/stats/detailed?${queryParams.toString()}`);
    return response;
  }

  // 🔄 Reprogramar cita
  async rescheduleAppointment(appointmentId, newDate, newTime, reason = 'Reprogramación solicitada') {
    const response = await this.request(`/appointments/${appointmentId}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ newDate, newTime, reason })
    });
    return response;
  }

  // 📊 Verificar disponibilidad en tiempo real
  async checkSlotAvailability(date, time, serviceId) {
    const response = await this.request('/appointments/check-availability', {
      method: 'POST',
      body: JSON.stringify({ date, time, serviceId })
    });
    return response;
  }

  // ✅ Confirmar cita (para staff)
  async confirmAppointment(appointmentId) {
    const response = await this.request(`/appointments/${appointmentId}/confirm`, {
      method: 'POST'
    });
    return response;
  }

  // ✅ Completar cita (para staff)
  async completeAppointment(appointmentId, notes = '') {
    const response = await this.request(`/appointments/${appointmentId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
    return response;
  }

  // 📊 Obtener historial de cambios de una cita
  async getAppointmentHistory(appointmentId) {
    const response = await this.request(`/appointments/${appointmentId}/history`);
    return response;
  }

  // 📄 Exportar citas a PDF/Excel
  async exportAppointments(format = 'pdf', filters = {}) {
    const queryParams = new URLSearchParams({
      format,
      ...filters
    });
    
    const response = await this.request(`/appointments/export?${queryParams.toString()}`, {
      method: 'GET'
    });
    return response;
  }

  // 📱 Generar enlace de videollamada (si aplica)
  async generateVideoCallLink(appointmentId) {
    const response = await this.request(`/appointments/${appointmentId}/video-link`, {
      method: 'POST'
    });
    return response;
  }

  // ===============================
  // APPOINTMENT METHODS - CON RETRY
  // ===============================

  // 🔄 Crear cita con reintentos automáticos
  async createAppointmentWithRetry(appointmentData, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Validar datos antes del intento
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
          // Esperar antes del siguiente intento (backoff exponencial)
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

  // 🔔 Configuración de notificaciones
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

  async getClinicMetrics(period = 'month') {
    const response = await this.request(`/clinics/metrics?period=${period}`);
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

  // 🎯 Validar datos de cita antes de enviar
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
    
    // Validar serviceId es string o número
    if (appointmentData.serviceId && typeof appointmentData.serviceId !== 'string' && typeof appointmentData.serviceId !== 'number') {
      errors.push('ID de servicio inválido');
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

  // ===============================
  // DEMO & TESTING METHODS
  // ===============================
  async demoLogin() {
    return this.login('test@example.com', 'password123');
  }

  // 🧪 Método para testing de endpoints
  async testAllEndpoints() {
    const tests = [];
    
    try {
      // Test auth endpoint
      const authTest = await this.getCurrentUser().catch(e => ({ error: e.message }));
      tests.push({ endpoint: '/auth/profile', success: !authTest.error, result: authTest });
      
      // Test appointments endpoint
      const appointmentsTest = await this.getUserAppointments().catch(e => ({ error: e.message }));
      tests.push({ endpoint: '/appointments', success: !appointmentsTest.error, result: appointmentsTest });
      
      // Test services endpoint
      const servicesTest = await this.getServices().catch(e => ({ error: e.message }));
      tests.push({ endpoint: '/services', success: !servicesTest.error, result: servicesTest });
      
      // Test VIP endpoint
      const vipTest = await this.getVipStatus().catch(e => ({ error: e.message }));
      tests.push({ endpoint: '/vip/status', success: !vipTest.error, result: vipTest });
      
      return {
        success: true,
        results: tests,
        summary: {
          total: tests.length,
          passed: tests.filter(t => t.success).length,
          failed: tests.filter(t => !t.success).length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: tests
      };
    }
  }

  // 📊 Método para obtener estadísticas de uso de API
  getApiUsageStats() {
    // En un entorno real, esto podría trackear llamadas a API
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastRequestTime: null
    };
  }
}

export default ApiService;