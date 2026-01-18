// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Package, DollarSign, Percent, Hash } from "lucide-react";
// import { PurchaseSalesTransactionItem } from "@/components/data-table/purchases-items-columna";
// import Select from "react-select";

// interface ItemsDialogProps {
//   items: PurchaseSalesTransactionItem[];
//   trigger: React.ReactNode;
//   transactionId: number;
//   totalItems: number;
//   products: Product[];
//   onUpdate: (items: PurchaseSalesTransactionItem[]) => void;
// }

// export function ItemsDialog({
//   items,
//   trigger,
//   transactionId,
//   totalItems,
//   products,
//   onUpdate,
// }: ItemsDialogProps) {

//   const options = products.map((va) => {
//     return { label: va.name, value: va.itemCd };
//   });
//   return (
//     <Dialog>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>
//       <DialogContent className="max-w-4xl max-h-[80vh]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Package className="h-5 w-5" />
//             Transaction #{transactionId} - Items ({totalItems})
//           </DialogTitle>
//           <DialogDescription>
//             Detailed view of all items in this transaction
//           </DialogDescription>
//         </DialogHeader>

//         <ScrollArea className="h-[60vh] pr-4">
//           <div className="space-y-4">
//             {items.map((item, index) => (
//               <div key={item.id || index} className="border rounded-lg p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <h3 className="font-semibold text-lg">
//                       {item.itemNm || `Item ${item.itemSeq}`}
//                     </h3>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       <Badge variant="outline">
//                         <Hash className="h-3 w-3 mr-1" />
//                         Seq: {item.itemSeq}
//                       </Badge>
//                       <Badge variant="outline">Code: {item.itemCd}</Badge>
//                       <Badge variant="outline">Class: {item.itemClsCd}</Badge>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold">
//                       {item.totAmt?.toLocaleString("en-US")} RWF
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       {item.qty} × {item.prc?.toLocaleString("en-US")} RWF
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="text-sm font-medium">Quantity:</div>
//                       <div className="text-sm">
//                         {item.qty} {item.qtyUnitCd}
//                       </div>

//                       <div className="text-sm font-medium">Package:</div>
//                       <div className="text-sm">
//                         {item.pkg} {item.pkgUnitCd}
//                       </div>

//                       <div className="text-sm font-medium">Unit Price:</div>
//                       <div className="text-sm">
//                         {item.prc?.toLocaleString("en-US")} RWF
//                       </div>

//                       <div className="text-sm font-medium">Supply Amount:</div>
//                       <div className="text-sm">
//                         {item.splyAmt?.toLocaleString("en-US")} RWF
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="text-sm font-medium">Tax Type:</div>
//                       <div className="text-sm">
//                         <Badge
//                           variant={
//                             item.taxTyCd === "A" ? "default" : "secondary"
//                           }
//                         >
//                           Type {item.taxTyCd}
//                         </Badge>
//                       </div>

//                       <div className="text-sm font-medium">Taxable Amount:</div>
//                       <div className="text-sm">
//                         {item.taxblAmt?.toLocaleString("en-US")} RWF
//                       </div>

//                       <div className="text-sm font-medium">Tax Amount:</div>
//                       <div className="text-sm">
//                         {item.taxAmt?.toLocaleString("en-US")} RWF
//                       </div>

//                       <div className="text-sm font-medium">Discount:</div>
//                       <div className="text-sm">
//                         {item.dcRt}% ({item.dcAmt?.toLocaleString("en-US")} RWF)
//                       </div>
//                     </div>

//                     {item.bcd && (
//                       <div className="mt-2 p-2 bg-muted rounded">
//                         <div className="text-xs font-semibold">Barcode:</div>
//                         <div className="font-mono text-sm">{item.bcd}</div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-4 border-t">
//                   <div className="flex justify-between items-center">
//                     <div className="text-sm text-muted-foreground">
//                       Item ID: {item.id}
//                     </div>
//                      Map to
//                     <div className="text-sm text-muted-foreground">
//                       <Select
//                       className="w-full"
//                       options={options} />
//                     </div>
//                     <div className="text-sm font-semibold">
//                       Total: {item.totAmt?.toLocaleString("en-US")} RWF
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//         <div className="border-t pt-4">
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-muted-foreground">
//               Total Items: {totalItems}
//             </div>
//             <div className="text-lg font-bold">
//               Transaction Total:{" "}
//               {items
//                 .reduce((sum, item) => sum + (item.totAmt || 0), 0)
//                 .toLocaleString("en-US")}{" "}
//               RWF
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

  "use client";

  import { useState, useEffect } from "react";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Badge } from "@/components/ui/badge";
  import {
    Package,
    DollarSign,
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
  import { PurchaseSalesTransactionItem } from "@/components/data-table/purchases-items-columna";
  import Select from "react-select";
  import { Separator } from "@/components/ui/separator";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { cn } from "@/lib/utils";
  import { LoadingSpinner } from "@/components/ui/loading-spinner";

  interface ItemsDialogProps {
    items: PurchaseSalesTransactionItem[];
    trigger: React.ReactNode;
    transactionId: number;
    totalItems: number;
    products: Product[];
    onUpdate: (
      items: (PurchaseSalesTransactionItem & { mappedProductId: string })[]
    ) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading?: boolean;
  }

  interface ProductMapping {
    itemCd: string;
    productId: string;
  }

  export function ItemsDialog({
    items,
    trigger,
    transactionId,
    totalItems,
    products,
    onUpdate,
    open,
    onOpenChange,
    isLoading = false,
  }: ItemsDialogProps) {
    const [selectedItems, setSelectedItems] =
      useState<PurchaseSalesTransactionItem[]>(items);
    const [productMappings, setProductMappings] = useState<ProductMapping[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
      setSelectedItems(items);
      // Initialize mappings from existing items
      const initialMappings = items.map((item) => ({
        itemCd: item.itemCd || "",
        productId: item.itemCd ?? "", // Default to same itemCd
      }));
      setProductMappings(initialMappings);
    }, [items]);

    const productOptions = products
      ?.filter((p) => p.itemCd !== null && p.itemTyCd !== "3")
      .map((product) => ({
        label: `${product.name} (${product.itemCd})`,
        value: product.itemCd,
        data: product,
      }));

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

    const handleConfirm = () => {
      // Update items with mapped product IDs
      const updatedItems = selectedItems.map((item) => {
        const mapping = productMappings.find((m) => m.itemCd === item.itemCd);
        return {
          ...item,
          mappedProductId: mapping?.productId || item.itemCd,
        };
      });

      onUpdate(
        updatedItems as (PurchaseSalesTransactionItem & {
          mappedProductId: string;
        })[]
      );
      setIsDirty(false);
    };

    const calculateSummary = () => {
      const totalAmount = selectedItems.reduce(
        (sum, item) => sum + (item.totAmt || 0),
        0
      );
      const totalTax = selectedItems.reduce(
        (sum, item) => sum + (item.taxAmt || 0),
        0
      );
      const totalDiscount = selectedItems.reduce(
        (sum, item) => sum + (item.dcAmt || 0),
        0
      );
      const totalQuantity = selectedItems.reduce(
        (sum, item) => sum + (item.qty || 0),
        0
      );

      return {
        totalAmount,
        totalTax,
        totalDiscount,
        totalQuantity,
        netAmount: totalAmount - totalDiscount,
      };
    };

    const summary = calculateSummary();

    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
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
                      Transaction #{transactionId}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {totalItems} items
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
                  <ScrollArea className="h-[calc(120vh-16rem)]">
                    <div className="space-y-4 p-6">
                      {selectedItems.map((item, index) => {
                        const mapping = productMappings.find(
                          (m) => m.itemCd === item.itemCd
                        );
                        const selectedProduct = mapping
                          ? productOptions.find(
                              (opt) => opt.value === mapping.productId
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
                                  {item.qty} × {item.prc?.toLocaleString("en-US")}{" "}
                                  RWF
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
                            <Badge variant="secondary">{totalItems}</Badge>
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
                                {summary.totalAmount.toLocaleString("en-US")} RWF
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
                              {
                                productMappings.filter(
                                  (m) => m.productId !== m.itemCd
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Unmapped:</span>
                            <span className="font-medium text-amber-600">
                              {
                                productMappings.filter(
                                  (m) => m.productId === m.itemCd
                                ).length
                              }
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
                    onClick={() => setIsDirty(false)}
                    disabled={!isDirty}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset Changes
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!isDirty}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" /> mapping ...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm Mapping
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
