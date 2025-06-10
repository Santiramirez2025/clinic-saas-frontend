import React, { useState } from 'react';

// Componentes modulares
import AnimatedBackground from './AnimatedBackground';
import ModernHeader from './ModernHeader';
import BackendConnectionIndicator from './BackendConnectionIndicator';
import ModernToggle from './ModernToggle';
import LoginForm from './LoginForm';

// Hook personalizado
import useBackendConnection from './useBackendConnection';

const ModernLogin = ({ store }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  // Hook de conexión al backend
  const { isConnected, isLoading: testingConnection } = useBackendConnection();

  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        errors.name = 'El nombre es requerido';
      } else if (formData.name.trim().length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres';
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'El teléfono es requerido';
      } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
        errors.phone = 'El teléfono no es válido';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Verificar conexión al backend
    if (isConnected === false) {
      store.setError('No hay conexión con el servidor. Intenta más tarde.');
      return;
    }

    try {
      if (isLogin) {
        console.log('🔐 Login attempt:', formData.email);
        await store.login(formData.email, formData.password);
      } else {
        console.log('📝 Registration attempt:', formData.email);
        await store.register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim()
        });
      }
    } catch (error) {
      console.error('Auth error:', error.message);
      // El error ya se maneja en el store
    }
  };

  // Manejar cambios en inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error de validación cuando el usuario empieza a escribir
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Limpiar error general
    if (store.error) {
      store.clearError();
    }
  };

  // Cambiar entre login y registro
  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: ''
    });
    setValidationErrors({});
    if (store.error) {
      store.clearError();
    }
  };

  // Login demo
  const handleDemoLogin = async () => {
    if (isConnected === false) {
      store.setError('No hay conexión con el servidor. Intenta más tarde.');
      return;
    }

    try {
      console.log('🧪 Demo login attempt');
      await store.login('test@example.com', 'password123');
    } catch (error) {
      console.error('Demo login error:', error.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      {/* Fondo animado */}
      <AnimatedBackground />

      {/* Indicador de conexión (solo si hay problemas) */}
      <BackendConnectionIndicator 
        isConnected={isConnected} 
        isLoading={testingConnection} 
      />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <ModernHeader 
          clinicName={store.clinic?.name}
          isLogin={isLogin}
        />

        {/* Card principal */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Toggle Login/Registro */}
          <ModernToggle 
            isLogin={isLogin}
            onToggle={switchMode}
          />

          {/* Formulario */}
          <LoginForm
            isLogin={isLogin}
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onDemoLogin={handleDemoLogin}
            isLoading={store.isLoading}
            error={store.error}
            success={store.successMessage}
            onClearError={store.clearError}
            disabled={isConnected === false}
          />

          {/* Footer del formulario */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={switchMode}
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold transition-colors duration-300 hover:underline"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer legal */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            Al continuar, aceptas nuestros{' '}
            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
              Términos de Servicio
            </span>
            {' '}y{' '}
            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
              Política de Privacidad
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;