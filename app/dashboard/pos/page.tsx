"use client";

import { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, ShoppingCart } from 'lucide-react';
import ControlBar from '@/components/pos/ControlBar';
import ProductsGrid from '@/components/pos/ProductsGrid';
import CartSection from '@/components/pos/CartSection';
import QuickActions from '@/components/pos/QuickActions';
import SettingsDropdown from '@/components/pos/SettingsDropdown';
import Notifications from '@/components/pos/Notifications';
import ScannerInput from '@/components/pos/ScannerInput';
import { useCartStore } from './store/cartStore';

type Product = {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
};

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'scan'>('search');
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  
  // Sample products (in real app, fetch from API)
  const products: Product[] = [
    { id: '1', name: 'Organic Apples', price: 3.99, barcode: '4898662099960', category: 'Produce', stock: 50 },
    { id: '2', name: 'Whole Wheat Bread', price: 2.49, barcode: '6201101060250', category: 'Bakery', stock: 30 },
    // ... more products
  ];
  
  // Auto-enter fullscreen on load
  useEffect(() => {
    const enterFullScreen = () => {
      setIsFullScreen(true);
      if (containerRef.current && !document.fullscreenElement) {
        containerRef.current.requestFullscreen?.().catch(console.log);
      }
    };
    
    enterFullScreen();
    
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      containerRef.current?.requestFullscreen?.().catch(console.log);
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };
  
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  
  const handleBarcodeScan = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        barcode: product.barcode,
        category: product.category,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };
  
  const useDarkTheme = isFullScreen || isDarkTheme;
  
  return (
    <div 
      ref={containerRef}
      className={`min-h-screen transition-all duration-300 ${
        useDarkTheme 
          ? 'bg-gray-900 text-gray-100' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800'
      }`}
    >
      {/* Control Bar */}
      <ControlBar
        useDarkTheme={useDarkTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartLength={useCartStore((state) => state.cart.length)}
        total={useCartStore((state) => state.calculateTotal())}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        scannerInput={
          activeTab === 'scan' ? (
            <ScannerInput onScan={handleBarcodeScan} useDarkTheme={useDarkTheme} />
          ) : null
        }
      />
      
      {/* Settings Dropdown */}
      <SettingsDropdown
        useDarkTheme={useDarkTheme}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
      />
      
      {/* Main Content */}
      <div className={`pt-16 h-screen overflow-hidden transition-colors duration-300`}>
        <div className="h-full max-w-screen-2xl mx-auto p-2 md:p-3">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Column */}
            <div className="lg:col-span-2 h-full flex flex-col">
              <ProductsGrid products={products} useDarkTheme={useDarkTheme} />
              <div className="mt-2">
                <QuickActions useDarkTheme={useDarkTheme} />
              </div>
            </div>
            
            {/* Right Column - Cart */}
            <div className="h-full">
              <CartSection useDarkTheme={useDarkTheme} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      <Notifications
        showSuccess={showSuccess}
        isFullScreen={isFullScreen}
        useDarkTheme={useDarkTheme}
      />
    </div>
  );
}