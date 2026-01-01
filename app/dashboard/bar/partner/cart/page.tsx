"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { useCartStore } from "@/lib/store/cart-store"
import { useCreateOrder } from "@/lib/hooks/use-orders"
import { CartItem } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
  const createOrder = useCreateOrder()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (!user || items.length === 0) return

    try {
      await createOrder.mutateAsync({
        distributorId: user.id,
        distributorName: user.name,
        businessType: user.businessType!,
        items: items,
        total: getTotalPrice(),
        status: "pending",
      })

      clearCart()

      toast({
        title: "Order placed successfully",
        description: "Your order has been submitted and is pending approval.",
      })

      router.push("/dashboard/my-orders")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Add some products to get started</p>
          <Button asChild>
            <Link href="/dashboard/catalog">Browse Catalog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/catalog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground">{items.length} items in your cart</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardContent className="p-6">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-border/50 sticky top-8">
            <CardHeader>
              <CardTitle className="text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="text-foreground">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Free</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${(getTotalPrice() * 1.1).toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={createOrder.isPending}>
                {createOrder.isPending ? "Processing..." : "Place Order"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Your order will be reviewed by an admin before processing
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
