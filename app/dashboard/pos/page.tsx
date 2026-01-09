// // app/pos/page.tsx
// "use client";

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { Search, Barcode, Trash2, Plus, Minus, Printer, ShoppingCart, AlertCircle, CheckCircle, X } from 'lucide-react';

// type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   barcode: string;
//   category: string;
//   image?: string;
// };

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   barcode: string;
//   category: string;
//   stock: number;
//   image?: string;
// };

// export default function POSPage() {
//   const [cart, setCart] = useState<CartItem[]>([
//     { id: '1', name: 'Organic Apples', price: 3.99, quantity: 2, barcode: '890123456789', category: 'Produce' },
//     { id: '2', name: 'Whole Wheat Bread', price: 2.49, quantity: 1, barcode: '890123456788', category: 'Bakery' },
//   ]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [products, setProducts] = useState<Product[]>([
//     { id: '1', name: 'Organic Apples', price: 3.99, barcode: '890123456789', category: 'Produce', stock: 50 },
//     { id: '2', name: 'Whole Wheat Bread', price: 2.49, barcode: '890123456788', category: 'Bakery', stock: 30 },
//     { id: '3', name: 'Milk 1 Gallon', price: 4.49, barcode: '890123456787', category: 'Dairy', stock: 25 },
//     { id: '4', name: 'Eggs (Dozen)', price: 3.99, barcode: '890123456786', category: 'Dairy', stock: 40 },
//     { id: '5', name: 'Chicken Breast', price: 8.99, barcode: '890123456785', category: 'Meat', stock: 20 },
//     { id: '6', name: 'Coca-Cola 2L', price: 1.99, barcode: '890123456784', category: 'Beverages', stock: 60 },
//     { id: '7', name: 'Potato Chips', price: 2.99, barcode: '890123456783', category: 'Snacks', stock: 45 },
//     { id: '8', name: 'Toilet Paper', price: 6.49, barcode: '890123456782', category: 'Household', stock: 35 },
//   ]);
//   const [scannedItem, setScannedItem] = useState<Product | null>(null);
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showScanner, setShowScanner] = useState(false);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const barcodeInputRef = useRef<HTMLInputElement>(null);

//   // Simulate barcode scanner input
//   useEffect(() => {
//     if (barcodeInput.length >= 8) {
//       handleBarcodeScan(barcodeInput);
//       setBarcodeInput('');
//     }
//   }, [barcodeInput]);

//   // Auto-focus search on load
//   useEffect(() => {
//     searchInputRef.current?.focus();
//   }, []);

//   const handleBarcodeScan = useCallback((barcode: string) => {
//     const product = products.find(p => p.barcode === barcode);
//     if (product) {
//       setScannedItem(product);
      
//       // Add to cart or increase quantity
//       setCart(prev => {
//         const existing = prev.find(item => item.barcode === barcode);
//         if (existing) {
//           return prev.map(item =>
//             item.barcode === barcode
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           );
//         } else {
//           return [...prev, {
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             quantity: 1,
//             barcode: product.barcode,
//             category: product.category
//           }];
//         }
//       });
      
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 2000);
//     }
//   }, [products]);

//   const handleManualSearch = (query: string) => {
//     setSearchQuery(query);
//     if (query.length > 2) {
//       const found = products.find(p =>
//         p.name.toLowerCase().includes(query.toLowerCase()) ||
//         p.barcode.includes(query)
//       );
//       if (found) {
//         handleBarcodeScan(found.barcode);
//         setSearchQuery('');
//       }
//     }
//   };

//   const updateQuantity = (id: string, delta: number) => {
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       ).filter(item => item.quantity > 0)
//     );
//   };

//   const removeItem = (id: string) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//     setScannedItem(null);
//   };

//   const calculateTotal = () => {
//     return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   };

//   const calculateTax = () => calculateTotal() * 0.08;
//   const calculateGrandTotal = () => calculateTotal() + calculateTax();

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.barcode.includes(searchQuery) ||
//     product.category.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       {/* Header */}
//       <header className="mb-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">QuickPOS Terminal</h1>
//             <p className="text-gray-600 mt-1">Fast & Efficient Checkout System</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
//               <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-sm font-medium text-gray-700">Scanner Active</span>
//             </div>
//             <button
//               onClick={() => setShowScanner(!showScanner)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//             >
//               <Barcode size={20} />
//               {showScanner ? 'Hide Scanner' : 'Show Scanner'}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Product Search & List */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Search Section */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products by name, barcode, or category..."
//                 className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   handleManualSearch(e.target.value);
//                 }}
//               />
//             </div>
            
//             {/* Barcode Scanner Simulator */}
//             {showScanner && (
//               <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Barcode className="text-blue-600" size={24} />
//                     <h3 className="font-semibold text-gray-800">Scanner Input</h3>
//                   </div>
//                   <span className="text-sm text-gray-500">Auto-detects on 8+ digits</span>
//                 </div>
//                 <input
//                   ref={barcodeInputRef}
//                   type="text"
//                   placeholder="Simulate barcode scan (type 8+ digits)..."
//                   className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   value={barcodeInput}
//                   onChange={(e) => setBarcodeInput(e.target.value)}
//                 />
//                 <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
//                   <AlertCircle size={14} />
//                   Connect barcode scanner or type barcode above
//                 </div>
//               </div>
//             )}

