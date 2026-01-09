// "use client"

// import { useCartStore } from "@/lib/store/cart-store"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { X, Minus, Plus, ShoppingCart } from "lucide-react"
// import Image from "next/image"
// import { ConfirmOrderDialog } from "./confirm-order-dialog"

// export function CartSidebar() {
//   const items = useCartStore((state) => state.items)
//   const removeItem = useCartStore((state) => state.removeItem)
//   const updateQuantity = useCartStore((state) => state.updateQuantity)
//   const getTotalPrice = useCartStore((state) => state.getTotalPrice)
//   const getTotalItems = useCartStore((state) => state.getTotalItems)

//   if (items.length === 0) {
//     return null
//   }

//   return (
//     <div className="h-full p-4">
//       <Card className="h-full border-2 shadow-xl">
//         <div className="flex items-center justify-between border-b p-4">
//           <div className="flex items-center gap-2">
//             <ShoppingCart className="h-5 w-5" />
//             <h3 className="font-semibold">Cart ({getTotalItems()})</h3>
//           </div>
//         </div>

//         <ScrollArea className="h-[calc(100vh-300px)]">
//           <div className="space-y-4 p-4">
//             {items.map((item) => (
//               <div key={item.product.id} className="flex gap-3">
//                 <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
//                   <Image
//                     src={item.product.image || `/placeholder.svg?height=64&width=64`}
//                     alt={item.product.name}
//                     fill
//                     className="object-cover"
//                     crossOrigin="anonymous"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-start justify-between">
//                     <p className="text-sm font-medium leading-tight">{item.product.name}</p>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 -mt-1"
//                       onClick={() => removeItem(item.product.id)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-sm font-semibold text-primary">{item.product.price.toFixed(2)} Rwf</p>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-6 w-6 bg-transparent"
//                       onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
//                     >
//                       <Minus className="h-3 w-3" />
//                     </Button>
//                     <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-6 w-6 bg-transparent"
//                       onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
//                     >
//                       <Plus className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>

//         <div className="border-t p-4 space-y-4">
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span className="font-medium"> {getTotalPrice().toFixed(2)} Rwf</span>
//             </div>
//             <Separator />
//             <div className="flex justify-between">
//               <span className="font-semibold">Total</span>
//               <span className="text-xl font-bold text-primary">{getTotalPrice().toFixed(2)} Rwf</span>
//             </div>
//           </div>
//           <ConfirmOrderDialog />
//         </div>
//       </Card>
//     </div>
//   )
// }

// "use client";

// import { useCartStore } from "@/lib/store/cart-store";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { X, Minus, Plus, ShoppingCart, ShoppingBag } from "lucide-react";
// import Image from "next/image";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useApi } from "@/hooks/api-hooks";
// import { toast } from "../ui/use-toast";
// import { ConfirmOrderDialog } from "./confirm-order-dialog";
// import { useRouter } from "next/navigation";

// interface OrderDetails {
//   id?: number;
//   orderName?: string;
// }

// // Define beverage condition types
// export function CartSidebar() {
//   const { queryClient, useApiPost } = useApi();
//   const items = useCartStore((state) => state.items);
//   const removeItem = useCartStore((state) => state.removeItem);
//   const updateQuantity = useCartStore((state) => state.updateQuantity);
//   const updateBeverageCondition = useCartStore(
//     (state) => state.updateBeverageCondition
//   );
//   const clearCart = useCartStore((state) => state.clearCart);
//   const getTotalPrice = useCartStore((state) => state.getTotalPrice);
//   const getTotalItems = useCartStore((state) => state.getTotalItems);
//   const isAsynchonized = localStorage.getItem("isAsynchonized");
//   const orderDetails: OrderDetails = JSON.parse(
//     isAsynchonized || "{}"
//   );
//   const { mutateAsync: confirmOrder, isPending: confirmingOrder } = useApiPost(
//     ["confirm-order"],
//     `/bar/orders${orderDetails?.id ? `?orderId=${orderDetails?.id}` : ""}`
//   );
//   const router = useRouter();
//   if (items.length === 0) {
//     return null;
//   }
//   const handleBeverageConditionChange = (
//     productId: number,
//     condition: BeverageCondition
//   ) => {
//     updateBeverageCondition(productId, condition);
//   };
//   return (
//     <div className="h-full p-4">
//       <Card className="h-full border-2 shadow-xl">
//         <div className="flex items-center justify-between border-b p-4">
//           <div className="flex items-center gap-2">
//             <ShoppingCart className="h-5 w-5" />
//             <h3 className="font-semibold">Cart ({getTotalItems()})</h3>
//           </div>
//         </div>

