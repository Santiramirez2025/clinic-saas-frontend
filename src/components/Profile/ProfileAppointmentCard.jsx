import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const ProfileAppointmentCard = ({ appointment }) => {
  const appointmentDate = new Date(appointment.date);
  const isToday = appointmentDate.toDateString() === new Date().toDateString();
  
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-gray-900">
              {appointment.service?.name || 'Servicio'}
            </h4>
            {(appointment.vipDiscount > 0 || appointment.isVIP) && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                VIP
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {appointment.clinic?.name || 'Clínica Premium'}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{appointmentDate.toLocaleDateString('es-AR')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>
        {isToday && (
          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
            Hoy
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium flex items-center ${
          appointment.status === 'CONFIRMED' ? 'text-green-600' : 'text-blue-600'
        }`}>
          <CheckCircle size={14} className="mr-1" />
          {appointment.status === 'CONFIRMED' ? 'Confirmado' : 'Programado'}
        </span>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default ProfileAppointmentCard;