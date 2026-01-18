"use client";

import { User, Sun, Moon } from 'lucide-react';

interface SettingsDropdownProps {
  useDarkTheme: boolean;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

export default function SettingsDropdown({
  useDarkTheme,
  showSettings,
  setShowSettings,
  isDarkTheme,
  toggleTheme
}: SettingsDropdownProps) {
  if (!showSettings) return null;

  return (
    <div 
      className={`fixed top-12 right-4 z-50 w-48 rounded-lg shadow-lg border ${
        useDarkTheme 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <User size={14} className={useDarkTheme ? "text-gray-400" : "text-gray-500"} />
          <span className={`text-sm font-medium ${
            useDarkTheme ? "text-gray-300" : "text-gray-700"
          }`}>
            Cashier: John Doe
          </span>
        </div>
      </div>
      <div className="p-2">
        <button 
          onClick={toggleTheme}
          className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${
            useDarkTheme 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {isDarkTheme ? <Sun size={14} /> : <Moon size={14} />}
            <span>Theme: {isDarkTheme ? 'Dark' : 'Light'}</span>
          </div>
          <div className={`w-10 h-5 rounded-full relative ${
            isDarkTheme ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              isDarkTheme ? 'transform translate-x-6' : 'transform translate-x-1'
            }`}></div>
          </div>
        </button>
        <button className={`w-full text-left px-3 py-2 text-sm rounded ${
          useDarkTheme 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}>
          Change Cashier
        </button>
        <button className={`w-full text-left px-3 py-2 text-sm rounded ${
          useDarkTheme 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}>
          Scanner Settings
        </button>
        <button className={`w-full text-left px-3 py-2 text-sm rounded ${
          useDarkTheme 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}>
          Print Settings
        </button>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          <button className={`w-full text-left px-3 py-2 text-sm rounded ${
            useDarkTheme 
              ? 'hover:bg-gray-700 text-red-400' 
              : 'hover:bg-red-50 text-red-600'
          }`}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}