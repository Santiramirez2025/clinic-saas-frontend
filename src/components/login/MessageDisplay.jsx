import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const MessageDisplay = ({ 
  error, 
  success, 
  onClearError,
  onClearSuccess 
}) => {
  if (!error && !success) return null;

  return (
    <div className="space-y-4">
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 animate-shake">
          <div className="flex items-start justify-between">
            <div className="flex items-center text-red-800">
              <AlertCircle size={18} className="mr-3 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
            {onClearError && (
              <button
                onClick={onClearError}
                className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {success && (
        <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-4 animate-bounce-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center text-green-800">
              <CheckCircle size={18} className="mr-3 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{success}</span>
            </div>
            {onClearSuccess && (
              <button
                onClick={onClearSuccess}
                className="text-green-400 hover:text-green-600 ml-2 flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
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

export default MessageDisplay;