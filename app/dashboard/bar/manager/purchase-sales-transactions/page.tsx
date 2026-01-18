// "use client";

// import { useState, useMemo, useEffect, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { DataTable } from "@/components/data-table/data-table";
// import { useApi } from "@/hooks/api-hooks";
// import { keepPreviousData } from "@tanstack/react-query";
// import DateTimeHelper from "@/lib/date-time";
// import { useDebounce } from "@/hooks/useDebounce";
// import {
//   PurchaseSalesTransaction,
//   PurchaseSalesTransactionColumns,
//   PurchaseSalesTransactionItem,
// } from "@/components/data-table/purchases-items-columna";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { LoadingSpinner } from "@/components/ui/loading-spinner";
// import { PurchaseTransactionSettings } from "@/lib/service/purchaseTransactionSettings";
// import { useToast } from "@/hooks/use-toast";
// import { RefreshCw } from "lucide-react";
// import { cn } from "@/lib/utils";
// export default function PurchasedItemsPage() {
//   const { toast } = useToast();
//   const { useApiQuery, useApiPost } = useApi();
//   const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
//     null
//   );
//   const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
//     null
//   );
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const [selectedPurchaseItem, setSelectedPurchaseItem] =
//     useState<PurchaseSalesTransaction | null>(null);

//   const { mutateAsync: savePurchase, isPending: isSavingPurchase } = useApiPost(
//     ["save-purchase-status"],
//     "/ebm/items/purchase-sales-transactions"
//   );

//   const debouncedDateFilterChange = useDebounce(
//     (start: Date | null, end: Date | null) => {
//       if (start && end) {
//         setFilterStartDate(YmdHelper(start));
//         setFilterEndDate(YmdHelper(end));
//       }
//     },
//     500
//   );

//   const {
//     data: purchaseTransactions,
//     isRefetching,
//     isLoading,
//     isFetching,
//     refetch,
//   } = useApiQuery<{
//     data: PurchaseSalesTransaction[];
//     resultDt: string;
//     message: string;
//   }>(
//     ["purchases-transactions", filterStartDate, filterEndDate],
//     `/ebm/items/purchase-sales-transactions${
//       filterStartDate && filterEndDate
//         ? `?start_date=${filterStartDate}&end_date=${filterEndDate}`
//         : ""
//     }`,
//     {
//       enabled:
//         !filterStartDate ||
//         !filterEndDate ||
//         Boolean(filterStartDate && filterEndDate),
//       staleTime: 10 * 60 * 1000,
//       refetchOnWindowFocus: false,
//       refetchOnReconnect: false,
//       placeholderData: keepPreviousData,
//     }
//   );

//   const { data: purchaseStatuses } = useApiQuery<
//     Array<{ cd: string; cdNm: string }>
//   >(["purchase-Status-cd"], `/ebm/codes/cdClsNm/Purchase Status`, {
//     enabled: Boolean(
//       purchaseTransactions && purchaseTransactions.data.length > 0
//     ),
//     staleTime: 10 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     placeholderData: keepPreviousData,
//   });

//   const { data: products, isLoading: isLoadingProduct } = useApiQuery<
//     Product[]
//   >(["products"], "/bar/products", {
//     enabled: purchaseTransactions && purchaseTransactions.data.length > 0,
//     refetchOnWindowFocus: false,
//     staleTime: 5 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
//     placeholderData: keepPreviousData,
//   });

//   const handleChangeDate = (startDate: Date | null, endDate: Date | null) => {
//     // id dates are valid, set the filter state
//     if (startDate && endDate) {
//       debouncedDateFilterChange(startDate, endDate);
//     }
//   };

//   const handleChangeStatus = (data: any) => {
//     setSelectedPurchaseItem(data);
//     // console.log(data);
//   };

