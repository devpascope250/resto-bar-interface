"use client";

import { ShoppingCart, Trash2, Plus, Minus, X, CreditCard, Printer } from 'lucide-react';
import { useCartStore } from '@/app/dashboard/pos/store/cartStore';

interface CartSectionProps {
  useDarkTheme: boolean;
}

export default function CartSection({ useDarkTheme }: CartSectionProps) {
  const {
    cart,
    updateQuantity,
    removeItem,
    clearCart,
    calculateTotal,
    calculateTax,
    calculateGrandTotal
  } = useCartStore();

  return (
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

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 320px)' }}>
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
            {cart.map((item, idx) => (
              <div 
                key={idx} 
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

      {/* Cart Summary */}
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
  );
}