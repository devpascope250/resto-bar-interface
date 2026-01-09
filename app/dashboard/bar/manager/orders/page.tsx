"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/data-table/data-table";
import { useApi } from "@/hooks/api-hooks";
import { orderColumns } from "@/components/data-table/order-columns";
import DateTimeHelper from "@/lib/date-time";
import { useDebounce } from "@/hooks/useDebounce";
import { keepPreviousData } from "@tanstack/react-query";
import Receipt from "@/components/Receipt";
import OrderDetailsDialog from "@/components/orders/order-details";
import { useCartStore } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ViewGeneratedInvoiceDialog, {
  ViewInvoiceDialog,
} from "@/components/orders/generated-invoice";
import { LocalStorage } from "@/lib/local-storage";
import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export default function OrdersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const { useApiQuery, useApiPut, queryClient, useApiPost } = useApi();
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const clearCart = useCartStore((state) => state.clearCart);
  const [editOrderId, setSelectOrderId] = useState<number | null>(null);
  const [viewgenInvOrderId, setVewgenInvOrderId] = useState<number | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );

  const [loadingButtonStatu, setLoadingButtonStatus] = useState<{
    itemId?: number | null | undefined;
    status: "confirmed" | "cancelled";
  }>({
    itemId: null,
    status: "cancelled",
  });

  const {
    data: getOrder,
    isLoading: isLoadingDetails,
    refetch: refetchDetails,
  } = useApiQuery<OrderDetails>(
    ["get-order-details", editOrderId],
    `/bar/orders/${editOrderId?.toString()}?orderDetail=true`,
    {
      enabled: editOrderId !== null,
      placeholderData: keepPreviousData,
    }
  );
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (searchParams.get("view-details")) {
      setSelectOrderId(Number(searchParams.get("view-details")));
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("uh8c6sp7sjvn7u4wnp2w")) {
      setVewgenInvOrderId(Number(searchParams.get("uh8c6sp7sjvn7u4wnp2w")));
    } else {
      if (LocalStorage.getItem("CurrentCopy")) {
        LocalStorage.removeItem("CurrentCopy");
      }
    }
  }, [searchParams]);

  const debouncedDateFilterChange = useDebounce(
    (start: Date | null, end: Date | null) => {
      if (start && end) {
        setFilterStartDate(YmdHelper(start));
        setFilterEndDate(YmdHelper(end));
      }
    },
    500
  );
  const {
    data: orders,
    isLoading,
    isRefetching,
    isFetched,
    refetch,
  } = useApiQuery<DisplayOrder[]>(
    ["orders", filterStartDate, filterEndDate],
    `/bar/orders${
      filterStartDate && filterEndDate
        ? `?start=${filterStartDate}&&end=${filterEndDate}`
        : ""
    }`,
    {
      enabled:
        !filterStartDate ||
        !filterEndDate ||
        Boolean(filterStartDate && filterEndDate),
      staleTime: 5 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
      placeholderData: keepPreviousData,
      retry: false,
      refetchInterval: 10000
    }
  );
  const { mutateAsync: updateStatus } = useApiPut(
    ["orders"],
    `/bar/orders/status`
  );

  const {
    mutateAsync: changeItemStatus,
    isPending: isUpdatingOrderItemStatus,
  } = useApiPost(["change_item_status"], "/bar/orders/change-item-status");
  const { mutateAsync: changeConfirmAll, isPending: isUpdatingConfirmAll } =
    useApiPost(["confirm-all"], "/bar/orders/change-all-order-status");
  const handleUpdateStatus = async (
    orderId: string,
    status: OrderStatusType
  ) => {
    try {
      await updateStatus({ orderId, status });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Order updated",
        description: `Order ${orderId} has been marked as ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const pendingOrders = orders?.filter((o) => o.status === "PENDING");
  const concelledOrders = orders?.filter((o) => o.status === "CANCELLED");
  const completedOrders = orders?.filter((o) => o.status === "COMPLETED");
  const totalOrders = orders?.length;

  useEffect(() => {
    if (isFetched) {
      const pendingCount = orders?.filter(
        (order) => order.status === "PENDING"
      ).length;
      if (pendingCount && pendingCount > newOrdersCount) {
        setNewOrdersCount(pendingCount);
        toast({
          title: "New Orders!",
          description: `${pendingCount - newOrdersCount} new order(s) received`,
          variant: "info",
        });
      }
    }
  }, [isFetched, orders, newOrdersCount, toast]);

  // Play sound for new orders
  useEffect(() => {
    if (soundEnabled && newOrdersCount > 0) {
      const audio = new Audio("/order-notif.wav");
      audio.play().catch(() => {});
    }
  }, [newOrdersCount, soundEnabled]);

  // if (isLoading) {
  //   return (
  //     <div className="p-8">
  //       <div className="mb-8">
  //         <Skeleton className="mb-2 h-8 w-64" />
  //         <Skeleton className="h-4 w-96" />
  //       </div>
  //       <Skeleton className="h-96 w-full" />
  //     </div>
  //   );
  // }

  const handleDateFilterChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    // id dates are valid, set the filter state
    if (startDate && endDate) {
      debouncedDateFilterChange(startDate, endDate);
    }
  };
  // printing

  const handlePrint = (id: string) => {
    setIsPrinting(true);
    // Wait for the printing to finish
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 1000);
  };

  const handleShowDetails = (id: string) => {
    setSelectOrderId(parseInt(id));
    // Handle showing details for the order with the given id
  };

  const handleOpen = () => {
    setSelectOrderId(null);
  };

  const handleCloseReceiptVew = () => {
    router.push("/dashboard/bar/manager/orders");
    setVewgenInvOrderId(null);
  };

  const handleChangeOrderItemStatus = async (
    itemId: number,
    status: "confirmed" | "cancelled"
  ) => {
    try {
      setLoadingButtonStatus({
        itemId,
        status,
      });
      await changeItemStatus({ itemId, status });
      refetchDetails();
      clearCart();
      localStorage.removeItem("isAsynchonized");
      toast({
        title: "Item status updated",
        description: `Item ${itemId} has been marked as ${status}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAll = async (orderId: number) => {
    try {
      setLoadingButtonStatus({
        itemId: null,
        status: "confirmed",
      });
      await changeConfirmAll({ orderId });
      refetchDetails();
      localStorage.removeItem("isAsynchonized");
      clearCart();
      toast({
        title: "Item status updated",
        description: `Orders ${orderId} has been marked as Confirmed}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
          <h1 className="text-3xl font-bold text-foreground">
            Orders Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all orders from distributors
          </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")}
              />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <Bell
                className={cn("h-4 w-4 mr-2", soundEnabled && "text-green-500")}
              />
              {soundEnabled ? "Mute" : "Unmute"}
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">
                Total Orders
              </CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {totalOrders || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">
                Pending Orders
              </CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {pendingOrders?.length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">
                Cancelled Orders
              </CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {concelledOrders?.length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">
                Completed Orders
              </CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {completedOrders?.length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="cursor-pointer">
              All Orders ({orders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending" className="cursor-pointer">
              Pending ({pendingOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="cursor-pointer">
              Cancelled ({concelledOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="completed" className="cursor-pointer">
              Completed ({completedOrders?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <DataTable
              columns={orderColumns(
                handleUpdateStatus,
                handlePrint,
                handleShowDetails
              )}
              data={orders ?? []}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
              dateFilterPlaceholder="Filter by Date"
              showDateFilter={true}
              onDateFilterChange={handleDateFilterChange}
              isRefetching={isRefetching}
            />
          </TabsContent>

          <TabsContent value="pending">
            <DataTable
              columns={orderColumns(
                handleUpdateStatus,
                handlePrint,
                handleShowDetails
              )}
              data={pendingOrders ?? []}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
              dateFilterPlaceholder="Filter by Date"
              showDateFilter={true}
              onDateFilterChange={handleDateFilterChange}
              isRefetching={isRefetching}
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <DataTable
              columns={orderColumns(
                handleUpdateStatus,
                handlePrint,
                handleShowDetails
              )}
              data={concelledOrders ?? []}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
              dateFilterPlaceholder="Filter by Date"
              showDateFilter={true}
              onDateFilterChange={handleDateFilterChange}
              isRefetching={isRefetching}
            />
          </TabsContent>
          <TabsContent value="completed">
            <DataTable
              columns={orderColumns(
                handleUpdateStatus,
                handlePrint,
                handleShowDetails
              )}
              data={completedOrders ?? []}
              searchKey="distributor"
              searchPlaceholder="Search by distributor..."
              dateFilterPlaceholder="Filter by Date"
              showDateFilter={true}
              onDateFilterChange={handleDateFilterChange}
              isRefetching={isRefetching}
            />
          </TabsContent>
        </Tabs>
      </div>

      <OrderDetailsDialog
        open={editOrderId !== null}
        onEditOrder={(id) => {
          router.push(`/dashboard/bar/manager/catalog?orders=${id.toString()}`);
        }}
        onConfirmAll={handleConfirmAll}
        loadingButton={
          isUpdatingOrderItemStatus
            ? loadingButtonStatu
            : isUpdatingConfirmAll
            ? loadingButtonStatu
            : undefined
        }
        onItemStatusChange={handleChangeOrderItemStatus}
        order={getOrder ?? null}
        onOpenChange={handleOpen}
        isLoading={isLoadingDetails}
        viewgenInvOrderId={viewgenInvOrderId !== null}
      />
      <ViewInvoiceDialog
        open={viewgenInvOrderId !== null}
        onOpenChange={handleCloseReceiptVew}
        order={orders?.find((order) => order.id === viewgenInvOrderId)}
      />
    </>
  );
}
function YmdHelper(date: Date | null) {
  if (!date) return null;
  return DateTimeHelper.getDateFormat(date);
}
