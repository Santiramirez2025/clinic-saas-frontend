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
  Activity
} from 'lucide-react';

const ModernProfileView = ({ store }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editData, setEditData] = useState({
    name: store?.user?.name || 'María González',
    email: store?.user?.email || 'maria@example.com',
    phone: store?.user?.phone || '+54 11 1234-5678',
    bio: store?.user?.bio || '',
    birthday: store?.user?.birthday || '',
    location: store?.user?.location || 'Buenos Aires, Argentina'
  });

  // Mock data for demonstration
  const user = {
    name: 'María González',
    email: 'maria@example.com',
    phone: '+54 11 1234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face',
    memberSince: '2023',
    location: 'Buenos Aires, Argentina',
    bio: 'Apasionada por el cuidado de la piel y los tratamientos de belleza naturales.',
    birthday: '1990-05-15'
  };

  const vipStatus = {
    isActive: true,
    level: 'Premium',
    expiresAt: '2025-12-06',
    nextBenefit: 'Consulta gratuita en 3 días'
  };

  const stats = [
    { 
      label: 'Servicios realizados', 
      value: '23', 
      icon: Activity, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '+3 este mes'
    },
    { 
      label: 'Ahorro total VIP', 
      value: '$8,500', 
      icon: TrendingUp, 
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: '+$1,200 último mes'
    },
    { 
      label: 'Puntos de fidelidad', 
      value: '1,247', 
      icon: Star, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      change: '+150 disponibles'
    },
    { 
      label: 'Satisfacción promedio', 
      value: '4.9/5', 
      icon: Heart, 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      change: 'Excelente historial'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      service: 'Limpieza Facial Profunda',
      date: '2025-06-10',
      time: '14:30',
      doctor: 'Dr. Ana Silva',
      type: 'Facial',
      status: 'confirmed',
      isVip: true
    },
    {
      id: 2,
      service: 'Tratamiento Anti-edad',
      date: '2025-06-15',
      time: '16:00',
      doctor: 'Dr. Carlos Mendez',
      type: 'Premium',
      status: 'confirmed',
      isVip: true
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'appointment',
      title: 'Limpieza facial completada',
      subtitle: 'Con Dr. Ana Silva',
      date: '2025-06-01',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'reward',
      title: 'Puntos ganados',
      subtitle: '+150 puntos de fidelidad',
      date: '2025-06-01',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      id: 3,
      type: 'vip',
      title: 'Beneficio VIP aplicado',
      subtitle: '20% descuento en tratamiento',
      date: '2025-05-28',
      icon: Crown,
      color: 'text-purple-500'
    }
  ];

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

  useEffect(() => {
    if (store?.user) {
      setEditData({
        name: store.user.name || '',
        email: store.user.email || '',
        phone: store.user.phone || '',
        bio: store.user.bio || '',
        birthday: store.user.birthday || '',
        location: store.user.location || ''
      });
    }
  }, [store?.user]);

  const handleSaveProfile = async () => {
    try {
      // await store.updateUser(editData);
      setEditMode(false);
      console.log('Profile updated:', editData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

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
              <h4 className="font-semibold text-gray-900">{appointment.service}</h4>
              {appointment.isVip && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  VIP
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">con {appointment.doctor}</p>
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
          <span className="text-xs text-green-600 font-medium flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Confirmado
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
              className={`p-2 rounded-xl transition-all duration-300 ${
                editMode 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
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
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border-4 border-white/20 object-cover"
                />
                {editMode && (
                  <button className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera size={20} className="text-white" />
                  </button>
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
                      {vipStatus.isActive && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full flex items-center space-x-1">
                          <Crown size={16} />
                          <span className="text-sm font-semibold">VIP</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white/80 mb-2">{user.bio}</p>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>Miembro desde {user.memberSince}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {vipStatus.isActive && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">Estado VIP Premium</p>
                    <p className="text-sm text-white/80">{vipStatus.nextBenefit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80">Válido hasta</p>
                    <p className="font-semibold">{new Date(vipStatus.expiresAt).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
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

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={store?.isLoading}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>{store?.isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Próximas Citas</h3>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center space-x-1">
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

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
            <div className="space-y-2">
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
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
              
              <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors duration-200 text-red-600">
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

        {/* Error Display */}
        {store?.error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
            <p className="text-red-800 text-sm">{store.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernProfileView;