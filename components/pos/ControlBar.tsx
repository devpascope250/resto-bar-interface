"use client";

import { Search, ShoppingCart, Maximize2, Minimize2, Settings, Barcode } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';

interface ControlBarProps {
  useDarkTheme: boolean;
  activeTab: 'search' | 'scan';
  setActiveTab: (tab: 'search' | 'scan') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartLength: number;
  total: number;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  scannerInput?: ReactNode;
}

export default function ControlBar({
  useDarkTheme,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  cartLength,
  total,
  toggleFullScreen,
  isFullScreen,
  showSettings,
  setShowSettings,
  scannerInput
}: ControlBarProps) {
  // Use state to handle hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't render cart stats on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className={`fixed top-0 left-0 right-0 z-50 ${
        useDarkTheme ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
      } border-b ${useDarkTheme ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="max-w-screen-2xl mx-auto p-2 md:p-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${
                useDarkTheme ? 'bg-blue-500' : 'bg-blue-600'
              }`}>
                <ShoppingCart className="text-white" size={20} />
              </div>
              <div>
                <h1 className={`text-lg font-bold ${
                  useDarkTheme ? 'text-white' : 'text-gray-800'
                }`}>QuickoPOS</h1>
                <p className={`text-xs ${
                  useDarkTheme ? 'text-gray-300' : 'text-gray-500'
                }`}>Fast Checkout System</p>
              </div>
            </div>
            
            {/* Center: Search/Scan Tabs - simplified */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="flex gap-1 mb-1">
                <button className="px-3 py-1.5 rounded-t text-xs font-medium opacity-0">
                  Search
                </button>
              </div>
            </div>
            
            {/* Right: Placeholder for Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      useDarkTheme ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
    } border-b ${useDarkTheme ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
      <div className="max-w-screen-2xl mx-auto p-2 md:p-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${
              useDarkTheme ? 'bg-blue-500' : 'bg-blue-600'
            }`}>
              <ShoppingCart className="text-white" size={20} />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${
                useDarkTheme ? 'text-white' : 'text-gray-800'
              }`}>QuickoPOS</h1>
              <p className={`text-xs ${
                useDarkTheme ? 'text-gray-300' : 'text-gray-500'
              }`}>Fast Checkout System</p>
            </div>
          </div>

          {/* Center: Search/Scan Tabs */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex gap-1 mb-1">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-1 ${
                  activeTab === 'search' 
                    ? useDarkTheme 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-600 text-white'
                    : useDarkTheme
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Search size={12} />
                Search
              </button>
              <button
                onClick={() => setActiveTab('scan')}
                className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-1 ${
                  activeTab === 'scan' 
                    ? useDarkTheme 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-600 text-white'
                    : useDarkTheme
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Barcode size={12} />
                Scan
              </button>
            </div>

            {activeTab === 'search' ? (
              <div className="relative">
                <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
                  useDarkTheme ? 'text-gray-400' : 'text-gray-400'
                }`} size={14} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`w-full pl-8 pr-3 py-2 text-sm rounded ${
                    useDarkTheme
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
                  } border outline-none transition-colors`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            ) : (
              scannerInput
            )}
          </div>

          {/* Right: Controls and Stats */}
          <div className="flex items-center gap-3">
            {/* Quick Stats */}
            <div className={`hidden md:flex items-center gap-4 mr-2 ${
              useDarkTheme ? 'text-white' : 'text-gray-700'
            }`}>
              <div className="text-right">
                <p className="text-xs opacity-75">Items</p>
                <p className="text-sm font-bold">{cartLength}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Total</p>
                <p className="text-sm font-bold">${total.toFixed(2)}</p>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded ${
                  useDarkTheme 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={toggleFullScreen}
                className={`p-1.5 rounded ${
                  useDarkTheme 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}