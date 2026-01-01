import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dummyOrders } from "../dummy-data"
import type { Order } from "../types"

const ordersData = [...dummyOrders]

export function useOrders(distributorId?: string) {
  return useQuery({
    queryKey: ["orders", distributorId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (distributorId) {
        return ordersData.filter((o) => o.distributorId === distributorId)
      }

      return ordersData
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order["status"] }) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const orderIndex = ordersData.findIndex((o) => o.id === orderId)
      if (orderIndex !== -1) {
        ordersData[orderIndex] = {
          ...ordersData[orderIndex],
          status,
          updatedAt: new Date(),
        }
      }

      return ordersData[orderIndex]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newOrder: Order = {
        ...order,
        id: `o${ordersData.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ordersData.push(newOrder)

      return newOrder
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
