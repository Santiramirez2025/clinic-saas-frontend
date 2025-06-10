import React from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';

import ModernInputField from './ModernInputField';
import ModernSubmitButton from './ModernSubmitButton';
import MessageDisplay from './MessageDisplay';
import DemoCredentials from './DemoCredentials';

const LoginForm = ({
  isLogin,
  formData,
  validationErrors,
  onInputChange,
  onSubmit,
  onDemoLogin,
  isLoading,
  error,
  success,
  onClearError,
  disabled = false
}) => {
  return (
    <div className="space-y-6">
      {/* Campos de registro */}
      {!isLogin && (
        <div className="space-y-6 animate-fade-in">
          <ModernInputField
            type="text"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(value) => onInputChange('name', value)}
            error={validationErrors.name}
            icon={User}
            required
          />
          
          <ModernInputField
            type="tel"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={(value) => onInputChange('phone', value)}
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
        onChange={(value) => onInputChange('email', value)}
        error={validationErrors.email}
        icon={Mail}
        required
      />
      
      {/* Contraseña */}
      <ModernInputField
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(value) => onInputChange('password', value)}
        error={validationErrors.password}
        icon={Lock}
        required
      />

      {/* Mensajes de error/éxito */}
      <MessageDisplay
        error={error}
        success={success}
        onClearError={onClearError}
      />

      {/* Botón de envío */}
      <ModernSubmitButton
        isLoading={isLoading}
        isLogin={isLogin}
        onClick={onSubmit}
        disabled={disabled}
      />

      {/* Demo credentials para login */}
      {isLogin && (
        <DemoCredentials 
          onDemoLogin={onDemoLogin}
          isLoading={isLoading}
        />
      )}

      <style>{`
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
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;