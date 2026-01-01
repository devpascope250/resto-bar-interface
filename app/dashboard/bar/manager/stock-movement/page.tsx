"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DataTable } from "@/components/data-table/data-table";
import { useApi } from "@/hooks/api-hooks";
import { keepPreviousData } from "@tanstack/react-query";
import DateTimeHelper from "@/lib/date-time";
import { useDebounce } from "@/hooks/useDebounce";
import { StockMovement, StockMovementColumns } from "@/components/data-table/stock-movement-columns";
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
  } = useApiQuery<StockMovement[]>(
    ["stock-movement", filterStartDate, filterEndDate],
    `/ebm/stock-movement${filterStartDate&&filterEndDate ? `?start_date=${filterStartDate}&&end_date=${filterEndDate}` : ''}`,
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
        <h1 className="text-3xl font-bold text-foreground">EBM Stock Movement</h1>
        <p className="text-muted-foreground">
          Comprehensive Stock  Movement and tracking
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stock Movement </CardTitle>
              <CardDescription>
                Complete Stock movement and pricing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={StockMovementColumns}
            data={inventoryReport ?? []}
            searchKey="sarNo"
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