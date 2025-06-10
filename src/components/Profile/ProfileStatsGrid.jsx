import React from 'react';

const ProfileStatsGrid = ({ stats = [] }) => {
  const StatCard = ({ stat, index }) => {
    const Icon = stat.icon;
    return (
      <div 
        className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-xl ${stat.bgColor}`}>
            <Icon size={20} className={stat.color} />
          </div>
          <span className="text-xs text-gray-500 font-medium">↗</span>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-600">{stat.label}</p>
          <p className="text-xs text-green-600 font-medium">{stat.change}</p>
        </div>
      </div>
    );
  };

  if (!stats.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
};

export default ProfileStatsGrid;