//             {/* Scanned Item Display */}
//             {scannedItem && (
//               <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="p-2 bg-green-100 rounded-lg">
//                       <CheckCircle className="text-green-600" size={24} />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-800">Last Scanned Item</h4>
//                       <p className="text-gray-600">{scannedItem.name}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-gray-800">${scannedItem.price.toFixed(2)}</p>
//                     <p className="text-sm text-gray-500">Stock: {scannedItem.stock}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Product Grid */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">Popular Products</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredProducts.slice(0, 6).map(product => (
//                 <button
//                   key={product.id}
//                   onClick={() => handleBarcodeScan(product.barcode)}
//                   className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
//                         {product.name}
//                       </h3>
//                       <p className="text-sm text-gray-500 mt-1">{product.category}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</p>
//                       <p className="text-xs text-gray-400">#{product.barcode}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between mt-4">
//                     <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
//                       In Stock: {product.stock}
//                     </span>
//                     <div className="flex items-center gap-1 text-blue-600">
//                       <span className="text-sm font-medium">Add</span>
//                       <Plus size={16} />
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Cart */}
//         <div className="space-y-6">
//           {/* Cart Summary */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <ShoppingCart className="text-blue-600" size={24} />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
//                   <p className="text-sm text-gray-500">{cart.length} items</p>
//                 </div>
//               </div>
//               <button
//                 onClick={clearCart}
//                 className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
//               >
//                 <Trash2 size={16} />
//                 Clear All
//               </button>
//             </div>

//             {/* Cart Items */}
//             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
//               {cart.length === 0 ? (
//                 <div className="text-center py-8">
//                   <ShoppingCart className="mx-auto text-gray-300" size={48} />
//                   <p className="text-gray-500 mt-2">No items in cart</p>
//                   <p className="text-sm text-gray-400">Scan or search for products</p>
//                 </div>
//               ) : (
//                 cart.map(item => (
//                   <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
//                       <p className="text-sm text-gray-500 truncate">{item.category}</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => updateQuantity(item.id, -1)}
//                         className="p-1 hover:bg-gray-200 rounded"
//                       >
//                         <Minus size={16} />
//                       </button>
//                       <span className="font-bold text-gray-800 min-w-[2rem] text-center">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() => updateQuantity(item.id, 1)}
//                         className="p-1 hover:bg-gray-200 rounded"
//                       >
//                         <Plus size={16} />
//                       </button>
//                       <div className="text-right min-w-[80px]">
//                         <p className="font-bold text-gray-800">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </p>
//                         <p className="text-xs text-gray-500">${item.price.toFixed(2)} ea</p>
//                       </div>
//                       <button
//                         onClick={() => removeItem(item.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Cart Totals */}
//             <div className="mt-8 space-y-4 pt-6 border-t">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span className="font-medium">${calculateTotal().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Tax (8%)</span>
//                 <span className="font-medium">${calculateTax().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t">
//                 <span>Total</span>
//                 <span>${calculateGrandTotal().toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-8 grid grid-cols-2 gap-3">
//               <button className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
//                 <Printer size={20} />
//                 Print Receipt
//               </button>
//               <button className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg">
//                 Process Payment
//               </button>
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
//             <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm opacity-90">Items in Cart</p>
//                 <p className="text-2xl font-bold">{cart.length}</p>
//               </div>
//               <div>
//                 <p className="text-sm opacity-90">Total Value</p>
//                 <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Success Notification */}
//       {showSuccess && (
//         <div className="fixed bottom-6 right-6 animate-slide-up">
//           <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
//             <CheckCircle size={24} />
//             <div>
//               <p className="font-semibold">Item Added!</p>
//               <p className="text-sm opacity-90">Successfully added to cart</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Keyboard Shortcuts Help */}
//       <div className="fixed bottom-6 left-6 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
//         <kbd className="px-2 py-1 bg-gray-100 rounded mx-1">F1</kbd> Search • 
//         <kbd className="px-2 py-1 bg-gray-100 rounded mx-1">F2</kbd> New Item • 
//         <kbd className="px-2 py-1 bg-gray-100 rounded mx-1">F3</kbd> Discount
//       </div>
//     </div>
//   );
// }











// // app/pos/page.tsx
// "use client";

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { Search, Barcode, Trash2, Plus, Minus, Printer, ShoppingCart, CheckCircle, X, Scan, Clock, Hash, Package, Percent, CreditCard, QrCode } from 'lucide-react';

// type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   barcode: string;
//   category: string;
// };

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   barcode: string;
//   category: string;
//   stock: number;
// };

// export default function POSPage() {
//   const [cart, setCart] = useState<CartItem[]>([
//     { id: '1', name: 'Organic Apples', price: 3.99, quantity: 2, barcode: '890123456789', category: 'Produce' },
//     { id: '2', name: 'Whole Wheat Bread', price: 2.49, quantity: 1, barcode: '890123456788', category: 'Bakery' },
//     { id: '3', name: 'Milk 1 Gallon', price: 4.49, quantity: 1, barcode: '890123456787', category: 'Dairy' },
//   ]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [activeTab, setActiveTab] = useState<'search' | 'scan'>('search');
  
//   const products: Product[] = [
//     { id: '1', name: 'Organic Apples', price: 3.99, barcode: '890123456789', category: 'Produce', stock: 50 },
//     { id: '2', name: 'Whole Wheat Bread', price: 2.49, barcode: '890123456788', category: 'Bakery', stock: 30 },
//     { id: '3', name: 'Milk 1 Gallon', price: 4.49, barcode: '890123456787', category: 'Dairy', stock: 25 },
//     { id: '4', name: 'Eggs (Dozen)', price: 3.99, barcode: '890123456786', category: 'Dairy', stock: 40 },
//     { id: '5', name: 'Chicken Breast', price: 8.99, barcode: '890123456785', category: 'Meat', stock: 20 },
//     { id: '6', name: 'Coca-Cola 2L', price: 1.99, barcode: '890123456784', category: 'Beverages', stock: 60 },
//     { id: '7', name: 'Potato Chips', price: 2.99, barcode: '890123456783', category: 'Snacks', stock: 45 },
//     { id: '8', name: 'Toilet Paper', price: 6.49, barcode: '890123456782', category: 'Household', stock: 35 },
//   ];

//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const barcodeInputRef = useRef<HTMLInputElement>(null);

//   // Auto-focus search on load
//   useEffect(() => {
//     searchInputRef.current?.focus();
//   }, []);

//   // Simulate barcode scanner input
//   useEffect(() => {
//     if (barcodeInput.length >= 8) {
//       handleBarcodeScan(barcodeInput);
//       setBarcodeInput('');
//     }
//   }, [barcodeInput]);

//   const handleBarcodeScan = useCallback((barcode: string) => {
//     const product = products.find(p => p.barcode === barcode);
//     if (product) {
//       setCart(prev => {
//         const existing = prev.find(item => item.barcode === barcode);
//         if (existing) {
//           return prev.map(item =>
//             item.barcode === barcode
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           );
//         } else {
//           return [...prev, {
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             quantity: 1,
//             barcode: product.barcode,
//             category: product.category
//           }];
//         }
//       });
      
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 1500);
//     }
//   }, [products]);

//   const updateQuantity = (id: string, delta: number) => {
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       ).filter(item => item.quantity > 0)
//     );
//   };

//   const removeItem = (id: string) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const calculateTax = () => calculateTotal() * 0.08;
//   const calculateGrandTotal = () => calculateTotal() + calculateTax();

//   const handleQuickProduct = (product: Product) => {
//     handleBarcodeScan(product.barcode);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-4">
//       {/* Fixed Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
//         <div className="max-w-screen-2xl mx-auto p-3">
//           <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
//             {/* Logo and Title */}
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-600 rounded-lg">
//                 <ShoppingCart className="text-white" size={24} />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-800">QuickPOS</h1>
//                 <p className="text-xs text-gray-500">Fast Checkout System</p>
//               </div>
//             </div>

//             {/* Search/Scan Tabs */}
//             <div className="flex-1 max-w-2xl">
//               <div className="flex gap-1 mb-2">
//                 <button
//                   onClick={() => setActiveTab('search')}
//                   className={`px-4 py-2 rounded-t-lg text-sm font-medium flex items-center gap-2 ${activeTab === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
//                 >
//                   <Search size={16} />
//                   Search Products
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('scan')}
//                   className={`px-4 py-2 rounded-t-lg text-sm font-medium flex items-center gap-2 ${activeTab === 'scan' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
//                 >
//                   <Barcode size={16} />
//                   Barcode Scan
//                 </button>
//               </div>

//               {/* Input Field */}
//               <div className="relative">
//                 {activeTab === 'search' ? (
//                   <>
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                       ref={searchInputRef}
//                       type="text"
//                       placeholder="Search by name, barcode, or category..."
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={18} />
//                     <input
//                       ref={barcodeInputRef}
//                       type="text"
//                       placeholder="Scan barcode or type 8+ digits..."
//                       className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                       value={barcodeInput}
//                       onChange={(e) => setBarcodeInput(e.target.value)}
//                     />
//                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                       <div className="flex items-center gap-1">
//                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                         <span className="text-xs text-gray-500">Live</span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="flex gap-4">
//               <div className="text-right">
//                 <p className="text-xs text-gray-500">Items</p>
//                 <p className="text-lg font-bold text-gray-800">{cart.length}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-gray-500">Total</p>
//                 <p className="text-lg font-bold text-gray-800">${calculateTotal().toFixed(2)}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content - Fixed layout with offset for header */}
//       <div className="pt-28 pb-4 max-w-screen-2xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Left Column - Products */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-sm border p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                   <Package size={18} />
//                   Available Products
//                 </h2>
//                 <div className="flex gap-2">
//                   <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">All</span>
//                   <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Produce</span>
//                   <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Dairy</span>
//                   <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Snacks</span>
//                 </div>
//               </div>

//               {/* Product Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {products.map(product => (
//                   <button
//                     key={product.id}
//                     onClick={() => handleQuickProduct(product)}
//                     className="group p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left bg-white"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600">
//                           {product.name}
//                         </h3>
//                         <p className="text-xs text-gray-500 mt-1 truncate">{product.category}</p>
//                       </div>
//                       <div className="text-right ml-2">
//                         <p className="font-bold text-gray-800">${product.price.toFixed(2)}</p>
//                         <p className="text-[10px] text-gray-400">#{product.barcode.slice(-6)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between mt-3 pt-2 border-t">
//                       <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded">
//                         Stock: {product.stock}
//                       </span>
//                       <div className="flex items-center gap-1 text-blue-600">
//                         <Plus size={14} />
//                         <span className="text-xs font-medium">Add</span>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Recent Transactions */}
//             <div className="mt-4 bg-white rounded-xl shadow-sm border p-4">
//               <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
//                 <Clock size={16} />
//                 Quick Actions
//               </h3>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                 <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
//                   <Percent size={20} className="text-blue-600" />
//                   <span className="text-sm font-medium">Apply Discount</span>
//                 </button>
//                 <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
//                   <Hash size={20} className="text-green-600" />
//                   <span className="text-sm font-medium">Add Note</span>
//                 </button>
//                 <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
//                   <QrCode size={20} className="text-purple-600" />
//                   <span className="text-sm font-medium">QR Code</span>
//                 </button>
//                 <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
//                   <Scan size={20} className="text-orange-600" />
//                   <span className="text-sm font-medium">Multi Scan</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Fixed Cart */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-28 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
//               {/* Cart Header */}
//               <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <ShoppingCart className="text-blue-600" size={20} />
//                     <h2 className="font-bold text-gray-800">Current Sale</h2>
//                   </div>
//                   <button
//                     onClick={clearCart}
//                     className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
//                   >
//                     <Trash2 size={14} />
//                     Clear
//                   </button>
//                 </div>
//                 <div className="flex items-center justify-between mt-2 text-sm">
//                   <span className="text-gray-600">{cart.length} items</span>
//                   <span className="font-semibold text-gray-800">${calculateTotal().toFixed(2)}</span>
//                 </div>
//               </div>

//               {/* Cart Items - Scrollable */}
//               <div className="flex-1 overflow-y-auto p-4">
//                 {cart.length === 0 ? (
//                   <div className="text-center py-8">
//                     <ShoppingCart className="mx-auto text-gray-300 mb-3" size={40} />
//                     <p className="text-gray-500 mb-1">Cart is empty</p>
//                     <p className="text-sm text-gray-400">Scan or search for products</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {cart.map(item => (
//                       <div key={item.id} className="group p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                         <div className="flex justify-between items-start mb-2">
//                           <div className="flex-1 min-w-0">
//                             <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
//                             <p className="text-xs text-gray-500 truncate">{item.category}</p>
//                           </div>
//                           <button
//                             onClick={() => removeItem(item.id)}
//                             className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => updateQuantity(item.id, -1)}
//                               className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
//                             >
//                               <Minus size={12} />
//                             </button>
//                             <span className="font-bold text-gray-800 min-w-[2rem] text-center text-sm">
//                               {item.quantity}
//                             </span>
//                             <button
//                               onClick={() => updateQuantity(item.id, 1)}
//                               className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
//                             >
//                               <Plus size={12} />
//                             </button>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold text-gray-800 text-sm">
//                               ${(item.price * item.quantity).toFixed(2)}
//                             </p>
//                             <p className="text-xs text-gray-500">${item.price.toFixed(2)} ea</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Cart Summary - Fixed at bottom */}
//               <div className="border-t bg-white p-4">
//                 <div className="space-y-2 mb-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">${calculateTotal().toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax (8%)</span>
//                     <span className="font-medium">${calculateTax().toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
//                     <span>Total</span>
//                     <span>${calculateGrandTotal().toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Methods */}
//                 <div className="grid grid-cols-2 gap-2 mb-4">
//                   <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
//                     <CreditCard size={16} />
//                     Card
//                   </button>
//                   <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
//                     Cash
//                   </button>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <button className="px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm">
//                     <Printer size={16} />
//                     Print
//                   </button>
//                   <button className="px-3 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-sm text-sm">
//                     Complete Sale
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Success Notification */}
//       {showSuccess && (
//         <div className="fixed bottom-4 right-4 animate-slide-up z-50">
//           <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
//             <CheckCircle size={20} />
//             <div>
//               <p className="font-semibold text-sm">Added to cart!</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Scanner Status */}
//       <div className="fixed bottom-4 left-4">
//         <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border">
//           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//           <span className="text-sm text-gray-700">Scanner: Ready</span>
//         </div>
//       </div>
//     </div>
//   );
// }






// app/pos/page.tsx
// "use client";

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { Search, Barcode, Trash2, Plus, Minus, Printer, ShoppingCart, CheckCircle, X, Scan, Clock, Hash, Package, Percent, CreditCard, QrCode, Maximize2, Minimize2, Settings, User, Bell } from 'lucide-react';

// type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   barcode: string;
//   category: string;
// };

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   barcode: string;
//   category: string;
//   stock: number;
// };

// export default function POSPage() {
//   const [cart, setCart] = useState<CartItem[]>([
//     { id: '1', name: 'Organic Apples', price: 3.99, quantity: 2, barcode: '890123456789', category: 'Produce' },
//     { id: '2', name: 'Whole Wheat Bread', price: 2.49, quantity: 1, barcode: '890123456788', category: 'Bakery' },
//     { id: '3', name: 'Milk 1 Gallon', price: 4.49, quantity: 1, barcode: '890123456787', category: 'Dairy' },
//   ]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [activeTab, setActiveTab] = useState<'search' | 'scan'>('search');
//   const [isFullScreen, setIsFullScreen] = useState(true);
//   const [showSettings, setShowSettings] = useState(false);
  
//   const products: Product[] = [
//     { id: '1', name: 'Organic Apples', price: 3.99, barcode: '890123456789', category: 'Produce', stock: 50 },
//     { id: '2', name: 'Whole Wheat Bread', price: 2.49, barcode: '890123456788', category: 'Bakery', stock: 30 },
//     { id: '3', name: 'Milk 1 Gallon', price: 4.49, barcode: '890123456787', category: 'Dairy', stock: 25 },
//     { id: '4', name: 'Eggs (Dozen)', price: 3.99, barcode: '890123456786', category: 'Dairy', stock: 40 },
//     { id: '5', name: 'Chicken Breast', price: 8.99, barcode: '890123456785', category: 'Meat', stock: 20 },
//     { id: '6', name: 'Coca-Cola 2L', price: 1.99, barcode: '890123456784', category: 'Beverages', stock: 60 },
//     { id: '7', name: 'Potato Chips', price: 2.99, barcode: '890123456783', category: 'Snacks', stock: 45 },
//     { id: '8', name: 'Toilet Paper', price: 6.49, barcode: '890123456782', category: 'Household', stock: 35 },
//   ];

//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const barcodeInputRef = useRef<HTMLInputElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Auto-enter fullscreen on load
//   useEffect(() => {
//     const enterFullScreen = () => {
//       setIsFullScreen(true);
//       if (containerRef.current) {
//         containerRef.current.requestFullscreen?.().catch(console.log);
//       }
//     };
    
//     enterFullScreen();
    
//     // Auto-focus search on load
//     searchInputRef.current?.focus();
    
//     // Listen for fullscreen change
//     const handleFullscreenChange = () => {
//       setIsFullScreen(!!document.fullscreenElement);
//     };
    
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
    
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, []);

//   // Simulate barcode scanner input
//   useEffect(() => {
//     if (barcodeInput.length >= 8) {
//       handleBarcodeScan(barcodeInput);
//       setBarcodeInput('');
//     }
//   }, [barcodeInput]);

//   const handleBarcodeScan = useCallback((barcode: string) => {
//     const product = products.find(p => p.barcode === barcode);
//     if (product) {
//       setCart(prev => {
//         const existing = prev.find(item => item.barcode === barcode);
//         if (existing) {
//           return prev.map(item =>
//             item.barcode === barcode
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           );
//         } else {
//           return [...prev, {
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             quantity: 1,
//             barcode: product.barcode,
//             category: product.category
//           }];
//         }
//       });
      
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 1500);
//     }
//   }, [products]);

//   const toggleFullScreen = () => {
//     if (!isFullScreen) {
//       containerRef.current?.requestFullscreen?.().catch(console.log);
//       setIsFullScreen(true);
//     } else {
//       document.exitFullscreen?.();
//       setIsFullScreen(false);
//     }
//   };

//   const updateQuantity = (id: string, delta: number) => {
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       ).filter(item => item.quantity > 0)
//     );
//   };

//   const removeItem = (id: string) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const calculateTax = () => calculateTotal() * 0.08;
//   const calculateGrandTotal = () => calculateTotal() + calculateTax();

//   const handleQuickProduct = (product: Product) => {
//     handleBarcodeScan(product.barcode);
//   };

//   return (
//     <div 
//       ref={containerRef}
//       className={`min-h-screen transition-all duration-300 ${
//         isFullScreen 
//           ? 'bg-gray-900' 
//           : 'bg-gradient-to-br from-gray-50 to-gray-100'
//       }`}
//     >
//       {/* Top Control Bar */}
//       <div className={`fixed top-0 left-0 right-0 z-50 ${
//         isFullScreen ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white'
//       } border-b ${isFullScreen ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
//         <div className="max-w-screen-2xl mx-auto p-2 md:p-3">
//           <div className="flex items-center justify-between">
//             {/* Left: Logo and Title */}
//             <div className="flex items-center gap-3">
//               <div className={`p-1.5 rounded-lg ${
//                 isFullScreen ? 'bg-blue-500' : 'bg-blue-600'
//               }`}>
//                 <ShoppingCart className="text-white" size={20} />
//               </div>
//               <div>
//                 <h1 className={`text-lg font-bold ${
//                   isFullScreen ? 'text-white' : 'text-gray-800'
//                 }`}>QuickPOS</h1>
//                 <p className={`text-xs ${
//                   isFullScreen ? 'text-gray-300' : 'text-gray-500'
//                 }`}>Fast Checkout System</p>
//               </div>
//             </div>

//             {/* Center: Search/Scan Tabs */}
//             <div className="flex-1 max-w-2xl mx-4">
//               <div className="flex gap-1 mb-1">
//                 <button
//                   onClick={() => setActiveTab('search')}
//                   className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-1 ${
//                     activeTab === 'search' 
//                       ? isFullScreen 
//                         ? 'bg-blue-600 text-white' 
//                         : 'bg-blue-600 text-white'
//                       : isFullScreen
//                         ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   <Search size={12} />
//                   Search
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('scan')}
//                   className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-1 ${
//                     activeTab === 'scan' 
//                       ? isFullScreen 
//                         ? 'bg-blue-600 text-white' 
//                         : 'bg-blue-600 text-white'
//                       : isFullScreen
//                         ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   <Barcode size={12} />
//                   Scan
//                 </button>
//               </div>

//               <div className="relative">
//                 {activeTab === 'search' ? (
//                   <>
//                     <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
//                       isFullScreen ? 'text-gray-400' : 'text-gray-400'
//                     }`} size={14} />
//                     <input
//                       ref={searchInputRef}
//                       type="text"
//                       placeholder="Search products..."
//                       className={`w-full pl-8 pr-3 py-2 text-sm rounded ${
//                         isFullScreen
//                           ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
//                           : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
//                       } border outline-none transition-colors`}
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <Barcode className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
//                       isFullScreen ? 'text-blue-400' : 'text-blue-500'
//                     }`} size={14} />
//                     <input
//                       ref={barcodeInputRef}
//                       type="text"
//                       placeholder="Scan barcode..."
//                       className={`w-full pl-8 pr-3 py-2 text-sm font-mono rounded ${
//                         isFullScreen
//                           ? 'bg-gray-700 border-2 border-blue-500/50 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
//                           : 'bg-white border-2 border-blue-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
//                       } outline-none transition-colors`}
//                       value={barcodeInput}
//                       onChange={(e) => setBarcodeInput(e.target.value)}
//                     />
//                     <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Right: Controls and Stats */}
//             <div className="flex items-center gap-3">
//               {/* Quick Stats */}
//               <div className={`hidden md:flex items-center gap-4 mr-2 ${
//                 isFullScreen ? 'text-white' : 'text-gray-700'
//               }`}>
//                 <div className="text-right">
//                   <p className="text-xs opacity-75">Items</p>
//                   <p className="text-sm font-bold">{cart.length}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs opacity-75">Total</p>
//                   <p className="text-sm font-bold">${calculateTotal().toFixed(2)}</p>
//                 </div>
//               </div>

//               {/* Control Buttons */}
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setShowSettings(!showSettings)}
//                   className={`p-1.5 rounded ${
//                     isFullScreen 
//                       ? 'hover:bg-gray-700 text-gray-300' 
//                       : 'hover:bg-gray-100 text-gray-600'
//                   }`}
//                   title="Settings"
//                 >
//                   <Settings size={16} />
//                 </button>
//                 <button
//                   onClick={toggleFullScreen}
//                   className={`p-1.5 rounded ${
//                     isFullScreen 
//                       ? 'hover:bg-gray-700 text-gray-300' 
//                       : 'hover:bg-gray-100 text-gray-600'
//                   }`}
//                   title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
//                 >
//                   {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Settings Dropdown */}
//       {showSettings && (
//         <div className={`fixed top-12 right-4 z-50 w-48 rounded-lg shadow-lg border ${
//           isFullScreen 
//             ? 'bg-gray-800 border-gray-700' 
//             : 'bg-white border-gray-200'
//         }`}>
//           <div className="p-3 border-b border-gray-200 dark:border-gray-700">
//             <div className="flex items-center gap-2">
//               <User size={14} className="text-gray-500" />
//               <span className="text-sm font-medium">Cashier: John Doe</span>
//             </div>
//           </div>
//           <div className="p-2">
//             <button className={`w-full text-left px-3 py-2 text-sm rounded ${
//               isFullScreen 
//                 ? 'hover:bg-gray-700 text-gray-300' 
//                 : 'hover:bg-gray-100 text-gray-700'
//             }`}>
//               Change Cashier
//             </button>
//             <button className={`w-full text-left px-3 py-2 text-sm rounded ${
//               isFullScreen 
//                 ? 'hover:bg-gray-700 text-gray-300' 
//                 : 'hover:bg-gray-100 text-gray-700'
//             }`}>
//               Scanner Settings
//             </button>
//             <button className={`w-full text-left px-3 py-2 text-sm rounded ${
//               isFullScreen 
//                 ? 'hover:bg-gray-700 text-gray-300' 
//                 : 'hover:bg-gray-100 text-gray-700'
//             }`}>
//               Print Settings
//             </button>
//             <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
//               <button className={`w-full text-left px-3 py-2 text-sm rounded ${
//                 isFullScreen 
//                   ? 'hover:bg-gray-700 text-red-400' 
//                   : 'hover:bg-red-50 text-red-600'
//               }`}>
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Content - Full Screen */}
//       <div className={`pt-16 h-screen overflow-hidden transition-colors duration-300 ${
//         isFullScreen ? 'bg-gray-900' : ''
//       }`}>
//         <div className="h-full max-w-screen-2xl mx-auto p-2 md:p-3">
//           <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-3">
//             {/* Left Column - Products */}
//             <div className="lg:col-span-2 h-full flex flex-col">
//               {/* Products Grid */}
//               <div className={`flex-1 rounded-xl overflow-hidden ${
//                 isFullScreen ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
//               } shadow-sm border ${isFullScreen ? 'border-gray-700' : 'border-gray-200'}`}>
//                 <div className="p-3 border-b border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center justify-between">
//                     <h2 className={`font-bold text-sm flex items-center gap-2 ${
//                       isFullScreen ? 'text-white' : 'text-gray-800'
//                     }`}>
//                       <Package size={14} />
//                       Available Products
//                     </h2>
//                     <div className="flex gap-1">
//                       {['All', 'Produce', 'Dairy', 'Snacks'].map(cat => (
//                         <span key={cat} className={`px-2 py-0.5 text-xs rounded ${
//                           isFullScreen
//                             ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                         } cursor-pointer`}>
//                           {cat}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Product Grid - Scrollable */}
//                 <div className="h-[calc(100%-4rem)] overflow-y-auto p-3">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
//                     {products.map(product => (
//                       <button
//                         key={product.id}
//                         onClick={() => handleQuickProduct(product)}
//                         className={`group p-2 rounded-lg border text-left transition-all ${
//                           isFullScreen
//                             ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500 hover:bg-gray-700'
//                             : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
//                         }`}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1 min-w-0">
//                             <h3 className={`font-semibold text-xs truncate ${
//                               isFullScreen 
//                                 ? 'text-white group-hover:text-blue-400' 
//                                 : 'text-gray-800 group-hover:text-blue-600'
//                             }`}>
//                               {product.name}
//                             </h3>
//                             <p className={`text-[10px] truncate ${
//                               isFullScreen ? 'text-gray-400' : 'text-gray-500'
//                             }`}>
//                               {product.category}
//                             </p>
//                           </div>
//                           <div className="text-right ml-1">
//                             <p className={`font-bold text-xs ${
//                               isFullScreen ? 'text-white' : 'text-gray-800'
//                             }`}>
//                               ${product.price.toFixed(2)}
//                             </p>
//                             <p className={`text-[9px] ${
//                               isFullScreen ? 'text-gray-500' : 'text-gray-400'
//                             }`}>
//                               #{product.barcode.slice(-4)}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
//                           <span className={`px-1 py-0.5 text-[9px] font-medium rounded ${
//                             isFullScreen
//                               ? 'bg-green-900/30 text-green-400'
//                               : 'bg-green-100 text-green-700'
//                           }`}>
//                             Stock: {product.stock}
//                           </span>
//                           <div className="flex items-center gap-0.5">
//                             <Plus size={10} className={isFullScreen ? 'text-blue-400' : 'text-blue-600'} />
//                             <span className={`text-[10px] font-medium ${
//                               isFullScreen ? 'text-blue-400' : 'text-blue-600'
//                             }`}>
//                               Add
//                             </span>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className={`mt-2 rounded-xl p-3 ${
//                 isFullScreen ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
//               } shadow-sm border ${isFullScreen ? 'border-gray-700' : 'border-gray-200'}`}>
//                 <h3 className={`font-bold text-xs mb-2 flex items-center gap-1 ${
//                   isFullScreen ? 'text-white' : 'text-gray-800'
//                 }`}>
//                   <Clock size={12} />
//                   Quick Actions
//                 </h3>
//                 <div className="grid grid-cols-4 gap-1">
//                   {[
//                     { icon: Percent, label: 'Discount', color: 'text-blue-500' },
//                     { icon: Hash, label: 'Add Note', color: 'text-green-500' },
//                     { icon: QrCode, label: 'QR Code', color: 'text-purple-500' },
//                     { icon: Scan, label: 'Multi Scan', color: 'text-orange-500' }
//                   ].map((action, idx) => (
//                     <button
//                       key={idx}
//                       className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 ${
//                         isFullScreen
//                           ? 'hover:bg-gray-700 border-gray-600'
//                           : 'hover:bg-gray-50 border-gray-200'
//                       } border transition-colors`}
//                     >
//                       <action.icon size={14} className={action.color} />
//                       <span className={`text-[10px] font-medium ${
//                         isFullScreen ? 'text-gray-300' : 'text-gray-700'
//                       }`}>
//                         {action.label}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Cart */}
//             <div className="h-full">
//               <div className={`h-full rounded-xl overflow-hidden flex flex-col ${
//                 isFullScreen ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white'
//               } shadow-sm border ${isFullScreen ? 'border-gray-700' : 'border-gray-200'}`}>
//                 {/* Cart Header */}
//                 <div className={`p-3 border-b ${
//                   isFullScreen 
//                     ? 'border-gray-700 bg-gradient-to-r from-blue-900/20 to-indigo-900/20' 
//                     : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
//                 }`}>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <ShoppingCart className={isFullScreen ? 'text-blue-400' : 'text-blue-600'} size={16} />
//                       <h2 className={`font-bold text-sm ${
//                         isFullScreen ? 'text-white' : 'text-gray-800'
//                       }`}>
//                         Current Sale
//                       </h2>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className={`text-xs ${
//                         isFullScreen ? 'text-gray-400' : 'text-gray-600'
//                       }`}>
//                         {cart.length} items
//                       </span>
//                       <button
//                         onClick={clearCart}
//                         className={`ml-2 px-2 py-1 text-xs rounded ${
//                           isFullScreen
//                             ? 'text-red-400 hover:bg-red-900/30'
//                             : 'text-red-600 hover:bg-red-50'
//                         } flex items-center gap-1 transition-colors`}
//                       >
//                         <Trash2 size={12} />
//                         Clear
//                       </button>
//                     </div>
//                   </div>
//                   <div className={`flex items-center justify-between mt-1 text-xs ${
//                     isFullScreen ? 'text-gray-400' : 'text-gray-600'
//                   }`}>
//                     <span>Subtotal</span>
//                     <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Cart Items */}
//                 <div className="flex-1 overflow-y-auto p-3">
//                   {cart.length === 0 ? (
//                     <div className="text-center py-8">
//                       <ShoppingCart className={`mx-auto mb-3 ${
//                         isFullScreen ? 'text-gray-600' : 'text-gray-300'
//                       }`} size={32} />
//                       <p className={`text-sm ${
//                         isFullScreen ? 'text-gray-400' : 'text-gray-500'
//                       }`}>
//                         Cart is empty
//                       </p>
//                       <p className={`text-xs mt-1 ${
//                         isFullScreen ? 'text-gray-500' : 'text-gray-400'
//                       }`}>
//                         Scan or search for products
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-2">
//                       {cart.map(item => (
//                         <div 
//                           key={item.id} 
//                           className={`group p-2 rounded-lg ${
//                             isFullScreen 
//                               ? 'bg-gray-700/30 hover:bg-gray-700/50' 
//                               : 'bg-gray-50 hover:bg-gray-100'
//                           } transition-colors`}
//                         >
//                           <div className="flex justify-between items-start mb-1">
//                             <div className="flex-1 min-w-0">
//                               <h4 className={`font-semibold text-xs truncate ${
//                                 isFullScreen ? 'text-white' : 'text-gray-800'
//                               }`}>
//                                 {item.name}
//                               </h4>
//                               <p className={`text-[10px] truncate ${
//                                 isFullScreen ? 'text-gray-400' : 'text-gray-500'
//                               }`}>
//                                 {item.category}
//                               </p>
//                             </div>
//                             <button
//                               onClick={() => removeItem(item.id)}
//                               className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
//                                 isFullScreen 
//                                   ? 'text-gray-400 hover:text-red-400' 
//                                   : 'text-gray-400 hover:text-red-600'
//                               }`}
//                             >
//                               <X size={10} />
//                             </button>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-1">
//                               <button
//                                 onClick={() => updateQuantity(item.id, -1)}
//                                 className={`w-5 h-5 flex items-center justify-center rounded ${
//                                   isFullScreen
//                                     ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
//                                     : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                                 }`}
//                               >
//                                 <Minus size={8} />
//                               </button>
//                               <span className={`font-bold text-xs min-w-[1.5rem] text-center ${
//                                 isFullScreen ? 'text-white' : 'text-gray-800'
//                               }`}>
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 onClick={() => updateQuantity(item.id, 1)}
//                                 className={`w-5 h-5 flex items-center justify-center rounded ${
//                                   isFullScreen
//                                     ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
//                                     : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                                 }`}
//                               >
//                                 <Plus size={8} />
//                               </button>
//                             </div>
//                             <div className="text-right">
//                               <p className={`font-bold text-xs ${
//                                 isFullScreen ? 'text-white' : 'text-gray-800'
//                               }`}>
//                                 ${(item.price * item.quantity).toFixed(2)}
//                               </p>
//                               <p className={`text-[9px] ${
//                                 isFullScreen ? 'text-gray-500' : 'text-gray-500'
//                               }`}>
//                                 ${item.price.toFixed(2)} ea
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Cart Summary */}
//                 <div className={`border-t p-3 ${
//                   isFullScreen ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
//                 }`}>
//                   <div className="space-y-1.5 mb-3">
//                     <div className="flex justify-between text-xs">
//                       <span className={isFullScreen ? 'text-gray-400' : 'text-gray-600'}>
//                         Subtotal
//                       </span>
//                       <span className={`font-medium ${
//                         isFullScreen ? 'text-white' : 'text-gray-800'
//                       }`}>
//                         ${calculateTotal().toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className={isFullScreen ? 'text-gray-400' : 'text-gray-600'}>
//                         Tax (8%)
//                       </span>
//                       <span className={`font-medium ${
//                         isFullScreen ? 'text-white' : 'text-gray-800'
//                       }`}>
//                         ${calculateTax().toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
//                       <span className={isFullScreen ? 'text-white' : 'text-gray-800'}>
//                         Total
//                       </span>
//                       <span className={isFullScreen ? 'text-white' : 'text-gray-800'}>
//                         ${calculateGrandTotal().toFixed(2)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Payment Methods */}
//                   <div className="grid grid-cols-2 gap-1 mb-2">
//                     <button className={`p-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 ${
//                       isFullScreen
//                         ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
//                         : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//                     }`}>
//                       <CreditCard size={12} />
//                       Card
//                     </button>
//                     <button className={`p-1.5 rounded text-xs font-medium ${
//                       isFullScreen
//                         ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
//                         : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//                     }`}>
//                       Cash
//                     </button>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="grid grid-cols-2 gap-1">
//                     <button className={`p-2 rounded text-xs font-medium flex items-center justify-center gap-1 ${
//                       isFullScreen
//                         ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                         : 'bg-blue-600 hover:bg-blue-700 text-white'
//                     }`}>
//                       <Printer size={12} />
//                       Print
//                     </button>
//                     <button className={`p-2 rounded text-xs font-medium ${
//                       isFullScreen
//                         ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
//                         : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
//                     }`}>
//                       Complete Sale
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Success Notification */}
//       {showSuccess && (
//         <div className="fixed bottom-4 right-4 animate-slide-up z-50">
//           <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
//             <CheckCircle size={16} />
//             <span className="text-sm font-medium">Item added!</span>
//           </div>
//         </div>
//       )}

//       {/* Scanner Status */}
//       <div className="fixed bottom-4 left-4">
//         <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg shadow-sm ${
//           isFullScreen
//             ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700'
//             : 'bg-white border-gray-200'
//         } border`}>
//           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
//           <span className={`text-xs ${
//             isFullScreen ? 'text-gray-300' : 'text-gray-700'
//           }`}>
//             Scanner: Ready
//           </span>
//         </div>
//       </div>

//       {/* Fullscreen Status */}
//       <div className={`fixed top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
//         isFullScreen
//           ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
//           : 'bg-gray-200 text-gray-600 border border-gray-300'
//       }`}>
//         {isFullScreen ? 'FULLSCREEN MODE' : 'REGULAR MODE'}
//       </div>
//     </div>
//   );
// }






















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
    { id: '3', name: 'Milk 1 Gallon', price: 4.49, quantity: 1, barcode: '890123456787', category: 'Dairy' },
    { id: '4', name: 'Eggs (Dozen)', price: 3.99, quantity: 3, barcode: '890123456786', category: 'Dairy' },
    { id: '5', name: 'Chicken Breast', price: 8.99, quantity: 1, barcode: '890123456785', category: 'Meat' },
    { id: '6', name: 'Coca-Cola 2L', price: 1.99, quantity: 2, barcode: '890123456784', category: 'Beverages' },
    { id: '7', name: 'Potato Chips', price: 2.99, quantity: 1, barcode: '890123456783', category: 'Snacks' },
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