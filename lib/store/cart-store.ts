import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartStore {
  items: CartItem[]
  addItem: (id: number, product: Product, status: "CONFIRMED" | "PENDING" | "CANCELLED", quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  updateBeverageCondition: (productId: number, condition: BeverageCondition) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (id, product, status="PENDING", quantity = 1,) => {
        set((state: CartStore) => {
          const existingItem = state.items.find((item) => item.product.id === product.id)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? {
                  ...item, quantity: item.quantity + quantity,status: item.status, beverageCondition: product.productType === "BEVERAGE" && !item.beverageCondition
                    ? "NORMAL"
                    : item.beverageCondition
                } : item,
              ),
            }
          }

          return {
            items: [...state.items, {id, product, quantity, status }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        }))
      },
      updateBeverageCondition: (productId, condition) => {
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, beverageCondition: condition } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.filter((item) => item.status !== "CANCELLED")?.reduce((total, item) => total + ((item.product.discount&& item.product.discount !== null) ? item.product.price * (1 - item.product.discount.rate / 100) : item.product.price) * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
