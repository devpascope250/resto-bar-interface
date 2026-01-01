"use client"

import { useAuthStore } from "@/lib/store/auth-store"
import { useOrders } from "@/lib/hooks/use-orders"
import { OrderTable } from "@/components/orders/order-table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyOrdersPage() {
  const user = useAuthStore((state) => state.user)
  const { data: orders, isLoading } = useOrders(user?.id)

  const pendingOrders = orders?.filter((o) => o.status === "pending")
  const processingOrders = orders?.filter((o) => o.status === "processing")
  const completedOrders = orders?.filter((o) => o.status === "completed")

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your order history</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Orders ({orders?.length || 0})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders?.length || 0})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({processingOrders?.length || 0})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {orders && orders.length > 0 ? (
            <OrderTable orders={orders} />
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No orders yet. Start shopping to place your first order!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingOrders && pendingOrders.length > 0 ? (
            <OrderTable orders={pendingOrders} />
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No pending orders</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processing">
          {processingOrders && processingOrders.length > 0 ? (
            <OrderTable orders={processingOrders} />
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No processing orders</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedOrders && completedOrders.length > 0 ? (
            <OrderTable orders={completedOrders} />
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No completed orders</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
