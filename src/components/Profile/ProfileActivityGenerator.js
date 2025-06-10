import { CheckCircle, Crown, Calendar } from 'lucide-react';

// Función para generar actividad reciente del usuario
export const generateRecentActivity = (appointments = [], vipStatus = {}, isVIP = false) => {
  const activities = [];
  
  // Actividad de citas recientes
  const recentCompletedAppointments = appointments
    .filter(apt => apt.status === 'COMPLETED')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 2);

  recentCompletedAppointments.forEach(apt => {
    activities.push({
      id: `apt-${apt.id}`,
      type: 'appointment',
      title: `${apt.service?.name || 'Servicio'} completado`,
      subtitle: `Cita finalizada exitosamente`,
      date: apt.date,
      icon: CheckCircle,
      color: 'text-green-500'
    });
  });

  // Actividad VIP
  if (isVIP && vipStatus?.createdAt) {
    activities.push({
      id: 'vip-active',
      type: 'vip',
      title: 'Estado VIP activo',
      subtitle: 'Beneficios y descuentos disponibles',
      date: vipStatus.createdAt,
      icon: Crown,
      color: 'text-purple-500'
    });
  }

  // Citas programadas
  const upcomingAppointments = appointments
    .filter(apt => {
      const appointmentDate = new Date(apt.date);
      const now = new Date();
      return appointmentDate > now && (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcomingAppointments.length > 0) {
    activities.push({
      id: 'upcoming-apt',
      type: 'appointment',
      title: 'Próxima cita programada',
      subtitle: `${upcomingAppointments[0].service?.name || 'Servicio'}`,
      date: upcomingAppointments[0].date,
      icon: Calendar,
      color: 'text-blue-500'
    });
  }

  return activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
};

export default generateRecentActivity;