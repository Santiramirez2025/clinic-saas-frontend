import React from 'react';
import { Award, TrendingUp, Heart, Crown } from 'lucide-react';

const StatsAndAchievements = ({ appointments = [], isVIP }) => {
  const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED').length;
  const thisMonthAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    const now = new Date();
    return appointmentDate.getMonth() === now.getMonth() && 
           appointmentDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      label: 'Tratamientos completados',
      value: completedAppointments,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Este mes',
      value: thisMonthAppointments,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Nivel de satisfacción',
      value: '98%',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">Tu Progreso</h3>
        {isVIP && (
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full flex items-center space-x-1">
            <Crown size={10} />
            <span>VIP</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex p-3 rounded-2xl ${stat.bgColor} mb-2`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 leading-tight">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Achievement badge */}
      {completedAppointments >= 5 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Award size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-purple-900 text-sm">
                ¡Cliente Frecuente!
              </p>
              <p className="text-xs text-purple-700">
                Has completado {completedAppointments} tratamientos
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsAndAchievements;