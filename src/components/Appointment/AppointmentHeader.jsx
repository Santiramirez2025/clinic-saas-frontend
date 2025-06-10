import React from 'react';
import { 
  Calendar, 
  Plus, 
  RefreshCw,
  CheckCircle,
  Star
} from 'lucide-react';

const AppointmentHeader = ({ 
  onNewAppointment, 
  onRefresh, 
  isLoading, 
  upcomingCount,
  monthlyStats = { thisMonth: 12, completed: 24, vipActive: true }
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Mis Citas</h1>
          <p className="text-indigo-100 opacity-90">
            {upcomingCount > 0 
              ? `Tienes ${upcomingCount} cita${upcomingCount > 1 ? 's' : ''} próxima${upcomingCount > 1 ? 's' : ''}`
              : "No hay citas programadas"
            }
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            title="Actualizar"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={onNewAppointment}
            className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>
      
      {/* Quick stats con animación */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { 
            label: "Este mes", 
            value: monthlyStats.thisMonth.toString(), 
            icon: Calendar 
          },
          { 
            label: "Completadas", 
            value: monthlyStats.completed.toString(), 
            icon: CheckCircle 
          },
          { 
            label: "VIP Activo", 
            value: monthlyStats.vipActive ? "✨" : "—", 
            icon: Star 
          }
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-2 mb-1">
              <stat.icon size={16} className="text-white/80" />
              <span className="text-sm text-white/80">{stat.label}</span>
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentHeader;