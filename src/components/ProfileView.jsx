import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Crown, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle,
  Edit3,
  Save,
  X,
  MapPin,
  Gift,
  Star,
  TrendingUp,
  Award,
  Heart,
  Sparkles,
  Camera,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight,
  Activity,
  Loader,
  AlertCircle
} from 'lucide-react';

const ModernProfileView = ({ store }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    birthday: '',
    location: ''
  });
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // ✅ Obtener datos reales del store
  const user = store?.user;
  const isVIP = store?.isVipActive?.() || false;
  const vipStatus = store?.vipStatus;
  const appointments = store?.appointments || [];
  const isLoading = store?.isLoading || false;

  // ✅ Filtrar citas próximas del backend
  const upcomingAppointments = appointments
    .filter(apt => {
      const appointmentDate = new Date(apt.date);
      const now = new Date();
      return appointmentDate > now && (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2); // Solo mostrar las próximas 2

  // ✅ Calcular estadísticas reales
  const calculateStats = () => {
    const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED');
    const totalSpent = completedAppointments.reduce((sum, apt) => sum + (apt.finalPrice || 0), 0);
    const vipSavings = completedAppointments.reduce((sum, apt) => {
      if (apt.vipDiscount > 0) {
        return sum + (apt.originalPrice - apt.finalPrice);
      }
      return sum;
    }, 0);

    return [
      { 
        label: 'Servicios realizados', 
        value: completedAppointments.length.toString(), 
        icon: Activity, 
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        change: `${completedAppointments.filter(apt => {
          const date = new Date(apt.date);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return date > monthAgo;
        }).length} este mes`
      },
      { 
        label: 'Ahorro total VIP', 
        value: vipSavings > 0 ? `$${vipSavings.toLocaleString()}` : '$0', 
        icon: TrendingUp, 
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        change: isVIP ? 'Activo' : 'Inactivo'
      },
      { 
        label: 'Total invertido', 
        value: `$${totalSpent.toLocaleString()}`, 
        icon: Star, 
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        change: 'Historial completo'
      },
      { 
        label: 'Citas programadas', 
        value: upcomingAppointments.length.toString(), 
        icon: Heart, 
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        change: 'Próximas'
      }
    ];
  };

  // ✅ Generar actividad reciente real
  const generateRecentActivity = () => {
    const activities = [];
    
    // Actividad de citas recientes
    const recentCompletedAppointments = appointments
      .filter(apt => apt.status === 'COMPLETED')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);

    recentCompletedAppointments.forEach(apt => {
      activities.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        title: `${apt.service?.name || 'Servicio'} completado`,
        subtitle: `Cita finalizada exitosamente`,
        date: apt.date,
        icon: CheckCircle,
        color: 'text-green-500'
      });
    });

    // Actividad VIP
    if (isVIP && vipStatus?.createdAt) {
      activities.push({
        id: 'vip-active',
        type: 'vip',
        title: 'Estado VIP activo',
        subtitle: 'Beneficios y descuentos disponibles',
        date: vipStatus.createdAt,
        icon: Crown,
        color: 'text-purple-500'
      });
    }

    // Citas programadas
    if (upcomingAppointments.length > 0) {
      activities.push({
        id: 'upcoming-apt',
        type: 'appointment',
        title: 'Próxima cita programada',
        subtitle: `${upcomingAppointments[0].service?.name || 'Servicio'}`,
        date: upcomingAppointments[0].date,
        icon: Calendar,
        color: 'text-blue-500'
      });
    }

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  };

  const stats = calculateStats();
  const recentActivity = generateRecentActivity();

  // ✅ Configuración de preferencias (mock por ahora)
  const preferences = [
    {
      icon: Bell,
      title: 'Notificaciones',
      description: 'Recordatorios y promociones',
      enabled: true
    },
    {
      icon: Shield,
      title: 'Privacidad',
      description: 'Configuración de datos',
      enabled: true
    },
    {
      icon: CreditCard,
      title: 'Métodos de pago',
      description: 'Tarjetas y facturación',
      enabled: false
    }
  ];

  // ✅ Inicializar datos de edición con datos reales del usuario
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        birthday: user.birthday || '',
        location: user.location || ''
      });
    }
  }, [user]);

  // ✅ Función real para actualizar perfil
  const handleSaveProfile = async () => {
    if (!store?.updateUserProfile) {
      setLocalError('Función de actualización no disponible');
      return;
    }

    try {
      setLocalError(null);
      const response = await store.updateUserProfile(editData);
      
      if (response?.success) {
        setEditMode(false);
        store.setSuccess?.('Perfil actualizado exitosamente');
      } else {
        throw new Error(response?.error || 'Error actualizando perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setLocalError(error.message || 'Error actualizando perfil');
    }
  };

  // ✅ Función para manejar logout
  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      store?.logout?.();
    }
  };

  // ✅ Función para manejar upload de avatar
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setLocalError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setLocalError('Solo se permiten archivos de imagen.');
      return;
    }

    setUploading(true);
    setLocalError(null);

    try {
      if (store?.uploadAvatar) {
        const response = await store.uploadAvatar(file);
        if (response?.success) {
          store.setSuccess?.('Avatar actualizado exitosamente');
        } else {
          throw new Error(response?.error || 'Error subiendo avatar');
        }
      } else {
        // Fallback: simular upload
        setTimeout(() => {
          setUploading(false);
          store?.setSuccess?.('Avatar actualizado exitosamente');
        }, 2000);
        return;
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setLocalError(error.message || 'Error subiendo avatar');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Loading state
  if (!user && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md w-full text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error cargando perfil</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la información del usuario</p>
          <button
            onClick={() => store?.refreshUserSession?.()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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

  const AppointmentCard = ({ appointment }) => {
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
              {(appointment.vipDiscount > 0 || isVIP) && (
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

  const ActivityItem = ({ activity }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-sm text-gray-600">Gestiona tu información y preferencias</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
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

      <div className="max-w-4xl mx-auto px-4 pb-8 w-full">
        {/* Profile Hero */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 lg:p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-start space-x-4 lg:space-x-6 mb-6">
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
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {editMode ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full bg-white/20 backdrop-blur border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                      placeholder="Nombre completo"
                    />
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
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

            {/* ✅ VIP Status Real */}
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

        {/* ✅ Stats Grid con datos reales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Contact Information */}
        {editMode && (
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
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
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
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
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
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
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
                  value={editData.birthday}
                  onChange={(e) => setEditData({...editData, birthday: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Error Display Local */}
            {localError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-800 text-sm">{localError}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveProfile}
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
                onClick={() => {
                  setEditMode(false);
                  setLocalError(null);
                  // Reset data to original user data
                  if (user) {
                    setEditData({
                      name: user.name || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      bio: user.bio || '',
                      birthday: user.birthday || '',
                      location: user.location || ''
                    });
                  }
                }}
                className="flex-1 border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ✅ Upcoming Appointments - Datos Reales */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Próximas Citas</h3>
              <button 
                onClick={() => {/* Navigate to appointments */}}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center space-x-1"
              >
                <span>Ver todas</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        )}

        {/* ✅ Recent Activity - Datos Reales */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              {recentActivity.length === 0 && (
                <span className="text-sm text-gray-500">Sin actividad</span>
              )}
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Sin actividad reciente</p>
                <p className="text-sm text-gray-400">Tu actividad aparecerá aquí cuando comiences a usar la aplicación</p>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración</h3>
            <div className="space-y-4">
              {preferences.map((pref, index) => {
                const Icon = pref.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-xl">
                        <Icon size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{pref.title}</p>
                        <p className="text-xs text-gray-600">{pref.description}</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      pref.enabled ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        pref.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </div>
                );
              })}
              
              {/* ✅ Logout conectado al store */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors duration-200 text-red-600"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <LogOut size={16} className="text-red-600" />
                  </div>
                  <span className="font-medium text-sm">Cerrar Sesión</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Error Display Global */}
        {store?.error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-600" />
              <div>
                <p className="text-red-800 text-sm font-medium">Error</p>
                <p className="text-red-700 text-sm">{store.error}</p>
              </div>
              <button
                onClick={() => store.clearError?.()}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ✅ Success Display */}
        {store?.successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-green-800 text-sm font-medium">Éxito</p>
                <p className="text-green-700 text-sm">{store.successMessage}</p>
              </div>
              <button
                onClick={() => store.clearSuccess?.()}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <Loader size={24} className="animate-spin text-indigo-600" />
                <span className="text-gray-700">Procesando...</span>
              </div>
            </div>
          </div>
        )}

        {/* Development Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-800 text-white p-4 rounded-2xl mb-8">
            <h4 className="font-bold mb-2">🔧 Debug Info</h4>
            <div className="text-xs space-y-1">
              <p>User ID: {user?.id}</p>
              <p>VIP Status: {isVIP ? 'Active' : 'Inactive'}</p>
              <p>Appointments: {appointments.length}</p>
              <p>Upcoming: {upcomingAppointments.length}</p>
              <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
              <p>Store Functions: {Object.keys(store || {}).filter(k => typeof store[k] === 'function').length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernProfileView;