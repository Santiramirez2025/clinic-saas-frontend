import React from 'react';
import { Sparkles } from 'lucide-react';

const VipHeroSection = ({ isVIP = false }) => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full mb-6">
        <Sparkles size={16} className="text-indigo-500" />
        <span className="text-sm font-medium text-indigo-700">
          {isVIP ? 'Experiencia Premium Activa' : 'Experiencia Premium te espera'}
        </span>
      </div>
      
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        {isVIP ? (
          <>Tu belleza es <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">VIP</span></>
        ) : (
          <>Belleza sin <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">límites</span></>
        )}
      </h2>
      
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        {isVIP 
          ? 'Disfruta de todos los beneficios exclusivos y la atención premium que mereces'
          : 'Accede a tratamientos exclusivos, descuentos especiales y atención personalizada'
        }
      </p>
    </div>
  );
};

export default VipHeroSection;