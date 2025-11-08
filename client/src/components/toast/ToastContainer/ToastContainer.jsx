import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToastItem from '../ToastItem';

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
};

const ToastContainer = ({ toasts = [], onRemove }) => {
  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-50 pointer-events-none ${positionStyles[position]}`}
        >
          <AnimatePresence>
            {positionToasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onRemove={onRemove}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
};

export default ToastContainer;