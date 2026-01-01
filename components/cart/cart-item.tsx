"use client"

import type { CartItem as CartItemType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      onUpdateQuantity(item.product.id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4 border-b border-border py-4 last:border-0">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image src={item.product.image || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{item.product.name}</h3>
          <p className="text-sm text-muted-foreground">{item.product.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
            className="h-8 w-16 text-center"
            min={1}
            max={item.product.stock}
          />

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>

          <span className="ml-auto text-sm text-muted-foreground">
            {item.quantity} × ${item.product.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => onRemove(item.product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <span className="text-lg font-bold text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  )
}
