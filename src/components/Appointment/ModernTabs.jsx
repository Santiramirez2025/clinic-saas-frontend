import React from 'react';

const ModernTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { 
      key: 'upcoming', 
      label: 'Próximas', 
      count: counts?.upcoming || 0, 
      color: 'bg-blue-500' 
    },
    { 
      key: 'past', 
      label: 'Historial', 
      count: counts?.past || 0, 
      color: 'bg-green-500' 
    },
    { 
      key: 'cancelled', 
      label: 'Canceladas', 
      count: counts?.cancelled || 0, 
      color: 'bg-red-500' 
    }
  ];

  const activeIndex = tabs.findIndex(t => t.key === activeTab);

  return (
    <div className="bg-gray-50 rounded-2xl p-2 relative">
      {/* Indicador animado de fondo */}
      <div 
        className="absolute top-2 bottom-2 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
        style={{
          left: `${2 + (activeIndex * 33.333)}%`,
          width: '31.333%'
        }}
      />
      
      <div className="grid grid-cols-3 relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeTab === tab.key
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <div className={`${tab.color} text-white text-xs px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center`}>
                {tab.count}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModernTabs;