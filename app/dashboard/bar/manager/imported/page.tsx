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
import DateTimeHelper from "@/lib/date-time";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ImportedItem,
  ImportedItemsColumns,
} from "@/components/data-table/imported-items-columns";
import { Button } from "@/components/ui/button";
import { Import, ImportIcon } from "lucide-react";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select as SelectImTy,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
export default function ImportedItemsPage() {
  const { toast } = useToast();
  const { useApiQuery, useApiPost } = useApi();
  const [selectedItems, setSelectedItems] = useState<ImportedItem[]>([]);
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );
  const [selectetImportType, setSelectetImportType] = useState<string | "">("");
  const [selectedImportProduct, setSelectedImportProduct] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [importedItems, setImportedItems] = useState<ImportedItem[]>([]);
  const [Open, setDialogOpen] = React.useState(false);
  const [isItem, setDialogItem] = React.useState<number | null>(null);
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
    data: fetchImportedItems,
    isRefetching,
    isLoading,
    refetch,
  } = useApiQuery<{ data: ImportedItem[]; resultDt: string }>(
    ["imported-item", filterStartDate, filterEndDate],
    `/ebm/items/imported${filterStartDate&&filterEndDate ? `?start_date=${filterStartDate}&&end_date=${filterEndDate}` : ''}`,
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

  const { data: products, isLoading: isLoadingProduct } = useApiQuery<
    Product[]
  >(["products"], "/bar/products", {
    enabled: importedItems.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (fetchImportedItems?.data && fetchImportedItems.data?.length > 0) {
      setImportedItems(fetchImportedItems.data);
    }
  }, [fetchImportedItems?.data]);

  const { data: importItemCCd } = useApiQuery<
    Array<{ cd: string; cdNm: string }>
  >(["imported-item-ccd"], `/ebm/codes/cdClsNm/Import Item Status`, {
    enabled: products && products?.length > 0,
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

  const { mutateAsync: importSelected, isPending: isImporting } = useApiPost(
    ["update-imported-all-item"],
    "/ebm/items/imported"
  );
  // imptItemSttsCd
  const handleImportAllItems = async () => {
    try {
      
      let selected = selectedItems.map((item) => {
        return {
          ...item,
          itemClCd: item.itemClsCd ?? item.itemClCd,
          modrNm: "Admin",
          modrId: "Admin",
          imptItemSttsCd: selectetImportType,
        };
      });
      if(selected.some((item) => (item.itemCd === null && item.imptItemSttsCd === "3"))){
        toast({
        title: "Error",
        description: "You must select item first since status you choose Approved Status",
        variant: "error",
      });
      return;
      }
      await importSelected(selected);
      setSelectedItems([]);
      setDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Selected items imported successfully",
        variant: "success",
      });
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err?.message ?? "Error importing selected items",
        variant: "destructive",
      });
    }
  };

  const handleSelectedProduct = (
    selected: { value: string; label: string } | null
  ) => {
    setSelectedImportProduct(selected);

    const newedited = importedItems?.map((item) => {
      return {
        ...item,
        itemCd: item.id === isItem ? selected?.value : item.itemCd,
        itemClCd:
          item.id === isItem
            ? products?.find((p) => p.itemCd === selected?.value)?.itemClCd
            : item.itemClCd,
      };
    });
    setImportedItems(newedited);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Imported Items</h1>
          <p className="text-muted-foreground">
            View And Tracking Imported Items
          </p>
        </div>
        {fetchImportedItems?.resultDt ? (
          <div className="inline-block">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {new Date(fetchImportedItems?.resultDt).toLocaleString()}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Imported Items </CardTitle>
              <CardDescription>
                View and Tracking Impoted Items status
              </CardDescription>
            </div>
            {selectedItems && selectedItems.length > 0 && (
              <Button
                variant="default"
                className="bg-green-500 cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                <Import className="mr-2 h-4 w-4" />
                Import All Selected
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={ImportedItemsColumns({
              selectedItems,
              setSelectedItems,
              setDialogItem,
              importstatsCd: importItemCCd ?? [],
            })}
            data={importedItems ?? []}
            searchKey="itemNm"
            searchPlaceholder="Search products..."
            dateFilterPlaceholder="filter by Date"
            isRefetching={isRefetching}
            isLoading={isLoading}
            showDateFilter={true}
            onDateFilterChange={handleChangeDate}
          />
        </CardContent>
      </Card>

      <Dialog open={Open} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Select Status Type</DialogTitle>
            <DialogDescription>
              Choose the Status That will Be Applied to All Selected Items
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <SelectImTy
              value={selectetImportType}
              onValueChange={(values) => {
                setSelectetImportType(values);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {importItemCCd?.filter((cd) => cd.cdNm === "Approved" || cd.cdNm === "Cancelled").map((imp) => (
                  <SelectItem key={imp.cd} value={imp.cd}>
                    {imp.cdNm}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectImTy>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportAllItems}
              disabled={!selectetImportType || isImporting}
            >
              {isImporting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Importing
                </>
              ) : (
                "Record Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isItem !== null}
        onOpenChange={() => {
          setDialogItem(null);
          setSelectedImportProduct(null);
        }}
      >
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Select Item Code</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Select
              isLoading={isLoadingProduct}
              isClearable
              value={selectedImportProduct}
              className="w-full"
              onChange={(value) => {
                handleSelectedProduct(value);
              }}
              options={products
                ?.filter((p) => p.itemCd !== null)
                .map((prod) => {
                  return {
                    value: prod.itemCd,
                    label: prod.name + " (" + prod.itemCd + ")",
                  };
                })}
            />
          </div>

          <DialogFooter>
            {/* <Button
              variant="outline"
              onClick={() => setDialogItem(null)}
              disabled={isImporting}
            >
              Cancel
            </Button> */}
            <Button
              onClick={() => {
                setDialogItem(null);
                setSelectedImportProduct(null);
              }}
              disabled={!isItem || isImporting}
            >
              Save
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
