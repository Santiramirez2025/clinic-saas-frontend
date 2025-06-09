import React from 'react';
import { MapPin, Phone, Coffee } from 'lucide-react';

const ClinicInfo = ({ clinic }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-indigo-100 rounded-2xl">
          <MapPin size={20} className="text-indigo-600" />
        </div>
        <h3 className="font-bold text-gray-900">Nuestra Clínica</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">{clinic.address}</p>
            <p className="text-sm text-gray-600">Zona premium, fácil acceso</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone size={16} className="text-gray-400 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">{clinic.phone}</p>
            <p className="text-sm text-gray-600">Atención personalizada 24/7</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Coffee size={16} className="text-gray-400 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Horarios de atención</p>
            <p className="text-sm text-gray-600">Lun - Vie: 9:00 - 19:00 | Sáb: 9:00 - 15:00</p>
          </div>
        </div>
      </div>

      {/* Botón de llamada rápida */}
      <div className="mt-6">
        <a
          href={`tel:${clinic.phone}`}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
        >
          <Phone size={18} />
          <span>Llamar Ahora</span>
        </a>
      </div>
    </div>
  );
};

export default ClinicInfo;