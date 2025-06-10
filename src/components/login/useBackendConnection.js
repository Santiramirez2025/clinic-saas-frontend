import { useState, useEffect, useRef } from 'react';

// Global flags para evitar múltiples tests de conexión
let connectionTestDone = false;
let connectionTestPromise = null;

const useBackendConnection = (healthUrl = 'https://clinic-backend-z0d0.onrender.com/health') => {
  const [isConnected, setIsConnected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(false);
  const connectionTestedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    
    // Evitar múltiples tests
    if (connectionTestedRef.current || connectionTestDone) {
      console.log('🚫 Connection already tested, skipping...');
      setIsConnected(true); // Asumimos que está conectado
      return;
    }
    
    const testConnection = async () => {
      if (connectionTestPromise) {
        console.log('⏳ Connection test in progress, waiting...');
        return await connectionTestPromise;
      }
      
      connectionTestPromise = (async () => {
        setIsLoading(true);
        connectionTestedRef.current = true;
        connectionTestDone = true;
        
        try {
          console.log('🧪 Testing backend connection (one time only)...');
          
          const response = await fetch(healthUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          const connected = response.ok && data.status === 'OK';
          
          if (mountedRef.current) {
            setIsConnected(connected);
            if (connected) {
              console.log('✅ Backend connected successfully');
            } else {
              console.warn('❌ Backend health check failed');
            }
          }
          
          return connected;
        } catch (error) {
          console.error('❌ Connection test failed:', error.message);
          if (mountedRef.current) {
            setIsConnected(false);
          }
          return false;
        } finally {
          if (mountedRef.current) {
            setIsLoading(false);
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
  }, [healthUrl]);

  // Función para resetear y volver a testear
  const retestConnection = () => {
    connectionTestDone = false;
    connectionTestedRef.current = false;
    setIsConnected(null);
    setIsLoading(false);
  };

  return {
    isConnected,
    isLoading,
    retestConnection
  };
};

export default useBackendConnection;