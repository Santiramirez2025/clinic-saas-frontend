import React, { useState, useEffect } from 'react';

// Componentes modulares
import VipHeader from './VipHeader';
import VipStatsDashboard from './VipStatsDashboard';
import VipHeroSection from './VipHeroSection';
import VipBenefitsGrid from './VipBenefitsGrid';
import VipPricingSection from './VipPricingSection';
import VipManagementSection from './VipManagementSection';
import VipPaymentModal from './VipPaymentModal';
import VipSocialProof from './VipSocialProof';
import VipSuccessMessage from './VipSuccessMessage';
import VipErrorAlert from './VipErrorAlert';
import VipLoadingScreen from './VipLoadingScreen';

const VipView = ({ store }) => {
  // Estados locales
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Datos del store
  const vipStatus = store?.vipStatus || {};
  const isVIP = store?.isVipActive?.() || false;
  const vipData = vipStatus?.subscription || {};
  const vipStats = vipStatus?.stats || {};
  const vipDaysRemaining = store?.getVipDaysRemaining?.() || 0;
  const vipExpiresAt = vipData?.endDate || null;

  // Efectos
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
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

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleClosePaymentModal = () => {
    setShowPayment(false);
  };

  // Loading state
  if (store?.isLoading && !vipStatus) {
    return <VipLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Header flotante */}
      <VipHeader 
        isVIP={isVIP}
        vipDaysRemaining={vipDaysRemaining}
        isScrolled={isScrolled}
      />

      <div className="max-w-4xl mx-auto p-4 pb-8">
        {/* Alerta de error */}
        <VipErrorAlert 
          error={error} 
          onDismiss={handleDismissError} 
        />

        {/* Dashboard de estadísticas VIP */}
        <VipStatsDashboard 
          vipStats={vipStats}
          vipDaysRemaining={vipDaysRemaining}
          isVIP={isVIP}
        />

        {/* Sección Hero */}
        <VipHeroSection isVIP={isVIP} />

        {/* Grid de beneficios */}
        <VipBenefitsGrid isVIP={isVIP} />

        {/* Sección de precios (solo para no-VIP) */}
        {!isVIP && (
          <VipPricingSection
            selectedPlan={selectedPlan}
            onPlanSelect={handlePlanSelect}
            onSubscribe={handleSubscribeVIP}
            loading={loading}
            showPayment={showPayment}
          />
        )}

        {/* Gestión VIP (solo para usuarios VIP) */}
        {isVIP && (
          <VipManagementSection
            vipData={vipData}
            vipStats={vipStats}
            vipDaysRemaining={vipDaysRemaining}
            vipExpiresAt={vipExpiresAt}
            onUnsubscribe={handleUnsubscribe}
            loading={loading}
          />
        )}

        {/* Prueba social */}
        <VipSocialProof vipStats={vipStats} />

        {/* Mensaje de éxito para usuarios VIP */}
        <VipSuccessMessage
          isVIP={isVIP}
          totalSavings={vipStats?.totalSavings || 0}
          show={isVIP && vipStats?.totalSavings > 0}
        />

        {/* Debug info para desarrollo */}
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

      {/* Modal de pago */}
      <VipPaymentModal
        show={showPayment}
        loading={loading}
        onClose={handleClosePaymentModal}
      />
    </div>
  );
};

export default VipView;