//         <ScrollArea className="h-[calc(100vh-300px)]">
//           <div className="space-y-4 p-4">
//             {items.map((item) => (
//               <div key={item.product.id} className="flex gap-3">
//                 <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
//                   <Image
//                     src={
//                       item.product.image ||
//                       `/placeholder.svg?height=64&width=64`
//                     }
//                     alt={item.product.name}
//                     fill
//                     className="object-cover"
//                     crossOrigin="anonymous"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-start justify-between">
//                     <p className="text-sm font-medium leading-tight">
//                       {item.product.name}
//                     </p>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 -mt-1"
//                       onClick={async () => {
//                         // if remain only 1 item then remove the item
//                         if (items.length === 1 && isAsynchonized) {
//                           if (
//                             !window.confirm(
//                               "Are you sure you want to remove this item? \n This will remove the item from your cart and you will not be able to restore it."
//                             )
//                           ) {
//                             return;
//                           }
//                           const orders = {
//                             orderName: orderDetails?.orderName,
//                             delete_current: 'true',
//                             items: items.map((item) => ({
//                               productId: item.product.id,
//                               quantity: item.quantity,
//                               sellingPrice: item.product.price,
//                             })),
//                           };
//                           await confirmOrder(orders).then(
//                             () => {
//                               toast({
//                                 title: "Order confirmed",
//                                 description: "Your order has been confirmed",
//                               });

//                               clearCart();
//                               localStorage.removeItem("isAsynchonized");
//                               queryClient.invalidateQueries({
//                                 queryKey: ["products"],
//                               });
//                               queryClient.invalidateQueries({
//                                 queryKey: ["orders"],
//                               });
//                               router.replace("/dashboard/bar/manager/orders");
//                             }
//                           );
//                         } else {
//                           removeItem(item.product.id);
//                         }
//                       }}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-sm font-semibold text-primary">
//                     {item.product.price.toFixed(2)} Rwf
//                   </p>
//                   {item.product.productType === "BEVERAGE" && (
//                     <div className="flex items-center gap-3">
//                       <label className="text-xs text-muted-foreground min-w-[56px]">
//                         Condition
//                       </label>
//                       <div className="min-w-0">
//                         <Select
//                           value={item.beverageCondition || "NORMAL"}
//                           onValueChange={(value: BeverageCondition) =>
//                             handleBeverageConditionChange(
//                               item.product.id,
//                               value
//                             )
//                           }
//                         >
//                           <SelectTrigger className="h-7 w-28 text-xs px-2 py-0 rounded-md">
//                             <SelectValue
//                               placeholder="Normal"
//                               className="truncate"
//                             />
//                           </SelectTrigger>
//                           <SelectContent className="w-28">
//                             <SelectItem value="HOT">Hot</SelectItem>
//                             <SelectItem value="NORMAL">Normal</SelectItem>
//                             <SelectItem value="COLD">Cold</SelectItem>
//                             <SelectItem value="ROOM_TEMPERATURE">
//                               Room Temp
//                             </SelectItem>
//                             <SelectItem value="FROZEN">Frozen</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-6 w-6 bg-transparent"
//                       onClick={
//                         async () => {
//                         // if remain only 1 item then remove the item
//                         if (items.length === 1 && isAsynchonized && item.quantity === 1) {
//                           if (
//                             !window.confirm(
//                               "Are you sure you want to remove this item? \n This will remove the item from your cart and you will not be able to restore it."
//                             )
//                           ) {
//                             return;
//                           }
//                           const orders = {
//                             orderName: orderDetails?.orderName,
//                             delete_current: 'true',
//                             items: items.map((item) => ({
//                               productId: item.product.id,
//                               quantity: item.quantity,
//                               sellingPrice: item.product.price,
//                             })),
//                           };
//                           await confirmOrder(orders).then(
//                             () => {
//                               toast({
//                                 title: "Order confirmed",
//                                 description: "Your order has been confirmed",
//                               });

