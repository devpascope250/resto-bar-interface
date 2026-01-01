"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { inventoryColumns } from "@/components/data-table/inventory-columns";
import { useApi } from "@/hooks/api-hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import DateTimeHelper from "@/lib/date-time";
import { useDebounce } from "@/hooks/useDebounce";
export default function InventoryReportPage() {
  const { useApiQuery } = useApi();
   const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );
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
    data: inventoryReport,
    isRefetching,
  } = useApiQuery<MonthlyRemport[]>(
    ["inventory-report", filterStartDate, filterEndDate],
    `/bar/products/report${filterStartDate&&filterEndDate ? `?start_date=${filterStartDate}&&end_date=${filterEndDate}` : ''}`,
     {
      enabled:
        !filterStartDate ||
        !filterEndDate ||
        Boolean(filterStartDate && filterEndDate),
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    }
  );

  const [filterCategory, setFilterCategory] = useState<
    "all" | "BEVERAGE" | "FOOD"
  >("all");
  const filteredData = useMemo(() => {
    if (filterCategory === "all") return inventoryReport;
    return inventoryReport?.filter(
      (item) =>
        item.productType ===
        (filterCategory === "BEVERAGE" ? "BEVERAGE" : "FOOD")
    );
  }, [inventoryReport, filterCategory]);

  const inventoryStats = useMemo(() => {
  const totalStockIn = inventoryReport
    ?.filter((t) => t.totalIn)
    .reduce((sum, t) => sum + t.totalIn, 0) || 0;
  
  const totalStockOut = inventoryReport
    ?.filter((t) => t.totalOut)
    .reduce((sum, t) => sum + t.totalOut, 0) || 0;
  
  // Use inventoryReport instead of dummyProducts
  const lowStockProducts = inventoryReport?.filter(
    (item) => item.currentStock < 20 ) || [];
  
  const outOfStockProducts = inventoryReport?.filter(
    (item) => item.currentStock === 0
  ) || [];

  return {
    totalStockIn,
    totalStockOut,
    lowStockCount: lowStockProducts.length,
    outOfStockCount: outOfStockProducts.length,
  };
}, [inventoryReport]);

   const handleChangeDate = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    // id dates are valid, set the filter state
    if (startDate && endDate) {
      debouncedDateFilterChange(startDate, endDate);
    }
  };
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Inventory Report</h1>
        <p className="text-muted-foreground">
          Comprehensive inventory management and stock tracking
        </p>
      </div>
      {/* 
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Date Range</CardTitle>
          <CardDescription>
            View inventory transactions within a specific period (defaults to current month)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card> */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock In
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventoryStats.totalStockIn ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Units added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Out
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventoryStats.totalStockOut ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Units removed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inventoryStats.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">Below 20 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventoryStats.outOfStockCount}
            </div>
            <p className="text-xs text-muted-foreground">Needs restocking</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                Complete inventory with stock levels and pricing
              </CardDescription>
            </div>

            <Select
              value={filterCategory}
              onValueChange={(value: "all" | "BEVERAGE" | "FOOD") =>
                setFilterCategory(value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="BEVERAGE">Beverage</SelectItem>
                <SelectItem value="FOOD">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={inventoryColumns}
            data={filteredData ?? []}
            searchKey="name"
            searchPlaceholder="Search products..."
            dateFilterPlaceholder="filter by Date"
            isRefetching={isRefetching}
            showDateFilter={true}
            onDateFilterChange={handleChangeDate}
          />
        </CardContent>
      </Card>
    </div>
  );
}


function YmdHelper(date: Date | null) {
  if (!date) return null;
  return DateTimeHelper.getDateFormat(date);
}