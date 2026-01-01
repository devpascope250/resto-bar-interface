"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useDebounce } from "@/hooks/useDebounce";

// Define the StockItem interface based on your data structure
export interface StockItem {
  id: number;
  tin: string;
  bhfId: string;
  itemCd: string;
  name: string;
  rsdQty: number;
  regrNm: string;
  regrId: string;
  modrNm: string;
  modrId: string;
  createdAt: string;
}

// Import the columns (we'll create this below)
import { StockMasterColumns } from "@/components/data-table/stock-master-columns";

export default function StockMasterPage() {
  const { useApiQuery } = useApi();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );

  const debouncedDateFilterChange = useDebounce(
    (start: Date | null, end: Date | null) => {
      if (start && end) {
        setFilterStartDate(start.toISOString().split('T')[0]);
        setFilterEndDate(end.toISOString().split('T')[0]);
      }
    },
    500
  );
   const { data: products } = useApiQuery<Product[]>(["products"], '/bar/products', {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
      placeholderData: keepPreviousData,
    });

  const {
    data: fetchStockItems,
    isRefetching,
    isLoading,
    refetch,
  } = useApiQuery<StockItem[]>(
    ["stock-master", filterStartDate, filterEndDate],
    `/ebm/items/list-stock-master${filterStartDate && filterEndDate ? `?start_date=${filterStartDate}&end_date=${filterEndDate}` : ''}`,
    {
      enabled: !filterStartDate || !filterEndDate || Boolean(filterStartDate && filterEndDate),
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    }
  );

  useEffect(() => {
    if (fetchStockItems && fetchStockItems?.length > 0) {
        // add name to stockItems
       const newStockItems = fetchStockItems.map((item) => {
        const product = products?.find((p) => p.itemCd === item.itemCd);
        return {
          ...item,
          name: product?.name || '',
        };
       })

       console.log(newStockItems);
       
      setStockItems(newStockItems);
    }
  }, [fetchStockItems]);

  const handleChangeDate = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      debouncedDateFilterChange(startDate, endDate);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Master</h1>
          <p className="text-muted-foreground">
            View and manage stock inventory
          </p>
        </div>
        {/* {fetchStockItems?.resultDt ? (
          <div className="inline-block">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {new Date(fetchStockItems?.resultDt).toLocaleString()}
            </span>
          </div>
        ) : (
          ""
        )} */}
      </div>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Stock Inventory </CardTitle>
            <CardDescription>
              View and manage all stock items
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={StockMasterColumns()}
            data={stockItems ?? []}
            searchKey="itemCd"
            searchPlaceholder="Search by item code..."
            dateFilterPlaceholder="Filter by creation date"
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