//                               clearCart();
//                               localStorage.removeItem("isAsynchonized");
//                               queryClient.invalidateQueries({
//                                 queryKey: ["products"],
//                               });
//                               queryClient.invalidateQueries({
//                                 queryKey: ["orders"],
//                               });
//                                 router.replace("/dashboard/bar/manager/orders");
//                             }
//                           );
//                         } else {
//                           updateQuantity(item.product.id, item.quantity - 1)
//                         }
//                       }

//                       }
//                     >
//                       <Minus className="h-3 w-3" />
//                     </Button>
//                     <span className="w-8 text-center text-sm font-medium">
//                       {item.quantity}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-6 w-6 bg-transparent"
//                       disabled={item.quantity >= item.product.currentStock}
//                       onClick={() =>
//                         updateQuantity(item.product.id, item.quantity + 1)
//                       }
//                     >
//                       <Plus className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>

//         <div className="border-t p-4 space-y-4">
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span className="font-medium">
//                 {" "}
//                 {getTotalPrice().toFixed(2)} Rwf
//               </span>
//             </div>
//             <Separator />
//             <div className="flex justify-between">
//               <span className="font-semibold">Total</span>
//               <span className="text-xl font-bold text-primary">
//                 {getTotalPrice().toFixed(2)} Rwf
//               </span>
//             </div>
//           </div>
//           <ConfirmOrderDialog />
//         </div>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useCartStore } from "@/lib/store/cart-store";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { X, Minus, Plus, ShoppingCart, ShoppingBag } from "lucide-react";
// import Image from "next/image";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useApi } from "@/hooks/api-hooks";
// import { toast } from "../ui/use-toast";
// import { ConfirmOrderDialog } from "./confirm-order-dialog";
// import { useRouter } from "next/navigation";

// interface OrderDetails {
//   id?: number;
//   orderName?: string;
// }

// // Define beverage condition types
// export function CartSidebar() {
//   const { queryClient, useApiPost } = useApi();
//   const items = useCartStore((state) => state.items);
//   const removeItem = useCartStore((state) => state.removeItem);
//   const updateQuantity = useCartStore((state) => state.updateQuantity);
//   const updateBeverageCondition = useCartStore(
//     (state) => state.updateBeverageCondition
//   );
//   const clearCart = useCartStore((state) => state.clearCart);
//   const getTotalPrice = useCartStore((state) => state.getTotalPrice);
//   const getTotalItems = useCartStore((state) => state.getTotalItems);

//   // Move localStorage access inside useEffect to avoid SSR issues
//   const isAsynchonized = typeof window !== 'undefined' ? localStorage.getItem("isAsynchonized") : null;
//   const orderDetails: OrderDetails = isAsynchonized ? JSON.parse(isAsynchonized) : {};

//   const { mutateAsync: confirmOrder, isPending: confirmingOrder } = useApiPost(
//     ["confirm-order"],
//     `/bar/orders${orderDetails?.id ? `?orderId=${orderDetails?.id}` : ""}`
//   );
//   const router = useRouter();

//   if (items.length === 0) {
//     return null;
//   }

//   const handleBeverageConditionChange = (
//     productId: number,
//     condition: BeverageCondition
//   ) => {
//     updateBeverageCondition(productId, condition);
//   };

//   return (
//     // Remove h-full and add flex flex-col for proper sticky behavior
//     <div className="flex flex-col h-screen">
//       <Card className="flex flex-col border-2 shadow-xl flex-1">
//         <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
//           <div className="flex items-center gap-2">
//             <ShoppingCart className="h-5 w-5" />
//             <h3 className="font-semibold">Cart ({getTotalItems()})</h3>
//           </div>
//         </div>

//         {/* Scrollable content area */}
//         <ScrollArea className="flex-1">
//           <div className="space-y-4 p-4">
//             {items.map((item) => (
//               <div key={item.product.id} className="flex gap-3">
//                 <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
//                   <Image
//                     src={
//                       item.product.image ||
//                       `/placeholder.svg?height=64&width=64`
//                     }
//                     alt={item.product.name}
//                     fill
//                     className="object-cover"
//                     crossOrigin="anonymous"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-start justify-between">
//                     <p className="text-sm font-medium leading-tight">
//                       {item.product.name}
//                     </p>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 -mt-1"
//                       onClick={async () => {
//                         if (items.length === 1 && isAsynchonized) {
//                           if (
//                             !window.confirm(
//                               "Are you sure you want to remove this item? \n This will remove the item from your cart and you will not be able to restore it."
//                             )
//                           ) {
//                             return;
//                           }
//                           const orders = {
//                             orderName: orderDetails?.orderName,
//                             delete_current: 'true',
//                             items: items.map((item) => ({
//                               productId: item.product.id,
//                               quantity: item.quantity,
//                               sellingPrice: item.product.price,
//                             })),
//                           };
//                           await confirmOrder(orders).then(
//                             () => {
//                               toast({
//                                 title: "Order confirmed",
//                                 description: "Your order has been confirmed",
//                               });

//                               clearCart();
//                               localStorage.removeItem("isAsynchonized");
//                               queryClient.invalidateQueries({
//                                 queryKey: ["products"],
//                               });
//                               queryClient.invalidateQueries({
//                                 queryKey: ["orders"],
//                               });
//                               router.replace("/dashboard/bar/manager/orders");
//                             }
//                           );
//                         } else {
//                           removeItem(item.product.id);
//                         }
//                       }}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-sm font-semibold text-primary">
//                     {item.product.price.toFixed(2)} Rwf
//                   </p>
//                   {item.product.productType === "BEVERAGE" && (
//                     <div className="flex items-center gap-3">
//                       <label className="text-xs text-muted-foreground min-w-[56px]">
//                         Condition
//                       </label>
//                       <div className="min-w-0">
//                         <Select
//                           value={item.beverageCondition || "NORMAL"}
//                           onValueChange={(value: BeverageCondition) =>
//                             handleBeverageConditionChange(
//                               item.product.id,
//                               value
//                             )
//                           }
//                         >
//                           <SelectTrigger className="h-7 w-28 text-xs px-2 py-0 rounded-md">
//                             <SelectValue
//                               placeholder="Normal"
//                               className="truncate"
//                             />
//                           </SelectTrigger>
//                           <SelectContent className="w-28">
//                             <SelectItem value="HOT">Hot</SelectItem>
//                             <SelectItem value="NORMAL">Normal</SelectItem>
//                             <SelectItem value="COLD">Cold</SelectItem>
//                             <SelectItem value="ROOM_TEMPERATURE">
//                               Room Temp
//                             </SelectItem>
//                             <SelectItem value="FROZEN">Frozen</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-6 w-6 bg-transparent"
//                       onClick={async () => {
//                         if (items.length === 1 && isAsynchonized && item.quantity === 1) {
//                           if (
//                             !window.confirm(
//                               "Are you sure you want to remove this item? \n This will remove the item from your cart and you will not be able to restore it."
//                             )
//                           ) {
//                             return;
//                           }
//                           const orders = {
//                             orderName: orderDetails?.orderName,
//                             delete_current: 'true',
//                             items: items.map((item) => ({
//                               productId: item.product.id,
//                               quantity: item.quantity,
//                               sellingPrice: item.product.price,
//                             })),
//                           };
//                           await confirmOrder(orders).then(
//                             () => {
//                               toast({
//                                 title: "Order confirmed",
//                                 description: "Your order has been confirmed",
//                               });

//                               clearCart();
//                               localStorage.removeItem("isAsynchonized");
//                               queryClient.invalidateQueries({
//                                 queryKey: ["products"],
//                               });
//                               queryClient.invalidateQueries({
//                                 queryKey: ["orders"],
//                               });
//                               router.replace("/dashboard/bar/manager/orders");
//                             }
//                           );
//                         } else {
//                           updateQuantity(item.product.id, item.quantity - 1)
//                         }
//                       }}
//                     >
//                       <Minus className="h-3 w-3" />
//                     </Button>
//                     <span className="w-8 text-center text-sm font-medium">
//                       {item.quantity}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-6 w-6 bg-transparent"
//                       disabled={item.quantity >= item.product.currentStock}
//                       onClick={() =>
//                         updateQuantity(item.product.id, item.quantity + 1)
//                       }
//                     >
//                       <Plus className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>

//         {/* Fixed footer */}
//         <div className="border-t p-4 space-y-4 flex-shrink-0">
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span className="font-medium">
//                 {getTotalPrice().toFixed(2)} Rwf
//               </span>
//             </div>
//             <Separator />
//             <div className="flex justify-between">
//               <span className="font-semibold">Total</span>
//               <span className="text-xl font-bold text-primary">
//                 {getTotalPrice().toFixed(2)} Rwf
//               </span>
//             </div>
//           </div>
//           <ConfirmOrderDialog />
//         </div>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/hooks/api-hooks";
import { toast } from "../ui/use-toast";
import { ConfirmOrderDialog } from "./confirm-order-dialog";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { keepPreviousData } from "@tanstack/react-query";
import { AmountFormat } from "@/lib/AmountFormat";

interface OrderDetails {
  id?: number;
  orderName?: string;
  orderStatus: OrderStatus;
}

export function CartSidebar() {
  const { queryClient, useApiPost } = useApi();
  const { useApiQuery, api } = useApi();
  const {
    data: catalog,
    isLoading,
    refetch,
  } = useApiQuery<Product[]>(["products"], "/bar/products", {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
    placeholderData: keepPreviousData,
  });
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateBeverageCondition = useCartStore(
    (state) => state.updateBeverageCondition
  );
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const isAsynchonized =
    typeof window !== "undefined"
      ? localStorage.getItem("isAsynchonized")
      : null;
  const orderDetails: OrderDetails = isAsynchonized
    ? JSON.parse(isAsynchonized)
    : {};

  const { mutateAsync: confirmOrder, isPending: confirmingOrder } = useApiPost(
    ["confirm-order"],
    `/bar/orders${orderDetails?.id ? `?orderId=${orderDetails?.id}` : ""}`
  );
  const router = useRouter();

  if (items.length === 0) {
    return null;
  }

  const handleBeverageConditionChange = (
    productId: number,
    condition: BeverageCondition
  ) => {
    updateBeverageCondition(productId, condition);
  };

  const haveDiscount = (productId: number): number | undefined => {
    const findd = catalog?.find((item) => item.id === productId);
    return findd?.discount?.rate;
  };

  const getDiscountedPrice = (productId: number, price: number) => {
    const discount = haveDiscount(productId);
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  return (
    <div className="flex flex-col h-ful">
      <Card className="flex flex-col border-2 shadow-xl flex-1">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b p-4 mt-0 flex-shrink-0 bg-background">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="font-semibold">Cart ({getTotalItems()})</h3>
          </div>
        </div>

        {/* Scrollable Items Area */}
        <ScrollArea className="max-h-[54vh]">
          <div className="space-y-4 p-2">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-2 rounded-lg border bg-card"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={
                      item.product.image ||
                      `/placeholder.svg?height=64&width=64`
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium leading-tight line-clamp-2">
                      {item.product.name}
                    </p>

                    {item.status === "PENDING" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 flex-shrink-0"
                        onClick={async () => {
                          if (items.length === 1 && isAsynchonized) {
                            if (
                              !window.confirm(
                                "Are you sure you want to remove this item? \n This will remove the item from your cart and you will not be able to restore it."
                              )
                            ) {
                              return;
                            }
                            const orders = {
                              orderName: orderDetails?.orderName,
                              delete_current: "true",
                              items: items.map((item) => ({
                                id: item.id,
                                productId: item.product.id,
                                quantity: item.quantity,
                                sellingPrice: item.product.price,
                              })),
                            };
                            await confirmOrder(orders).then(() => {
                              toast({
                                title: "Order confirmed",
                                description: "Your order has been confirmed",
                                duration: 3000,
                              });

                              clearCart();
                              localStorage.removeItem("isAsynchonized");
                              queryClient.invalidateQueries({
                                queryKey: ["products"],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ["orders"],
                              });
                              router.replace("/dashboard/bar/manager/orders");
                            });
                          } else {
                            removeItem(item.product.id);
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <Badge
                          variant={
                            item.status === "CANCELLED"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {item.status.toLocaleLowerCase()}
                        </Badge>
                      </>
                    )}
                  </div>
                  {item.product.discount && item.product.discount !== null ? (
                    <>
                      <span className="text-sm font-semibold text-primary">
                        {AmountFormat(
                          (
                            item.product?.price *
                            (1 - item.product.discount.rate / 100)
                          ).toString()
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {AmountFormat(item.product.price.toString(), 0)}
                      </span>
                      <Badge
                        variant="outline"
                        className="h-3.5 px-1 text-[9px] border-red-200 text-red-600 bg-red-50"
                      >
                        {item.product.discount.rate}% off
                      </Badge>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-primary">
                      {AmountFormat(item.product.price.toString(), 0)}
                    </p>
                  )}
                  {item.product.productType === "BEVERAGE" && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground whitespace-nowrap">
                        Condition:
                      </label>
                      <Select
                        value={item.beverageCondition || "NORMAL"}
                        onValueChange={(value: BeverageCondition) =>
                          handleBeverageConditionChange(item.product.id, value)
                        }
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Normal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOT">Hot</SelectItem>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="COLD">Cold</SelectItem>
                          <SelectItem value="ROOM_TEMPERATURE">
                            Room Temp
                          </SelectItem>
                          <SelectItem value="FROZEN">Frozen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {item.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={async () => {
                          if (
                            items.length === 1 &&
                            isAsynchonized &&
                            item.quantity === 1
                          ) {
                            if (
                              !window.confirm(
                                "Are you sure you want to remove this item? \n This will remove the item from your cart and you will not be able to restore it."
                              )
                            ) {
                              return;
                            }
                            const orders = {
                              orderName: orderDetails?.orderName,
                              delete_current: "true",
                              items: items.map((item) => ({
                                id: item.id,
                                productId: item.product.id,
                                quantity: item.quantity,
                                sellingPrice: item.product.price,
                              })),
                            };
                            await confirmOrder(orders).then(() => {
                              toast({
                                title: "Order confirmed",
                                description: "Your order has been confirmed",
                                duration: 3000,
                              });

                              clearCart();
                              localStorage.removeItem("isAsynchonized");
                              queryClient.invalidateQueries({
                                queryKey: ["products"],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ["orders"],
                              });
                              router.replace("/dashboard/bar/manager/orders");
                            });
                          } else {
                            updateQuantity(item.product.id, item.quantity - 1);
                          }
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      {/* Replace the span with an input field */}
                      <input
                        type="number"
                        step="0.05"
                        min="0.05"
                        value={Number(item.quantity)} // Always display with 2 decimals
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const value = parseFloat(rawValue);

                          if (!isNaN(value) && value > 0) {
                            // Set max value if product has stock limit (except for itemTyCd "3")
                            const maxQuantity =
                              item.product.itemTyCd !== "3"
                                ? item.product.currentStock
                                : Infinity;

                            const finalQuantity = Math.min(value, maxQuantity);
                            updateQuantity(item.product.id, finalQuantity);
                          }
                        }}
                        onBlur={(e) => {
                          let value = parseFloat(e.target.value);

                          if (isNaN(value) || value <= 0) {
                            // Reset to minimum quantity if invalid
                            updateQuantity(item.product.id, 0.01);
                            return;
                          }

                          // Always ensure 2 decimal places
                          value = parseFloat(value.toFixed(2));

                          // Set max value if product has stock limit (except for itemTyCd "3")
                          const maxQuantity =
                            item.product.itemTyCd !== "3"
                              ? item.product.currentStock
                              : Infinity;

                          const finalQuantity = Math.min(value, maxQuantity);
                          updateQuantity(item.product.id, finalQuantity);
                        }}
                        className="w-16 text-center text-sm font-medium border rounded px-1 py-1"
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        disabled={
                          item.product.itemTyCd !== "3" &&
                          item.quantity >= item.product.currentStock
                        }
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="border-t p-4 space-y-4 flex-shrink-0 bg-background">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {AmountFormat(getTotalPrice().toString(), 2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">
                {AmountFormat(getTotalPrice().toString())}
              </span>
            </div>
          </div>
          {(orderDetails.orderStatus === "PENDING" ||
            !orderDetails.orderStatus) && <ConfirmOrderDialog />}
        </div>
      </Card>
    </div>
  );
}
