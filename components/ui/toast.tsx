'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function Toast({ title, description, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={cn(
        'max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 transform',
        getBackgroundColor(),
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {title}
          </p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}