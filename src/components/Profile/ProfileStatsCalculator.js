import { Activity, TrendingUp, Star, Heart } from 'lucide-react';

// Función para calcular estadísticas del perfil
export const calculateProfileStats = (appointments = []) => {
  const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED');
  const totalSpent = completedAppointments.reduce((sum, apt) => sum + (apt.finalPrice || 0), 0);
  const vipSavings = completedAppointments.reduce((sum, apt) => {
    if (apt.vipDiscount > 0) {
      return sum + (apt.originalPrice - apt.finalPrice);
    }
    return sum;
  }, 0);

  // Citas de este mes
  const thisMonthAppointments = completedAppointments.filter(apt => {
    const date = new Date(apt.date);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return date > monthAgo;
  }).length;

  // Próximas citas
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    const now = new Date();
    return appointmentDate > now && (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
  });

  return [
    { 
      label: 'Servicios realizados', 
      value: completedAppointments.length.toString(), 
      icon: Activity, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: `${thisMonthAppointments} este mes`
    },
    { 
      label: 'Ahorro total VIP', 
      value: vipSavings > 0 ? `$${vipSavings.toLocaleString()}` : '$0', 
      icon: TrendingUp, 
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: vipSavings > 0 ? 'Activo' : 'Inactivo'
    },
    { 
      label: 'Total invertido', 
      value: `$${totalSpent.toLocaleString()}`, 
      icon: Star, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      change: 'Historial completo'
    },
    { 
      label: 'Citas programadas', 
      value: upcomingAppointments.length.toString(), 
      icon: Heart, 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      change: 'Próximas'
    }
  ];
};

export default calculateProfileStats;