import React from 'react';
import { User, Crown, MapPin, Calendar, Camera, Loader } from 'lucide-react';

const ProfileHeroSection = ({ 
  user = {}, 
  isVIP = false, 
  vipStatus = {}, 
  editMode = false,
  editData = {},
  onEditDataChange,
  onAvatarUpload,
  uploading = false
}) => {
  const handleInputChange = (field, value) => {
    if (onEditDataChange) {
      onEditDataChange({ ...editData, [field]: value });
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 lg:p-8 mb-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4 lg:space-x-6 mb-6">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border-4 border-white/20 bg-white/20 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-white/70" />
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader size={20} className="text-white animate-spin" />
                </div>
              )}
            </div>
            
            {editMode && (
              <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Camera size={20} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={onAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          
          {/* User Info Section */}
          <div className="flex-1 min-w-0">
            {editMode ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-white/20 backdrop-blur border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  placeholder="Nombre completo"
                />
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full bg-white/20 backdrop-blur border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none"
                  placeholder="Cuéntanos sobre ti..."
                  rows="2"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl lg:text-3xl font-bold">{user.name}</h2>
                  {isVIP && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full flex items-center space-x-1">
                      <Crown size={16} />
                      <span className="text-sm font-semibold">VIP</span>
                    </div>
                  )}
                </div>
                <p className="text-white/80 mb-2">{user.bio || 'Sin descripción'}</p>
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{user.location || 'Ubicación no especificada'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Miembro desde {new Date(user.createdAt || Date.now()).getFullYear()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* VIP Status */}
        {isVIP && vipStatus && (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">Estado VIP {vipStatus.planType || 'Premium'}</p>
                <p className="text-sm text-white/80">
                  {vipStatus.stats?.daysRemaining ? `${vipStatus.stats.daysRemaining} días restantes` : 'Activo'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Válido hasta</p>
                <p className="font-semibold">
                  {vipStatus.endDate ? new Date(vipStatus.endDate).toLocaleDateString('es-AR') : 'Indefinido'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeroSection;