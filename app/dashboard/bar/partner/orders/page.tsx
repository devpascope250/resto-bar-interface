"use client";

import { useState } from "react";
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
export default function OrdersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const { useApiQuery, useApiPut, queryClient } = useApi();
   const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const [editOrderId, setSelectOrderId] = useState<number | null>(null);
 

  const { data: getOrder, isLoading: isLoadingDetails } = useApiQuery<OrderDetails>(
    ["get-order-details", editOrderId],
    `/bar/orders/${editOrderId?.toString()}?orderDetail=true`,
    {
      enabled: editOrderId !== null,
    }
  );
  const [isPrinting, setIsPrinting] = useState(false);

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
    }
  );
  const { mutateAsync: updateStatus } = useApiPut(
    ["orders"],
    `/bar/orders/status`
  );
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

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

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

  const sampleReceiptData = {
    tradeName: "Trade Name",
    address: "Address, City",
    tin: "000000000",
    clientId: "000000000",
    items: [
      {
        name: "Plain Bread",
        quantity: 1000.0,
        unitPrice: 1.0,
        total: 1000.0,
        taxType: "A-EX",
      },
      {
        name: "Gouda cheese",
        quantity: 33600.0,
        unitPrice: 0.2,
        total: 6720.0,
        taxType: "B",
        discount: 25,
      },
      {
        name: "Wriggly gum",
        quantity: 60.0,
        unitPrice: 5.0,
        total: 300.0,
        taxType: "B",
      },
    ],
    totals: {
      total: 8020.0,
      totalAEx: 1000.0,
      totalB: 7020.0,
      totalTaxB: 1080.0,
      totalTax: 1080.0,
    },
    payment: {
      method: "CASH",
      amount: 8020.0,
    },
    itemsNumber: 3,
    date: "25/5/2012",
    time: "11:07:35",
    sdcId: "SDC001000001",
    receiptNumber: "168/258 NS",
    internalData: "TE68-SLA2-34J5-EAV3-N569-88LJ-Q7",
    receiptSignature: "V249-J39C-FJ48-HE2W",
    mrc: "AAACC123456",
    thankYouMessage: "THANK YOU\nCOME BACK AGAIN\nYOUR BEST STORE IN TOWN",
    commercialMessage: "Commercial message",
  };

  const handlePrint = (id: string) => {
    setIsPrinting(true);
    // Wait for the printing to finish
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 1000);
  };

  const handleShowDetails = async (id: string) => {
    setSelectOrderId(parseInt(id));
    // Handle showing details for the order with the given id
  };

  const handleOpen = () => {
    setSelectOrderId(null);
  };
  
  return (
    <>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Orders Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all orders from distributors
          </p>
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
              columns={orderColumns(handleUpdateStatus)}
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
              columns={orderColumns(handleUpdateStatus)}
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
              columns={orderColumns(handleUpdateStatus, handlePrint)}
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

      {isPrinting && (
        <div className="print-container">
          <Receipt receiptData={sampleReceiptData} />
        </div>
      )}

      <OrderDetailsDialog
      viewgenInvOrderId={false}
        open={editOrderId !== null}
        order={getOrder ?? null}
        onOpenChange={handleOpen}
        isLoading={isLoadingDetails}
      />
    </>
  );
}
function YmdHelper(date: Date | null) {
  if (!date) return null;
  return DateTimeHelper.getDateFormat(date);
}
