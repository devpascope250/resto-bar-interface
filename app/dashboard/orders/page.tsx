"use client"

import { useState } from "react"
import { useOrders, useUpdateOrderStatus } from "@/lib/hooks/use-orders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "@/components/data-table/data-table"
import { useApi } from "@/hooks/api-hooks"
import { orderColumns } from "@/components/data-table/order-columns"
export default function OrdersPage() {
  const updateStatus = useUpdateOrderStatus()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const { useApiQuery } = useApi();
  const { data: orders, isLoading} = useApiQuery<DisplayOrder[]>(['orders'],'/bar/orders');

  const handleUpdateStatus = async (orderId: string, status: OrderStatusType) => {
    // try {
    //   await updateStatus.mutateAsync({ orderId, status })
    //   toast({
    //     title: "Order updated",
    //     description: `Order ${orderId} has been marked as ${status}.`,
    //   })
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to update order status.",
    //     variant: "destructive",
    //   })
    // }
  }

  const pendingOrders = orders?.filter((o) => o.status === OrderStatus.PENDING)
  const concelledOrders = orders?.filter((o) => o.status === OrderStatus.CANCELLED)
  const completedOrders = orders?.filter((o) => o.status === OrderStatus.COMPLETED)

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
        <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
        <p className="text-muted-foreground">View and manage all orders from distributors</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-muted-foreground">Pending Orders</CardDescription>
            <CardTitle className="text-3xl text-foreground">{pendingOrders?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-muted-foreground">Cancelled Orders</CardDescription>
            <CardTitle className="text-3xl text-foreground">{concelledOrders?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-muted-foreground">Completed Orders</CardDescription>
            <CardTitle className="text-3xl text-foreground">{completedOrders?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Orders ({orders?.length || 0})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders?.length || 0})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({concelledOrders?.length || 0})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {orders && orders.length > 0 ? (
            <DataTable
              columns={orderColumns(handleUpdateStatus)}
              data={orders}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
            />
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingOrders && pendingOrders.length > 0 ? (
            <DataTable
              columns={orderColumns(handleUpdateStatus)}
              data={pendingOrders}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
            />
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No pending orders</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processing">
          {concelledOrders && concelledOrders.length > 0 ? (
            <DataTable
              columns={orderColumns(handleUpdateStatus)}
              data={concelledOrders}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
            />
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
            <DataTable
              columns={orderColumns(handleUpdateStatus)}
              data={completedOrders}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
            />
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
