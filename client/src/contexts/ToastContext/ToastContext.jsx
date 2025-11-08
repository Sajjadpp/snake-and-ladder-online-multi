import React, { createContext, useState } from 'react';
import { ToastContainer } from '../../components/toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (options) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type: 'info',
      duration: 4000,
      position: 'top-right',
      ...options
    };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after delay
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const toast = {
    // Basic toast methods
    success: (message, title = 'Success') => 
      addToast({ type: 'success', title, message }),
    
    error: (message, title = 'Error') => 
      addToast({ type: 'error', title, message }),
    
    warning: (message, title = 'Warning') => 
      addToast({ type: 'warning', title, message }),
    
    info: (message, title = 'Info') => 
      addToast({ type: 'info', title, message }),
    
    // Custom toast
    custom: (options) => addToast(options),
    
    // Remove toasts
    remove: removeToast,
    clear: clearToasts
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};