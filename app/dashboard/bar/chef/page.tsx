"use client";
import { useAuthStore } from "@/lib/store/auth-store";;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/api-hooks";
import { Badge } from "@/components/ui/badge";
import { keepPreviousData } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
interface OrderStats {
  countOrders: number;
  countProducts: number;
  pendingOrders: number;
  recent5Orders: Orders[];
  qstats: SuccessRateDetails;
}

interface SuccessRateDetails {
  completeOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  successRate: string;
}

export default function DashboardPage() {
  const { useApiQuery } = useApi();
  const user = useAuthStore((state) => state.user);
  const { data: dataStats, isLoading } = useApiQuery<OrderStats>(
    ["stats"],
    "/bar/stats/get",
    {
      staleTime: 10 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
      placeholderData: keepPreviousData,
      retry: false,
    }
  );

  const stats = [
    {
      title: "Total Orders",
      value: dataStats?.countOrders || 0,
      icon: ShoppingCart,
      description: user?.role === "ADMIN" ? "All orders" : "Your orders",
    },
    {
      title: "Products",
      value: dataStats?.countProducts || 0,
      icon: Package,
      description:
        user?.role === "ADMIN" ? "Total products" : "Available products",
    },
    {
      title: "Pending Orders",
      value: dataStats?.pendingOrders || 0,
      icon: TrendingUp,
      description: "Awaiting processing",
    },
  ];

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          {user?.role === "ADMIN"
            ? "Manage all orders and products across the platform"
            : `Manage your ${
                user?.partnerType === "BARRESTAURANT"
                  ? "BAR RESTAURANT"
                  : user?.partnerType
              } orders`}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : dataStats?.recent5Orders &&
              dataStats.recent5Orders.length > 0 ? (
              <div className="space-y-4">
                {dataStats.recent5Orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderName}
                      </p>
                    </div>
                    <div className="text-right">
                      {/* <p className="text-sm capitalize text-muted-foreground"> */}
                      <Badge
                        variant={
                          order.status === "COMPLETED"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {order.status.toLocaleLowerCase()}
                      </Badge>
                      {/* </p> */}
                      <p className="font-medium text-foreground">
                        {order.totalPrice.toFixed(2)} Rwf
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completed Orders
                </span>
                <span className="font-medium text-foreground">
                  {dataStats?.qstats.completeOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Processing Orders
                </span>
                <span className="font-medium text-foreground">
                  {dataStats?.qstats.pendingOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Cancelled Orders
                </span>
                <span className="font-medium text-foreground">
                  {dataStats?.qstats.cancelledOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-foreground">
                  Success Rate
                </span>
                <span className="font-bold text-foreground">
                  {dataStats?.qstats.successRate}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
