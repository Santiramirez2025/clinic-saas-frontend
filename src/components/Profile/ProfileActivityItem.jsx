import React from 'react';

const ProfileActivityItem = ({ activity }) => {
  const Icon = activity.icon;
  
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
      <div className="p-2 bg-gray-100 rounded-xl">
        <Icon size={16} className={activity.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
        <p className="text-xs text-gray-600">{activity.subtitle}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(activity.date).toLocaleDateString('es-AR')}
        </p>
      </div>
    </div>
  );
};

export default ProfileActivityItem;