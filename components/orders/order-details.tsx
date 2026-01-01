"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Printer,
  Download,
  Calendar,
  User,
  Check,
  X as XIcon,
  Edit,
  CheckCircle,
  Receipt,
  FileText,
  Plus,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useApi } from "@/hooks/api-hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TransactionTypeCodeClassification } from "@/lib/codeDefinitions";
import { LocalStorage } from "@/lib/local-storage";

// Updated interfaces
interface CustomerReceiptData {
  id: number;
  name: string;
  tin?: string;
  mobile?: string;
  prcOrdCd?: string;
  paymentType: string;
  amount: number;
  items: Array<{
    productId: number;
    itemCd: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

interface GeneratedReceipt {
  id: string;
  customerName: string;
  timestamp: string;
  amount: number;
  items: CustomerReceiptData["items"];
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: OrderDetails | null;
  isLoading: boolean;
  viewgenInvOrderId: boolean;
  onItemStatusChange?: (
    itemId: number,
    status: "confirmed" | "cancelled"
  ) => void;
  onConfirmAll?: (orderId: number) => void;
  onEditOrder?: (orderId: number) => void;
  loadingButton?: { itemId?: number | null; status: "confirmed" | "cancelled" };
  onGenerateReceipt?: (receiptData: CustomerReceiptData[]) => void;
  generatedReceipts?: GeneratedReceipt[];
  onPrintReceipts?: (receipts: GeneratedReceipt[]) => void; // New prop for printing existing receipts
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  isLoading,
  viewgenInvOrderId,
  onItemStatusChange,
  onConfirmAll,
  onEditOrder,
  loadingButton,
  onGenerateReceipt,
  generatedReceipts, // Use dummy data by default
  onPrintReceipts,
}: OrderDetailsDialogProps) {
  const { toast } = useToast();
  const items = order?.orderItems ?? [];
  const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);
  const [viewReceiptsDialogOpen, setViewReceiptsDialogOpen] =
    React.useState(false);
  const [customers, setCustomers] = React.useState<CustomerReceiptData[]>([]);
  const [updatedCustomers, setUpdatedCustomers] = React.useState<
    CustomerReceiptData[]
  >([]);
  // Add this state for the type selection dialog
  const [receiptTypeDialogOpen, setReceiptTypeDialogOpen] =
    React.useState(false);
  const [selectedReceiptType, setSelectedReceiptType] = React.useState("");
  const router = useRouter();
  const { useApiQuery, useApiPost, queryClient, useApiPut } = useApi();
  const { data: paymentTypes, isLoading: isLoadingpaymentTypes } = useApiQuery(
    ["payment-type", receiptDialogOpen],
    `/ebm/codes/cdClsNm/Payment Type`,
    {
      staleTime: Infinity,
      placeholderData: keepPreviousData,
      enabled: receiptDialogOpen,
    }
  );

  //   const { data: transactionTypes, isLoading: isLoadingTransaction } = useApiQuery(
  //   ["transaction-type", receiptTypeDialogOpen],
  //   `/ebm/codes/cdClsNm/Transaction Type`,
  //   {
  //     staleTime: Infinity,
  //     placeholderData: keepPreviousData,
  //     enabled: receiptDialogOpen,
  //   }
  // );
  const formatMoney = (n?: number) =>
    typeof n === "number" ? n.toFixed(2) + " Rwf" : "-";

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const getStatusVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Initialize customers with all items assigned to first customer
  React.useEffect(() => {
    if (items.length > 0 && receiptDialogOpen) {
      const firstCustomerItems = items
        .filter((status) => status.status !== "CANCELLED")
        .map((item) => ({
          productId: item.product.id,
          itemCd: item.product.itemCd,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        }));

      const firstCustomerAmount = firstCustomerItems.reduce(
        (sum, item) => sum + item.total,
        0
      );
      if (order && order?.orderCustomers?.length > 0) {
        for (const [index, customer] of order?.orderCustomers.entries()) {
          if (index === 0) {
            setCustomers([
              {
                id: customer.id,
                name: customer.name,
                tin: customer.tin,
                paymentType: customer.paymentType,
                mobile: customer.mobile,
                amount: firstCustomerAmount,
                items: firstCustomerItems,
              },
            ]);
          } else {
            setCustomers((prev) => [
              ...prev,
              {
                id: customer.id,
                name: customer.name,
                tin: customer.tin,
                paymentType: customer.paymentType,
                mobile: customer.mobile,
                amount: 0,
                // assign empty items array to other customers
                items: [],
              },
            ]);
          }
        }
      } else {
        // generate a unique id for the customer using math
        const uniqUid = Math.floor(Math.random() * 1000000);
        setCustomers([
          {
            id: uniqUid,
            name: "",
            tin: "",
            paymentType: "",
            mobile: "",
            amount: firstCustomerAmount,
            items: firstCustomerItems,
          },
        ]);
      }
    }
  }, [items, receiptDialogOpen]);

  const handleItemConfirm = (itemId: number) => {
    onItemStatusChange?.(itemId, "confirmed");
  };

  const handleItemReject = (itemId: number) => {
    onItemStatusChange?.(itemId, "cancelled");
  };

  const handleConfirmAll = () => {
    if (order?.id) {
      onConfirmAll?.(order.id);
    }
  };

  const handleEditOrder = () => {
    if (order) {
      onEditOrder?.(order.id);
    }
  };

  const handleGenerateReceipt = () => {
    setReceiptDialogOpen(true);
  };

  const handleViewReceipts = () => {
    setViewReceiptsDialogOpen(true);
  };

  const handleCustomerChange = (
    id: number,
    field: keyof CustomerReceiptData,
    value: string
  ) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              [field]: value,
            }
          : customer
      )
    );
  };

  const addCustomer = () => {
    setCustomers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: "",
        tin: "",
        paymentType: "",
        mobile: "",
        amount: 0,
        items: [],
      },
    ]);
  };
  const {
    mutateAsync: createSaleTransaction,
    isPending: isLoadingCreateSaleTransaction,
  } = useApiPost(
    ["create-sale-transaction"],
    `/ebm/sales/transaction${
      order && order?.orderCustomers.length > 0 ? "?is_existed_order=true" : ""
    }`
  );
  // Add this function to handle receipt type selection
  const handleReceiptTypeSelect = async (type: string) => {
    setSelectedReceiptType(type);
    try {
      let message = "";
      const customersWithInvalidTIN = [];
      // Check each customer
      for (const customer of customers) {
        const tin = customer.tin?.trim();

        // Only validate if TIN is provided (non-empty)
        if (tin && tin.length > 0) {
          // Check if TIN is exactly 9 digits
          if (!/^\d{9}$/.test(tin)) {
            customersWithInvalidTIN.push(customer);
            message += `The TIN Number of ${customer.name} must be exactly 9 digits when provided\n`;
          }
        }
      }

      // Show error only if there are invalid TINs
      if (customersWithInvalidTIN.length > 0) {
        toast({
          title: "Error",
          description: message,
          variant: "error",
        });
        return;
      }
      const CustNeedPrcd = customers.filter(
        (customer) => customer.tin && !customer.prcOrdCd
      );
      if (CustNeedPrcd) {
        // if some one with tin but not puchase codes
        let purchaseCodeMsg = "";
        const foundCust = [];

        for (const customer of customers) {
          if (customer.tin && !customer.prcOrdCd) {
            foundCust.push(customer.id);
            purchaseCodeMsg += `Please Generate Purchase Codes for \n ${customer.name} \n`;
          }
        }

        console.log(customers);
        if (foundCust.length > 0) {
          toast({
            title: "Error",
            description: purchaseCodeMsg,
            variant: "error",
            duration: 3000,
          });
          return;
        }
      }
      await createSaleTransaction({
        customer: customers,
        salesTyCd: type,
        orderId: order?.id,
      });
      setReceiptTypeDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get-order-details"] });
      toast({
        title: "Transaction Created Successfully",
        description: "The transaction has been created successfully.",
        duration: 3000,
        variant: "success",
      });
      setReceiptDialogOpen(false);
      LocalStorage.setItem("latestReceipt", { receiptType: type });
      if (type === "NS" || type === "TS") {
        LocalStorage.setItem("CurrentCopy", { status: 201, type: type });
      }
      router.push(
        `/dashboard/bar/manager/orders?uh8c6sp7sjvn7u4wnp2w=${order?.id}`
      );
    } catch (error) {
      console.log(error);
      const Error = error as TypeError;
      toast({
        title: "Error Creating Receipt Transaction",
        description:
          Error.message ?? "An error occurred while creating the transaction.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  // Modify your existing handleSubmitReceipts to accept type parameter

  const removeCustomer = (id: number) => {
    if (customers.length <= 1) return;

    const customerToRemove = customers.find((c) => c.id === id);
    if (!customerToRemove) return;

    // Find the first customer (with id from original first position)
    const firstCustomer = customers.find((c) => c.id === customers[0].id);
    if (!firstCustomer || firstCustomer.id === id) return; // Can't remove the first customer if it has items

    // Create updated customers array
    const updatedCustomers = customers.filter((customer) => customer.id !== id);

    if (customerToRemove.items.length > 0) {
      // Return items to the first customer
      const firstCustomerIndex = updatedCustomers.findIndex(
        (c) => c.id === firstCustomer.id
      );
      if (firstCustomerIndex >= 0) {
        const returnedItems = [...updatedCustomers[firstCustomerIndex].items];

        customerToRemove.items.forEach((removedItem) => {
          const existingItemIndex = returnedItems.findIndex(
            (item) => item.productId === removedItem.productId
          );

          if (existingItemIndex >= 0) {
            returnedItems[existingItemIndex] = {
              ...returnedItems[existingItemIndex],
              quantity:
                returnedItems[existingItemIndex].quantity +
                removedItem.quantity,
              total: returnedItems[existingItemIndex].total + removedItem.total,
            };
          } else {
            returnedItems.push({ ...removedItem });
          }
        });

        const firstCustomerAmount = returnedItems.reduce(
          (sum, item) => sum + item.total,
          0
        );

        updatedCustomers[firstCustomerIndex] = {
          ...updatedCustomers[firstCustomerIndex],
          items: returnedItems,
          amount: firstCustomerAmount,
        };
      }
    }

    setCustomers(updatedCustomers);
  };

  // Move items between customers
  const moveItemToCustomer = (
    fromCustomerId: number,
    toCustomerId: number,
    productId: number,
    quantity: number
  ) => {
    if (quantity <= 0) return;

    setCustomers((prev) =>
      prev.map((customer) => {
        // Remove from source customer
        if (customer.id === fromCustomerId) {
          const itemIndex = customer.items.findIndex(
            (item) => item.productId === productId
          );
          if (itemIndex === -1) return customer;

          const updatedItems = [...customer.items];
          const currentItem = updatedItems[itemIndex];

          if (currentItem.quantity < quantity) return customer; // Not enough quantity

          if (currentItem.quantity === quantity) {
            // Remove item entirely
            updatedItems.splice(itemIndex, 1);
          } else {
            // Reduce quantity
            updatedItems[itemIndex] = {
              ...currentItem,
              itemCd: currentItem.itemCd,
              quantity: currentItem.quantity - quantity,
              total: currentItem.price * (currentItem.quantity - quantity),
            };
          }

          const newAmount = updatedItems.reduce(
            (sum, item) => sum + item.total,
            0
          );

          return {
            ...customer,
            items: updatedItems,
            amount: newAmount,
          };
        }

        // Add to target customer
        if (customer.id === toCustomerId) {
          const product = items.find((item) => item.product.id === productId);
          if (!product) return customer;

          const itemIndex = customer.items.findIndex(
            (item) => item.productId === productId
          );
          const updatedItems = [...customer.items];

          if (itemIndex >= 0) {
            // Item exists, increase quantity
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity: updatedItems[itemIndex].quantity + quantity,
              total:
                updatedItems[itemIndex].price *
                (updatedItems[itemIndex].quantity + quantity),
            };
          } else {
            // Add new item
            updatedItems.push({
              productId: product.product.id,
              productName: product.product.name,
              itemCd: product.product.itemCd,
              quantity,
              price: product.product.price,
              total: product.product.price * quantity,
            });
          }

          const newAmount = updatedItems.reduce(
            (sum, item) => sum + item.total,
            0
          );

          return {
            ...customer,
            items: updatedItems,
            amount: newAmount,
          };
        }

        return customer;
      })
    );
  };

  // Check if all items are already confirmed (for UI state)
  const allItemsConfirmed =
    items.length > 0 &&
    items.every((item) => item.status?.toLowerCase() === "confirmed");

  const totalOrderAmount = items
    .filter((item) => item.status !== "CANCELLED")
    .reduce((total, item) => total + (item.product?.discount && item.product.discount !== null ? item.product.price * (1 - item.product.discount.rate / 100) : item.product.price) * item.quantity, 0);

  const { mutateAsync: updateStatus, isPending: isPendingConfirm } = useApiPut(
    ["orders"],
    `/bar/orders/status`
  );

  const handleUpdateStatus = async (
    orderId: string,
    status: OrderStatusType
  ) => {
    try {
      if (order?.orderItems?.some((itm) => itm.status === "PENDING")) {
        const pending = order.orderItems.filter(
          (item) => item.status === "PENDING"
        );
        let message = "";

        for (let index = 0; index < pending.length; index++) {
          message += `Please Confirm Or Reject this Item \n 1. ${pending[index].product?.name} \n Before Confirm Orders.\n`;
        }

        toast({
          title: "Error",
          description: `${message}`,
          variant: "error",
        });
        return;
      }
      await updateStatus({ orderId, status });
      queryClient.invalidateQueries({ queryKey: ["get-order-details"] });
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
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          onOpenChange(false);
          router.push("/dashboard/bar/manager/orders");
        }}
      >
        <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 bg-muted/50 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-xl">
                    Order {order?.orderName ?? order?.id ?? "—"}
                  </DialogTitle>
                  {order?.status && (
                    <Badge
                      variant={getStatusVariant(order.status.toLowerCase())}
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  )}
                  {/* {hasGeneratedReceipts && (
                    <Badge variant="secondary" className="text-xs bg-green-100">
                      <FileText className="h-3 w-3 mr-1" />
                      Receipts Generated 0
                    </Badge>
                  )} */}
                </div>
                <DialogDescription className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{order?.distributor}</span>
                  </span>

                  {order?.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(order.createdAt)}</span>
                    </span>
                  )}
                </DialogDescription>
              </div>

              {/* Header Actions */}
              <div className="flex gap-2">
                {onEditOrder && order?.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditOrder}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Order
                  </Button>
                )}

                {onConfirmAll &&
                  items.length > 0 &&
                  order?.status === "PENDING" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleConfirmAll}
                      disabled={allItemsConfirmed}
                      className="gap-2 bg-green-600 hover:bg-green-700 mr-5"
                    >
                      {loadingButton && loadingButton.itemId === null ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="">Loading...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          {allItemsConfirmed ? "All Confirmed" : "Confirm All"}
                        </>
                      )}
                    </Button>
                  )}
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden px-6 py-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 pb-4">
                {/* Customers List */}
                {isLoading ? (
                  <>
                    <div className="flex justify-center items-center py-12">
                      <LoadingSpinner size="lg" />
                      <span className="ml-3 text-lg">Loading...</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {items.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No items in this order
                      </div>
                    ) : (
                      items.map((item, idx) => (
                        <div
                          key={item.id ?? idx}
                          className="flex gap-4 p-3 rounded-lg border"
                        >
                          {/* Product Image */}
                          {item.product.image && (
                            <div className="flex-shrink-0">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                                crossOrigin="anonymous"
                              />
                            </div>
                          )}

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h4 className="font-semibold text-sm truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {item.product.description !== null
                                    ? item.product.description
                                    : item.product.beverageCategoryType}
                                </p>
                                {item.product.beverageSize && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {item.beverageType}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {item.product.beverageSize}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Left Stock: {item.product.currentStock}
                                    </span>
                                    {item.status && (
                                      <Badge
                                        variant={getStatusVariant(item.status)}
                                        className="text-xs"
                                      >
                                        {item.status}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="text-right space-y-1 ml-4">
                                {order?.status === "COMPLETED" && (
                                  <>
                                    {item.status === "CANCELLED" ? (
                                      <Badge variant="destructive">
                                        {item.status.toLocaleLowerCase()}
                                      </Badge>
                                    ) : (
                                      <Badge variant="default">
                                        {item.status.toLocaleLowerCase()}
                                      </Badge>
                                    )}
                                  </>
                                )}
                                <div className="text-sm font-medium">
                                  {formatMoney(
                                    (item.product.discount&& item.product.discount !== null ? item.product.price * (1 - item.product.discount.rate / 100) : item.product.price) * item.quantity
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
  {item.product.discount && item.product.discount.rate > 0 ? (
    <div className="flex items-center gap-1">
      <span className="font-medium">
        {item.quantity} × {(item.product.price * (1 - item.product.discount.rate / 100)).toFixed(2)} Rwf
      </span>
      <span className="text-muted-foreground/70 line-through text-[11px]">
        {(item.quantity * item.product.price).toFixed(2)}
      </span>
      <Badge variant="outline" className="h-3.5 px-1 text-[9px] border-red-200 text-red-600 bg-red-50">
        {item.product.discount.rate}% off
      </Badge>
    </div>
  ) : (
    <span className="font-medium">
      {item.quantity} × {formatMoney(item.product.price)}
    </span>
  )}
</div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {onItemStatusChange &&
                              order?.status !== "COMPLETED" && (
                                <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleItemReject(item.id)}
                                    disabled={
                                      item.status?.toLowerCase() ===
                                        "cancelled" ||
                                      order?.status !== "PENDING"
                                    }
                                    className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:cursor-not-allowed"
                                  >
                                    {loadingButton &&
                                    loadingButton.itemId === item.id &&
                                    loadingButton.status === "cancelled" ? (
                                      <>
                                        <>
                                          <LoadingSpinner size="sm" />
                                          <span className="">Loading...</span>
                                        </>
                                      </>
                                    ) : (
                                      <>
                                        <XIcon className="h-3 w-3 mr-1" />
                                        {item.status?.toLowerCase() ===
                                        "cancelled"
                                          ? "Rejected"
                                          : "Reject"}
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleItemConfirm(item.id)}
                                    disabled={
                                      item.status?.toLowerCase() ===
                                        "confirmed" ||
                                      order?.status !== "PENDING"
                                    }
                                    className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white disabled:cursor-not-allowed"
                                  >
                                    {loadingButton &&
                                    loadingButton.itemId === item.id &&
                                    loadingButton.status === "confirmed" ? (
                                      <>
                                        <LoadingSpinner size="sm" /> loading
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        {item.status?.toLowerCase() ===
                                        "confirmed"
                                          ? "Confirmed"
                                          : "Confirm"}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Footer with Totals */}
          <div className="px-6 py-4 border-t bg-muted/25">
            <div className="space-y-4">
              <Separator />

              {/* Summary */}
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Items: </span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Amount: </span>
                  <span className="font-medium">
                    {formatMoney(totalOrderAmount)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <DialogFooter className="!justify-between !items-center mt-4">
                <div className="text-xs text-muted-foreground">
                  Order ID: {order?.id}
                </div>

                <div className="flex gap-2">
                  {/* View/Print Existing Receipts Buttons */}
                  {order?.status === "COMPLETED" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/dashboard/bar/manager/orders?uh8c6sp7sjvn7u4wnp2w=${order.id}`
                          )
                        }
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Receipts
                      </Button>
                    </>
                  )}
                  {order?.status !== "COMPLETED" &&
                    order?.orderItems.some(
                      (item) => item.status === "CONFIRMED"
                    ) && (
                      <Button
                        variant="default"
                        onClick={() =>
                          handleUpdateStatus(order.id.toString(), "COMPLETED")
                        }
                        className="gap-2 cursor-pointer disabled:cursor-not-allowed"
                        disabled={items.length === 0 || isPendingConfirm}
                      >
                        {isPendingConfirm ? (
                          <>
                            <LoadingSpinner size="sm" /> Confirming Order ...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Confirm Order And Start Generate Invoice
                          </>
                        )}
                      </Button>
                    )}

                  {/* Generate Receipt Button */}
                  {order?.status === "COMPLETED" && (
                    <Button
                      variant="outline"
                      onClick={handleGenerateReceipt}
                      className="gap-2"
                      disabled={items.length === 0}
                    >
                      <Receipt className="h-4 w-4" />
                      Create More Receipts
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      router.push("/dashboard/bar/manager/orders");
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Generation Dialog */}
      {order?.status === "COMPLETED" && (
        <>
          <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
            <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
              <DialogHeader className="px-6 py-4 border-b shrink-0">
                <DialogTitle>Distribute Items to Customers</DialogTitle>
                <DialogDescription>
                  All items are initially assigned to Customer 1. Add more
                  customers and move items between them as needed. Total order
                  amount: {formatMoney(totalOrderAmount)}
                </DialogDescription>
              </DialogHeader>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-hidden px-6 py-4">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-6 pb-4">
                    {/* Customers List */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Customers</h3>
                        <Button
                          variant="outline"
                          onClick={addCustomer}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Customer
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        {customers.map((customer, index) => (
                          <div
                            key={customer.id}
                            className="p-4 border rounded-lg space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold">
                                  Customer {index + 1}
                                </h4>
                                {index === 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    Default (All Items)
                                  </Badge>
                                )}
                              </div>
                              {index > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeCustomer(customer.id)}
                                  className="h-8 w-8 p-0 text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${customer.id}`}>
                                  Customer Name *
                                </Label>
                                <Input
                                  id={`name-${customer.id}`}
                                  value={customer.name}
                                  onChange={(e) =>
                                    handleCustomerChange(
                                      customer.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter customer name"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`mobile-${customer.id}`}>
                                  Mobile Number
                                </Label>
                                <Input
                                  id={`mobile-${customer.id}`}
                                  value={customer.mobile}
                                  min={customer.mobile ? 10 : 0}
                                  max={customer.mobile ? 10 : 0}
                                  onChange={(e) =>
                                    handleCustomerChange(
                                      customer.id,
                                      "mobile",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter mobile number"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`tin-${customer.id}`}>
                                  TIN Number
                                </Label>
                                <Input
                                  id={`tin-${customer.id}`}
                                  value={customer.tin}
                                  min={customer.tin ? 9 : 0}
                                  max={customer.tin ? 9 : 0}
                                  onChange={(e) =>
                                    handleCustomerChange(
                                      customer.id,
                                      "tin",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter TIN number"
                                />
                              </div>

                              {/* Payment Type Select Field */}
                              <div className="space-y-2">
                                <Label htmlFor={`paymentType-${customer.id}`}>
                                  Payment Type *
                                </Label>
                                <Select
                                  value={customer.paymentType}
                                  onValueChange={(value) =>
                                    handleCustomerChange(
                                      customer.id,
                                      "paymentType",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    id={`paymentType-${customer.id}`}
                                  >
                                    <SelectValue placeholder="Select payment type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(paymentTypes as any)?.map((type: any) => (
                                      <SelectItem key={type.cd} value={type.cd}>
                                        {type.cdNm}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Customer Items */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label className="font-medium">
                                  Items for this customer:
                                </Label>
                                <span className="font-medium">
                                  {formatMoney(customer.amount)}
                                </span>
                              </div>

                              {customer.items.length > 0 ? (
                                <div className="space-y-2">
                                  {customer.items.map((item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">
                                          {item.productName}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {formatMoney(item.price)} each
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                          {index === 0 &&
                                          customers.length > 1 ? (
                                            // First customer - can distribute to others (only show when multiple customers exist)
                                            <div className="flex flex-wrap gap-1">
                                              {customers
                                                .slice(1)
                                                .map((otherCustomer) => (
                                                  <Button
                                                    key={otherCustomer.id}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      moveItemToCustomer(
                                                        customer.id,
                                                        otherCustomer.id,
                                                        item.productId,
                                                        1
                                                      )
                                                    }
                                                    className="h-7 px-2 text-xs"
                                                    disabled={
                                                      item.quantity <= 0
                                                    }
                                                  >
                                                    Move 1 to C
                                                    {otherCustomer.id}
                                                  </Button>
                                                ))}
                                            </div>
                                          ) : (
                                            // Other customers - can return to first customer (only show when multiple customers exist)
                                            customers.length > 1 && (
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    moveItemToCustomer(
                                                      customer.id,
                                                      customers
                                                        ? customers[0].id
                                                        : 1,
                                                      item.productId,
                                                      1
                                                    )
                                                  }
                                                  className="h-7 px-2 text-xs"
                                                  disabled={item.quantity <= 0}
                                                >
                                                  Return 1
                                                </Button>
                                              </div>
                                            )
                                          )}

                                          <div className="flex items-center gap-2 ml-2">
                                            <span className="text-sm font-medium min-w-[80px] text-right">
                                              {item.quantity} ×{" "}
                                              {formatMoney(item.total)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-muted-foreground border rounded">
                                  No items assigned yet
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Fixed Footer */}
              <div className="border-t bg-background px-6 py-4 shrink-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Total Distributed:{" "}
                    {formatMoney(
                      customers.reduce(
                        (sum, customer) => sum + customer.amount,
                        0
                      )
                    )}{" "}
                    / {formatMoney(totalOrderAmount)}
                    {customers.length > 0 && (
                      <span className="ml-2 text-green-600">
                        • {customers.filter((c) => c.items.length > 0).length}{" "}
                        customer(s) with items
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReceiptDialogOpen(false);
                        setCustomers([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setReceiptTypeDialogOpen(true)}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      disabled={
                        customers.length === 0 ||
                        !customers.every(
                          (c) =>
                            c.name.trim() && c.items.length > 0 && c.paymentType
                        )
                      }
                    >
                      <Printer className="h-4 w-4" />
                      Generate Receipts
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      {/* // Alternative with Select component */}
      {/* <Dialog
        open={receiptTypeDialogOpen}
        onOpenChange={setReceiptTypeDialogOpen}
      >
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Select Receipt Type</DialogTitle>
            <DialogDescription>
              Choose the type of receipt you want to generate
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Select
              value={selectedReceiptType}
              onValueChange={setSelectedReceiptType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select receipt type" />
              </SelectTrigger>
              <SelectContent>
                {TransactionTypeCodeClassification.filter(
                  (rec) => rec.code !== "NR" && rec.code !== "TR"
                )?.map((transaction) => (
                  <SelectItem key={transaction.code} value={transaction.code}>
                    {transaction.codeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReceiptTypeDialogOpen(false)}
              disabled={isLoadingCreateSaleTransaction}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReceiptTypeSelect(selectedReceiptType)}
              disabled={!selectedReceiptType || isLoadingCreateSaleTransaction}
            >
              {isLoadingCreateSaleTransaction ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating
                </>
              ) : (
                "Generate Receipt"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <Dialog
        open={receiptTypeDialogOpen}
        onOpenChange={setReceiptTypeDialogOpen}
      >
        <DialogContent className="w-full max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Customer Receipt Setup
            </DialogTitle>
            <DialogDescription className="text-sm">
              Add purchase codes and select receipt type
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Compact Customer Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Customers</Label>
                <Badge variant="secondary" className="text-xs">
                  {customers?.filter(
                    (customer) => customer.tin && !customer.prcOrdCd
                  )?.length ?? ""}
                </Badge>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {customers
                  .filter((customer) => customer?.tin?.trim())
                  ?.map((customer) => (
                    <div key={customer.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {customer.name}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            {customer.tin && <span>TIN: {customer.tin}</span>}
                            {customer.mobile && (
                              <span>TEL: {customer.mobile}</span>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          #{customer.id}
                        </Badge>
                      </div>

                      <Input
                        placeholder="Purchase code"
                        value={customer.prcOrdCd || ""}
                        onChange={(e) => {
                          setCustomers(
                            customers.map((c) =>
                              c.id === customer.id
                                ? { ...c, prcOrdCd: e.target.value }
                                : c
                            )
                          );
                        }}
                        className="h-8 text-md"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Receipt Type in a Card */}
            <div className="border rounded p-3 bg-gray-50">
              <Label className="text-sm font-medium mb-2 block">
                Receipt Configuration
              </Label>
              <Select
                value={selectedReceiptType}
                onValueChange={setSelectedReceiptType}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Choose receipt type" />
                </SelectTrigger>
                <SelectContent>
                  {TransactionTypeCodeClassification.filter(
                    (rec) => rec.code !== "NR" && rec.code !== "TR"
                  )?.map((transaction) => (
                    <SelectItem key={transaction.code} value={transaction.code}>
                      {transaction.codeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setReceiptTypeDialogOpen(false)}
              disabled={isLoadingCreateSaleTransaction}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReceiptTypeSelect(selectedReceiptType)}
              disabled={!selectedReceiptType || isLoadingCreateSaleTransaction}
              size="sm"
            >
              {isLoadingCreateSaleTransaction ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                "Generate Receipts"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrderDetailsDialog;
