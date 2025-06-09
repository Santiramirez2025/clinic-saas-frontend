// services/api.js - ACTUALIZADO para backend en Render
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
          this.clearTokens();
          throw new Error('Sesión expirada. Inicia sesión nuevamente.');
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

  // Auth methods - CORREGIDOS
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

  // User methods - CORREGIDOS
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

  // Appointment methods - CORREGIDOS
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

  async cancelAppointment(appointmentId, reason) {
    const response = await this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response;
  }

  async getAvailableSlots(date, serviceId) {
    const response = await this.request(`/appointments/available?date=${date}&serviceId=${serviceId}`);
    return response;
  }

  async getAppointmentStats() {
    const response = await this.request('/appointments/stats');
    return response;
  }

  // VIP methods - CORREGIDOS
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

  // Services methods
  async getServices() {
    const response = await this.request('/services');
    return response;
  }

  async getServiceById(serviceId) {
    const response = await this.request(`/services/${serviceId}`);
    return response;
  }

  // Tips methods
  async getTips() {
    const response = await this.request('/tips');
    return response;
  }

  async getTipById(tipId) {
    const response = await this.request(`/tips/${tipId}`);
    return response;
  }

  // Notifications methods
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

  // Clinic methods
  async getClinicInfo() {
    const response = await this.request('/clinics/current');
    return response;
  }

  // Utility methods
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

  // Test connection method
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

  // Demo login method for testing
  async demoLogin() {
    return this.login('test@example.com', 'password123');
  }
}

export default ApiService;