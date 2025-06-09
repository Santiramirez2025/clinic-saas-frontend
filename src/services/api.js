// services/api.js - CORREGIDO para backend
const API_BASE_URL = 'http://localhost:3000/api';

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

  // User methods - CORREGIDOS
  async getCurrentUser() {
    const response = await this.request('/auth/profile');
    return response;
  }

  // Appointment methods - CORREGIDOS
  async getUserAppointments(userId, filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = `/appointments${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request(endpoint);
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
    const response = await this.request(`/appointments/${appointmentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
    return response;
  }

  async getAvailableSlots(date, serviceId) {
    const response = await this.request(`/appointments/available?date=${date}&serviceId=${serviceId}`);
    return response;
  }

  // VIP methods - CORREGIDOS
  async getVipStatus() {
    const response = await this.request('/vip/status');
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

  async unsubscribeVip() {
    const response = await this.request('/vip/cancel', {
      method: 'POST',
      body: JSON.stringify({ reason: 'User request' }),
    });
    return response;
  }

  // Services
  async getServices() {
    const response = await this.request('/services');
    return response;
  }

  // Tips
  async getTips() {
    const response = await this.request('/tips');
    return response;
  }

  // Notifications
  async getNotifications() {
    const response = await this.request('/notifications');
    return response;
  }

  // Utility methods
  isAuthenticated() {
    return !!this.accessToken;
  }

  logout() {
    console.log('🚪 API Service logout');
    this.clearTokens();
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
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ API health check failed:', error);
      return false;
    }
  }
}

export default ApiService;
