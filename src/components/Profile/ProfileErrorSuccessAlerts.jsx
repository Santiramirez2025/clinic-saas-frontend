import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const ProfileErrorSuccessAlerts = ({ 
  error, 
  successMessage, 
  onDismissError, 
  onDismissSuccess 
}) => {
  return (
    <>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 text-sm font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            {onDismissError && (
              <button
                onClick={onDismissError}
                className="text-red-600 hover:text-red-800 flex-shrink-0"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
          <div className="flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 text-sm font-medium">Éxito</p>
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
            {onDismissSuccess && (
              <button
                onClick={onDismissSuccess}
                className="text-green-600 hover:text-green-800 flex-shrink-0"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileErrorSuccessAlerts;