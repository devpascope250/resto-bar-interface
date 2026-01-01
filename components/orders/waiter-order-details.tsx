// "use client";

// import * as React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import {
//   X,
//   Printer,
//   Download,
//   Calendar,
//   User,
//   Check,
//   X as XIcon,
//   Edit,
//   CheckCircle,
//   Receipt,
//   FileText,
//   Plus,
// } from "lucide-react";
// import Image from "next/image";
// import { LoadingSpinner } from "../ui/loading-spinner";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // Updated interfaces
// interface CustomerReceiptData {
//   id: number;
//   name: string;
//   tin?: string;
//   mobile?: string;
//   amount: number;
//   items: Array<{
//     productId: number;
//     productName: string;
//     quantity: number;
//     price: number;
//     total: number;
//   }>;
// }

// interface GeneratedReceipt {
//   id: string;
//   customerName: string;
//   timestamp: string;
//   amount: number;
//   items: CustomerReceiptData['items'];
// }

// interface OrderDetailsDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   order?: OrderDetails | null;
//   isLoading: boolean;
//   onItemStatusChange?: (
//     itemId: number,
//     status: "confirmed" | "cancelled"
//   ) => void;
//   onConfirmAll?: (orderId: number) => void;
//   onEditOrder?: (orderId: number) => void;
//   loadingButton?: { itemId?: number | null; status: "confirmed" | "cancelled" };
//   onGenerateReceipt?: (receiptData: CustomerReceiptData[]) => void;
//   generatedReceipts?: GeneratedReceipt[];
// }

// export function OrderDetailsDialog({
//   open,
//   onOpenChange,
//   order,
//   isLoading,
//   onItemStatusChange,
//   onConfirmAll,
//   onEditOrder,
//   loadingButton,
//   onGenerateReceipt,
//   generatedReceipts = [],
// }: OrderDetailsDialogProps) {
//   const items = order?.orderItems ?? [];
//   const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);
//   const [customers, setCustomers] = React.useState<CustomerReceiptData[]>([]);

//   const formatMoney = (n?: number) =>
//     typeof n === "number" ? n.toFixed(2) + " Rwf" : "-";

//   const formatDate = (dateString?: string) =>
//     dateString
//       ? new Date(dateString).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "-";

//   const getStatusVariant = (status?: string) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "default";
//       case "pending":
//         return "secondary";
//       case "cancelled":
//         return "destructive";
//       default:
//         return "outline";
//     }
//   };

//   // Initialize customers with all items assigned to first customer
//   React.useEffect(() => {
//     if (items.length > 0 && receiptDialogOpen) {
//       const firstCustomerItems = items.map(item => ({
//         productId: item.product.id,
//         productName: item.product.name,
//         quantity: item.quantity,
//         price: item.product.price,
//         total: item.product.price * item.quantity,
//       }));

//       const firstCustomerAmount = firstCustomerItems.reduce((sum, item) => sum + item.total, 0);

//       setCustomers([
//         {
//           id: 1,
//           name: "",
//           tin: "",
//           mobile: "",
//           amount: firstCustomerAmount,
//           items: firstCustomerItems,
//         },
//       ]);
//     }
//   }, [items, receiptDialogOpen]);

//   const handleItemConfirm = (itemId: number) => {
//     onItemStatusChange?.(itemId, "confirmed");
//   };

//   const handleItemReject = (itemId: number) => {
//     onItemStatusChange?.(itemId, "cancelled");
//   };

//   const handleConfirmAll = () => {
//     if (order?.id) {
//       onConfirmAll?.(order.id);
//     }
//   };

//   const handleEditOrder = () => {
//     if (order) {
//       onEditOrder?.(order.id);
//     }
//   };

//   const handleGenerateReceipt = () => {
//     setReceiptDialogOpen(true);
//   };

//   const handleCustomerChange = (id: number, field: keyof CustomerReceiptData, value: string) => {
//     setCustomers(prev =>
//       prev.map(customer =>
//         customer.id === id
//           ? {
//               ...customer,
//               [field]: value,
//             }
//           : customer
//       )
//     );
//   };

//   const addCustomer = () => {
//     setCustomers(prev => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         name: "",
//         tin: "",
//         mobile: "",
//         amount: 0,
//         items: [],
//       },
//     ]);
//   };

//   const removeCustomer = (id: number) => {
//     if (customers.length > 1) {
//       const customerToRemove = customers.find(c => c.id === id);
//       if (customerToRemove && customerToRemove.items.length > 0) {
//         // Return items to first customer
//         const firstCustomer = customers[0];
//         const returnedItems = [...firstCustomer.items];
        
//         customerToRemove.items.forEach(removedItem => {
//           const existingItemIndex = returnedItems.findIndex(item => item.productId === removedItem.productId);
          
//           if (existingItemIndex >= 0) {
//             returnedItems[existingItemIndex] = {
//               ...returnedItems[existingItemIndex],
//               quantity: returnedItems[existingItemIndex].quantity + removedItem.quantity,
//               total: returnedItems[existingItemIndex].total + removedItem.total,
//             };
//           } else {
//             returnedItems.push(removedItem);
//           }
//         });

//         const firstCustomerAmount = returnedItems.reduce((sum, item) => sum + item.total, 0);

//         setCustomers(prev => [
//           {
//             ...firstCustomer,
//             items: returnedItems,
//             amount: firstCustomerAmount,
//           },
//           ...prev.filter(customer => customer.id !== id && customer.id !== firstCustomer.id)
//         ]);
//       } else {
//         setCustomers(prev => prev.filter(customer => customer.id !== id));
//       }
//     }
//   };

//   // Move items between customers
//   const moveItemToCustomer = (fromCustomerId: number, toCustomerId: number, productId: number, quantity: number) => {
//     if (quantity <= 0) return;

//     setCustomers(prev =>
//       prev.map(customer => {
//         // Remove from source customer
//         if (customer.id === fromCustomerId) {
//           const itemIndex = customer.items.findIndex(item => item.productId === productId);
//           if (itemIndex === -1) return customer;

//           const updatedItems = [...customer.items];
//           const currentItem = updatedItems[itemIndex];

//           if (currentItem.quantity < quantity) return customer; // Not enough quantity

//           if (currentItem.quantity === quantity) {
//             // Remove item entirely
//             updatedItems.splice(itemIndex, 1);
//           } else {
//             // Reduce quantity
//             updatedItems[itemIndex] = {
//               ...currentItem,
//               quantity: currentItem.quantity - quantity,
//               total: currentItem.price * (currentItem.quantity - quantity),
//             };
//           }

//           const newAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);

//           return {
//             ...customer,
//             items: updatedItems,
//             amount: newAmount,
//           };
//         }

//         // Add to target customer
//         if (customer.id === toCustomerId) {
//           const product = items.find(item => item.product.id === productId);
//           if (!product) return customer;

//           const itemIndex = customer.items.findIndex(item => item.productId === productId);
//           const updatedItems = [...customer.items];

//           if (itemIndex >= 0) {
//             // Item exists, increase quantity
//             updatedItems[itemIndex] = {
//               ...updatedItems[itemIndex],
//               quantity: updatedItems[itemIndex].quantity + quantity,
//               total: updatedItems[itemIndex].price * (updatedItems[itemIndex].quantity + quantity),
//             };
//           } else {
//             // Add new item
//             updatedItems.push({
//               productId: product.product.id,
//               productName: product.product.name,
//               quantity,
//               price: product.product.price,
//               total: product.product.price * quantity,
//             });
//           }

//           const newAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);

//           return {
//             ...customer,
//             items: updatedItems,
//             amount: newAmount,
//           };
//         }

//         return customer;
//       })
//     );
//   };

//   const handleSubmitReceipts = () => {
//     // Validate customers have names and at least one item
//     const validCustomers = customers.filter(customer => 
//       customer.name.trim() && customer.items.length > 0
//     );

//     if (validCustomers.length === 0) {
//       alert("Please add customer names and ensure at least one customer has items");
//       return;
//     }

//     // Check if first customer has all required items (no validation for distribution completeness)
//     const totalDistributedAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
//     const totalOrderAmount = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

//     if (Math.abs(totalDistributedAmount - totalOrderAmount) > 0.01) {
//       alert(`Total distributed amount (${formatMoney(totalDistributedAmount)}) doesn't match order total (${formatMoney(totalOrderAmount)})`);
//       return;
//     }

//     // Call the receipt generation handler
//     onGenerateReceipt?.(validCustomers);
    
//     // Close the dialog and reset
//     setReceiptDialogOpen(false);
//     setCustomers([]);
//   };

//   // Check if all items are already confirmed (for UI state)
//   const allItemsConfirmed =
//     items.length > 0 &&
//     items.every((item) => item.status?.toLowerCase() === "confirmed");

//   const totalOrderAmount = items.reduce(
//     (total, item) => total + item.product.price * item.quantity,
//     0
//   );

//   const hasGeneratedReceipts = generatedReceipts.length > 0;

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="w-full max-w-4xl p-0 gap-0 overflow-hidden">
//           {/* Header */}
//           <DialogHeader className="px-6 py-4 bg-muted/50 border-b">
//             <div className="flex items-start justify-between">
//               <div className="space-y-2">
//                 <div className="flex items-center gap-3">
//                   <DialogTitle className="text-xl">
//                     Order {order?.orderName ?? order?.id ?? "—"}
//                   </DialogTitle>
//                   {order?.status && (
//                     <Badge
//                       variant={getStatusVariant(order.status.toLowerCase())}
//                       className="text-xs"
//                     >
//                       {order.status}
//                     </Badge>
//                   )}
//                   {hasGeneratedReceipts && (
//                     <Badge variant="secondary" className="text-xs bg-green-100">
//                       <FileText className="h-3 w-3 mr-1" />
//                       Receipts Generated ({generatedReceipts.length})
//                     </Badge>
//                   )}
//                 </div>
//                 <DialogDescription className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//                   <span className="flex items-center gap-1">
//                     <User className="h-3 w-3" />
//                     <span>{order?.distributor}</span>
//                   </span>

//                   {order?.createdAt && (
//                     <span className="flex items-center gap-1">
//                       <Calendar className="h-3 w-3" />
//                       <span>{formatDate(order.createdAt)}</span>
//                     </span>
//                   )}
//                 </DialogDescription>
//               </div>

//               {/* Header Actions */}
//               <div className="flex gap-2">
//                 {onEditOrder && order?.status !== "COMPLETED" && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleEditOrder}
//                     className="gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Edit Order
//                   </Button>
//                 )}

//                 {onConfirmAll && items.length > 0 && (
//                   <Button
//                     variant="default"
//                     size="sm"
//                     onClick={handleConfirmAll}
//                     disabled={allItemsConfirmed}
//                     className="gap-2 bg-green-600 hover:bg-green-700 mr-5"
//                   >
//                     {loadingButton && loadingButton.itemId === null ? (
//                       <>
//                         <LoadingSpinner size="sm" /> loading
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle className="h-4 w-4" />
//                         {allItemsConfirmed ? "All Confirmed" : "Confirm All"}
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </DialogHeader>

//           {/* Content */}
//           <div className="flex-1 px-6 py-4">
//             <ScrollArea className="max-h-[50vh]">
//               {isLoading ? (
//                 <LoadingSpinner size="lg" />
//               ) : (
//                 <div className="space-y-4">
//                   {items.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No items in this order
//                     </div>
//                   ) : (
//                     items.map((item, idx) => (
//                       <div
//                         key={item.id ?? idx}
//                         className="flex gap-4 p-3 rounded-lg border"
//                       >
//                         {/* Product Image */}
//                         {item.product.image && (
//                           <div className="flex-shrink-0">
//                             <Image
//                               src={item.product.image}
//                               alt={item.product.name}
//                               width={60}
//                               height={60}
//                               className="rounded-md object-cover"
//                               crossOrigin="anonymous"
//                             />
//                           </div>
//                         )}

//                         {/* Product Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between">
//                             <div className="space-y-1">
//                               <h4 className="font-semibold text-sm truncate">
//                                 {item.product.name}
//                               </h4>
//                               <p className="text-xs text-muted-foreground line-clamp-2">
//                                 {item.product.description !== null
//                                   ? item.product.description
//                                   : item.product.beverageCategoryType}
//                               </p>
//                               {item.product.beverageSize && (
//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                   <Badge variant="outline" className="text-xs">
//                                     {item.beverageType}
//                                   </Badge>
//                                   <Badge variant="outline" className="text-xs">
//                                     {item.product.beverageSize}
//                                   </Badge>
//                                   <span className="text-xs text-muted-foreground">
//                                     Left Stock: {item.product.currentStock}
//                                   </span>
//                                   {item.status && (
//                                     <Badge
//                                       variant={getStatusVariant(item.status)}
//                                       className="text-xs"
//                                     >
//                                       {item.status}
//                                     </Badge>
//                                   )}
//                                 </div>
//                               )}
//                             </div>

//                             <div className="text-right space-y-1 ml-4">
//                               <div className="text-sm font-medium">
//                                 {formatMoney(item.product.price * item.quantity)}
//                               </div>
//                               <div className="text-xs text-muted-foreground">
//                                 {item.quantity} ×{" "}
//                                 {formatMoney(item.product.price)}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Action Buttons */}
//                           {onItemStatusChange && order?.status !== "COMPLETED" && (
//                             <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleItemReject(item.id)}
//                                 disabled={
//                                   item.status?.toLowerCase() === "cancelled"
//                                 }
//                                 className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:cursor-not-allowed"
//                               >
//                                 {loadingButton &&
//                                 loadingButton.itemId === item.id &&
//                                 loadingButton.status === "cancelled" ? (
//                                   <>
//                                     <LoadingSpinner size="sm" /> loading
//                                   </>
//                                 ) : (
//                                   <>
//                                     <XIcon className="h-3 w-3 mr-1" />
//                                     {item.status?.toLowerCase() === "cancelled"
//                                       ? "Rejected"
//                                       : "Reject"}
//                                   </>
//                                 )}
//                               </Button>
//                               <Button
//                                 variant="default"
//                                 size="sm"
//                                 onClick={() => handleItemConfirm(item.id)}
//                                 disabled={
//                                   item.status?.toLowerCase() === "confirmed"
//                                 }
//                                 className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white disabled:cursor-not-allowed"
//                               >
//                                 {loadingButton &&
//                                 loadingButton.itemId === item.id &&
//                                 loadingButton.status === "confirmed" ? (
//                                   <>
//                                     <LoadingSpinner size="sm" /> loading
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Check className="h-3 w-3 mr-1" />
//                                     {item.status?.toLowerCase() === "confirmed"
//                                       ? "Confirmed"
//                                       : "Confirm"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </ScrollArea>
//           </div>

//           {/* Footer with Totals */}
//           <div className="px-6 py-4 border-t bg-muted/25">
//             <div className="space-y-4">
//               <Separator />

//               {/* Summary */}
//               <div className="flex justify-between items-center">
//                 <div className="text-sm">
//                   <span className="text-muted-foreground">Total Items: </span>
//                   <span className="font-medium">{items.length}</span>
//                 </div>
//                 <div className="text-sm">
//                   <span className="text-muted-foreground">Total Amount: </span>
//                   <span className="font-medium">
//                     {formatMoney(totalOrderAmount)}
//                   </span>
//                 </div>
//               </div>

