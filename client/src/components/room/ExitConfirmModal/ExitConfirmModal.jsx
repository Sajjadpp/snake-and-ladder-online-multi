import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, AlertTriangle } from 'lucide-react';
import Button from '../../ui/button';

const ExitConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Bottom Sheet Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 p-6 max-w-md mx-auto"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Leave Room?</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Warning Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-gray-600 mb-2">
                Are you sure you want to leave this room?
              </p>
              <p className="text-sm text-gray-500">
                You'll need the room code to rejoin later
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onConfirm}
                variant="primary"
                className="w-full bg-red-500 hover:bg-red-600 border-red-500"
                size="large"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Yes, Leave Room
              </Button>
              <Button
                onClick={onClose}
                variant="secondary"
                className="w-full"
                size="large"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitConfirmModal;