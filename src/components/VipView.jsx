import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Star, 
  Gift, 
  Calendar, 
  Zap, 
  Shield, 
  Award, 
  Check, 
  Sparkles,
  Heart,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  X,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

const ModernVipView = ({ store }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [activeTab, setActiveTab] = useState('benefits');
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Datos reales del backend
  const vipStatus = store?.vipStatus || {};
  const isVIP = store?.isVipActive?.() || false;
  const vipData = vipStatus?.subscription || {};
  const vipStats = vipStatus?.stats || {};
  
  // ✅ Calcular días restantes
  const vipDaysRemaining = store?.getVipDaysRemaining?.() || 0;
  const vipExpiresAt = vipData?.endDate || null;

  // ✅ Cargar datos VIP al montar componente
  useEffect(() => {
    const loadVipData = async () => {
      try {
        if (store?.refreshUserSession) {
          await store.refreshUserSession();
        }
      } catch (error) {
        console.error('Error loading VIP data:', error);
      }
    };

    loadVipData();
  }, []);

  // Scroll handler for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Beneficios VIP del backend o fallback
  const vipBenefits = [
    {
      icon: Star,
      title: 'Descuentos Exclusivos',
      description: 'Hasta 25% OFF en todos nuestros servicios premium',
      highlight: '25% OFF',
      color: 'from-yellow-400 to-orange-500',
      active: isVIP
    },
    {
      icon: Calendar,
      title: 'Reservas Prioritarias',
      description: 'Acceso preferencial a los mejores horarios disponibles',
      highlight: 'Prioridad VIP',
      color: 'from-blue-400 to-indigo-500',
      active: isVIP
    },
    {
      icon: Gift,
      title: 'Consultas Gratuitas',
      description: 'Evaluaciones completas sin costo adicional',
      highlight: 'Sin costo',
      color: 'from-green-400 to-emerald-500',
      active: isVIP
    },
    {
      icon: Zap,
      title: 'Tratamientos Premium',
      description: 'Tecnología de última generación exclusiva para VIP',
      highlight: 'Exclusivo',
      color: 'from-purple-400 to-pink-500',
      active: isVIP
    },
    {
      icon: Heart,
      title: 'Seguimiento Personalizado',
      description: 'Plan de cuidado diseñado especialmente para ti',
      highlight: 'Personalizado',
      color: 'from-red-400 to-pink-500',
      active: isVIP
    },
    {
      icon: Users,
      title: 'Comunidad Exclusiva',
      description: 'Eventos especiales y talleres para miembros VIP',
      highlight: 'Solo VIP',
      color: 'from-teal-400 to-cyan-500',
      active: isVIP
    }
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Mensual',
      subtitle: 'Perfecto para probar',
      price: 1500,
      originalPrice: 2000,
      period: 'mes',
      discount: 25,
      popular: false,
      features: ['Todos los beneficios VIP', 'Soporte prioritario', 'Cancelación flexible'],
      color: 'from-gray-100 to-gray-200'
    },
    {
      id: 'annual',
      name: 'Anual',
      subtitle: 'Máximo ahorro',
      price: 1000,
      originalPrice: 1500,
      yearlyPrice: 12000,
      yearlyOriginalPrice: 18000,
      period: 'mes',
      discount: 33,
      popular: true,
      savings: 'Ahorrás $6.000',
      features: ['Todos los beneficios VIP', 'Soporte 24/7', '2 meses GRATIS', 'Garantía de satisfacción'],
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  // ✅ Estadísticas reales del backend
  const stats = [
    { 
      label: 'Ahorro total', 
      value: vipStats?.totalSavings ? `$${vipStats.totalSavings.toLocaleString()}` : '$0', 
      icon: TrendingUp, 
      color: 'text-green-500' 
    },
    { 
      label: 'Servicios este mes', 
      value: vipStats?.appointmentsThisMonth?.toString() || '0', 
      icon: Calendar, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Días VIP restantes', 
      value: vipDaysRemaining?.toString() || '0', 
      icon: Crown, 
      color: 'text-yellow-500' 
    },
    { 
      label: 'Citas completadas', 
      value: vipStats?.completedAppointments?.toString() || '0', 
      icon: Heart, 
      color: 'text-red-500' 
    }
  ];

  // ✅ Función real para suscribirse a VIP
  const handleSubscribeVIP = async () => {
    if (!store?.subscribeVip) {
      setError('Función de suscripción no disponible');
      return;
    }

    setLoading(true);
    setShowPayment(true);
    setError(null);

    try {
      console.log('🔄 Subscribing to VIP:', selectedPlan);
      const response = await store.subscribeVip(selectedPlan);
      
      if (response?.success) {
        console.log('✅ VIP subscription successful');
        store.setSuccess('¡Suscripción VIP activada exitosamente!');
        
        // Refresh data after successful subscription
        setTimeout(async () => {
          if (store.refreshUserSession) {
            await store.refreshUserSession();
          }
        }, 1000);
      } else {
        throw new Error(response?.error || 'Error en la suscripción');
      }
    } catch (error) {
      console.error('❌ VIP subscription failed:', error);
      setError(error.message || 'Error al procesar la suscripción');
      store?.setError?.(error.message || 'Error al procesar la suscripción');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowPayment(false);
      }, 2000);
    }
  };

  // ✅ Función real para cancelar VIP
  const handleUnsubscribe = async () => {
    if (!store?.cancelVipSubscription) {
      setError('Función de cancelación no disponible');
      return;
    }

    const confirmed = window.confirm(
      '¿Estás segura de que quieres cancelar tu plan VIP? Perderás todos los beneficios al final del período actual.'
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Canceling VIP subscription');
      const response = await store.cancelVipSubscription('User requested cancellation');
      
      if (response?.success) {
        console.log('✅ VIP cancellation successful');
        store.setSuccess('Suscripción VIP cancelada exitosamente');
        
        // Refresh data after cancellation
        if (store.refreshUserSession) {
          await store.refreshUserSession();
        }
      } else {
        throw new Error(response?.error || 'Error en la cancelación');
      }
    } catch (error) {
      console.error('❌ VIP cancellation failed:', error);
      setError(error.message || 'Error al cancelar la suscripción');
      store?.setError?.(error.message || 'Error al cancelar la suscripción');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Formatear fecha de expiración
  const formatExpirationDate = (dateString) => {
    if (!dateString) return 'No definida';
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const BenefitCard = ({ benefit, index }) => {
    const Icon = benefit.icon;
    return (
      <div 
        className={`group relative bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 border transition-all duration-500 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 w-full ${
          benefit.active 
            ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
            : 'border-gray-100 hover:border-gray-200'
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-start space-x-3 lg:space-x-4 w-full">
          <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-gradient-to-r ${benefit.color} shadow-lg flex-shrink-0`}>
            <Icon size={20} className="text-white lg:w-6 lg:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 text-sm lg:text-base leading-tight mb-1">
              {benefit.title}
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 leading-relaxed mb-2">
              {benefit.description}
            </p>
            <div className={`inline-block text-xs font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${benefit.color} text-white`}>
              {benefit.highlight}
            </div>
          </div>
          {benefit.active && (
            <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
              <div className="bg-green-500 text-white rounded-full p-1">
                <Check size={12} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PlanCard = ({ plan, isSelected, onSelect }) => {
    return (
      <div
        className={`relative cursor-pointer transition-all duration-300 ${
          isSelected ? 'scale-105 z-10' : 'hover:scale-102'
        }`}
        onClick={onSelect}
      >
        <div className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
          isSelected
            ? 'border-indigo-400 shadow-2xl shadow-indigo-500/25'
            : 'border-gray-200 shadow-lg hover:border-gray-300 hover:shadow-xl'
        }`}>
          {plan.popular && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
              <Sparkles size={16} className="inline mr-1" />
              Más Popular
            </div>
          )}
          
          <div className={`p-6 ${plan.popular ? 'pt-12' : ''} bg-white`}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-600">{plan.subtitle}</p>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.price.toLocaleString()}
                </span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              
              {plan.originalPrice && (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <span className="text-gray-400 line-through">
                    ${plan.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    -{plan.discount}%
                  </span>
                </div>
              )}

              {plan.savings && (
                <p className="text-green-600 font-semibold mt-2 text-sm">
                  💰 {plan.savings}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {plan.id === 'annual' && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-indigo-700 font-medium">Precio anual</p>
                  <p className="text-lg font-bold text-indigo-900">
                    ${plan.yearlyPrice.toLocaleString()} 
                    <span className="text-sm font-normal ml-1">por año</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ✅ Loading state mientras carga datos
  if (store?.isLoading && !vipStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando información VIP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Floating Header */}
      <div className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-2xl transition-all duration-300 ${
                isVIP 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                  : 'bg-gray-200'
              }`}>
                <Crown size={24} className={isVIP ? 'text-white' : 'text-gray-500'} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isVIP ? 'Panel VIP' : 'Únete a VIP'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isVIP ? 'Miembro Premium Activo' : 'Desbloquea beneficios exclusivos'}
                </p>
              </div>
            </div>
            
            {isVIP && (
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ✨ Activo
                </div>
                {vipDaysRemaining > 0 && vipDaysRemaining <= 30 && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {vipDaysRemaining}d restantes
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-500" size={20} />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* VIP Stats Dashboard */}
        {isVIP && (
          <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={20} className={stat.color} />
                      <span className="text-xs text-gray-500">VIP</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hero Section */}
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

        {/* Benefits Grid */}
        <div className="mb-12 overflow-hidden">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {isVIP ? 'Tus Beneficios Activos' : 'Beneficios Exclusivos VIP'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vipBenefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} index={index} />
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        {!isVIP && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Elige tu Plan VIP</h3>
              <p className="text-gray-600">Comienza tu transformación hoy mismo</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {plans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                />
              ))}
            </div>

            {/* Subscribe Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubscribeVIP}
                disabled={loading || showPayment}
                className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 min-w-64"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader size={20} className="animate-spin" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <>
                    <Lock size={20} className="inline mr-2" />
                    Activar Plan VIP
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 mt-4">
                🔒 Pago 100% seguro • Cancela cuando quieras
              </p>
            </div>
          </div>
        )}

        {/* VIP Management for Active Users */}
        {isVIP && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gestionar Suscripción</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800">Plan Activo</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  Plan {vipData?.planType === 'annual' ? 'Anual' : 'Mensual'} VIP
                </p>
                <p className="text-green-700">
                  Válido hasta: {formatExpirationDate(vipExpiresAt)}
                </p>
                {vipDaysRemaining <= 30 && vipDaysRemaining > 0 && (
                  <div className="mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ⚠️ Quedan {vipDaysRemaining} días
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp size={20} className="text-blue-600" />
                  <span className="font-semibold text-blue-800">Ahorro Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {vipStats?.totalSavings ? `${vipStats.totalSavings.toLocaleString()}` : '$0'}
                </p>
                <p className="text-blue-700">Desde que eres VIP</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                disabled={loading}
              >
                <CreditCard size={20} className="inline mr-2" />
                Actualizar Método de Pago
              </button>
              
              <button
                onClick={handleUnsubscribe}
                disabled={loading}
                className="flex-1 border-2 border-red-200 text-red-600 py-3 px-6 rounded-2xl font-semibold hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader size={16} className="animate-spin" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  'Cancelar Suscripción'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Payment Processing Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {loading ? (
                    <Loader size={32} className="text-white animate-spin" />
                  ) : (
                    <CheckCircle size={32} className="text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {loading ? 'Procesando Pago' : '¡Pago Procesado!'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {loading 
                    ? 'Conectando con pasarela segura...' 
                    : 'Tu suscripción VIP ha sido activada exitosamente'
                  }
                </p>
                
                {loading && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  🔒 {loading ? 'Tu información está protegida con encriptación de nivel bancario' : 'Bienvenida al club VIP'}
                </p>
                
                {!loading && (
                  <button
                    onClick={() => setShowPayment(false)}
                    className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Social Proof Section */}
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-3xl p-8 mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Por qué elegir VIP?</h3>
            <p className="text-gray-600">Más de 1,200 clientas VIP confían en nosotros</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">98%</div>
              <p className="text-gray-700 font-medium">Satisfacción garantizada</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {vipStats?.totalSavings ? `${Math.round(vipStats.totalSavings / 12).toLocaleString()}` : '$3,200'}
              </div>
              <p className="text-gray-700 font-medium">Ahorro promedio mensual</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-700 font-medium">Soporte premium</p>
            </div>
          </div>
        </div>

        {/* Success Message for VIP users */}
        {isVIP && vipStats?.totalSavings > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 mt-8 border border-green-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-2">
                ¡Excelente decisión! 🎉
              </h3>
              <p className="text-green-700">
                Has ahorrado <span className="font-bold">${vipStats.totalSavings.toLocaleString()}</span> siendo miembro VIP.
                Sigue disfrutando de todos los beneficios exclusivos.
              </p>
            </div>
          </div>
        )}

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-gray-100 rounded-2xl p-4">
            <h4 className="font-bold text-gray-900 mb-2">Debug Info (Development)</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify({
                isVIP,
                vipStatus: vipStatus,
                vipDaysRemaining,
                vipExpiresAt,
                hasSubscribeFunction: !!store?.subscribeVip,
                hasCancelFunction: !!store?.cancelVipSubscription
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernVipView;