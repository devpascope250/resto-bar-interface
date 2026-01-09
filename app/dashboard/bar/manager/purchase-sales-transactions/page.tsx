"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
import {
  PurchaseSalesTransaction,
  PurchaseSalesTransactionColumns,
} from "@/components/data-table/purchases-items-columna";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PurchaseTransactionSettings } from "@/lib/service/purchaseTransactionSettings";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
export default function PurchasedItemsPage() {
  const { toast } = useToast();
  const { useApiQuery, useApiPost } = useApi();
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );

  const [selectedPurchaseItem, setSelectedPurchaseItem] =
    useState<PurchaseSalesTransaction | null>(null);
  const [selectetPurchaseStatusType, setIsSelectetPurchaseStatusType] =
    useState<string | null>(null);

  const { mutateAsync: savePurchase, isPending: isSavingPurchase } = useApiPost(
    ["save-purchase-status"],
    "/ebm/items/purchase-sales-transactions"
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
    data: purchaseTransactions,
    isRefetching,
    isLoading,
    isFetching,
    refetch,
  } = useApiQuery<{ data: PurchaseSalesTransaction[]; resultDt: string, message: string }>(
    ["purchases-transactions", filterStartDate, filterEndDate],
    `/ebm/items/purchase-sales-transactions${
      filterStartDate && filterEndDate
        ? `?start_date=${filterStartDate}&end_date=${filterEndDate}`
        : ""
    }`,
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

  const { data: purchaseStatuses } = useApiQuery<
    Array<{ cd: string; cdNm: string }>
  >(["purchase-Status-cd"], `/ebm/codes/cdClsNm/Purchase Status`, {
    enabled: Boolean(
      purchaseTransactions && purchaseTransactions.data.length > 0
    ),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });

  const handleChangeDate = (startDate: Date | null, endDate: Date | null) => {
    // id dates are valid, set the filter state
    if (startDate && endDate) {
      debouncedDateFilterChange(startDate, endDate);
    }
  };

  const handleChangeStatus = (data: any) => {
    setSelectedPurchaseItem(data);
    // console.log(data);
  };

  const handleSavePurchaseStatus = async () => {
    const newpurchaseStatuses = new PurchaseTransactionSettings();
    try {
      const data = {
        data: newpurchaseStatuses.getAllPayloads(
          selectedPurchaseItem!,
          selectetPurchaseStatusType!
        ),
        id: selectedPurchaseItem?.id,
      };
      await savePurchase(data);
      refetch();
      toast({
        title: "Purchase Status Updated",
        description: "Purchase Status Updated Successfully",
        variant: "success",
      });
      setSelectedPurchaseItem(null);
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Purchase Status Update Failed",
        description: error.message ?? "Purchase Status Update Failed",
        variant: "destructive",
      });
    }
  };

  const prevIsFetchingRef = useRef(isFetching);
  useEffect(() => {
  
    if (prevIsFetchingRef.current && !isFetching && purchaseTransactions?.message) {
      toast({
        title: "Purchase messages",
        description: purchaseTransactions.message ?? "There is An Error While Fetching Data",
        variant: "info",
      });
    }
    
    // Update the ref
    prevIsFetchingRef.current = isFetching;
  }, [isFetching, purchaseTransactions]);
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Purchases Transactions
          </h1>
          <p className="text-muted-foreground">
            View And Purchases Transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
        {purchaseTransactions?.resultDt ? (
          <div className="inline-block">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {new Date(purchaseTransactions?.resultDt).toLocaleString()}
            </span>
          </div>
        ) : (
          ""
        )}

        {/* Refresh Button */}
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
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Purchases Transactions </CardTitle>
              <CardDescription>
                View and Tracking Purchases Transactions status
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={PurchaseSalesTransactionColumns(
              handleChangeStatus,
              purchaseStatuses ?? []
            )}
            data={purchaseTransactions?.data ?? []}
            searchKey="salesDt"
            searchPlaceholder="Search products..."
            dateFilterPlaceholder="filter by Date"
            isRefetching={isRefetching}
            isLoading={isLoading}
            showDateFilter={true}
            onDateFilterChange={handleChangeDate}
          />
        </CardContent>
      </Card>

      <Dialog
        open={selectedPurchaseItem !== null}
        onOpenChange={() => {
          setSelectedPurchaseItem(null);
        }}
      >
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Select Status</DialogTitle>
            <DialogDescription>
              Choose the Status that will be applied to selected Purchase{" "}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Select
              value={selectetPurchaseStatusType ?? ""}
              onValueChange={(values) => {
                setIsSelectetPurchaseStatusType(values);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {purchaseStatuses
                  ?.filter((cd) => {
                    if (cd.cd === "02" || cd.cd === "04") {
                      return {
                        cd: cd.cd,
                        cdNm: cd.cd === "04" ? "Reject" : cd.cdNm,
                      };
                    }
                  })
                  .map((imp) => (
                    <SelectItem key={imp.cd} value={imp.cd}>
                      {imp.cdNm}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedPurchaseItem(null)}
              disabled={isSavingPurchase}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePurchaseStatus}
              disabled={!selectetPurchaseStatusType || isSavingPurchase}
            >
              {isSavingPurchase ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving ...
                </>
              ) : (
                "Record Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function YmdHelper(date: Date | null) {
  if (!date) return null;
  return DateTimeHelper.getDateFormat(date);
}
