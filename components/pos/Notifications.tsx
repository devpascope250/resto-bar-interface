"use client";

import { CheckCircle, ShoppingCart } from 'lucide-react';

interface NotificationsProps {
  showSuccess: boolean;
  isFullScreen: boolean;
  useDarkTheme: boolean;
}

export default function Notifications({
  showSuccess,
  isFullScreen,
  useDarkTheme
}: NotificationsProps) {
  return (
    <>
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 animate-slide-up z-50">
          <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Item added!</span>
          </div>
        </div>
      )}

      {/* Scanner Status */}
      <div className="fixed bottom-4 left-4">
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg shadow-sm ${
          useDarkTheme
            ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700'
            : 'bg-white border-gray-200'
        } border`}>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className={`text-xs ${
            useDarkTheme ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Scanner: Ready
          </span>
        </div>
      </div>

      {/* Fullscreen Status */}
      <div className={`fixed top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
        isFullScreen
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : 'bg-gray-200 text-gray-600 border border-gray-300'
      }`}>
        {isFullScreen ? 'FULLSCREEN MODE' : 'REGULAR MODE'}
      </div>

      {/* Scroll Indicator */}
      <div className={`fixed bottom-4 right-20 text-xs ${
        useDarkTheme ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex items-center gap-2">
          <span>↑↓ Scroll</span>
        </div>
      </div>
    </>
  );
}