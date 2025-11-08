import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Utils
import { ANIMATION_VARIANTS, COLOR_THEME } from '../../../utils/constants';

const ToastItem = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: `bg-${COLOR_THEME.status.success} border-green-400 text-white`,
    error: `bg-${COLOR_THEME.status.error} border-red-400 text-white`,
    warning: `bg-${COLOR_THEME.status.warning} border-yellow-400 text-white`,
    info: `bg-${COLOR_THEME.status.info} border-blue-400 text-white`
  };

  const IconComponent = icons[toast.type] || Info;
  const style = styles[toast.type] || styles.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg shadow-lg border 
        min-w-80 max-w-md mb-3 backdrop-blur-sm ${style}
        pointer-events-auto
      `}
    >
      <IconComponent size={20} className="flex-shrink-0 mt-0.5" />
      
      <div className="flex-1">
        {toast.title && (
          <h3 className="font-semibold text-sm mb-1">{toast.title}</h3>
        )}
        <p className="text-sm opacity-90">{toast.message}</p>
      </div>
      
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default ToastItem;