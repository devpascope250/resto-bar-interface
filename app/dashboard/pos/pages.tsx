// app/pos/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Barcode, Trash2, Plus, Minus, Printer, ShoppingCart, CheckCircle, X, Scan, Clock, Hash, Package, Percent, CreditCard, QrCode, Maximize2, Minimize2, Settings, User, Bell, Moon, Sun } from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode: string;
  category: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
};

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'Organic Apples', price: 3.99, quantity: 2, barcode: '890123456789', category: 'Produce' },
    { id: '2', name: 'Whole Wheat Bread', price: 2.49, quantity: 1, barcode: '890123456788', category: 'Bakery' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'scan'>('search');
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // Generate more products for testing scroll
  const products: Product[] = [
    { id: '1', name: 'Organic Apples', price: 3.99, barcode: '4898662099960', category: 'Produce', stock: 50 },
    { id: '2', name: 'Whole Wheat Bread', price: 2.49, barcode: '6201101060250', category: 'Bakery', stock: 30 },
    { id: '3', name: 'Milk 1 Gallon', price: 4.49, barcode: '890123456787', category: 'Dairy', stock: 25 },
    { id: '4', name: 'Eggs (Dozen)', price: 3.99, barcode: '890123456786', category: 'Dairy', stock: 40 },
    { id: '5', name: 'Chicken Breast', price: 8.99, barcode: '890123456785', category: 'Meat', stock: 20 },
    { id: '6', name: 'Coca-Cola 2L', price: 1.99, barcode: '890123456784', category: 'Beverages', stock: 60 },
    { id: '7', name: 'Potato Chips', price: 2.99, barcode: '890123456783', category: 'Snacks', stock: 45 },
    { id: '8', name: 'Toilet Paper', price: 6.49, barcode: '890123456782', category: 'Household', stock: 35 },
    { id: '9', name: 'Orange Juice', price: 3.49, barcode: '890123456781', category: 'Beverages', stock: 30 },
    { id: '10', name: 'Cheddar Cheese', price: 4.99, barcode: '890123456780', category: 'Dairy', stock: 25 },
    { id: '11', name: 'Ground Beef', price: 7.99, barcode: '890123456779', category: 'Meat', stock: 15 },
    { id: '12', name: 'Lettuce', price: 1.99, barcode: '890123456778', category: 'Produce', stock: 40 },
    { id: '13', name: 'Tomatoes', price: 2.49, barcode: '890123456777', category: 'Produce', stock: 35 },
    { id: '14', name: 'Pasta', price: 1.79, barcode: '890123456776', category: 'Pantry', stock: 50 },
    { id: '15', name: 'Pasta Sauce', price: 2.99, barcode: '890123456775', category: 'Pantry', stock: 30 },
    { id: '16', name: 'Frozen Pizza', price: 5.99, barcode: '890123456774', category: 'Frozen', stock: 20 },
    { id: '17', name: 'Ice Cream', price: 4.49, barcode: '890123456773', category: 'Frozen', stock: 25 },
    { id: '18', name: 'Coffee', price: 8.99, barcode: '890123456772', category: 'Beverages', stock: 40 },
    { id: '19', name: 'Tea Bags', price: 3.49, barcode: '890123456771', category: 'Beverages', stock: 45 },
    { id: '20', name: 'Sugar', price: 2.99, barcode: '890123456770', category: 'Pantry', stock: 60 },
  ];

  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const cartItemsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-enter fullscreen on load
  useEffect(() => {
    const enterFullScreen = () => {
      setIsFullScreen(true);
      if (containerRef.current && !document.fullscreenElement) {
        containerRef.current.requestFullscreen?.().catch(console.log);
      }
    };
    
    enterFullScreen();
    
    // Auto-focus search on load
    searchInputRef.current?.focus();
    
    // Listen for fullscreen change
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Simulate barcode scanner input
  useEffect(() => {
    if (barcodeInput.length >= 8) {
      handleBarcodeScan(barcodeInput);
      setBarcodeInput('');
    }
  }, [barcodeInput]);

  const handleBarcodeScan = useCallback((barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setCart(prev => {
        const existing = prev.find(item => item.barcode === barcode);
        if (existing) {
          return prev.map(item =>
            item.barcode === barcode
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            barcode: product.barcode,
            category: product.category
          }];
        }
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  }, [products]);

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

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculateTax = () => calculateTotal() * 0.08;
  const calculateGrandTotal = () => calculateTotal() + calculateTax();

  const handleQuickProduct = (product: Product) => {
    handleBarcodeScan(product.barcode);
  };

  // Determine theme based on fullscreen and theme toggle
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
      {/* Top Control Bar */}
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

              <div className="relative">
                {activeTab === 'search' ? (
                  <>
                    <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
                      useDarkTheme ? 'text-gray-400' : 'text-gray-400'
                    }`} size={14} />
                    <input
                      ref={searchInputRef}
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
                  </>
                ) : (
                  <>
                    <Barcode className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
                      useDarkTheme ? 'text-blue-400' : 'text-blue-500'
                    }`} size={14} />
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      placeholder="Scan barcode..."
                      className={`w-full pl-8 pr-3 py-2 text-sm font-mono rounded ${
                        useDarkTheme
                          ? 'bg-gray-700 border-2 border-blue-500/50 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-white border-2 border-blue-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
                      } outline-none transition-colors`}
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Controls and Stats */}
            <div className="flex items-center gap-3">
              {/* Quick Stats */}
              <div className={`hidden md:flex items-center gap-4 mr-2 ${
                useDarkTheme ? 'text-white' : 'text-gray-700'
              }`}>
                <div className="text-right">
                  <p className="text-xs opacity-75">Items</p>
                  <p className="text-sm font-bold">{cart.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Total</p>
                  <p className="text-sm font-bold">${calculateTotal().toFixed(2)}</p>
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

      {/* Settings Dropdown */}
      {showSettings && (
        <div className={`fixed top-12 right-4 z-50 w-48 rounded-lg shadow-lg border ${
          useDarkTheme 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
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
                {useDarkTheme ? <Sun size={14} /> : <Moon size={14} />}
                <span>Theme: {useDarkTheme ? 'Dark' : 'Light'}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative ${
                useDarkTheme ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  useDarkTheme ? 'transform translate-x-6' : 'transform translate-x-1'
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
      )}

      {/* Main Content - Full Screen */}
      <div className={`pt-16 h-screen overflow-hidden transition-colors duration-300`}>
        <div className="h-full max-w-screen-2xl mx-auto p-2 md:p-3">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Column - Products */}
            <div className="lg:col-span-2 h-full flex flex-col">
              {/* Products Grid */}
              <div className={`flex-1 rounded-xl overflow-hidden flex flex-col ${
                useDarkTheme ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
              } shadow-sm border ${useDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`p-3 border-b ${
                  useDarkTheme ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mt-2">
                    <h2 className={`font-bold text-sm flex items-center gap-2 ${
                      useDarkTheme ? 'text-white' : 'text-gray-800'
                    }`}>
                      <Package size={14} />
                      Available Products ({products.length})
                    </h2>
                    <div className="flex gap-1">
                      {['All', 'Produce', 'Dairy', 'Snacks', 'Beverages'].map(cat => (
                        <span key={cat} className={`px-2 py-0.5 text-xs rounded cursor-pointer ${
                          useDarkTheme
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Product Grid - Scrollable with proper height */}
                <div 
                  ref={productsContainerRef}
                  className="flex-1 overflow-y-auto p-3"
                  style={{ maxHeight: 'calc(100vh - 180px)' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {products.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleQuickProduct(product)}
                        className={`group p-2 rounded-lg border text-left transition-all ${
                          useDarkTheme
                            ? 'bg-gray-700/30 border-gray-600 hover:border-blue-500 hover:bg-gray-700'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-xs truncate ${
                              useDarkTheme 
                                ? 'text-white group-hover:text-blue-400' 
                                : 'text-gray-800 group-hover:text-blue-600'
                            }`}>
                              {product.name}
                            </h3>
                            <p className={`text-[10px] truncate ${
                              useDarkTheme ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right ml-1">
                            <p className={`font-bold text-xs ${
                              useDarkTheme ? 'text-white' : 'text-gray-800'
                            }`}>
                              ${product.price.toFixed(2)}
                            </p>
                            <p className={`text-[9px] ${
                              useDarkTheme ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              #{product.barcode.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                          <span className={`px-1 py-0.5 text-[9px] font-medium rounded ${
                            useDarkTheme
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            Stock: {product.stock}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Plus size={10} className={useDarkTheme ? 'text-blue-400' : 'text-blue-600'} />
                            <span className={`text-[10px] font-medium ${
                              useDarkTheme ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              Add
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`mt-2 rounded-xl p-3 ${
                useDarkTheme ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
              } shadow-sm border ${useDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-bold text-xs mb-2 flex items-center gap-1 ${
                  useDarkTheme ? 'text-white' : 'text-gray-800'
                }`}>
                  <Clock size={12} />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { icon: Percent, label: 'Discount', color: 'text-blue-500' },
                    { icon: Hash, label: 'Add Note', color: 'text-green-500' },
                    { icon: QrCode, label: 'QR Code', color: 'text-purple-500' },
                    { icon: Scan, label: 'Multi Scan', color: 'text-orange-500' }
                  ].map((action, idx) => (
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
            </div>

            {/* Right Column - Cart */}
            <div className="h-full">
              <div className={`h-full rounded-xl overflow-hidden flex flex-col ${
                useDarkTheme ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white'
              } shadow-sm border ${useDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                {/* Cart Header */}
                <div className={`p-3 border-b ${
                  useDarkTheme 
                    ? 'border-gray-700 bg-gradient-to-r from-blue-900/20 to-indigo-900/20' 
                    : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                }`}>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className={useDarkTheme ? 'text-blue-400' : 'text-blue-600'} size={16} />
                      <h2 className={`font-bold text-sm ${
                        useDarkTheme ? 'text-white' : 'text-gray-800'
                      }`}>
                        Current Sale
                      </h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${
                        useDarkTheme ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {cart.length} items
                      </span>
                      <button
                        onClick={clearCart}
                        className={`ml-2 px-2 py-1 text-xs rounded flex items-center gap-1 transition-colors ${
                          useDarkTheme
                            ? 'text-red-400 hover:bg-red-900/30'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={12} />
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between mt-1 text-xs ${
                    useDarkTheme ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span>Subtotal</span>
                    <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Cart Items - Scrollable with proper height */}
                <div 
                  ref={cartItemsContainerRef}
                  className="flex-1 overflow-y-auto p-3"
                  style={{ maxHeight: 'calc(100vh - 320px)' }}
                >
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className={`mx-auto mb-3 ${
                        useDarkTheme ? 'text-gray-600' : 'text-gray-300'
                      }`} size={32} />
                      <p className={`text-sm ${
                        useDarkTheme ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Cart is empty
                      </p>
                      <p className={`text-xs mt-1 ${
                        useDarkTheme ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Scan or search for products
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cart.map(item => (
                        <div 
                          key={item.id} 
                          className={`group p-2 rounded-lg ${
                            useDarkTheme 
                              ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          } transition-colors`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold text-xs truncate ${
                                useDarkTheme ? 'text-white' : 'text-gray-800'
                              }`}>
                                {item.name}
                              </h4>
                              <p className={`text-[10px] truncate ${
                                useDarkTheme ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {item.category}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                                useDarkTheme 
                                  ? 'text-gray-400 hover:text-red-400' 
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                            >
                              <X size={10} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className={`w-5 h-5 flex items-center justify-center rounded ${
                                  useDarkTheme
                                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                              >
                                <Minus size={8} />
                              </button>
                              <span className={`font-bold text-xs min-w-[1.5rem] text-center ${
                                useDarkTheme ? 'text-white' : 'text-gray-800'
                              }`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className={`w-5 h-5 flex items-center justify-center rounded ${
                                  useDarkTheme
                                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                              >
                                <Plus size={8} />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-xs ${
                                useDarkTheme ? 'text-white' : 'text-gray-800'
                              }`}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className={`text-[9px] ${
                                useDarkTheme ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                ${item.price.toFixed(2)} ea
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Summary - Fixed at bottom */}
                <div className={`border-t p-3 ${
                  useDarkTheme ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className={useDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                        Subtotal
                      </span>
                      <span className={`font-medium ${
                        useDarkTheme ? 'text-white' : 'text-gray-800'
                      }`}>
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={useDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                        Tax (8%)
                      </span>
                      <span className={`font-medium ${
                        useDarkTheme ? 'text-white' : 'text-gray-800'
                      }`}>
                        ${calculateTax().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className={useDarkTheme ? 'text-white' : 'text-gray-800'}>
                        Total
                      </span>
                      <span className={useDarkTheme ? 'text-white' : 'text-gray-800'}>
                        ${calculateGrandTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <button className={`p-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 ${
                      useDarkTheme
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}>
                      <CreditCard size={12} />
                      Card
                    </button>
                    <button className={`p-1.5 rounded text-xs font-medium ${
                      useDarkTheme
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}>
                      Cash
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-1">
                    <button className={`p-2 rounded text-xs font-medium flex items-center justify-center gap-1 ${
                      useDarkTheme
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      <Printer size={12} />
                      Print
                    </button>
                    <button className={`p-2 rounded text-xs font-medium ${
                      useDarkTheme
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    }`}>
                      Complete Sale
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}