//   const handleSavePurchaseStatus = async () => {
//     const newpurchaseStatuses = new PurchaseTransactionSettings();
//     try {
//       const data = {
//         data: newpurchaseStatuses.getAllPayloads(selectedPurchaseItem!, "04"),
//         id: selectedPurchaseItem?.id,
//       };
//       await savePurchase(data);
//       refetch();
//       toast({
//         title: "Purchase Status",
//         description: "Purchase Status Updated Successfully",
//         variant: "success",
//       });
//       setSelectedPurchaseItem(null);
//     } catch (err) {
//       const error = err as Error;
//       toast({
//         title: "Purchase Status Update Failed",
//         description: error.message ?? "Purchase Status Update Failed",
//         variant: "destructive",
//       });
//     }
//   };

//   const prevIsFetchingRef = useRef(isFetching);
//   useEffect(() => {
//     if (
//       prevIsFetchingRef.current &&
//       !isFetching &&
//       purchaseTransactions?.message
//     ) {
//       toast({
//         title: "Purchase messages",
//         description:
//           purchaseTransactions.message ??
//           "There is An Error While Fetching Data",
//         variant: "info",
//       });
//     }

//     // Update the ref
//     prevIsFetchingRef.current = isFetching;
//   }, [isFetching, purchaseTransactions]);

//   const onMapping = async (
//     items: (PurchaseSalesTransactionItem & { mappedProductId: string })[]
//   ) => {
//     const mappedItem = purchaseTransactions?.data.find(
//       (itm) => itm.id === items[0].purchaseSalesTransactionId
//     );
//     setIsDialogOpen(true);
//     if (mappedItem) {
//       mappedItem.itemList = items.map((item) => {
//         return {
//           ...item,
//           itemCd: item.mappedProductId,
//         };
//       });
//       const newpurchaseStatuses = new PurchaseTransactionSettings();
//       try {
//         const data = {
//           data: newpurchaseStatuses.getAllPayloads(mappedItem!, "02"),
//           id: mappedItem?.id,
//         };
//         await savePurchase(data);
//         refetch();
//         toast({
//           title: "Purchase Status",
//           description: "Purchase Items  Mapped",
//           variant: "success",
//         });
//         setSelectedPurchaseItem(null);
//         setIsDialogOpen(true);
//       } catch (err) {
//         console.log(err);

//         const error = err as Error;
//         toast({
//           title: "Failed to map items",
//           description: error.message ?? "Failed to map items",
//           variant: "destructive",
//         });
//       }
//     }
//   };
//   return (
//     <div className="p-8">
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">
//             Purchases Transactions
//           </h1>
//           <p className="text-muted-foreground">
//             View And Purchases Transactions
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           {purchaseTransactions?.resultDt ? (
//             <div className="inline-block">
//               <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//                 {new Date(purchaseTransactions?.resultDt).toLocaleString()}
//               </span>
//             </div>
//           ) : (
//             ""
//           )}

//           {/* Refresh Button */}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => refetch()}
//             disabled={isRefetching}
//           >
//             <RefreshCw
//               className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")}
//             />
//             Refresh
//           </Button>
//         </div>
//       </div>
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Purchases Transactions </CardTitle>
//               <CardDescription>
//                 View and Tracking Purchases Transactions status
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <DataTable
//             columns={PurchaseSalesTransactionColumns(
//               handleChangeStatus,
//               purchaseStatuses ?? [],
//               products ?? [],
//               onMapping,
//               setIsDialogOpen,
//               isSavingPurchase
//             )}
//             data={purchaseTransactions?.data ?? []}
//             searchKey="salesDt"
//             searchPlaceholder="Search products..."
//             dateFilterPlaceholder="filter by Date"
//             isRefetching={isRefetching}
//             isLoading={isLoading}
//             showDateFilter={true}
//             onDateFilterChange={handleChangeDate}
//           />
//         </CardContent>
//       </Card>

//       <Dialog
//         open={selectedPurchaseItem !== null}
//         onOpenChange={() => {
//           setSelectedPurchaseItem(null);
//         }}
//       >
//         <DialogContent className="w-full max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm To Reject</DialogTitle>
//             <DialogDescription>
//               Are You Sure want to Reject This Purchase Transaction, Once You do
//               this you can not undo this action
//             </DialogDescription>
//           </DialogHeader>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setSelectedPurchaseItem(null)}
//               disabled={isSavingPurchase}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSavePurchaseStatus}
//               disabled={isSavingPurchase}
//             >
//               {isSavingPurchase ? (
//                 <>
//                   <LoadingSpinner size="sm" />
//                   Saving ...
//                 </>
//               ) : (
//                 "Confirm"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// function YmdHelper(date: Date | null) {
//   if (!date) return null;
//   return DateTimeHelper.getDateFormat(date);
// }

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
  PurchaseSalesTransactionItem,
} from "@/components/data-table/purchases-items-columna";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select as Sel1,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Percent,
  Hash,
  Check,
  X,
  AlertCircle,
  ShoppingCart,
  Tag,
  Package2,
  Scale,
  TrendingUp,
} from "lucide-react";
import Select from "react-select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store/auth-store";

interface ProductMapping {
  itemCd: string;
  productId: string;
}

export default function PurchasedItemsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { useApiQuery, useApiPost } = useApi();
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );
  const [selectedPurchaseItem, setSelectedPurchaseItem] =
    useState<PurchaseSalesTransaction | null>(null);
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    PurchaseSalesTransactionItem[]
  >([]);
  const [productMappings, setProductMappings] = useState<ProductMapping[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<
    number | null
  >(null);
  const [mappingLoading, setMappingLoading] = useState(false);

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
  } = useApiQuery<{
    data: PurchaseSalesTransaction[];
    resultDt: string;
    message: string;
  }>(
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

  const { data: products, isLoading: isLoadingProduct } = useApiQuery<
    Product[]
  >(["products"], "/bar/products", {
    enabled: purchaseTransactions && purchaseTransactions.data.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // const productOptions = useMemo(() => {
  //   // exclude mapped items

  //  let productsfil = products?.filter((p1) => !productMappings.find((p2) => p2.itemCd === p1.itemCd));
  //   return user?.taxStatus === "ENABLED" ? productsfil
  //     ?.filter((p) => p.itemCd !== null && p.itemTyCd !== "3" && p.taxTyCd !== "D")
  //     .map((product) => ({
  //       label: `${product.name} (${product.itemCd})`,
  //       value: product.itemCd,
  //       data: product,
  //     })) || [] : productsfil
  //     ?.filter((p) => p.itemCd !== null && p.itemTyCd !== "3" && p.taxTyCd === "D")
  //     .map((product) => ({
  //       label: `${product.name} (${product.itemCd})`,
  //       value: product.itemCd,
  //       data: product,
  //     })) || [];
  // }, [products, productMappings]);

  const productOptions = useMemo(() => {
    // First, extract all itemCd values from productMappings for efficient lookup
    const mappedItemCds = new Set(
      productMappings?.map((mapping) => mapping.productId) || []
    );

    // Filter out products that have been mapped
    let productsfil =
      products?.filter((p1) => !mappedItemCds.has(p1.itemCd)) || [];
    return user?.taxStatus === "ENABLED"
      ? productsfil
          .filter(
            (p) => p.itemCd !== null && p.itemTyCd !== "3" && p.taxTyCd !== "D"
          )
          .map((product) => ({
            label: `${product.name} (${product.itemCd})`,
            value: product.itemCd,
            data: product,
          }))
      : productsfil
          .filter(
            (p) => p.itemCd !== null && p.itemTyCd !== "3" && p.taxTyCd === "D"
          )
          .map((product) => ({
            label: `${product.name} (${product.itemCd})`,
            value: product.itemCd,
            data: product,
          })) || [];
  }, [products, productMappings, user?.taxStatus]);

  const handleChangeDate = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      debouncedDateFilterChange(startDate, endDate);
    }
  };

  const handleChangeStatus = (data: any) => {
    setSelectedPurchaseItem(data);
  };

  const handleSavePurchaseStatus = async () => {
    const newpurchaseStatuses = new PurchaseTransactionSettings();
    try {
      const data = {
        data: newpurchaseStatuses.getAllPayloads(selectedPurchaseItem!, "04"),
        id: selectedPurchaseItem?.id,
      };
      await savePurchase(data);
      refetch();
      toast({
        title: "Purchase Status",
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

  const openMappingDialog = (transaction: PurchaseSalesTransaction) => {
    setSelectedItems(transaction.itemList || []);
    setCurrentTransactionId(transaction.id || null);

    // Initialize mappings
    const initialMappings = (transaction.itemList || []).map((item) => ({
      itemCd: item.itemCd || "",
      productId: item.itemCd || "",
    }));
    setProductMappings(initialMappings);
    setIsDirty(false);
    setMappingDialogOpen(true);
  };

  const handleProductMappingChange = (itemCd: string, selectedOption: any) => {
    setProductMappings((prev) => {
      const existing = prev.find((m) => m.itemCd === itemCd);
      if (existing) {
        return prev.map((m) =>
          m.itemCd === itemCd
            ? { ...m, productId: selectedOption?.value || m.itemCd }
            : m
        );
      }
      return [...prev, { itemCd, productId: selectedOption?.value || itemCd }];
    });
    setIsDirty(true);
  };

  const handleConfirmMapping = async () => {
    if (!currentTransactionId || !purchaseTransactions) return;
    setMappingLoading(true);
    try {
      const mappedItem = purchaseTransactions.data.find(
        (itm) => itm.id === currentTransactionId
      );

      if (mappedItem) {
        const updatedItems = selectedItems.map((item) => {
          const mapping = productMappings.find((m) => m.itemCd === item.itemCd);
          return {
            ...item,
            mappedProductId: mapping?.productId || item.itemCd,
          };
        });
        mappedItem.itemList = updatedItems.map((item) => {
          return {
            ...item,
            // itemCd: item.mappedProductId,
          };
        });

        if (
          mappedItem.itemList.some(
            (item) => item.mappedProductId === item.itemCd
          )
        ) {
          toast({
            title: "Un mapped items",
            description:
              "Please map all items before saving, some items are not mapped!",
            variant: "destructive",
          });
          return;
        }

        const newpurchaseStatuses = new PurchaseTransactionSettings();
        const data = {
          data: newpurchaseStatuses.getAllPayloads(mappedItem, "02"),
          id: mappedItem.id,
        };
        await savePurchase(data);
        refetch();

        toast({
          title: "Purchase Status",
          description: "Purchase Items Mapped Successfully",
          variant: "success",
        });

        setMappingDialogOpen(false);
        setIsDirty(false);
      }
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast({
        title: "Failed to map items",
        description: error.message ?? "Failed to map items",
        variant: "destructive",
      });
    } finally {
      setMappingLoading(false);
    }
  };

  const calculateSummary = (items: PurchaseSalesTransactionItem[]) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.totAmt || 0),
      0
    );
    const totalTax = items.reduce((sum, item) => sum + (item.taxAmt || 0), 0);
    const totalDiscount = items.reduce(
      (sum, item) => sum + (item.dcAmt || 0),
      0
    );
    const totalQuantity = items.reduce((sum, item) => sum + (item.qty || 0), 0);

    return {
      totalAmount,
      totalTax,
      totalDiscount,
      totalQuantity,
      netAmount: totalAmount - totalDiscount,
    };
  };

  const summary = calculateSummary(selectedItems);

  const prevIsFetchingRef = useRef(isFetching);
  useEffect(() => {
    if (
      prevIsFetchingRef.current &&
      !isFetching &&
      purchaseTransactions?.message
    ) {
      toast({
        title: "Purchase messages",
        description:
          purchaseTransactions.message ??
          "There is An Error While Fetching Data",
        variant: "info",
      });
    }

    prevIsFetchingRef.current = isFetching;
  }, [isFetching, purchaseTransactions]);

  const onMapping = async (
    items: (PurchaseSalesTransactionItem & { mappedProductId: string })[]
  ) => {
    const mappedItem = purchaseTransactions?.data.find(
      (itm) => itm.id === items[0].purchaseSalesTransactionId
    );
    if (mappedItem) {
      mappedItem.itemList = items;
      // .map((item) => {
      //   return {
      //     ...item,
      //     itemCd: item.mappedProductId,
      //   };
      // });

      console.log(items);

      const newpurchaseStatuses = new PurchaseTransactionSettings();
      try {
        const data = {
          data: newpurchaseStatuses.getAllPayloads(mappedItem, "02"),
          id: mappedItem.id,
        };
        await savePurchase(data);
        refetch();
        toast({
          title: "Purchase Status",
          description: "Purchase Items Mapped",
          variant: "success",
        });
      } catch (err) {
        console.log(err);
        const error = err as Error;
        toast({
          title: "Failed to map items",
          description: error.message ?? "Failed to map items",
          variant: "destructive",
        });
      }
    }
  };

  const currentSelected = purchaseTransactions?.data?.find(
    (t) => t.id === currentTransactionId
  );

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
              purchaseStatuses ?? [],
              products ?? [],
              onMapping,
              openMappingDialog
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

      {/* Status Change Dialog */}
      <Dialog
        open={selectedPurchaseItem !== null}
        onOpenChange={() => {
          setSelectedPurchaseItem(null);
        }}
      >
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm To Reject</DialogTitle>
            <DialogDescription>
              Are You Sure want to Reject This Purchase Transaction, Once You do
              this you can not undo this action
            </DialogDescription>
          </DialogHeader>

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
              disabled={isSavingPurchase}
            >
              {isSavingPurchase ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving ...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Mapping Dialog */}
      <Dialog open={mappingDialogOpen} onOpenChange={setMappingDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <div className="flex flex-col h-full">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      Transaction #{currentTransactionId}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {selectedItems.length} items
                      </span>
                      <span>•</span>
                      <span>Detailed item view and mapping</span>
                    </DialogDescription>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-sm font-medium px-3 py-1"
                >
                  Total: {summary.totalAmount.toLocaleString("en-US")} RWF
                </Badge>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-4 h-full">
                {/* Items List */}
                <div className="col-span-3 border-r">
                  <div className="px-6 py-4 border-b bg-muted/30">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Package2 className="h-4 w-4" />
                      Transaction Items
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review and map items to your product catalog
                    </p>
                  </div>
                  <ScrollArea className="h-[calc(90vh-16rem)]">
                    <div className="space-y-4 p-6">
                      {selectedItems.map((item, index) => {
                        const mapping = productMappings.find(
                          (m) => m.itemCd === item.itemCd
                        );
                        const selectedProduct = mapping
                          ? productOptions.find(
                              (opt) =>
                                opt.data.itemCd === item.mappedProductId ||
                                opt.value === mapping.productId
                            )
                          : null;

                        return (
                          <div
                            key={item.id || index}
                            className="border rounded-xl p-5 bg-card shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                      <span className="font-bold text-primary">
                                        {String.fromCharCode(65 + (index % 26))}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {item.itemNm || `Item ${item.itemSeq}`}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge
                                        variant="secondary"
                                        className="gap-1"
                                      >
                                        <Hash className="h-3 w-3" />
                                        Seq: {item.itemSeq}
                                      </Badge>
                                      <Badge variant="outline">
                                        Code: {item.itemCd}
                                      </Badge>
                                      {item.itemClsCd && (
                                        <Badge variant="outline">
                                          Class: {item.itemClsCd}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  {item.totAmt?.toLocaleString("en-US")} RWF
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.qty} ×{" "}
                                  {item.prc?.toLocaleString("en-US")} RWF
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                              {/* Quantity & Pricing */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <Scale className="h-3 w-3" />
                                  Quantity & Pricing
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                      Quantity:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {item.qty} {item.qtyUnitCd}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                      Package:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {item.pkg} {item.pkgUnitCd}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                      Unit Price:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {item.prc?.toLocaleString("en-US")} RWF
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Tax & Discount */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <Percent className="h-3 w-3" />
                                  Tax & Discount
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                      Tax Type:
                                    </span>
                                    <Badge
                                      variant={
                                        item.taxTyCd === "A"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      Type {item.taxTyCd}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                      Tax Amount:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {item.taxAmt?.toLocaleString("en-US")} RWF
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                      Discount:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {item.dcRt}% (
                                      {item.dcAmt?.toLocaleString("en-US")} RWF)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Product Mapping */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <Tag className="h-3 w-3" />
                                  Product Mapping
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`mapping-${item.itemCd}`}
                                    className="text-xs"
                                  >
                                    Map to Product
                                  </Label>
                                  <Select
                                    id={`mapping-${item.itemCd}`}
                                    options={productOptions}
                                    value={selectedProduct}
                                    onChange={(option) =>
                                      handleProductMappingChange(
                                        item.itemCd ?? "",
                                        option
                                      )
                                    }
                                    isDisabled={
                                      mappingLoading ||
                                      currentSelected?.pchsSttsCd === "02"
                                    }
                                    className="w-full"
                                    classNamePrefix="select"
                                    placeholder="Select product..."
                                    isSearchable
                                    isClearable
                                  />
                                  {selectedProduct && (
                                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                      <Check className="h-3 w-3" />
                                      Mapped to {selectedProduct.label}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className="pt-3 border-t">
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-muted-foreground">
                                  Item ID: {item.id}
                                </div>
                                {item.bcd && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      Barcode:
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="font-mono"
                                    >
                                      {item.bcd}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Summary Panel */}
                <div className="col-span-1 bg-muted/30">
                  <div className="px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Summary
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          Transaction Summary
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Total Items:</span>
                            <Badge variant="secondary">
                              {selectedItems.length}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Total Quantity:</span>
                            <span className="font-medium">
                              {summary.totalQuantity}
                            </span>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Subtotal:</span>
                              <span className="text-sm">
                                {summary.totalAmount.toLocaleString("en-US")}{" "}
                                RWF
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-green-600">
                                Discount:
                              </span>
                              <span className="text-sm text-green-600">
                                -{summary.totalDiscount.toLocaleString("en-US")}{" "}
                                RWF
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-red-600">Tax:</span>
                              <span className="text-sm text-red-600">
                                {summary.totalTax.toLocaleString("en-US")} RWF
                              </span>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center pt-2">
                            <span className="font-semibold">Net Total:</span>
                            <span className="text-xl font-bold">
                              {summary.netAmount.toLocaleString("en-US")} RWF
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          Mapping Status
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Total Items:</span>
                            <span className="font-medium">
                              {productMappings.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Mapped:</span>
                            <span className="font-medium text-green-600">
                              {currentSelected?.pchsSttsCd === "02"
                                ? selectedItems?.filter(
                                    (sl) => sl.mappedProductId !== null
                                  ).length
                                : productMappings.filter(
                                    (m) => m.productId !== m.itemCd
                                  ).length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Unmapped:</span>
                            <span className="font-medium text-amber-600">
                              {currentSelected?.pchsSttsCd === "02"
                                ? selectedItems?.filter(
                                    (sl) => sl.mappedProductId === null
                                  ).length
                                : productMappings.filter(
                                    (m) => m.productId === m.itemCd
                                  ).length}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isDirty && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 text-amber-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              You have unsaved changes
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-background">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">
                  {selectedItems.length} items loaded • Click confirm to save
                  mappings
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDirty(false);
                      const initialMappings = selectedItems.map((item) => ({
                        itemCd: item.itemCd || "",
                        productId: item.itemCd || "",
                      }));
                      setProductMappings(initialMappings);
                    }}
                    disabled={!isDirty}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset Changes
                  </Button>
                  <Button
                    onClick={handleConfirmMapping}
                    disabled={
                      !isDirty ||
                      mappingLoading ||
                      currentSelected?.pchsSttsCd === "02"
                    }
                    className="min-w-[120px] disabled:cursor-not-allowed"
                  >
                    {mappingLoading ? (
                      <>
                        <LoadingSpinner size="sm" /> mapping ...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {currentSelected?.pchsSttsCd === "02"
                          ? "Already Mapped"
                          : "Confirm Mapping"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function YmdHelper(date: Date | null) {
  if (!date) return null;
  return DateTimeHelper.getDateFormat(date);
}
