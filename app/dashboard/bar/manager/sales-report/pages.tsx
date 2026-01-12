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
import { SalesTransactionColumns } from "@/components/data-table/sales-report-coumns";
import { useApi } from "@/hooks/api-hooks";
import { keepPreviousData } from "@tanstack/react-query";
import DateTimeHelper from "@/lib/date-time";
import { useDebounce } from "@/hooks/useDebounce";
import { SalesTransaction } from "@/components/data-table/sales-report-coumns";
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
    data: salesReport,
    isRefetching,
    isLoading
  } = useApiQuery<SalesTransaction[]>(
    ["sales-report", filterStartDate, filterEndDate],
    `/ebm/sales-report${filterStartDate&&filterEndDate ? `?start_date=${filterStartDate}&&end_date=${filterEndDate}` : ''}`,
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
        <h1 className="text-3xl font-bold text-foreground">Sales Report</h1>
        <p className="text-muted-foreground">
          Sales management Report
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generate Sales Report</CardTitle>
              <CardDescription>
                View, generate and Track sales
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={SalesTransactionColumns}
            data={salesReport ?? []}
            searchKey="salesSttsCd"
            searchPlaceholder="Search products..."
            dateFilterPlaceholder="filter by Date"
            isRefetching={isRefetching}
            isLoading={isLoading}
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