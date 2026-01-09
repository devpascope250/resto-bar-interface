"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  Plus,
  AlertTriangle,
  Receipt,
  MoreHorizontal,
} from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import {
  Select as SelectInput,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useApi } from "@/hooks/api-hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SalesTransaction } from "@/types/SalesTransaction";
import { DateUtils } from "@/lib/date-utils";
import Select from "react-select";
import {
  PaymentMethodCodeClassification,
  TransactionTypeCodeClassification,
} from "@/lib/codeDefinitions";
import ReceiptBody from "../Receipts/ReceiptBody";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalStorage } from "@/lib/local-storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { AmountFormat } from "@/lib/AmountFormat";
interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: DisplayOrder | null;
  isLoading?: boolean;
}

interface ReceiptTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  refundReason: string;
  onRefundReasonChange: (reason: string) => void;
  refundOptions: Array<{ label: string; value: string }>;
  isLoadingRefundOptions: boolean;
  onGenerate: () => void;
  isGenerating: boolean;
  orderCustomer: Array<{
    id: number;
    name: string;
    tin?: string;
    mobile?: string;
  }>;
  OnselectedCustomerOrders: (
    customers: Array<{ id: number; tin: string; purchaseCode: string }>
  ) => void;
}

interface ReceiptCardProps {
  receipt: SalesTransaction;
  index: number;
  onPrint: (id: string) => void;
}

const ReceiptTypeDialog: React.FC<ReceiptTypeDialogProps> = ({
  open,
  onOpenChange,
  selectedType,
  onTypeChange,
  refundReason,
  onRefundReasonChange,
  refundOptions,
  isLoadingRefundOptions,
  onGenerate,
  isGenerating,
  orderCustomer,
  OnselectedCustomerOrders,
}) => {
  const isRefundType = selectedType === "NR" || selectedType === "TR";
  const isCopyType = ["NS", "TS", "PS"].includes(selectedType);
  const [customers, setCustomers] = React.useState<
    Array<{ id: number; tin: string; purchaseCode: string }>
  >([]);

  React.useEffect(() => {
    if (orderCustomer && orderCustomer.length > 0) {
      setCustomers(
        orderCustomer?.map((customer) => ({
          id: customer.id,
          tin: customer.tin ?? "",
          purchaseCode: "",
        }))
      );
    }
  }, [orderCustomer]);

  const handleSelectPurchaseCode = (value: string, customerId: number) => {
    setCustomers(
      customers.map((c) =>
        c.id === customerId ? { ...c, purchaseCode: value } : c
      )
    );

    OnselectedCustomerOrders(
      customers.map((c) =>
        c.id === customerId ? { ...c, purchaseCode: value } : c
      )
    );
  };
  const receptErrorCode = LocalStorage.getItem("ReceiptErrorCode");

  const handleCloseMd = () => {
    onOpenChange(false);
    LocalStorage.removeItem("ReceiptErrorCode"); 
  }

  // console.log( !selectedType ||
  //             isGenerating ||
  //             (isRefundType && (!refundReason.trim() && (Number(receptErrorCode) === 404))) 
              // ||
              // (customers.some((c) => !c.purchaseCode.trim())
              //  &&
              //   (Number(receptErrorCode) === 404 &&
              //   selectedType !== "NS" &&
              //   selectedType !== "TS" &&
              //   selectedType !== "PS" &&
              //   selectedType !== "" &&
              //   selectedType !== undefined)
              // )
              // );
  console.log(Number(receptErrorCode) === 404);

  console.log(orderCustomer);
  
  
  return (
    <Dialog open={open} onOpenChange={handleCloseMd}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <DialogTitle>Generate New Receipt</DialogTitle>
          </div>
          <DialogDescription>
            Select the type of receipt you want to generate
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <div className="gap-3">
              <Label>Receipt Type</Label>
            </div>
            <SelectInput value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select receipt type" />
              </SelectTrigger>
              <SelectContent>
                {TransactionTypeCodeClassification?.map((transaction) => (
                  <SelectItem key={transaction.code} value={transaction.code}>
                    <div className="flex items-center gap-2">
                      <span>{transaction.code}</span>
                      <span className="text-muted-foreground">
                        - {transaction.codeName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectInput>
          </div>

          {selectedType !== "NS" &&
          selectedType !== "TS" &&
          selectedType !== "PS" &&
          selectedType !== "" &&
          selectedType !== undefined ? (
            <div>
              {Number(receptErrorCode) === 404 ? (
                <div>
                  {
                    // loop all customer and with purchase code field when customer has tin
                    orderCustomer &&
                      orderCustomer.length > 0 &&
                      orderCustomer.map((customer, index) => (
                        <div key={index}>
                          {customer.tin && (
                            <div
                              key={customer.id}
                              className="border rounded p-3"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-sm truncate">
                                    {customer.name}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    {customer.tin && (
                                      <span>TIN: {customer.tin}</span>
                                    )}
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
                                value={
                                  customers.find((c) => c.id === customer.id)
                                    ?.purchaseCode || ""
                                }
                                onChange={(e) =>
                                  handleSelectPurchaseCode(
                                    e.target.value,
                                    customer.id
                                  )
                                }
                                className="h-8 text-md"
                              />
                            </div>
                          )}
                        </div>
                      ))
                  }

                  {isRefundType && (
                    <div className="space-y-2">
                      <Label>Refund Reason</Label>
                      {isLoadingRefundOptions ? (
                        <div className="flex items-center justify-center py-4">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2 text-sm text-muted-foreground">
                            Loading reasons...
                          </span>
                        </div>
                      ) : (
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select refund reason"
                          value={refundOptions?.find(
                            (v) => v.value === refundReason
                          )}
                          onChange={(v) => onRefundReasonChange(v?.value ?? "")}
                          options={refundOptions}
                          isSearchable
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}

          {isCopyType && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800">
                    Duplicate Receipt
                  </p>
                  <p className="text-sm text-amber-700">
                    This will create a new receipt by copying data from the
                    existing invoice.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Type Description:</p>
            <p>
              {TransactionTypeCodeClassification.find(
                (t) => t.code === selectedType
              )?.codeName || "Select a type to see description"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={onGenerate}
            disabled={!selectedType ||
              isGenerating ||
              (isRefundType && (!refundReason.trim() && (Number(receptErrorCode) === 404))) 
            }
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating...
              </>
            ) : (
              "Generate Receipt"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  index,
  onPrint,
}) => {
  const formatMoney = (n?: number) =>
    typeof n === "number" ? `${n.toFixed(2)} Rwf` : "-";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = DateUtils.parse(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const paymentMethod =
    PaymentMethodCodeClassification.find(
      (code) => code.code === receipt.pmtTyCd
    )?.codeName || "Unknown";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              Receipt #{receipt.invcNo}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Customer: {receipt.custNm}
            </p>
          </div>
          <Badge
            variant={
              receipt.rcptTyCd === "S"
                ? "default"
                : receipt.rcptTyCd === "R"
                ? "destructive"
                : "outline"
            }
          >
            {TransactionTypeCodeClassification.find(
              (name) => name.code === receipt.salesTyCd + receipt.rcptTyCd
            )?.codeName || receipt.rcptTyCd}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Date & Time</p>
            <p className="text-muted-foreground">{formatDate(receipt.cfmDt)}</p>
          </div>
          <div>
            <p className="font-medium">Payment Method</p>
            <p className="text-muted-foreground">{paymentMethod}</p>
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Items ({receipt.itemList.length})</p>
            <p className="font-bold text-lg">{AmountFormat(receipt.totAmt.toString())}</p>
          </div>
          <ScrollArea className="h-32 pr-4">
            {receipt.itemList.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between items-center py-2 px-3 rounded-md hover:bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.itemNm}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.qty} × {AmountFormat(item.prc.toString())}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">
                    {AmountFormat((item.totAmt).toString())}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Tax {item.taxTyCd}
                  </Badge>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="p-0 cursor-pointer">
                {/* <span className="sr-only">Open menu</span> */}
                <Printer className="h-3 w-3" />
                Print
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => onPrint(`POS`)}
              >
                <Printer className="h-4 w-4" />
                POS Print
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => onPrint(`A4`)}
              >
                <Printer className="h-4 w-4" />
                A4 Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3 w-3" />
            Download
          </Button>
          <Button variant="ghost" size="sm">
            View Details
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export function ViewInvoiceDialog({
  onOpenChange,
  open,
  order,
  isLoading: orderLoading,
}: OrderDetailsDialogProps) {
  const { toast } = useToast();
  const { useApiQuery, api } = useApi();
  // console.log(order);

  const [genInvc, setGenInc] = React.useState<{
    status: number;
    data: SalesTransaction[];
  } | null>(null);
  const [receiptTypeDialogOpen, setReceiptTypeDialogOpen] =
    React.useState(false);
  const [selectedReceiptType, setSelectedReceiptType] = React.useState("");
  const [selectedCustomerOrders, setSelectedCustomerOrders] = React.useState<
    Array<{ id: number; tin: string; purchaseCode: string }>
  >([]);
  const [refundReason, setRefundReason] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [selectedReceipt, setSelectedReceipt] =
    React.useState<SalesTransaction>();
  const [receiptTYpe, setReceiptTYpe] = React.useState("");
  const [formatTYpe, setFormatTYpe] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("receipts");
  const { data: refundResonCd, isLoading: isLoadingRefundOptions } =
    useApiQuery<Array<{ cd: string; cdNm: string }>>(
      ["refund-reasons"],
      `/ebm/codes/cdClsNm/Refund Reason`,
      {
        staleTime: Infinity,
        placeholderData: keepPreviousData,
        enabled: selectedReceiptType === "NR" || selectedReceiptType === "TR",
      }
    );

  async function GetLatestReceipt(receiptType: string) {
    setIsGenerating(true);
    try {
      if (!order?.id) return null;
      let url = `/ebm/sales/${order?.id}/get-invoice/${receiptType}`;

      if (receiptType === "NR" || receiptType === "TR") {
        url += `?rfdRsnCd=01`;
      }
      const response = await api.post<{
        status: number;
        data: SalesTransaction[];
      } | null>(url, selectedCustomerOrders);

      setGenInc(response);
    } catch (error) {
    } finally {
      setIsGenerating(false);
    }
  }

  React.useEffect(() => {
    const getLatestLocalStorage = LocalStorage.getItem("latestReceipt");
    if (getLatestLocalStorage) {
      const { receiptType } = getLatestLocalStorage;
      GetLatestReceipt(receiptType);
    }
  }, [order]);

  const existedCpCopy = LocalStorage.getItem("CurrentCopy");

  const generateInvoice = async () => {
    LocalStorage.removeItem("ReceiptErrorCode");
    if (!order?.id || !selectedReceiptType) return null;
    setIsGenerating(true);
    try {
      let url = `/ebm/sales/${order.id}/get-invoice/${selectedReceiptType}`;
      if (
        (selectedReceiptType === "NR" || selectedReceiptType === "TR") &&
        refundReason
      ) {
        url += `?rfdRsnCd=${encodeURIComponent(refundReason)}`;
      }
      const response = await api.post<any>(url, selectedCustomerOrders);

      if (!response) {
        throw new Error("Failed to generate invoice");
      }
      LocalStorage.setItem("latestReceipt", {
        receiptType: selectedReceiptType,
      });
      setGenInc(response);
      if (genInvc?.status === 201) {
        toast({
          title: "Success",
          duration: 2000,
          description: `Receipt generated successfully`,
        });
      }
      setReceiptTypeDialogOpen(false);
      LocalStorage.removeItem("latestReceipt");
      LocalStorage.removeItem("CurrentCopy");
      return response;
    } catch (error) {
      
      LocalStorage.setItem("ReceiptErrorCode", "404");
      // console.error("Error generating invoice:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to generate receipt",
        variant: "destructive",
        duration: 2000,
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateReceipt = async () => {
    if (!selectedReceiptType) {
      toast({
        title: "Error",
        description: "Please select a receipt type",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    await generateInvoice();
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedReceiptType("");
      setRefundReason("");
    }
  }, [open]);

  const handlePrint = (
    receipt: SalesTransaction,
    type: string,
    formatType?: string
  ) => {
    if (!receipt) return;
    setSelectedReceipt(receipt);
    setReceiptTYpe(type);
    setFormatTYpe(formatType ?? "");
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const refundResonCdOptions =
    refundResonCd?.map((code) => ({
      label: code.cdNm,
      value: code.cd,
    })) || [];

    console.log(order?.invoices);
    
  return (
    <>
      {/* Main Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <div className="flex flex-col h-full">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Receipt className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p>Invoice Management</p>
                      <DialogDescription className="text-base mt-1">
                        {order?.id ? `Order #${order.id}` : "Order details"}
                      </DialogDescription>
                    </div>
                  </DialogTitle>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {genInvc?.data
                      ? `${genInvc.data.length} receipt(s) generated`
                      : "No receipts"}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="px-6 pt-4 border-b">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="receipts" className="flex-1">
                    <Receipt className="h-4 w-4 mr-2" />
                    Generated Receipts
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="flex-1">
                    Quick Actions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="receipts" className="flex-1 p-0 m-0">
                <ScrollArea className="h-[calc(90vh-200px)] px-6 py-4">
                  {orderLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <LoadingSpinner size="lg" />
                      <span className="ml-3 text-lg">Loading order...</span>
                    </div>
                  ) : isGenerating ? (
                    <div className="flex flex-col justify-center items-center py-12">
                      <LoadingSpinner size="lg" />
                      <span className="mt-3 text-lg">
                        Generating receipt...
                      </span>
                      <p className="text-muted-foreground mt-1">
                        Please wait a moment
                      </p>
                    </div>
                  ) : genInvc?.data?.length ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {genInvc.data.map((receipt, index) => (
                        <ReceiptCard
                          key={`${receipt.invcNo}-${index}`}
                          receipt={receipt}
                          index={index}
                          onPrint={(prtType) => {
                            handlePrint(
                              receipt,
                              receipt.salesTyCd + receipt.rcptTyCd,
                              prtType
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 bg-muted rounded-full mb-4">
                        <Receipt className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No Receipts Generated
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Generate your first receipt to view it here. Click the
                        button below to get started.
                      </p>
                      <Button
                        onClick={() => setReceiptTypeDialogOpen(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Generate First Receipt
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="actions" className="flex-1 p-0 m-0">
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => setReceiptTypeDialogOpen(true)}
                    >
                      <Plus className="h-6 w-6" />
                      <span>Generate New Receipt</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      disabled={!genInvc?.data?.length}
                    >
                      <Printer className="h-6 w-6" />
                      <span>Print All Receipts</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      disabled={!genInvc?.data?.length}
                    >
                      <Download className="h-6 w-6" />
                      <span>Export All</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2">
                      <AlertTriangle className="h-6 w-6" />
                      <span>Report Issue</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="px-6 py-4 border-t bg-muted/50">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => {onOpenChange(false); LocalStorage.removeItem("ReceiptErrorCode");}}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReceiptTypeDialogOpen(true)}
                    className="gap-2"
                    disabled={isGenerating}
                  >
                    <Plus className="h-4 w-4" />
                    Generate Receipt
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {genInvc?.data?.length
                    ? `Last updated: ${new Date().toLocaleTimeString()}`
                    : "Ready to generate receipts"}
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Type Selection Dialog */}
      <ReceiptTypeDialog
        open={receiptTypeDialogOpen}
        orderCustomer={(order?.invoices as any) ?? []}
        onOpenChange={setReceiptTypeDialogOpen}
        selectedType={selectedReceiptType}
        OnselectedCustomerOrders={(orders) => setSelectedCustomerOrders(orders)}
        onTypeChange={setSelectedReceiptType}
        refundReason={refundReason}
        onRefundReasonChange={setRefundReason}
        refundOptions={refundResonCdOptions}
        isLoadingRefundOptions={isLoadingRefundOptions}
        onGenerate={handleGenerateReceipt}
        isGenerating={isGenerating}
      />

      {/* Hidden Print Container */}
      {isPrinting && (
        <div className="print-container hidden">
          <ReceiptBody
            data={{
              type: receiptTYpe as any,
              dt: selectedReceipt,
              status:
                existedCpCopy &&
                (existedCpCopy.type === "NS" || existedCpCopy === "TS")
                  ? 201
                  : genInvc?.status ?? 0,
              formatTYpe,
            }}
          />
        </div>
      )}
    </>
  );
}

export default ViewInvoiceDialog;
