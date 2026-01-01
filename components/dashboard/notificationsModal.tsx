import { useState, useEffect } from 'react';
import { Store, Bell, X, ChevronRight, Check, Clock } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  content: string;
  detailUrl?: string;
  registeredDate: string;
  isRead?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}
import { useApi } from '@/hooks/api-hooks';
import { LocalStorage } from '@/lib/local-storage';
const NotificationsModal = () => {
    const { useApiQuery} = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: notifications } = useApiQuery<Notification[]>(['my-notice'], '/ebm/all-notices', {
    staleTime: 60 * 60 * 1000, // 1 hour
  });

useEffect(() => {
  if (notifications && notifications.length > 0) {
    const localData = LocalStorage.getItem('notices');
    const readNotifications = localData as Notification[] || [];
    
    // Create a Set of IDs from read notifications for efficient lookup
    const readIds = new Set(readNotifications.map(notif => notif.id));
    
    // Count notifications whose ID is NOT in the read set
    const unread = notifications.filter(notif => (!readIds.has(notif.id) && !notif.isRead)).length;
    
    setUnreadCount(unread);
  } else {
    setUnreadCount(0);
  }
}, [notifications, LocalStorage]);
  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const markAsRead = (id: number) => {
    const locatStorag = LocalStorage.getItem('notices');
    if(locatStorag){
        let local  = locatStorag as Notification[];
        local.map((notice) => {
            if(notice.id === id) {
                return {
                    ...notice,
                    isRead: true
                }
            }else{
                const newD = {isRead: true, id: id};
                return {
                    notice,
                    newD
                }
            }
        })
        LocalStorage.setItem('notices', local);
    }else{
        const finItem = notifications?.find((it) => it.id === id);
        LocalStorage.setItem("notices", [{id: finItem?.id, isRead: true}]);

    }
  };


  const markAllAsRead = () => {
    const locatStorag = notifications?.forEach((notice) => {
        notice.isRead = true;
    });
    if(locatStorag){
        LocalStorage.setItem('notices', locatStorag);
    }
  };

//   const deleteNotification = (id: number) => {
//     setNotifications(prev => prev.filter(notif => notif.id !== id));
//   };

  const getTypeColor = (type: Notification['type']) => {
    switch(type) {
      case 'success': return 'bg-green-500/20 border-l-green-500';
      case 'warning': return 'bg-yellow-500/20 border-l-yellow-500';
      case 'error': return 'bg-red-500/20 border-l-red-500';
      default: return 'bg-blue-500/20 border-l-blue-500';
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Dashboard Header */}
      <div className="flex h-16 items-center border-b border-white/10 px-6 bg-black shrink-0">
        <Store className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-white">Dashboard</span>

        <div className="ml-auto flex items-center space-x-4">
          <button 
            onClick={openModal}
            className="relative p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-white/5 rounded-lg group"
          >
            <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
            {unreadCount && unreadCount > 0 ? (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white animate-pulse">
                {unreadCount}
              </span>
            ): ""}
          </button>
        </div>
      </div>

      {/* Notification Modal */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop with fade animation */}
        <div 
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeModal}
        />
        
        {/* Modal Panel with slide animation */}
        <div 
          className={`absolute inset-y-0 left-0 w-full sm:w-96 bg-gray-900/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col border-r border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gray-900/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Notifications
                  </h2>
                  <p className="text-xs text-gray-400">
                    {unreadCount} unread • {notifications?.length} total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(notifications && notifications?.length > 0) && (unreadCount && unreadCount > 0) && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-400 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                  >
                    <Check className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-hidden">
              {notifications && notifications?.length > 0 ? (
                <div className="h-full overflow-y-auto custom-scrollbar py-2">
                  <div className="space-y-2 px-3">
                    {notifications?.map((notification) => (
                      <div
                        key={notification.id}
                        className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer border-l-4 ${
                          notification.isRead 
                            ? 'bg-white/5 hover:bg-white/10 border-l-gray-600' 
                            : getTypeColor(notification.type)
                        } hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
                        onClick={() => notification.detailUrl && (window.location.href = notification.detailUrl)}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'success' ? 'bg-green-500/20' :
                            notification.type === 'warning' ? 'bg-yellow-500/20' :
                            notification.type === 'error' ? 'bg-red-500/20' :
                            'bg-blue-500/20'
                          }`}>
                            <Bell className={`h-4 w-4 ${
                              notification.type === 'success' ? 'text-green-400' :
                              notification.type === 'warning' ? 'text-yellow-400' :
                              notification.type === 'error' ? 'text-red-400' :
                              'text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-semibold truncate ${
                                notification.isRead ? 'text-gray-300' : 'text-white'
                              }`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.isRead && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all duration-200"
                                    title="Mark as read"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                )}
                               
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                              {notification.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{notification.registeredDate}</span>
                              </div>
                              {notification.detailUrl && (
                                <div className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    View details
                                  </span>
                                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="absolute top-3 right-3 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
                  <div className="relative mb-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <Bell className="h-10 w-10 text-gray-600" />
                    </div>
                    <div className="absolute -inset-4 rounded-full border-2 border-gray-800/50 animate-ping" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    All caught up! 🎉
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-xs">
                    No notifications at the moment. Check back later for updates.
                  </p>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications && notifications.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-gray-900/90">
                <button
                  onClick={closeModal}
                  className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-black/20 active:scale-95"
                >
                  Close Panel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.05);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default NotificationsModal;