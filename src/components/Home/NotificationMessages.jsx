import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const NotificationMessages = ({ error, successMessage, onClearError, onClearSuccess }) => {
  if (!error && !successMessage) return null;

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-4">
          <div className="flex items-center text-red-800">
            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
            <button 
              onClick={onClearError}
              className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-4">
          <div className="flex items-center text-green-800">
            <CheckCircle size={20} className="mr-3 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
            <button 
              onClick={onClearSuccess}
              className="ml-auto p-1 hover:bg-green-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationMessages;