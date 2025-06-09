import React from 'react';
import { Plus, Repeat, Crown, Users, ArrowRight } from 'lucide-react';

const QuickActionsGrid = ({ 
  onNewAppointment, 
  onRepeatLast, 
  lastAppointment, 
  isLoading, 
  primaryColor, 
  onVIPUpgrade 
}) => {
  const quickActions = [
    {
      id: 'new',
      title: 'Nueva Cita',
      subtitle: 'Reservar ahora',
      icon: Plus,
      gradient: 'from-indigo-500 to-purple-600',
      action: onNewAppointment,
      primary: true
    },
    {
      id: 'repeat',
      title: 'Repetir Último',
      subtitle: lastAppointment ? lastAppointment.service : 'No disponible',
      icon: Repeat,
      gradient: 'from-green-500 to-emerald-600',
      action: onRepeatLast,
      disabled: !lastAppointment
    },
    {
      id: 'vip',
      title: 'Club VIP',
      subtitle: 'Beneficios exclusivos',
      icon: Crown,
      gradient: 'from-yellow-500 to-orange-600',
      action: onVIPUpgrade
    },
    {
      id: 'consultation',
      title: 'Consulta Virtual',
      subtitle: 'Por videollamada',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600',
      action: () => console.log('Virtual consultation')
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {quickActions.map((action, index) => (
        <button
          key={action.id}
          onClick={action.action}
          disabled={action.disabled || isLoading}
          className={`relative p-6 rounded-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group ${
            action.primary 
              ? 'col-span-2 bg-gradient-to-r ' + action.gradient + ' text-white shadow-xl hover:shadow-2xl' 
              : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg'
          }`}
          style={{ 
            animationDelay: `${index * 100}ms`,
            ...(action.primary && { background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)` })
          }}
        >
          {/* Decoración de fondo */}
          <div className={`absolute top-0 right-0 w-16 h-16 opacity-20 ${action.primary ? 'text-white' : 'text-gray-400'}`}>
            <action.icon size={32} className="transform rotate-12 group-hover:rotate-45 transition-transform duration-500" />
          </div>

          <div className="relative z-10 text-left">
            <div className={`inline-flex p-3 rounded-2xl mb-3 ${
              action.primary 
                ? 'bg-white/20 backdrop-blur-sm' 
                : `bg-gradient-to-r ${action.gradient} text-white`
            }`}>
              <action.icon size={20} />
            </div>
            
            <h3 className={`font-bold text-lg mb-1 ${action.primary ? 'text-white' : 'text-gray-900'}`}>
              {action.title}
            </h3>
            <p className={`text-sm ${action.primary ? 'text-white/80' : 'text-gray-600'}`}>
              {action.subtitle}
            </p>
            
            {action.primary && (
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-sm font-medium">Comenzar ahora</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsGrid;