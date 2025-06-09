import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Crown, 
  Sparkles, 
  ChevronDown,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Heart,
  Star,
  Gift,
  Calendar,
  User
} from 'lucide-react';

const ModernHeader = ({ title, clinic, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Mock data for demonstration
  const mockClinic = {
    name: 'Belleza Premium',
    logo: '✨',
    primaryColor: '#6366f1',
    accentColor: '#8b5cf6'
  };

  const mockUser = {
    name: 'María González',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=40&h=40&fit=crop&crop=face',
    isVIP: true,
    notifications: 3,
    vipLevel: 'Premium',
    nextAppointment: 'Hoy 14:30'
  };

  const currentClinic = clinic || mockClinic;
  const currentUser = user || mockUser;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Recordatorio de cita',
      message: 'Tu cita de hoy a las 14:30',
      time: '5 min',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'vip',
      title: 'Beneficio VIP disponible',
      message: '20% descuento en tratamientos',
      time: '1 hora',
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 3,
      type: 'reward',
      title: 'Puntos ganados',
      message: '+150 puntos de fidelidad',
      time: '2 horas',
      icon: Star,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const NotificationDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          <span className="text-xs text-gray-500">{notifications.length} nuevas</span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(notification => {
          const Icon = notification.icon;
          return (
            <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl ${notification.bgColor}`}>
                  <Icon size={16} className={notification.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button className="w-full text-center text-indigo-600 hover:text-indigo-800 font-medium text-sm">
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );

  const UserDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full border-2 border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{currentUser.name}</p>
            {currentUser.isVIP && (
              <div className="flex items-center space-x-1">
                <Crown size={14} className="text-yellow-500" />
                <span className="text-xs text-yellow-700 font-medium">{currentUser.vipLevel}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-2">
        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
          <User size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">Mi Perfil</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
          <Settings size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">Configuración</span>
        </button>
        {currentUser.isVIP && (
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors duration-200">
            <Crown size={16} className="text-yellow-500" />
            <span className="text-sm text-yellow-700">Panel VIP</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section - Logo & Title */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl font-bold shadow-lg">
                    {currentClinic.logo}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                    {title || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-600 leading-tight">
                    {currentClinic.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Search (Desktop only) */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className={`relative w-full transition-all duration-300 ${
                searchFocused ? 'scale-105' : 'scale-100'
              }`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className={`transition-colors duration-300 ${
                    searchFocused ? 'text-indigo-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="Buscar servicios, citas, tratamientos..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-0 ${
                    searchFocused 
                      ? 'border-indigo-500 bg-white shadow-lg' 
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                />
              </div>
            </div>

            {/* Right Section - Actions & User */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Search (Mobile) */}
              <button className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Search size={20} />
              </button>

              {/* Quick Action - Next Appointment */}
              {currentUser.nextAppointment && (
                <div className="hidden sm:flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl border border-blue-200">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{currentUser.nextAppointment}</span>
                </div>
              )}

              {/* VIP Status Indicator */}
              {currentUser.isVIP && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 px-3 py-2 rounded-xl border border-yellow-200">
                  <Crown size={16} className="text-yellow-600" />
                  <span className="hidden sm:inline text-sm font-medium">VIP</span>
                </div>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <Bell size={20} />
                  {currentUser.notifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-semibold">
                      {currentUser.notifications > 9 ? '9+' : currentUser.notifications}
                    </div>
                  )}
                </button>
                {showNotifications && <NotificationDropdown />}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-100 group-hover:border-gray-200 transition-colors duration-200"
                    />
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        Hola, {currentUser.name.split(' ')[0]}
                      </p>
                      {currentUser.isVIP && (
                        <p className="text-xs text-yellow-600 font-medium leading-tight">
                          Miembro VIP
                        </p>
                      )}
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : 'rotate-0'
                    }`} />
                  </div>
                </button>
                {showUserMenu && <UserDropdown />}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Title (when logo is compact) */}
        <div className="sm:hidden px-4 pb-3">
          <h1 className="text-lg font-semibold text-gray-900">{title || 'Dashboard'}</h1>
        </div>
      </header>

      {/* Click outside handlers */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </>
  );
};

export default ModernHeader;