//               {/* Actions */}
//               <DialogFooter className="!justify-between !items-center mt-4">
//                 <div className="text-xs text-muted-foreground">
//                   Order ID: {order?.id}
//                   {hasGeneratedReceipts && (
//                     <span className="ml-2 text-green-600">
//                       • {generatedReceipts.length} receipt(s) generated
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   {/* Print Existing Receipts Button */}
//                   {hasGeneratedReceipts && (
//                     <Button
//                       variant="outline"
//                       onClick={() => {
//                         // Handle printing existing receipts
//                         console.log('Print existing receipts:', generatedReceipts);
//                       }}
//                       className="gap-2"
//                     >
//                       <Printer className="h-4 w-4" />
//                       Print Receipts ({generatedReceipts.length})
//                     </Button>
//                   )}
                  
//                   {/* Generate Receipt Button */}
//                   <Button
//                     variant="outline"
//                     onClick={handleGenerateReceipt}
//                     className="gap-2"
//                     disabled={items.length === 0}
//                   >
//                     <Receipt className="h-4 w-4" />
//                     {hasGeneratedReceipts ? 'Generate More Receipts' : 'Generate Receipt'}
//                   </Button>
                  
//                   <Button
//                     variant="outline"
//                     onClick={() => onOpenChange(false)}
//                     className="gap-2"
//                   >
//                     <X className="h-4 w-4" />
//                     Close
//                   </Button>
//                 </div>
//               </DialogFooter>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Receipt Generation Dialog - FIXED SCROLLING */}
//       <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
//         <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
//           <DialogHeader className="px-6 py-4 border-b shrink-0">
//             <DialogTitle>Distribute Items to Customers</DialogTitle>
//             <DialogDescription>
//               All items are initially assigned to Customer 1. Add more customers and move items between them as needed.
//               Total order amount: {formatMoney(totalOrderAmount)}
//             </DialogDescription>
//           </DialogHeader>

//           {/* Scrollable Content Area */}
//           <div className="flex-1 overflow-hidden px-6 py-4">
//             <ScrollArea className="h-full pr-4">
//               <div className="space-y-6 pb-4">
//                 {/* Customers List */}
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h3 className="font-semibold">Customers</h3>
//                     <Button
//                       variant="outline"
//                       onClick={addCustomer}
//                       className="gap-2"
//                     >
//                       <Plus className="h-4 w-4" />
//                       Add Customer
//                     </Button>
//                   </div>

//                   <div className="grid gap-4">
//                     {customers.map((customer, index) => (
//                       <div key={customer.id} className="p-4 border rounded-lg space-y-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <h4 className="font-semibold">Customer {index + 1}</h4>
//                             {index === 0 && (
//                               <Badge variant="outline" className="text-xs">
//                                 Default (All Items)
//                               </Badge>
//                             )}
//                           </div>
//                           {index > 0 && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => removeCustomer(customer.id)}
//                               className="h-8 w-8 p-0 text-red-600"
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor={`name-${customer.id}`}>Customer Name *</Label>
//                             <Input
//                               id={`name-${customer.id}`}
//                               value={customer.name}
//                               onChange={(e) => handleCustomerChange(customer.id, 'name', e.target.value)}
//                               placeholder="Enter customer name"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor={`mobile-${customer.id}`}>Mobile Number</Label>
//                             <Input
//                               id={`mobile-${customer.id}`}
//                               value={customer.mobile}
//                               onChange={(e) => handleCustomerChange(customer.id, 'mobile', e.target.value)}
//                               placeholder="Enter mobile number"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor={`tin-${customer.id}`}>TIN Number</Label>
//                             <Input
//                               id={`tin-${customer.id}`}
//                               value={customer.tin}
//                               onChange={(e) => handleCustomerChange(customer.id, 'tin', e.target.value)}
//                               placeholder="Enter TIN number"
//                             />
//                           </div>
//                         </div>

