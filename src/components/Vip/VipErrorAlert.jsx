import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const VipErrorAlert = ({ 
  error, 
  onDismiss 
}) => {
  if (!error) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
      <div className="flex items-center space-x-3">
        <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
        <div className="flex-1">
          <p className="font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 flex-shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VipErrorAlert;