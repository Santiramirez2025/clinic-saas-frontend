import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const ModernInputField = ({ 
  type = 'text', 
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
        {required && <span className="text-red-500 ml-1">*</span>}
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

      <style>{`
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
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ModernInputField;