//                         {/* Customer Items */}
//                         <div className="space-y-3">
//                           <div className="flex justify-between items-center">
//                             <Label className="font-medium">Items for this customer:</Label>
//                             <span className="font-medium">{formatMoney(customer.amount)}</span>
//                           </div>
                          
//                           {customer.items.length > 0 ? (
//                             <div className="space-y-2">
//                               {customer.items.map((item, itemIndex) => (
//                                 <div key={itemIndex} className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                                   <div className="flex-1">
//                                     <div className="font-medium text-sm">{item.productName}</div>
//                                     <div className="text-xs text-muted-foreground">
//                                       {formatMoney(item.price)} each
//                                     </div>
//                                   </div>
                                  
//                                   <div className="flex items-center gap-3">
//                                     {/* Quantity Controls */}
//                                     <div className="flex items-center gap-2">
//                                       {index === 0 && customers.length > 1 ? (
//                                         // First customer - can distribute to others
//                                         <div className="flex flex-wrap gap-1">
//                                           {customers.slice(1).map(otherCustomer => (
//                                             <Button
//                                               key={otherCustomer.id}
//                                               variant="outline"
//                                               size="sm"
//                                               onClick={() => moveItemToCustomer(customer.id, otherCustomer.id, item.productId, 1)}
//                                               className="h-7 px-2 text-xs"
//                                               disabled={item.quantity <= 0}
//                                             >
//                                               Move 1 to C{otherCustomer.id}
//                                             </Button>
//                                           ))}
//                                         </div>
//                                       ) : (
//                                         // Other customers - can return to first customer or adjust quantity
//                                         <div className="flex items-center gap-2">
//                                           <Button
//                                             variant="outline"
//                                             size="sm"
//                                             onClick={() => moveItemToCustomer(customer.id, 1, item.productId, 1)}
//                                             className="h-7 px-2 text-xs"
//                                             disabled={item.quantity <= 0}
//                                           >
//                                             Return 1
//                                           </Button>
//                                         </div>
//                                       )}
                                      
//                                       <div className="flex items-center gap-2 ml-2">
//                                         <span className="text-sm font-medium min-w-[80px] text-right">
//                                           {item.quantity} × {formatMoney(item.total)}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-4 text-muted-foreground border rounded">
//                               No items assigned yet
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Fixed Footer */}
//           <div className="border-t bg-background px-6 py-4 shrink-0">
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-muted-foreground">
//                 Total Distributed: {formatMoney(customers.reduce((sum, customer) => sum + customer.amount, 0))} / {formatMoney(totalOrderAmount)}
//                 {customers.length > 0 && (
//                   <span className="ml-2 text-green-600">
//                     • {customers.filter(c => c.items.length > 0).length} customer(s) with items
//                   </span>
//                 )}
//               </div>
              
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setReceiptDialogOpen(false);
//                     setCustomers([]);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSubmitReceipts}
//                   className="gap-2 bg-blue-600 hover:bg-blue-700"
//                   disabled={customers.length === 0 || !customers.some(c => c.name.trim() && c.items.length > 0)}
//                 >
//                   <Printer className="h-4 w-4" />
//                   Generate Receipts
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default OrderDetailsDialog;





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

