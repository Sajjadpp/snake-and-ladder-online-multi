// components/NotificationSidebar.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, AlertTriangle, Trophy, Users, Gift, Clock, 
  Settings, Trash2, Search, RefreshCw 
} from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext';

const NotificationSidebar = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('unread');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    clearAll,
    refreshNotifications
  } = useNotification();

  const getIconComponent = (type) => {
    const icons = {
      game_invite: Trophy,
      friend_request: Users,
      reward: Gift,
      tournament: AlertTriangle,
      achievement: Trophy,
      system: Bell
    };
    return icons[type] || Bell;
  };

  const getColorClass = (type) => {
    const colors = {
      game_invite: 'text-orange-500',
      friend_request: 'text-blue-500',
      reward: 'text-green-500',
      tournament: 'text-yellow-500',
      achievement: 'text-purple-500',
      system: 'text-gray-500'
    };
    return colors[type] || 'text-gray-500';
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'unread' && !notification.read) ||
      (activeFilter === 'read' && notification.read);
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  // Check if there are any read notifications
  const hasReadNotifications = notifications.some(n => n.read);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-800 border-l border-gray-700 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <p className="text-sm text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={refreshNotifications}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {['all', 'unread', 'read'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    activeFilter === filter
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Only show action buttons if there are notifications */}
            {notifications.length > 0 && (
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {filteredNotifications.length !== 0 && (
                  <button
                    onClick={deleteAllRead}
                    className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    title="Clear read"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
              >
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
              </motion.div>
            ) : filteredNotifications.length > 0 ? (
              <motion.div
                key="notifications-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 space-y-3"
              >
                {filteredNotifications.map((notification, index) => {
                  const IconComponent = getIconComponent(notification.type);
                  const colorClass = getColorClass(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-gray-700 rounded-xl p-4 border-l-4 ${
                        notification.read 
                          ? 'border-l-gray-600' 
                          : 'border-l-orange-500 bg-gray-700/70'
                      } transition-all duration-200 group hover:bg-gray-650`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg bg-gray-600 ${colorClass} flex-shrink-0`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-white text-sm leading-tight">
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  className="p-1 text-gray-400 hover:text-green-500 transition-colors rounded"
                                  title="Mark as read"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDelete(notification.id, e)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                                title="Delete"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                              {!notification.read && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-orange-500 rounded-full"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center h-full py-12 px-6 text-center"
              >
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {searchQuery ? 'No notifications found' : 'No notifications'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'You are all caught up! Check back later for updates.'
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - Only show if there are notifications */}
        {notifications.length > 0 && (
          <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-900/30">
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-red-500 text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Clear All
              </button>
              <button className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default NotificationSidebar;