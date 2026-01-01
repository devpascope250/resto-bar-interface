import { Partnertype, Role } from "@prisma/client"

export type BusinessType = "bar-restaurant" | "supermarket"

export interface User {
  id: string
  name: string
  lastName: string
  email: string
  role: Role
  partnerType: Partnertype
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  businessType: BusinessType
  stock: number
  image: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  distributorId: string
  distributorName: string
  businessType: BusinessType
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface StockTransaction {
  id: string
  productId: string
  productName: string
  type: "in" | "out"
  quantity: number
  reason: string
  performedBy: string
  createdAt: Date
}
