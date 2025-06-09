import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Crown, 
  User, 
  LogOut, 
  Calendar,
  Sparkles,
  Bell,
  Settings
} from 'lucide-react';

const ModernTabBar = ({ activeTab, setActiveTab, onLogout, user, tabs }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll (optional)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Mock user data for demonstration
  const mockUser = {
    isVIP: true,
    notifications: 3,
    name: 'María González'
  };

  const currentUser = user || mockUser;

  // Default tabs with enhanced design
  const defaultTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'Inicio',
      badge: null,
      color: 'text-blue-500',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      activeBgColor: 'bg-blue-100'
    },
    {
      id: 'appointments',
      icon: Calendar,
      label: 'Citas',
      badge: 2,
      color: 'text-green-500',
      activeColor: 'text-green-600',
      bgColor: 'bg-green-50',
      activeBgColor: 'bg-green-100'
    },
    {
      id: 'vip',
      icon: Crown,
      label: 'VIP',
      badge: currentUser?.isVIP ? '★' : 'NEW',
      highlight: currentUser?.isVIP,
      color: 'text-yellow-500',
      activeColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      activeBgColor: 'bg-gradient-to-r from-yellow-100 to-orange-100',
      special: true
    },
    {
      id: 'profile',
      icon: User,
      label: 'Perfil',
      badge: currentUser?.notifications || null,
      color: 'text-purple-500',
      activeColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      activeBgColor: 'bg-purple-100'
    }
  ];

  const tabsToRender = tabs || defaultTabs;

  const handleTabClick = (tabId) => {
    if (tabId === 'logout') {
      onLogout();
    } else {
      setActiveTab(tabId);
      // Haptic feedback (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  const Badge = ({ badge, highlight = false, isActive = false }) => {
    if (!badge) return null;

    const getBadgeStyle = () => {
      if (highlight && isActive) {
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-110';
      }
      if (highlight) {
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md';
      }
      if (typeof badge === 'number') {
        return 'bg-red-500 text-white shadow-md';
      }
      return 'bg-indigo-500 text-white shadow-md';
    };

    return (
      <div className={`absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${getBadgeStyle()}`}>
        {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        {highlight && <Sparkles size={8} className="ml-0.5" />}
      </div>
    );
  };

  const TabButton = ({ tab, isActive }) => {
    const Icon = tab.icon;
    
    return (
      <button
        onClick={() => handleTabClick(tab.id)}
        className={`relative flex-1 py-3 px-1 transition-all duration-300 ease-out group ${
          isActive ? 'transform -translate-y-1' : 'hover:transform hover:-translate-y-0.5'
        }`}
      >
        {/* Background Bubble */}
        <div className={`absolute inset-x-2 inset-y-1 rounded-2xl transition-all duration-300 ${
          isActive 
            ? `${tab.activeBgColor || 'bg-indigo-100'} opacity-100 scale-100` 
            : `${tab.bgColor || 'bg-gray-50'} opacity-0 group-hover:opacity-60 scale-95 group-hover:scale-100`
        }`} />
        
        {/* Content */}
        <div className="relative flex flex-col items-center space-y-1">
          {/* Icon Container */}
          <div className="relative">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isActive 
                ? `${tab.activeBgColor || 'bg-indigo-100'} shadow-lg` 
                : 'group-hover:bg-gray-100'
            }`}>
              <Icon
                size={22}
                className={`transition-all duration-300 ${
                  isActive 
                    ? `${tab.activeColor || 'text-indigo-600'} scale-110` 
                    : `${tab.color || 'text-gray-500'} group-hover:text-gray-700 group-hover:scale-105`
                }`}
              />
            </div>
            <Badge badge={tab.badge} highlight={tab.highlight} isActive={isActive} />
            
            {/* Special VIP glow effect */}
            {tab.special && isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse" />
            )}
          </div>
          
          {/* Label */}
          <span className={`text-xs font-medium transition-all duration-300 ${
            isActive 
              ? `${tab.activeColor || 'text-indigo-600'} font-semibold` 
              : `${tab.color || 'text-gray-500'} group-hover:text-gray-700`
          }`}>
            {tab.label}
          </span>
          
          {/* Active Indicator */}
          {isActive && (
            <div className={`absolute -bottom-1 w-6 h-1 rounded-full transition-all duration-300 ${
              tab.special 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                : `${tab.activeColor?.replace('text-', 'bg-') || 'bg-indigo-600'}`
            }`} />
          )}
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Safe area spacer */}
      <div className="h-20 lg:h-0" />
      
      {/* Main TabBar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Background with blur effect */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50" />
        
        {/* Floating style container */}
        <div className="relative max-w-md mx-auto px-4 pb-safe">
          <div className="bg-white/50 backdrop-blur-sm rounded-t-3xl border-t border-gray-100 shadow-2xl shadow-gray-900/10">
            <div className="flex items-center px-2 py-2">
              {/* Main Navigation Tabs */}
              {tabsToRender.map(tab => (
                <TabButton 
                  key={tab.id} 
                  tab={tab} 
                  isActive={activeTab === tab.id} 
                />
              ))}
              
              {/* Logout Button with special styling */}
              <div className="relative flex-1">
                <button
                  onClick={() => handleTabClick('logout')}
                  className="w-full py-3 px-1 text-red-500 hover:text-red-600 transition-all duration-300 group hover:transform hover:-translate-y-0.5"
                >
                  {/* Background */}
                  <div className="absolute inset-x-2 inset-y-1 bg-red-50 rounded-2xl opacity-0 group-hover:opacity-60 transition-all duration-300 scale-95 group-hover:scale-100" />
                  
                  {/* Content */}
                  <div className="relative flex flex-col items-center space-y-1">
                    <div className="p-2 rounded-xl group-hover:bg-red-100 transition-all duration-300">
                      <LogOut 
                        size={22} 
                        className="transition-all duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <span className="text-xs font-medium">Salir</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom safe area */}
        <div className="h-safe bg-white/90 backdrop-blur-xl" />
      </div>
    </>
  );
};

export default ModernTabBar;