// Updated interfaces
interface CustomerReceiptData {
  id: number;
  name: string;
  tin?: string;
  mobile?: string;
  amount: number;
  items: Array<{
    productId: number;
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
  items: CustomerReceiptData['items'];
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: OrderDetails | null;
  isLoading: boolean;
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

// Dummy data for generated receipts
const dummyGeneratedReceipts: GeneratedReceipt[] = [
  {
    id: "rec-001",
    customerName: "John Doe",
    timestamp: "2024-01-15T10:30:00Z",
    amount: 25000,
    items: [
      {
        productId: 1,
        productName: "Coca-Cola 500ml",
        quantity: 2,
        price: 5000,
        total: 10000
      },
      {
        productId: 2,
        productName: "Fanta Orange 500ml",
        quantity: 3,
        price: 5000,
        total: 15000
      }
    ]
  },
  {
    id: "rec-002",
    customerName: "Alice Smith",
    timestamp: "2024-01-15T10:35:00Z",
    amount: 15000,
    items: [
      {
        productId: 3,
        productName: "Primus Beer 500ml",
        quantity: 3,
        price: 5000,
        total: 15000
      }
    ]
  }
];

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  isLoading,
  onItemStatusChange,
  onConfirmAll,
  onEditOrder,
  loadingButton,
  onGenerateReceipt,
  generatedReceipts = dummyGeneratedReceipts, // Use dummy data by default
  onPrintReceipts,
}: OrderDetailsDialogProps) {
  const items = order?.orderItems ?? [];
  const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);
  const [viewReceiptsDialogOpen, setViewReceiptsDialogOpen] = React.useState(false);
  const [customers, setCustomers] = React.useState<CustomerReceiptData[]>([]);

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
      const firstCustomerItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      }));

      const firstCustomerAmount = firstCustomerItems.reduce((sum, item) => sum + item.total, 0);

      setCustomers([
        {
          id: 1,
          name: "",
          tin: "",
          mobile: "",
          amount: firstCustomerAmount,
          items: firstCustomerItems,
        },
      ]);
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

  const handlePrintReceipts = () => {
    onPrintReceipts?.(generatedReceipts);
  };

  const handleCustomerChange = (id: number, field: keyof CustomerReceiptData, value: string) => {
    setCustomers(prev =>
      prev.map(customer =>
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
    setCustomers(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: "",
        tin: "",
        mobile: "",
        amount: 0,
        items: [],
      },
    ]);
  };

  const removeCustomer = (id: number) => {
    if (customers.length > 1) {
      const customerToRemove = customers.find(c => c.id === id);
      if (customerToRemove && customerToRemove.items.length > 0) {
        // Return items to first customer
        const firstCustomer = customers[0];
        const returnedItems = [...firstCustomer.items];
        
        customerToRemove.items.forEach(removedItem => {
          const existingItemIndex = returnedItems.findIndex(item => item.productId === removedItem.productId);
          
          if (existingItemIndex >= 0) {
            returnedItems[existingItemIndex] = {
              ...returnedItems[existingItemIndex],
              quantity: returnedItems[existingItemIndex].quantity + removedItem.quantity,
              total: returnedItems[existingItemIndex].total + removedItem.total,
            };
          } else {
            returnedItems.push(removedItem);
          }
        });

        const firstCustomerAmount = returnedItems.reduce((sum, item) => sum + item.total, 0);

        setCustomers(prev => [
          {
            ...firstCustomer,
            items: returnedItems,
            amount: firstCustomerAmount,
          },
          ...prev.filter(customer => customer.id !== id && customer.id !== firstCustomer.id)
        ]);
      } else {
        setCustomers(prev => prev.filter(customer => customer.id !== id));
      }
    }
  };

  // Move items between customers
  const moveItemToCustomer = (fromCustomerId: number, toCustomerId: number, productId: number, quantity: number) => {
    if (quantity <= 0) return;

    setCustomers(prev =>
      prev.map(customer => {
        // Remove from source customer
        if (customer.id === fromCustomerId) {
          const itemIndex = customer.items.findIndex(item => item.productId === productId);
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
              quantity: currentItem.quantity - quantity,
              total: currentItem.price * (currentItem.quantity - quantity),
            };
          }

          const newAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);

          return {
            ...customer,
            items: updatedItems,
            amount: newAmount,
          };
        }

        // Add to target customer
        if (customer.id === toCustomerId) {
          const product = items.find(item => item.product.id === productId);
          if (!product) return customer;

          const itemIndex = customer.items.findIndex(item => item.productId === productId);
          const updatedItems = [...customer.items];

          if (itemIndex >= 0) {
            // Item exists, increase quantity
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity: updatedItems[itemIndex].quantity + quantity,
              total: updatedItems[itemIndex].price * (updatedItems[itemIndex].quantity + quantity),
            };
          } else {
            // Add new item
            updatedItems.push({
              productId: product.product.id,
              productName: product.product.name,
              quantity,
              price: product.product.price,
              total: product.product.price * quantity,
            });
          }

          const newAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);

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

  const handleSubmitReceipts = () => {
    // Validate customers have names and at least one item
    const validCustomers = customers.filter(customer => 
      customer.name.trim() && customer.items.length > 0
    );

    if (validCustomers.length === 0) {
      alert("Please add customer names and ensure at least one customer has items");
      return;
    }

    // Check if first customer has all required items (no validation for distribution completeness)
    const totalDistributedAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
    const totalOrderAmount = items.filter((item) => item.status !== "CANCELLED").reduce((total, item) => total + item.product.price * item.quantity, 0);

    if (Math.abs(totalDistributedAmount - totalOrderAmount) > 0.01) {
      alert(`Total distributed amount (${formatMoney(totalDistributedAmount)}) doesn't match order total (${formatMoney(totalOrderAmount)})`);
      return;
    }

    // Call the receipt generation handler
    onGenerateReceipt?.(validCustomers);
    
    // Close the dialog and reset
    setReceiptDialogOpen(false);
    setCustomers([]);
  };

  // Check if all items are already confirmed (for UI state)
  const allItemsConfirmed =
    items.length > 0 &&
    items.every((item) => item.status?.toLowerCase() === "confirmed");

  const totalOrderAmount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const hasGeneratedReceipts = generatedReceipts.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-4xl p-0 gap-0 overflow-hidden">
          {/* Header */}
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
                  {hasGeneratedReceipts && (
                    <Badge variant="secondary" className="text-xs bg-green-100">
                      <FileText className="h-3 w-3 mr-1" />
                      Receipts Generated ({generatedReceipts.length})
                    </Badge>
                  )}
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
                {onEditOrder && order?.status !== "COMPLETED" && (
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

                {onConfirmAll && items.length > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleConfirmAll}
                    disabled={allItemsConfirmed}
                    className="gap-2 bg-green-600 hover:bg-green-700 mr-5"
                  >
                    {loadingButton && loadingButton.itemId === null ? (
                      <>
                        <LoadingSpinner size="sm" /> loading
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

          {/* Content */}
          <div className="flex-1 px-6 py-4">
            <ScrollArea className="max-h-[50vh]">
              {isLoading ? (
                <LoadingSpinner size="lg" />
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
                                  <Badge variant="outline" className="text-xs">
                                    {item.beverageType}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
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
                              <div className="text-sm font-medium">
                                {formatMoney(item.product.price * item.quantity)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.quantity} ×{" "}
                                {formatMoney(item.product.price)}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {onItemStatusChange && order?.status !== "COMPLETED" && (
                            <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleItemReject(item.id)}
                                disabled={
                                  item.status?.toLowerCase() === "cancelled"
                                }
                                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:cursor-not-allowed"
                              >
                                {loadingButton &&
                                loadingButton.itemId === item.id &&
                                loadingButton.status === "cancelled" ? (
                                  <>
                                    <LoadingSpinner size="sm" /> loading
                                  </>
                                ) : (
                                  <>
                                    <XIcon className="h-3 w-3 mr-1" />
                                    {item.status?.toLowerCase() === "cancelled"
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
                                  item.status?.toLowerCase() === "confirmed"
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
                                    {item.status?.toLowerCase() === "confirmed"
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
                  {hasGeneratedReceipts && (
                    <span className="ml-2 text-green-600">
                      • {generatedReceipts.length} receipt(s) generated
                    </span>
                  )}
                </div>

              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}

export default OrderDetailsDialog;