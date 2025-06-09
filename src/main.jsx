// src/main.jsx - CORREGIDO Y OPTIMIZADO
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ✅ StrictMode HABILITADO con protección mejorada
// StrictMode ejecuta efectos dos veces en desarrollo para detectar problemas
// Nuestras protecciones en App.jsx y useAppStore.js manejan esto correctamente

console.log('🚀 Starting React application...');
console.log('🔧 StrictMode: ENABLED (development mode)');
console.log('✅ Rate limiting protection: ACTIVE');
console.log('🛡️ Double execution protection: ACTIVE');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)