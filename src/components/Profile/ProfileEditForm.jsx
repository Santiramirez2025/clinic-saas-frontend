import React from 'react';
import { Mail, Phone, MapPin, Gift, Save, Loader } from 'lucide-react';

const ProfileEditForm = ({ 
  editData = {},
  onEditDataChange,
  onSave,
  onCancel,
  isLoading = false,
  error = null
}) => {
  const handleInputChange = (field, value) => {
    if (onEditDataChange) {
      onEditDataChange({ ...editData, [field]: value });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Información de Contacto</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Mail size={16} />
            <span>Email</span>
          </label>
          <input
            type="email"
            value={editData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="tu@email.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Phone size={16} />
            <span>Teléfono</span>
          </label>
          <input
            type="tel"
            value={editData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="+54 11 1234-5678"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <MapPin size={16} />
            <span>Ubicación</span>
          </label>
          <input
            type="text"
            value={editData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="Ciudad, País"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Gift size={16} />
            <span>Fecha de Nacimiento</span>
          </label>
          <input
            type="date"
            value={editData.birthday || ''}
            onChange={(e) => handleInputChange('birthday', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ProfileEditForm;