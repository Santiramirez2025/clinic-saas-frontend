import React from 'react';
import { Activity } from 'lucide-react';
import ProfileActivityItem from './ProfileActivityItem';

const ProfileRecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        {activities.length === 0 && (
          <span className="text-sm text-gray-500">Sin actividad</span>
        )}
      </div>
      
      {activities.length > 0 ? (
        <div className="space-y-2">
          {activities.map(activity => (
            <ProfileActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Sin actividad reciente</p>
          <p className="text-sm text-gray-400">
            Tu actividad aparecerá aquí cuando comiences a usar la aplicación
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileRecentActivity;