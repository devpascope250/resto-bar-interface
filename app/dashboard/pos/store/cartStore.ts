import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode: string;
  category: string;
};

type CartStore = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  calculateTax: () => number;
  calculateGrandTotal: () => number;
  // Add this to track hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      _hasHydrated: false,
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.cart.find(item => item.barcode === newItem.barcode);
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.barcode === newItem.barcode
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cart: [...state.cart, { ...newItem, quantity: 1 }],
            };
          }
        });
      },
      
      updateQuantity: (id: string, delta: number) => {
        set((state) => ({
          cart: state.cart
            .map(item =>
              item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
            )
            .filter(item => item.quantity > 0),
        }));
      },
      
      removeItem: (id: string) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id),
        }));
      },
      
      clearCart: () => {
        set({ cart: [] });
      },
      
      calculateTotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      calculateTax: () => {
        return get().calculateTotal() * 0.08;
      },
      
      calculateGrandTotal: () => {
        return get().calculateTotal() + get().calculateTax();
      },
      
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },
    }),
    {
      name: 'pos-cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Skip hydration on server
      skipHydration: true,
    }
  )
);