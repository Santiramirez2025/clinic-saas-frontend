import React from 'react';
import { ChevronRight } from 'lucide-react';
import ProfileAppointmentCard from './ProfileAppointmentCard';

const ProfileUpcomingAppointments = ({ 
  appointments = [], 
  onViewAll 
}) => {
  if (!appointments.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Próximas Citas</h3>
        <button 
          onClick={onViewAll}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center space-x-1"
        >
          <span>Ver todas</span>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {appointments.map(appointment => (
          <ProfileAppointmentCard 
            key={appointment.id} 
            appointment={appointment} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileUpcomingAppointments;