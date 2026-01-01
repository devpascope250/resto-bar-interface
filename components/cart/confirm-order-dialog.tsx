// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useCartStore } from "@/lib/store/cart-store";
// import { useToast } from "@/hooks/use-toast";
// import { ShoppingBag } from "lucide-react";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useApi } from "@/hooks/api-hooks";
// interface OrderDetails {
//   id?: number;
//   orderName?: string;
// }
// export function ConfirmOrderDialog() {
//   const { useApiPost, queryClient } = useApi();
//     // get item from localStorage where is called isAsynchonized
//   const orderDetails: OrderDetails = JSON.parse(localStorage.getItem("isAsynchonized" ) || "{}")
//   const { mutateAsync: confirmOrder, isPending: confirmingOrder } = useApiPost(
//     ["confirm-order"],
//     `/bar/orders${orderDetails?.id ? `?orderId=${orderDetails?.id}` : ''}`
//   );
//   const [open, setOpen] = useState(false);
//   const clearCart = useCartStore((state) => state.clearCart);
//   const items = useCartStore((state) => state.items);
//   const getTotalPrice = useCartStore((state) => state.getTotalPrice);
//   const { toast } = useToast();
//   const router = useRouter();

//   const handleConfirmOrder = async (values: any) => {
//     const orders = {
//       items: items.map((item) => ({
//         productId: item.product.id,
//         quantity: item.quantity,
//         sellingPrice: item.product.price,
//         beverageType: item.beverageCondition ?? null
//       })),
//       orderName: values.orderName,
//     };
//     await confirmOrder(orders)
//       .then(() => {
//         toast({
//           title: "Confirming Order",
//           description: "Order has been confirmed well!",
//           variant: "success",
//         });
//         clearCart();
//         localStorage.removeItem("isAsynchonized");
//         queryClient.invalidateQueries({queryKey: ['products']});
//         queryClient.invalidateQueries({queryKey: ['orders']});
//         router.push("/dashboard/bar/manager/orders");

//       })
//       .catch((error) => {
//         toast({
//           title: "Confirming Order",
//           description: error.message,
//           variant: "error",
//         });
//       });
//   };

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       orderName: orderDetails?.orderName || "",
//       // username: "",
//       // password: "",
//     },
//     validationSchema: yup.object({
//       orderName: yup.string().required("Order name is required"),
//       // username: yup.string().required("Username is required"),
//       // password: yup.string().required("Password is required"),
//     }),
//     onSubmit: handleConfirmOrder,
//   });

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="w-full" size="lg">
//           <ShoppingBag className="mr-2 h-5 w-5" />
//           Confirm Order
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Confirm Your Order</DialogTitle>
//           <DialogDescription>
//             Please enter order details and your credentials to place the order
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="order-name">Order Name</Label>
//               <Input
//                 id="order-name"
//                 type="text"
//                 name="orderName"
//                 placeholder="e.g Table 1 Eric"
//                 value={formik.values.orderName}
//                 onChange={formik.handleChange}
//                 className={formik.errors.orderName ? "border-red-500" : ""}
//               />
//             </div>
//             {/* <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="Your username"
//                 value={formik.values.username}
//                 onChange={formik.handleChange}
//                 className={formik.errors.username ? "border-red-500" : ""}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 className={formik.errors.password ? "border-red-500" : ""}
//               />
//             </div> */}
//             <div className="rounded-lg bg-muted p-4">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="text-muted-foreground">Items</span>
//                 <span className="font-medium">{items.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">Total Amount</span>
//                 <span className="text-lg font-bold text-primary">
//                   {getTotalPrice().toFixed(2)} Rwf
//                 </span>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={confirmingOrder}
//               className="cursor-pointer"
//             >
//               {confirmingOrder ? "Processing..." : "Place Order"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useCartStore } from "@/lib/store/cart-store";
// import { useToast } from "@/hooks/use-toast";
// import { ShoppingBag } from "lucide-react";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useApi } from "@/hooks/api-hooks";
// import { PaymentDialog, type PaymentAmount } from "./payment-dialog"; // Import the payment dialog

// interface OrderDetails {
//   id?: number;
//   orderName?: string;
// }

// export function ConfirmOrderDialog() {
//   const { useApiPost, queryClient } = useApi();
//   const orderDetails: OrderDetails = JSON.parse(localStorage.getItem("isAsynchonized") || "{}");
//   const { mutateAsync: confirmOrder, isPending: confirmingOrder } = useApiPost(
//     ["confirm-order"],
//     `/bar/orders${orderDetails?.id ? `?orderId=${orderDetails?.id}` : ''}`
//   );

//   const [open, setOpen] = useState(false);
//   const [showPayment, setShowPayment] = useState(false);
//   const [orderData, setOrderData] = useState<any>(null);

//   const clearCart = useCartStore((state) => state.clearCart);
//   const items = useCartStore((state) => state.items);
//   const getTotalPrice = useCartStore((state) => state.getTotalPrice);
//   const { toast } = useToast();
//   const router = useRouter();

//   const handleConfirmOrder = async (values: any, payments?: PaymentAmount[]) => {
//     const orderPayload = {
//       items: items.map((item) => ({
//         productId: item.product.id,
//         quantity: item.quantity,
//         sellingPrice: item.product.price,
//         beverageType: item.beverageCondition ?? null
//       })),
//       orderName: values.orderName,
//       payments: payments || [{ method: "CASH", amount: getTotalPrice() }]
//     };

//     await confirmOrder(orderPayload)
//       .then(() => {
//         toast({
//           title: "Order Confirmed",
//           description: "Order has been confirmed successfully!",
//           variant: "success",
//         });
//         clearCart();
//         localStorage.removeItem("isAsynchonized");
//         queryClient.invalidateQueries({ queryKey: ['products'] });
//         queryClient.invalidateQueries({ queryKey: ['orders'] });
//         router.push("/dashboard/bar/manager/orders");
//         setOpen(false);
//       })
//       .catch((error) => {
//         toast({
//           title: "Order Failed",
//           description: error.message,
//           variant: "error",
//         });
//       });
//   };

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       orderName: orderDetails?.orderName || "",
//     },
//     validationSchema: yup.object({
//       orderName: yup.string().required("Order name is required"),
//     }),
//     onSubmit: (values) => {
//       setOrderData(values);
//       setShowPayment(true);
//     },
//   });

//   const handlePaymentConfirm = (payments: PaymentAmount[]) => {
//     if (orderData) {
//       handleConfirmOrder(orderData, payments);
//     }
//     setShowPayment(false);
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button className="w-full" size="lg">
//             <ShoppingBag className="mr-2 h-5 w-5" />
//             Confirm Order
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Your Order</DialogTitle>
//             <DialogDescription>
//               Please enter order details to place the order
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={formik.handleSubmit}>
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="order-name">Order Name</Label>
//                 <Input
//                   id="order-name"
//                   type="text"
//                   name="orderName"
//                   placeholder="e.g Table 1 Eric"
//                   value={formik.values.orderName}
//                   onChange={formik.handleChange}
//                   className={formik.errors.orderName ? "border-red-500" : ""}
//                 />
//                 {formik.errors.orderName && (
//                   <p className="text-red-500 text-xs">{formik.errors.orderName}</p>
//                 )}
//               </div>

//               <div className="rounded-lg bg-muted p-4">
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-muted-foreground">Items</span>
//                   <span className="font-medium">{items.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold">Total Amount</span>
//                   <span className="text-lg font-bold text-primary">
//                     {getTotalPrice().toFixed(2)} Rwf
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={confirmingOrder}
//                 className="cursor-pointer"
//               >
//                 {confirmingOrder ? "Processing..." : "Continue to Payment"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       <PaymentDialog
//         open={showPayment}
//         onOpenChange={setShowPayment}
//         totalAmount={getTotalPrice()}
//         onConfirmPayment={handlePaymentConfirm}
//         isProcessing={confirmingOrder}
//       />
//     </>
//   );
// }

"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useApi } from "@/hooks/api-hooks";
import { useAuthStore } from "@/lib/store/auth-store";
import { LoadingSpinner } from "../ui/loading-spinner";

interface OrderDetails {
  id?: number;
  orderName?: string;
}

export function ConfirmOrderDialog() {
  const { useApiPost, queryClient } = useApi();
  const user = useAuthStore((state) => state.user);
  const orderDetails: OrderDetails = JSON.parse(
    localStorage.getItem("isAsynchonized") || "{}"
  );
  const { mutateAsync: confirmOrder, isPending: confirmingOrder } = useApiPost(
    ["confirm-order"],
    `/bar/orders${orderDetails?.id ? `?orderId=${orderDetails?.id}` : ""}`
  );

  const [open, setOpen] = useState(false);
  // const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirmOrder = async (
    orderName: any = orderDetails.orderName
    // paymentData?: {
    //   payments: PaymentAmount[];
    //   paymentType: PaymentType;
    // }
  ) => {
    const orderPayload = {
      items: items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        quantity: item.quantity,
        sellingPrice: item.product.price,
        beverageType: item.beverageCondition ?? null,
      })),
      orderName: orderName,
      // payments: paymentData?.payments || [],
      // paymentStatus: paymentData?.paymentType === "pay-now" ? "PAID" : "PENDING",
      totalAmount: getTotalPrice(),
    };

    await confirmOrder(orderPayload)
      .then((data) => {
        toast({
          title: "Order Placed",
          description: ((data as {message: string}).message) ?? "Order has been placed and added to customer tab!",
          variant: "success",
        });
        clearCart();
        localStorage.removeItem("isAsynchonized");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        if (user?.role !== "WAITER") {
          router.push(`/dashboard/bar/manager/orders?view-details=${orderDetails.id ?? (data as {orderId: number}).orderId}`);
        }else{
          router.push(`/dashboard/bar/waiters/catalog`);
        }

        setOpen(false);
      })
      .catch((error) => {
        toast({
          title: "Order Failed",
          description: error.message,
          variant: "error",
        });
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      orderName: orderDetails?.orderName || "",
    },
    validationSchema: yup.object({
      orderName: yup.string().required("Order name is required"),
    }),
    onSubmit: async (values) => {
      await handleConfirmOrder(values.orderName);
      // setOrderData(values);
      // setShowPayment(true);
    },
  });

  // const handlePaymentConfirm = (paymentData: {
  //   payments: PaymentAmount[];
  //   paymentType: PaymentType;
  // }) => {
  //   if (orderData) {
  //     handleConfirmOrder(orderData, paymentData);
  //   }
  //   setShowPayment(false);
  // };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {orderDetails?.orderName !== "" &&
        orderDetails?.orderName !== undefined ? (
          <Button
          disabled={confirmingOrder}
            className="w-full cursor-pointer disabled:cursor-not-allowed"
            size="lg"
            onClick={() => handleConfirmOrder()}
          >
            {confirmingOrder ? (
              <>
                <LoadingSpinner size="sm" /> Saving
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Confirm Order
              </>
            )}
          </Button>
        ) : (
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer" size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Confirm Order
            </Button>
          </DialogTrigger>
        )}

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription>
              Please enter order details to place the order. You can choose to
              pay now or later.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="order-name">Order Name / Table</Label>
                <Input
                  id="order-name"
                  type="text"
                  name="orderName"
                  readOnly={
                    orderDetails?.orderName !== "" &&
                    orderDetails?.orderName !== undefined
                  }
                  placeholder="e.g Table 1, Eric, Room 5"
                  value={formik.values.orderName}
                  onChange={formik.handleChange}
                  className={formik.errors.orderName ? "border-red-500" : ""}
                />
                {formik.errors.orderName && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.orderName}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold text-primary">
                    {getTotalPrice().toFixed(2)} Rwf
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  You can pay now or add to customer tab for later payment
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={confirmingOrder}
                className="cursor-pointer"
              >
                {confirmingOrder
                  ? "Processing..."
                  : user?.role !== "WAITER"
                  ? "Continue to Payment"
                  : "Save Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        totalAmount={getTotalPrice()}
        orderName={orderData?.orderName}
        onConfirmPayment={handlePaymentConfirm}
        isProcessing={confirmingOrder}
      /> */}
    </>
  );
}
