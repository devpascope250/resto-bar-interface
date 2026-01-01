"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useCartStore } from "@/lib/store/cart-store"
import { useProducts } from "@/lib/hooks/use-products"
import { ProductCard } from "@/components/products/product-card"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function CatalogPage() {
  const user = useAuthStore((state) => state.user)
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const { data: products, isLoading } = useProducts(user?.businessType)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { toast } = useToast()

  const hasCartItems = items.length > 0

  const categories = products ? ["all", ...new Set(products.map((p) => p.category))] : ["all"]

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="flex h-full">
      <div className={cn("transition-all duration-300", hasCartItems ? "w-1/2 border-r" : "w-full")}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Product Catalog</h1>
            <p className="text-muted-foreground">
              Browse and order products for your {user?.businessType?.replace("-", "/")}
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div
              className={cn(
                "grid gap-6",
                hasCartItems ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              )}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} showAddToCart />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>

      {hasCartItems && (
        <div className="w-1/2 overflow-y-auto bg-muted/30">
          <CartSidebar />
        </div>
      )}
    </div>
  )
}
