"use client";

import { Barcode } from 'lucide-react';
import { useBarcodeScanner } from '@/app/dashboard/pos/utils/barcodeScanner';

interface ScannerInputProps {
  onScan: (barcode: string) => void;
  useDarkTheme: boolean;
}

export default function ScannerInput({ onScan, useDarkTheme }: ScannerInputProps) {
  useBarcodeScanner(onScan, { minLength: 8, timeout: 100 });
  
  return (
    <div className="relative">
      <Barcode className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
        useDarkTheme ? 'text-blue-400' : 'text-blue-500'
      }`} size={14} />
      <input
        type="text"
        placeholder="Scan barcode (or type anywhere)..."
        className={`w-full pl-8 pr-3 py-2 text-sm font-mono rounded ${
          useDarkTheme
            ? 'bg-gray-700 border-2 border-blue-500/50 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
            : 'bg-white border-2 border-blue-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
        } outline-none transition-colors`}
        readOnly
        value=""
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}