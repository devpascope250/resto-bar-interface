"use client";

import { Package, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCartStore } from '@/app/dashboard/pos/store/cartStore';

type Product = {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
};

interface ProductsGridProps {
  products: Product[];
  useDarkTheme: boolean;
}

const memeFilters = [
  { id: 'all', label: 'All Items', meme: '🚀' },
  { id: 'popular', label: 'Popular', meme: '🔥' },
  { id: 'cheap', label: 'Under $5', meme: '💸' },
  { id: 'fresh', label: 'Fresh', meme: '🥬' },
  { id: 'snacks', label: 'Snacks', meme: '🍿' },
  { id: 'drinks', label: 'Drinks', meme: '🥤' },
  { id: 'clearance', label: 'Clearance', meme: '🤑' },
  { id: 'new', label: 'New Arrivals', meme: '🆕' },
];

export default function ProductsGrid({ products, useDarkTheme }: ProductsGridProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply meme filters
    switch (activeFilter) {
      case 'popular':
        filtered = filtered.filter(p => p.category === 'Beverages' || p.category === 'Snacks');
        break;
      case 'cheap':
        filtered = filtered.filter(p => p.price < 5);
        break;
      case 'fresh':
        filtered = filtered.filter(p => p.category === 'Produce' || p.category === 'Dairy');
        break;
      case 'snacks':
        filtered = filtered.filter(p => p.category === 'Snacks');
        break;
      case 'drinks':
        filtered = filtered.filter(p => p.category === 'Beverages');
        break;
      case 'clearance':
        filtered = filtered.filter(p => p.price < 3);
        break;
      case 'new':
        filtered = filtered.slice(0, 8); // First 8 as "new"
        break;
      default:
        break;
    }
    
    return filtered;
  }, [products, activeFilter, searchQuery]);
  
  const handleAddProduct = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      barcode: product.barcode,
      category: product.category,
    });
  };
  
  return (
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
            Available Products ({filteredProducts.length})
          </h2>
          
          {/* Meme Filter Bar */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {memeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex items-center gap-1 ${
                  activeFilter === filter.id
                    ? useDarkTheme
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : useDarkTheme
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{filter.meme}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Search within products */}
        <div className="mt-2">
          <input
            type="text"
            placeholder={`Search in ${activeFilter !== 'all' ? memeFilters.find(f => f.id === activeFilter)?.label : 'all'}...`}
            className={`w-full px-3 py-1.5 text-sm rounded ${
              useDarkTheme
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-800'
            } border outline-none`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">😅</div>
            <p className={`text-sm ${useDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              No products found!
            </p>
            <p className={`text-xs mt-1 ${useDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
              Try a different filter or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddProduct(product)}
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
        )}
      </div>
    </div>
  );
}