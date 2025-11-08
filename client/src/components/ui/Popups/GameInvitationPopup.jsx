import React, { useState, useEffect, useRef } from 'react';
import { X, Gamepad2, Clock } from 'lucide-react';

// Game Invitation Popup Component
const GameInvitationPopup = ({ invitation, isOpen, onClose, onAccept, onDecline }) => {
    if (!isOpen || !invitation) return null;

    const timeRemaining = invitation.expiresAt 
        ? Math.max(0, Math.floor((new Date(invitation.expiresAt) - new Date()) / 1000))
        : 0;

    const [countdown, setCountdown] = useState(timeRemaining);
        
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
        setCountdown(prev => {
            if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
            }
            return prev - 1;
        });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, onClose]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-80 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 relative">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
                <X size={16} />
            </button>
            
            <div className="flex items-center gap-2 text-white">
                <Gamepad2 size={20} />
                <h2 className="text-lg font-bold">Game Invitation</h2>
            </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
            {/* Sender Info */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl">
                {invitation.senderAvatar}
                </div>
                <div className="flex-1">
                <p className="text-xs text-gray-500">Invitation from</p>
                <p className="text-base font-semibold text-gray-800">
                    {invitation.senderUsername}
                </p>
                </div>
            </div>

            {/* Game Details */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Gamepad2 className="text-orange-600" size={16} />
                    <span className="text-sm font-medium text-gray-700">
                    {invitation.gameType}
                    </span>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                    Room {invitation.gameId}
                </span>
                </div>

                {countdown > 0 && (
                <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                    <Clock className="text-orange-500" size={14} />
                    <span className="text-xs text-gray-600">
                    Expires in <span className="font-semibold text-orange-600">{formatTime(countdown)}</span>
                    </span>
                </div>
                )}
            </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 flex gap-2">
            <button
                onClick={onDecline}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
                Decline
            </button>
            <button
                onClick={onAccept}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
                Join Game
            </button>
            </div>
        </div>

        <style jsx>{`
            @keyframes scale-in {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
            }
            .animate-scale-in {
            animation: scale-in 0.2s ease-out;
            }
        `}</style>
        </div>
    );
};

export default GameInvitationPopup