import React from 'react';
import { TrendingUp, Calendar, Crown, Heart } from 'lucide-react';

const VipStatsDashboard = ({ 
  vipStats = {}, 
  vipDaysRemaining = 0,
  isVIP = false 
}) => {
  // Configuración de estadísticas
  const stats = [
    { 
      label: 'Ahorro total', 
      value: vipStats?.totalSavings ? `$${vipStats.totalSavings.toLocaleString()}` : '$0', 
      icon: TrendingUp, 
      color: 'text-green-500' 
    },
    { 
      label: 'Servicios este mes', 
      value: vipStats?.appointmentsThisMonth?.toString() || '0', 
      icon: Calendar, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Días VIP restantes', 
      value: vipDaysRemaining?.toString() || '0', 
      icon: Crown, 
      color: 'text-yellow-500' 
    },
    { 
      label: 'Citas completadas', 
      value: vipStats?.completedAppointments?.toString() || '0', 
      icon: Heart, 
      color: 'text-red-500' 
    }
  ];

  if (!isVIP) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={stat.color} />
                <span className="text-xs text-gray-500">VIP</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VipStatsDashboard;