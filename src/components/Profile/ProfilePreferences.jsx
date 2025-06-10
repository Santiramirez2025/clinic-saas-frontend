import React from 'react';
import { Bell, Shield, CreditCard, LogOut, ChevronRight } from 'lucide-react';

const ProfilePreferences = ({ onLogout }) => {
  const preferences = [
    {
      icon: Bell,
      title: 'Notificaciones',
      description: 'Recordatorios y promociones',
      enabled: true
    },
    {
      icon: Shield,
      title: 'Privacidad',
      description: 'Configuración de datos',
      enabled: true
    },
    {
      icon: CreditCard,
      title: 'Métodos de pago',
      description: 'Tarjetas y facturación',
      enabled: false
    }
  ];

  const handleTogglePreference = (index) => {
    console.log('Toggle preference:', index);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración</h3>
      <div className="space-y-4">
        {preferences.map((pref, index) => {
          const Icon = pref.icon;
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Icon size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{pref.title}</p>
                  <p className="text-xs text-gray-600">{pref.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleTogglePreference(index)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  pref.enabled ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  pref.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          );
        })}
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors duration-200 text-red-600"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <LogOut size={16} className="text-red-600" />
            </div>
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfilePreferences;