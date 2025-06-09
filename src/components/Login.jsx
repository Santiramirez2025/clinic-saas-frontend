// components/ModernLogin.jsx - SIN LOGS REPETITIVOS
import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  Shield,
  Heart,
  Star,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';

// 🎨 COMPONENTE 1: Fondo animado con partículas
const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 10
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
      
      {/* Formas geométricas flotantes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/40 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      {/* Partículas flotantes */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.id * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

// 🎨 COMPONENTE 2: Header con logo animado
const ModernHeader = ({ clinicName, isLogin }) => {
  return (
    <div className="text-center mb-8 relative z-10">
      {/* Logo animado */}
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 relative overflow-hidden group">
          {/* Brillo animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Sparkles size={32} className="text-white relative z-10" />
        </div>
        
        {/* Anillos animados alrededor del logo */}
        <div className="absolute inset-0 rounded-3xl border-2 border-indigo-300/50 animate-ping"></div>
        <div className="absolute inset-0 rounded-3xl border border-purple-300/30 animate-pulse"></div>
      </div>

      {/* Título dinámico */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
        {clinicName || 'Clínica Estética'}
      </h1>
      
      {/* Subtítulo animado */}
      <p className="text-gray-600 text-lg font-medium">
        {isLogin ? (
          <span className="inline-flex items-center space-x-2">
            <span>¡Bienvenida de vuelta!</span>
            <Heart size={18} className="text-pink-500 animate-pulse" />
          </span>
        ) : (
          <span className="inline-flex items-center space-x-2">
            <span>Tu viaje de belleza comienza aquí</span>
            <Star size={18} className="text-yellow-500 animate-spin" />
          </span>
        )}
      </p>
    </div>
  );
};

// 🎨 COMPONENTE 3: Indicador de conexión SIMPLIFICADO
const BackendConnectionIndicator = ({ isConnected, isLoading }) => {
  // Solo mostrar si hay problemas de conexión
  if (isConnected === true) return null;
  
  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 flex items-center space-x-2 z-50">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
        <span className="text-yellow-800 text-sm font-medium">Conectando...</span>
      </div>
    );
  }

  if (isConnected === false) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg px-3 py-2 flex items-center space-x-2 z-50">
        <WifiOff size={16} className="text-red-600" />
        <span className="text-red-800 text-sm font-medium">Sin conexión</span>
      </div>
    );
  }

  return null;
};

// 🎨 COMPONENTE 4: Toggle moderno para Login/Registro
const ModernToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="relative bg-gray-100 rounded-2xl p-1 mb-8">
      {/* Indicador deslizante */}
      <div 
        className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-lg transition-all duration-500 ease-out ${
          isLogin ? 'left-1' : 'left-1/2'
        }`}
      />
      
      {/* Botones */}
      <div className="relative z-10 grid grid-cols-2">
        <button
          onClick={() => isLogin || onToggle()}
          className={`py-4 px-6 text-center rounded-xl font-bold transition-all duration-300 ${
            isLogin 
              ? 'text-indigo-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Shield size={18} />
            <span>Iniciar Sesión</span>
          </div>
        </button>
        
        <button
          onClick={() => !isLogin || onToggle()}
          className={`py-4 px-6 text-center rounded-xl font-bold transition-all duration-300 ${
            !isLogin 
              ? 'text-indigo-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles size={18} />
            <span>Registro</span>
          </div>
        </button>
      </div>
    </div>
  );
};

// 🎨 COMPONENTE 5: Input field moderno con animaciones
const ModernInputField = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon: Icon,
  required = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="relative">
      {/* Label flotante */}
      <label 
        className={`absolute left-12 transition-all duration-300 pointer-events-none ${
          isFocused || value 
            ? 'top-2 text-xs text-indigo-600 font-medium' 
            : 'top-4 text-gray-500'
        }`}
      >
        {placeholder}
      </label>

      {/* Container del input */}
      <div className={`relative transition-all duration-300 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        {/* Icono izquierdo */}
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? 'text-indigo-600' : 'text-gray-400'
        }`}>
          <Icon size={20} />
        </div>

        {/* Input */}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`w-full pl-12 pr-12 pt-6 pb-2 bg-white/80 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 focus:outline-none ${
            error 
              ? 'border-red-300 bg-red-50/50 shadow-red-100' 
              : isFocused
              ? 'border-indigo-500 shadow-lg shadow-indigo-100' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        />

        {/* Icono derecho (password toggle) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm animate-shake">
          <AlertCircle size={14} className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

// 🎨 COMPONENTE 6: Botón de envío moderno
const ModernSubmitButton = ({ isLoading, isLogin, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="group relative w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl hover:shadow-2xl"
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Contenido del botón */}
      <div className="relative z-10 flex items-center justify-center space-x-3">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </div>
    </button>
  );
};

