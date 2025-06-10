import React from 'react';
import { Edit3, X } from 'lucide-react';

const ProfileHeader = ({ 
  editMode = false, 
  onToggleEdit, 
  isLoading = false 
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-sm text-gray-600">Gestiona tu información y preferencias</p>
          </div>
          <button
            onClick={onToggleEdit}
            disabled={isLoading}
            className={`p-2 rounded-xl transition-all duration-300 ${
              editMode 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {editMode ? <X size={20} /> : <Edit3 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;