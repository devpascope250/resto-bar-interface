"use client";

import { Clock, Percent, Hash, QrCode, Scan } from 'lucide-react';

interface QuickActionsProps {
  useDarkTheme: boolean;
}

export default function QuickActions({ useDarkTheme }: QuickActionsProps) {
  const quickActions = [
    { icon: Percent, label: 'Discount', color: 'text-blue-500' },
    { icon: Hash, label: 'Add Note', color: 'text-green-500' },
    { icon: QrCode, label: 'QR Code', color: 'text-purple-500' },
    { icon: Scan, label: 'Multi Scan', color: 'text-orange-500' }
  ];

  return (
    <div className={`rounded-xl p-3 ${
      useDarkTheme ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
    } shadow-sm border ${useDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className={`font-bold text-xs mb-2 flex items-center gap-1 ${
        useDarkTheme ? 'text-white' : 'text-gray-800'
      }`}>
        <Clock size={12} />
        Quick Actions
      </h3>
      <div className="grid grid-cols-4 gap-1">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 ${
              useDarkTheme
                ? 'hover:bg-gray-700 border-gray-600'
                : 'hover:bg-gray-50 border-gray-200'
            } border transition-colors`}
          >
            <action.icon size={14} className={action.color} />
            <span className={`text-[10px] font-medium ${
              useDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}