// 🎨 COMPONENTE 7: Demo credentials mejorado
const DemoCredentials = ({ onDemoLogin, isLoading }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
        <Zap size={32} className="text-blue-600 transform rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap size={16} className="text-blue-600" />
          </div>
          <h4 className="font-bold text-blue-900">Prueba Rápida</h4>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Email:</span>
            <span className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded text-xs">sofia@example.com</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Contraseña:</span>
            <span className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded text-xs">password123</span>
          </div>
        </div>

        <button
          onClick={onDemoLogin}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Zap size={16} />
          <span>Acceso Demo</span>
        </button>
      </div>
    </div>
  );
};

// ✅ GLOBAL FLAG para evitar múltiples tests de conexión
let connectionTestDone = false;
let connectionTestPromise = null;

// 🎨 COMPONENTE PRINCIPAL: Login moderno SIN LOGS REPETITIVOS
const ModernLogin = ({ store }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [backendConnected, setBackendConnected] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  
  // ✅ Referencias para evitar múltiples ejecuciones
  const mountedRef = useRef(false);
  const connectionTestedRef = useRef(false);

  // ✅ Test backend connection SOLO UNA VEZ
  useEffect(() => {
    mountedRef.current = true;
    
    // Evitar múltiples tests
    if (connectionTestedRef.current || connectionTestDone) {
      console.log('🚫 Connection already tested, skipping...');
      setBackendConnected(true); // Asumimos que está conectado
      return;
    }
    
    const testConnection = async () => {
      if (connectionTestPromise) {
        console.log('⏳ Connection test in progress, waiting...');
        return await connectionTestPromise;
      }
      
      connectionTestPromise = (async () => {
        setTestingConnection(true);
        connectionTestedRef.current = true;
        connectionTestDone = true;
        
        try {
          console.log('🧪 Testing backend connection (one time only)...');
          
          // Test directo sin usar store para evitar logs repetitivos
          const healthUrl = 'https://clinic-backend-z0d0.onrender.com/health';
          const response = await fetch(healthUrl);
          const data = await response.json();
          
          const isConnected = response.ok && data.status === 'OK';
          
          if (mountedRef.current) {
            setBackendConnected(isConnected);
            if (isConnected) {
              console.log('✅ Backend connected successfully');
            } else {
              console.warn('❌ Backend health check failed');
            }
          }
          
          return isConnected;
        } catch (error) {
          console.error('❌ Connection test failed:', error.message);
          if (mountedRef.current) {
            setBackendConnected(false);
          }
          return false;
        } finally {
          if (mountedRef.current) {
            setTestingConnection(false);
          }
          connectionTestPromise = null;
        }
      })();
      
      return await connectionTestPromise;
    };

    // Test después de 500ms para evitar race conditions
    const timer = setTimeout(testConnection, 500);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []); // ✅ Solo al montar

  // Form validation MEJORADA
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Verificar conexión al backend
    if (backendConnected === false) {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (store.error) {
      store.clearError();
    }
  };

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

  const handleDemoLogin = async () => {
    if (backendConnected === false) {
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
        isConnected={backendConnected} 
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
          <div className="space-y-6">
            {/* Campos de registro */}
            {!isLogin && (
              <div className="space-y-6 animate-fade-in">
                <ModernInputField
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  error={validationErrors.name}
                  icon={User}
                  required
                />
                
                <ModernInputField
                  type="tel"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  error={validationErrors.phone}
                  icon={Phone}
                  required
                />
              </div>
            )}
            
            {/* Email */}
            <ModernInputField
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={validationErrors.email}
              icon={Mail}
              required
            />
            
            {/* Contraseña */}
            <ModernInputField
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={validationErrors.password}
              icon={Lock}
              required
            />

            {/* Mensajes de error/éxito */}
            {store.error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 animate-shake">
                <div className="flex items-center text-red-800">
                  <AlertCircle size={18} className="mr-3 flex-shrink-0" />
                  <span className="font-medium">{store.error}</span>
                </div>
              </div>
            )}

            {store.successMessage && (
              <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-4 animate-bounce-in">
                <div className="flex items-center text-green-800">
                  <CheckCircle size={18} className="mr-3 flex-shrink-0" />
                  <span className="font-medium">{store.successMessage}</span>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <ModernSubmitButton
              isLoading={store.isLoading}
              isLogin={isLogin}
              onClick={handleSubmit}
              disabled={backendConnected === false}
            />
          </div>

          {/* Demo credentials */}
          {isLogin && (
            <div className="mt-6">
              <DemoCredentials 
                onDemoLogin={handleDemoLogin}
                isLoading={store.isLoading}
              />
            </div>
          )}

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
            <span className="text-indigo-600 font-medium">Términos de Servicio</span>
            {' '}y{' '}
            <span className="text-indigo-600 font-medium">Política de Privacidad</span>
          </p>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ModernLogin;