import { useRef } from "react";
import GameInvitationPopup from "../../components/ui/Popups/GameInvitationPopup";
import { useState } from "react";
import { useEffect } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { joinRoom } from "../../services";
import { useAuth, useToast } from "../../contexts";
import { useNavigate } from "react-router-dom";

const GameInvitationHandler = () => {
    const [activeInvitation, setActiveInvitation] = useState(null);
    const processedInvitationsRef = useRef(new Set());
    const {user} = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
    const {notifications, markAsRead} = useNotification()

    // Auto-show game invitation when it arrives
    useEffect(() => {
        const newGameInvitation = notifications.find(
        (notification) =>
            notification.type === 'game_invite' &&
            !notification.read &&
            !processedInvitationsRef.current.has(notification._id)
        );

        if (newGameInvitation) {
        console.log('New game invitation found:', newGameInvitation);
        
        const invitationData = {
            id: newGameInvitation._id,
            type: 'game_invite',
            senderId: newGameInvitation.senderId,
            senderUsername: newGameInvitation.data?.senderUsername || 'Unknown Player',
            senderAvatar: newGameInvitation.data?.senderAvatar || '👤',
            gameType: newGameInvitation.data?.gameType || 'Game',
            gameId: newGameInvitation.data?.gameId,
            expiresAt: newGameInvitation.data?.expiresAt,
            message: newGameInvitation.message,
            createdAt: newGameInvitation.createdAt,
        };

        processedInvitationsRef.current.add(newGameInvitation._id);
        setActiveInvitation(invitationData);
        }
    }, [notifications]);

    const handleAcceptGameInvitation = async() => {
        try {
            console.log(activeInvitation,'activein')
            let data = await joinRoom(activeInvitation.gameId, user._id);
            navigate(`/room/${activeInvitation.gameId}`)
            setActiveInvitation(null)
        }
        catch(error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const handleAccept = async () => {
        if (activeInvitation) {
        try {
            console.log('Accepting game invitation:', activeInvitation);
            await handleAcceptGameInvitation(
            activeInvitation.senderId,
            activeInvitation.gameId,
            activeInvitation.id
            );
            await markAsRead(activeInvitation.id);
            console.log('Accepted game invitation from:', activeInvitation.senderUsername);
        } catch (error) {
            console.error('Error accepting game invitation:', error);
        }
        setActiveInvitation(null);
        }
    };

    const handleDecline = async () => {
        if (activeInvitation) {
        try {
            await markAsRead(activeInvitation.id);
            console.log('Declined game invitation from:', activeInvitation.senderUsername);
        } catch (error) {
            console.error('Error declining game invitation:', error);
        }
        setActiveInvitation(null);
        }
    };

    const handleClose = () => {
        setActiveInvitation(null);
        console.log(activeInvitation)
        markAsRead(activeInvitation._id)
    };

    // Debug log
    useEffect(() => {
        if (activeInvitation) {
        console.log('Active Game Invitation Data:', activeInvitation);
        }
    }, [activeInvitation]);

    return (
        <GameInvitationPopup
        invitation={activeInvitation}
        isOpen={!!activeInvitation}
        onClose={handleClose}
        onAccept={handleAccept}
        onDecline={handleDecline}
        />
    );
};

export default GameInvitationHandler;