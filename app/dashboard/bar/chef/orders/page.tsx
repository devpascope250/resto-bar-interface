// "use client";

// import { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/hooks/use-toast";
// import { useApi } from "@/hooks/api-hooks";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Bell,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ChefHat,
//   Flame,
//   AlertCircle,
//   RefreshCw,
// } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import { keepPreviousData } from "@tanstack/react-query";

// // Real-time order interface
// interface RealTimeOrder {
//   id: string;
//   orderNumber: string;
//   distributor: string;
//   items: OrderItem[];
//   status: "PENDING" | "PREPARING" | "READY" | "CANCELLED" | "REJECTED";
//   placedAt: string;
//   estimatedTime?: number; // in minutes
//   priority?: "NORMAL" | "HIGH" | "URGENT";
//   notes?: string;
// }

// interface OrderItem {
//   id: string;
//   name: string;
//   quantity: number;
//   specialInstructions?: string;
//   category: string;
// }

// export default function ChefOrdersPage() {
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState("realtime");
//   const { useApiQuery, useApiPut, queryClient } = useApi();
//   const [selectedOrder, setSelectedOrder] = useState<RealTimeOrder | null>(null);
//   const [newOrdersCount, setNewOrdersCount] = useState(0);
//   const [soundEnabled, setSoundEnabled] = useState(true);

//   // Simulate real-time updates (in production, use WebSockets)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       refetch();
//     }, 10000); // Poll every 10 seconds

//     return () => clearInterval(interval);
//   }, []);

//   // Play sound for new orders
//   useEffect(() => {
//     if (soundEnabled && newOrdersCount > 0) {
//       // Play notification sound
//       const audio = new Audio("/notification.mp3");
//       audio.play().catch(() => {});
//     }
//   }, [newOrdersCount, soundEnabled]);

//   // Fetch real-time orders
//   const {
//     data: realtimeOrders,
//     isLoading,
//     isRefetching,
//     refetch,
//   } = useApiQuery<RealTimeOrder[]>(
//     ["chef-orders-realtime"],
//     "/chef/orders/realtime",
//     {
//       refetchInterval: 10000,
//       placeholderData: keepPreviousData,
//       // onSuccess: (data) => {
//       //   const pendingCount = data.filter(
//       //     (order) => order.status === "PENDING"
//       //   ).length;
//       //   if (pendingCount > newOrdersCount) {
//       //     setNewOrdersCount(pendingCount);
//       //     toast({
//       //       title: "New Orders!",
//       //       description: `${pendingCount - newOrdersCount} new order(s) received`,
//       //       action: (
//       //         <Button variant="outline" size="sm" onClick={() => setActiveTab("realtime")}>
//       //           View
//       //         </Button>
//       //       ),
//       //     });
//       //   }
//       // },
//     }
//   );

//   // Fetch recent orders (last 24 hours)
//   const { data: recentOrders } = useApiQuery<RealTimeOrder[]>(
//     ["chef-orders-recent"],
//     "/chef/orders/recent"
//   );

//   // Fetch rejected orders
//   const { data: rejectedOrders } = useApiQuery<RealTimeOrder[]>(
//     ["chef-orders-rejected"],
//     "/chef/orders?status=REJECTED"
//   );

//   const { mutateAsync: updateOrderStatus } = useApiPut(
//     ["orders"],
//     "/chef/orders/status"
//   );

//   // Order actions
//   const handleAcceptOrder = async (orderId: string) => {
//     try {
//       await updateOrderStatus({ orderId, status: "PREPARING" });
//       toast({
//         title: "Order Accepted",
//         description: "Order is now being prepared",
//         variant: "default",
//       });
//       refetch();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to accept order",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRejectOrder = async (orderId: string, reason?: string) => {
//     try {
//       await updateOrderStatus({ orderId, status: "REJECTED", reason });
//       toast({
//         title: "Order Rejected",
//         description: "Order has been rejected",
//         variant: "default",
//       });
//       refetch();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to reject order",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleMarkReady = async (orderId: string) => {
//     try {
//       await updateOrderStatus({ orderId, status: "READY" });
//       toast({
//         title: "Order Ready",
//         description: "Order is ready for pickup",
//         variant: "default",
//       });
//       refetch();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update order status",
//         variant: "destructive",
//       });
//     }
//   };

//   // Filter orders by status
//   const pendingOrders = realtimeOrders?.filter((o) => o.status === "PENDING") || [];
//   const preparingOrders = realtimeOrders?.filter((o) => o.status === "PREPARING") || [];
//   const readyOrders = realtimeOrders?.filter((o) => o.status === "READY") || [];

//   // Stats
//   const stats = {
//     pending: pendingOrders.length,
//     preparing: preparingOrders.length,
//     ready: readyOrders.length,
//     total: realtimeOrders?.length || 0,
//   };

//   // if (isLoading && !realtimeOrders) {
//   //   return (
//   //     <div className="p-6">
//   //       <div className="mb-6">
//   //         <Skeleton className="mb-2 h-8 w-64" />
//   //         <Skeleton className="h-4 w-96" />
//   //       </div>
//   //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//   //         {[1, 2, 3].map((i) => (
//   //           <Skeleton key={i} className="h-[400px] w-full" />
//   //         ))}
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//             <ChefHat className="h-8 w-8" />
//             Chef's Dashboard
//           </h1>
//           <p className="text-muted-foreground">
//             Manage kitchen orders in real-time
//           </p>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => refetch()}
//             disabled={isRefetching}
//           >
//             <RefreshCw className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")} />
//             Refresh
//           </Button>
          
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setSoundEnabled(!soundEnabled)}
//           >
//             <Bell className={cn("h-4 w-4 mr-2", soundEnabled && "text-green-500")} />
//             {soundEnabled ? "Mute" : "Unmute"}
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <StatCard
//           title="Pending"
//           value={stats.pending}
//           description="Awaiting acceptance"
//           icon={<Clock className="h-5 w-5" />}
//           variant="warning"
//           badge={newOrdersCount > 0 && activeTab !== "realtime" ? newOrdersCount : undefined}
//           onClick={() => setActiveTab("realtime")}
//         />
        
//         <StatCard
//           title="Preparing"
//           value={stats.preparing}
//           description="In progress"
//           icon={<Flame className="h-5 w-5" />}
//           variant="primary"
//         />
        
//         <StatCard
//           title="Ready"
//           value={stats.ready}
//           description="For pickup"
//           icon={<CheckCircle className="h-5 w-5" />}
//           variant="success"
//         />
        
//         <StatCard
//           title="Total Today"
//           value={recentOrders?.length || 0}
//           description="Orders processed"
//           icon={<ChefHat className="h-5 w-5" />}
//           variant="default"
//         />
//       </div>

//       {/* Main Content */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="realtime" className="cursor-pointer relative">
//             Real-time Orders
//             {stats.pending > 0 && (
//               <Badge className="ml-2 bg-red-500 text-white">{stats.pending}</Badge>
//             )}
//           </TabsTrigger>
//           <TabsTrigger value="recent" className="cursor-pointer">
//             Recent Orders
//           </TabsTrigger>
//           <TabsTrigger value="rejected" className="cursor-pointer">
//             Rejected Orders
//           </TabsTrigger>
//         </TabsList>

//         {/* Real-time Orders Tab */}
//         <TabsContent value="realtime" className="space-y-6">
//           <div className="grid gap-6 lg:grid-cols-3">
//             {/* Pending Orders Column */}
//             <OrderColumn
//               title="Pending"
//               orders={pendingOrders}
//               status="PENDING"
//               onOrderSelect={setSelectedOrder}
//               onAccept={handleAcceptOrder}
//               onReject={handleRejectOrder}
//               emptyMessage="No pending orders"
//               showActions
//             />

//             {/* Preparing Orders Column */}
//             <OrderColumn
//               title="Preparing"
//               orders={preparingOrders}
//               status="PREPARING"
//               onOrderSelect={setSelectedOrder}
//               onMarkReady={handleMarkReady}
//               emptyMessage="No orders in preparation"
//               showTimer
//             />

//             {/* Ready Orders Column */}
//             <OrderColumn
//               title="Ready"
//               orders={readyOrders}
//               status="READY"
//               onOrderSelect={setSelectedOrder}
//               emptyMessage="No orders ready"
//             />
//           </div>
//         </TabsContent>

//         {/* Recent Orders Tab */}
//         <TabsContent value="recent">
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Orders (Last 24 Hours)</CardTitle>
//               <CardDescription>
//                 View all orders processed in the last day
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ScrollArea className="h-[600px]">
//                 <div className="space-y-4">
//                   {recentOrders?.map((order) => (
//                     <OrderCard
//                       key={order.id}
//                       order={order}
//                       onClick={() => setSelectedOrder(order)}
//                       showStatus
//                     />
//                   ))}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Rejected Orders Tab */}
//         <TabsContent value="rejected">
//           <Card>
//             <CardHeader>
//               <CardTitle>Rejected Orders</CardTitle>
//               <CardDescription>
//                 Orders that have been rejected with reasons
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ScrollArea className="h-[600px]">
//                 <div className="space-y-4">
//                   {rejectedOrders?.map((order) => (
//                     <OrderCard
//                       key={order.id}
//                       order={order}
//                       onClick={() => setSelectedOrder(order)}
//                       showStatus
//                       showRejectReason
//                     />
//                   ))}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <OrderDetailsModal
//           order={selectedOrder}
//           isOpen={!!selectedOrder}
//           onClose={() => setSelectedOrder(null)}
//           onAccept={handleAcceptOrder}
//           onReject={handleRejectOrder}
//           onMarkReady={handleMarkReady}
//         />
//       )}
//     </div>
//   );
// }

// // Stat Card Component
// interface StatCardProps {
//   title: string;
//   value: number;
//   description: string;
//   icon: React.ReactNode;
//   variant: "default" | "warning" | "success" | "primary";
//   badge?: number;
//   onClick?: () => void;
// }

// function StatCard({ title, value, description, icon, variant, badge, onClick }: StatCardProps) {
//   const variantClasses = {
//     default: "border-border/50 bg-background",
//     warning: "border-amber-200 bg-amber-50 dark:bg-amber-950/20",
//     success: "border-green-200 bg-green-50 dark:bg-green-950/20",
//     primary: "border-blue-200 bg-blue-50 dark:bg-blue-950/20",
//   };

//   const textClasses = {
//     default: "text-foreground",
//     warning: "text-amber-700 dark:text-amber-400",
//     success: "text-green-700 dark:text-green-400",
//     primary: "text-blue-700 dark:text-blue-400",
//   };

//   return (
//     <Card
//       className={cn(
//         "border-border/50 transition-all hover:shadow-md cursor-pointer",
//         variantClasses[variant],
//         onClick && "hover:scale-[1.02]"
//       )}
//       onClick={onClick}
//     >
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardDescription className={textClasses[variant]}>
//             {title}
//           </CardDescription>
//           <div className={textClasses[variant]}>{icon}</div>
//         </div>
//         <div className="flex items-baseline gap-2">
//           <CardTitle className={cn("text-3xl", textClasses[variant])}>
//             {value}
//           </CardTitle>
//           {badge && (
//             <Badge variant="destructive" className="animate-pulse">
//               {badge} new
//             </Badge>
//           )}
//         </div>
//         <CardDescription className={textClasses[variant]}>
//           {description}
//         </CardDescription>
//       </CardHeader>
//     </Card>
//   );
// }

// // Order Column Component
// interface OrderColumnProps {
//   title: string;
//   orders: RealTimeOrder[];
//   status: RealTimeOrder["status"];
//   onOrderSelect: (order: RealTimeOrder) => void;
//   onAccept?: (orderId: string) => void;
//   onReject?: (orderId: string, reason?: string) => void;
//   onMarkReady?: (orderId: string) => void;
//   emptyMessage: string;
//   showActions?: boolean;
//   showTimer?: boolean;
// }

// function OrderColumn({
//   title,
//   orders,
//   status,
//   onOrderSelect,
//   onAccept,
//   onReject,
//   onMarkReady,
//   emptyMessage,
//   showActions = false,
//   showTimer = false,
// }: OrderColumnProps) {
//   const getStatusColor = (priority?: string) => {
//     switch (priority) {
//       case "HIGH":
//         return "bg-orange-100 border-orange-300 dark:bg-orange-950/30";
//       case "URGENT":
//         return "bg-red-100 border-red-300 dark:bg-red-950/30";
//       default:
//         return "bg-white dark:bg-gray-900";
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between">
//           <span>{title}</span>
//           <Badge variant="outline">{orders.length}</Badge>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-[600px]">
//           <div className="space-y-4">
//             {orders.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 {emptyMessage}
//               </div>
//             ) : (
//               orders.map((order) => (
//                 <div
//                   key={order.id}
//                   className={cn(
//                     "p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer",
//                     getStatusColor(order.priority)
//                   )}
//                   onClick={() => onOrderSelect(order)}
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <h4 className="font-semibold text-lg">
//                         #{order.orderNumber}
//                       </h4>
//                       <p className="text-sm text-muted-foreground">
//                         {order.distributor}
//                       </p>
//                     </div>
//                     {order.priority === "URGENT" && (
//                       <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
//                     )}
//                   </div>

//                   <div className="space-y-2 mb-3">
//                     {order.items.slice(0, 2).map((item) => (
//                       <div key={item.id} className="text-sm">
//                         <span className="font-medium">{item.quantity}x</span>{" "}
//                         {item.name}
//                       </div>
//                     ))}
//                     {order.items.length > 2 && (
//                       <div className="text-sm text-muted-foreground">
//                         +{order.items.length - 2} more items
//                       </div>
//                     )}
//                   </div>

//                   {showTimer && order.estimatedTime && (
//                     <div className="flex items-center gap-2 text-sm text-amber-600 mb-3">
//                       <Clock className="h-4 w-4" />
//                       <span>{order.estimatedTime} mins remaining</span>
//                     </div>
//                   )}

//                   {showActions && onAccept && onReject && (
//                     <div className="flex gap-2 mt-3">
//                       <Button
//                         size="sm"
//                         className="flex-1 bg-green-600 hover:bg-green-700"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onAccept(order.id);
//                         }}
//                       >
//                         <CheckCircle className="h-4 w-4 mr-2" />
//                         Accept
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         className="flex-1"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onReject(order.id, "Kitchen busy");
//                         }}
//                       >
//                         <XCircle className="h-4 w-4 mr-2" />
//                         Reject
//                       </Button>
//                     </div>
//                   )}

//                   {status === "PREPARING" && onMarkReady && (
//                     <Button
//                       size="sm"
//                       className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onMarkReady(order.id);
//                       }}
//                     >
//                       Mark as Ready
//                     </Button>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }

// // Order Card Component (for lists)
// interface OrderCardProps {
//   order: RealTimeOrder;
//   onClick: () => void;
//   showStatus?: boolean;
//   showRejectReason?: boolean;
// }

// function OrderCard({ order, onClick, showStatus, showRejectReason }: OrderCardProps) {
//   const getStatusBadge = (status: RealTimeOrder["status"]) => {
//     const variants = {
//       PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
//       PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
//       READY: "bg-green-100 text-green-800 dark:bg-green-900/30",
//       CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30",
//       REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30",
//     };
//     return (
//       <Badge variant="outline" className={cn("text-xs", variants[status])}>
//         {status}
//       </Badge>
//     );
//   };

//   return (
//     <Card
//       className="cursor-pointer hover:shadow-md transition-shadow"
//       onClick={onClick}
//     >
//       <CardContent className="p-4">
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <h4 className="font-semibold">#{order.orderNumber}</h4>
//               {showStatus && getStatusBadge(order.status)}
//             </div>
//             <p className="text-sm text-muted-foreground">
//               From: {order.distributor}
//             </p>
//             <div className="flex items-center gap-2 text-sm">
//               <Clock className="h-3 w-3" />
//               {new Date(order.placedAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </div>
//             {showRejectReason && (
//               <p className="text-sm text-red-600">
//                 Reason: Kitchen capacity exceeded
//               </p>
//             )}
//           </div>
//           <div className="text-right">
//             <p className="text-sm font-medium">
//               {order.items.length} item(s)
//             </p>
//             {order.priority === "URGENT" && (
//               <Badge variant="destructive" className="mt-2">
//                 URGENT
//               </Badge>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // Order Details Modal Component
// interface OrderDetailsModalProps {
//   order: RealTimeOrder;
//   isOpen: boolean;
//   onClose: () => void;
//   onAccept?: (orderId: string) => void;
//   onReject?: (orderId: string, reason?: string) => void;
//   onMarkReady?: (orderId: string) => void;
// }

// function OrderDetailsModal({
//   order,
//   isOpen,
//   onClose,
//   onAccept,
//   onReject,
//   onMarkReady,
// }: OrderDetailsModalProps) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
//               <p className="text-muted-foreground">From: {order.distributor}</p>
//             </div>
//             <Button variant="ghost" size="sm" onClick={onClose}>
//               ✕
//             </Button>
//           </div>

//           <div className="space-y-6">
//             {/* Order Info */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold mb-2">Order Details</h3>
//                 <p className="text-sm">
//                   Placed:{" "}
//                   {new Date(order.placedAt).toLocaleString()}
//                 </p>
//                 {order.estimatedTime && (
//                   <p className="text-sm">
//                     Estimated Time: {order.estimatedTime} minutes
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-2">Priority</h3>
//                 <Badge
//                   variant={
//                     order.priority === "URGENT"
//                       ? "destructive"
//                       : order.priority === "HIGH"
//                       ? "default"
//                       : "outline"
//                   }
//                 >
//                   {order.priority || "NORMAL"}
//                 </Badge>
//               </div>
//             </div>

//             {/* Items */}
//             <div>
//               <h3 className="font-semibold mb-3">Order Items</h3>
//               <div className="space-y-3">
//                 {order.items.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
//                   >
//                     <div>
//                       <p className="font-medium">
//                         {item.quantity}x {item.name}
//                       </p>
//                       {item.specialInstructions && (
//                         <p className="text-sm text-muted-foreground">
//                           Note: {item.specialInstructions}
//                         </p>
//                       )}
//                     </div>
//                     <Badge variant="outline">{item.category}</Badge>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Notes */}
//             {order.notes && (
//               <div>
//                 <h3 className="font-semibold mb-2">Special Notes</h3>
//                 <p className="text-sm p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
//                   {order.notes}
//                 </p>
//               </div>
//             )}

//             {/* Actions */}
//             {order.status === "PENDING" && onAccept && onReject && (
//               <div className="flex gap-3 pt-4 border-t">
//                 <Button
//                   className="flex-1 bg-green-600 hover:bg-green-700"
//                   onClick={() => {
//                     onAccept(order.id);
//                     onClose();
//                   }}
//                 >
//                   <CheckCircle className="h-4 w-4 mr-2" />
//                   Accept Order
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   className="flex-1"
//                   onClick={() => {
//                     onReject(order.id, "Kitchen capacity");
//                     onClose();
//                   }}
//                 >
//                   <XCircle className="h-4 w-4 mr-2" />
//                   Reject Order
//                 </Button>
//               </div>
//             )}

//             {order.status === "PREPARING" && onMarkReady && (
//               <Button
//                 className="w-full bg-blue-600 hover:bg-blue-700"
//                 onClick={() => {
//                   onMarkReady(order.id);
//                   onClose();
//                 }}
//               >
//                 Mark as Ready for Pickup
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/api-hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  ChefHat,
  Flame,
  AlertCircle,
  RefreshCw,
  Package,
  Utensils,
  Coffee,
  AlertTriangle,
  CheckCheck,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { keepPreviousData } from "@tanstack/react-query";

// Types based on your Prisma schema
interface Order {
  id: number;
  orderName: string;
  userId: string;
  partnerId: string;
  quantity?: number;
  dozens?: number;
  tax?: number;
  totalPrice: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  orderedAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  stockInId?: number;
  quantity?: number;
  beverageType?: string;
  dozens?: number;
  sellingPrice: number;
  totalPrice: number;
  addedAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  product: Product;
}

interface Product {
  id: number;
  name: string;
  productType: "BEVERAGE" | "FOOD" | "OTHER";
  beverageSize?: string;
  temperature?: string;
  beverageCategory?: {
    name: string;
    type: string;
  };
}

export default function ChefOrdersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const { useApiQuery, useApiPut, useApiPost, queryClient } = useApi();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [preparationTime, setPreparationTime] = useState<number>(15);

  // Fetch all orders with items
  const {
    data: allOrders,
    isLoading,
    isRefetching,
    isFetched,
    refetch,
  } = useApiQuery<Order[]>(
    ["chef-orders"],
    "/bar/chef/orders?includeItems=true",
    {
      refetchInterval: 10000,
      placeholderData: keepPreviousData
      // onSuccess: (data) => {
      //   const pendingCount = data.filter(
      //     (order) => order.status === "PENDING"
      //   ).length;
      //   if (pendingCount > newOrdersCount) {
      //     setNewOrdersCount(pendingCount);
      //     toast({
      //       title: "New Orders!",
      //       description: `${pendingCount - newOrdersCount} new order(s) received`,
      //     });
      //   }
      // },
    }
  );

  useEffect(() => {
    if (isFetched) {
      const pendingCount = allOrders?.filter(
        (order) => order.status === "PENDING"
      ).length;
      if (pendingCount &&pendingCount > newOrdersCount) {
        setNewOrdersCount(pendingCount);
        toast({
          title: "New Orders!",
          description: `${pendingCount - newOrdersCount} new order(s) received`,
          variant: "info"
        });
      }
    }
  }, [isFetched, allOrders, newOrdersCount, toast]);

  // Mutations
    const { mutateAsync: updateStatus } = useApiPost(
    ["orders"],
    `/bar/orders/change-item-status`
  );
  // Filter orders based on tab
  const filteredOrders = useMemo(() => {
    if (!allOrders) return [];
    switch (activeTab) {
      case "pending":
        return allOrders.filter(order => 
          order.status === "PENDING" && 
          order.orderItems.some(item => item.status === "PENDING")
        );
      case "preparing":
        return allOrders.filter(order =>
          order.status === "PENDING" &&
          order.orderItems.some(item => item.status === "CONFIRMED") &&
          order.orderItems.some(item => item.status === "PENDING")
        );
      case "ready":
        return allOrders.filter(order => 
          order.orderItems.every(item => 
            item.status === "CONFIRMED" || item.status === "CANCELLED"
          ) && order.status === "PENDING"
        );
      case "rejected":
        return allOrders.filter(order => 
          order.orderItems.some(item => item.status === "CANCELLED")
        );
      default:
        return allOrders;
    }
  }, [allOrders, activeTab]);

  // Group orders by type
  const foodOrders = useMemo(() => 
    filteredOrders.filter(order => 
      order.orderItems.some(item => item.product.productType === "FOOD")
    ), [filteredOrders]
  );

  const beverageOrders = useMemo(() => 
    filteredOrders.filter(order => 
      order.orderItems.some(item => item.product.productType === "BEVERAGE")
    ), [filteredOrders]
  );

  const otherOrders = useMemo(() => 
    filteredOrders.filter(order => 
      order.orderItems.some(item => item.product.productType === "OTHER")
    ), [filteredOrders]
  );

  // Calculate stats
  const stats = useMemo(() => {
    if (!allOrders) return { pending: 0, food: 0, beverage: 0, other: 0, total: 0 };
    
    const pendingOrders = allOrders.filter(order => 
      order.status === "PENDING" && 
      order.orderItems.some(item => item.status === "PENDING")
    );
    
    return {
      pending: pendingOrders.length,
      food: pendingOrders.filter(order => 
        order.orderItems.some(item => item.product.productType === "FOOD")
      ).length,
      beverage: pendingOrders.filter(order => 
        order.orderItems.some(item => item.product.productType === "BEVERAGE")
      ).length,
      other: pendingOrders.filter(order => 
        order.orderItems.some(item => item.product.productType === "OTHER")
      ).length,
      total: allOrders.length,
    };
  }, [allOrders]);

  // Order actions
  const handleAcceptOrderItem = async (itemId: number) => {
    try {
      await updateStatus({ 
        itemId, 
        status: "CONFIRMED" 
      });
      toast({
        title: "Item Accepted",
        description: "Item is now being prepared",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept item",
        variant: "destructive",
      });
    }
  };

  const handleRejectOrderItem = async (itemId: number, reason: string = "Not available") => {
    try {
      await updateStatus({ 
        itemId, 
        status: "CANCELLED",
        reason 
      });
      toast({
        title: "Item Rejected",
        description: "Item has been rejected",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject item",
        variant: "destructive",
      });
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    try {
      await updateStatus({ 
        orderId, 
        status: "COMPLETED" 
      });
      toast({
        title: "Order Completed",
        description: "Order has been marked as completed",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete order",
        variant: "destructive",
      });
    }
  };

  // Play sound for new orders
  useEffect(() => {
    if (soundEnabled && newOrdersCount > 0) {
      const audio = new Audio("/order-notif.wav");
      audio.play().catch(() => {});
    }
  }, [newOrdersCount, soundEnabled]);



  // if (isLoading && !allOrders) {
  //   return (
  //     <div className="p-6">
  //       <div className="mb-6">
  //         <Skeleton className="mb-2 h-8 w-64" />
  //         <Skeleton className="h-4 w-96" />
  //       </div>
  //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  //         {[1, 2, 3].map((i) => (
  //           <Skeleton key={i} className="h-[400px] w-full" />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-8 w-8" />
            Chef's Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage kitchen orders item by item
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="prep-time" className="text-sm">Prep Time:</Label>
            <Input
              id="prep-time"
              type="number"
              value={preparationTime}
              onChange={(e) => setPreparationTime(parseInt(e.target.value) || 15)}
              className="w-20"
              min="5"
              max="60"
            />
            <span className="text-sm">min</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            <Bell className={cn("h-4 w-4 mr-2", soundEnabled && "text-green-500")} />
            {soundEnabled ? "Mute" : "Unmute"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Pending Items"
          value={stats.pending}
          description="Items awaiting preparation"
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
          badge={newOrdersCount > 0 && activeTab !== "pending" ? newOrdersCount : undefined}
          onClick={() => setActiveTab("pending")}
        />
        
        <StatCard
          title="Food Items"
          value={stats.food}
          description="Food items to prepare"
          icon={<Utensils className="h-5 w-5" />}
          variant="primary"
        />
        
        <StatCard
          title="Beverages"
          value={stats.beverage}
          description="Drinks to prepare"
          icon={<Coffee className="h-5 w-5" />}
          variant="info"
        />
        
        <StatCard
          title="Other Items"
          value={stats.other}
          description="Miscellaneous items"
          icon={<Package className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="cursor-pointer relative">
            Pending
            {stats.pending > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{stats.pending}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preparing" className="cursor-pointer">
            Preparing
          </TabsTrigger>
          <TabsTrigger value="ready" className="cursor-pointer">
            Ready
          </TabsTrigger>
          <TabsTrigger value="rejected" className="cursor-pointer">
            Rejected
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Food Column */}
            <OrderTypeColumn
              title="Food"
              icon={<Utensils className="h-5 w-5" />}
              orders={foodOrders}
              productType="FOOD"
              onItemSelect={setSelectedItemId}
              onAcceptItem={handleAcceptOrderItem}
              onRejectItem={handleRejectOrderItem}
              emptyMessage="No food items pending"
            />

            {/* Beverages Column */}
            <OrderTypeColumn
              title="Beverages"
              icon={<Coffee className="h-5 w-5" />}
              orders={beverageOrders}
              productType="BEVERAGE"
              onItemSelect={setSelectedItemId}
              onAcceptItem={handleAcceptOrderItem}
              onRejectItem={handleRejectOrderItem}
              emptyMessage="No beverage items pending"
            />

            {/* Other Items Column */}
            <OrderTypeColumn
              title="Other Items"
              icon={<Package className="h-5 w-5" />}
              orders={otherOrders}
              productType="OTHER"
              onItemSelect={setSelectedItemId}
              onAcceptItem={handleAcceptOrderItem}
              onRejectItem={handleRejectOrderItem}
              emptyMessage="No other items pending"
            />
          </div>
        </TabsContent>

        {/* Preparing Tab */}
        <TabsContent value="preparing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Items in Preparation
              </CardTitle>
              <CardDescription>
                Items currently being prepared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PreparingItemsList
                orders={filteredOrders}
                preparationTime={preparationTime}
                onCompleteOrder={handleCompleteOrder}
                onItemSelect={setSelectedItemId}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ready Tab */}
        <TabsContent value="ready">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Ready for Pickup
              </CardTitle>
              <CardDescription>
                Orders ready to be served
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReadyOrdersList
                orders={filteredOrders}
                onCompleteOrder={handleCompleteOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Rejected Items
              </CardTitle>
              <CardDescription>
                Items that could not be prepared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RejectedItemsList
                orders={filteredOrders}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Item Details Modal */}
      {selectedItemId && allOrders && (
        <OrderItemDetailsModal
          itemId={selectedItemId}
          orders={allOrders}
          isOpen={!!selectedItemId}
          onClose={() => setSelectedItemId(null)}
          onAccept={handleAcceptOrderItem}
          onReject={handleRejectOrderItem}
          preparationTime={preparationTime}
        />
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  variant: "default" | "warning" | "info" | "primary";
  badge?: number;
  onClick?: () => void;
}

function StatCard({ title, value, description, icon, variant, badge, onClick }: StatCardProps) {
  const variantClasses = {
    default: "border-border/50 bg-background",
    warning: "border-amber-200 bg-amber-50 dark:bg-amber-950/20",
    info: "border-blue-200 bg-blue-50 dark:bg-blue-950/20",
    primary: "border-orange-200 bg-orange-50 dark:bg-orange-950/20",
  };

  const textClasses = {
    default: "text-foreground",
    warning: "text-amber-700 dark:text-amber-400",
    info: "text-blue-700 dark:text-blue-400",
    primary: "text-orange-700 dark:text-orange-400",
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        variantClasses[variant],
        onClick && "hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardDescription className={textClasses[variant]}>
            {title}
          </CardDescription>
          <div className={textClasses[variant]}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-2">
          <CardTitle className={cn("text-3xl", textClasses[variant])}>
            {value}
          </CardTitle>
          {badge && (
            <Badge variant="destructive" className="animate-pulse">
              {badge} new
            </Badge>
          )}
        </div>
        <CardDescription className={textClasses[variant]}>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// Order Type Column Component
interface OrderTypeColumnProps {
  title: string;
  icon: React.ReactNode;
  orders: Order[];
  productType: "FOOD" | "BEVERAGE" | "OTHER";
  onItemSelect: (itemId: number) => void;
  onAcceptItem: (itemId: number) => void;
  onRejectItem: (itemId: number, reason: string) => void;
  emptyMessage: string;
}

function OrderTypeColumn({
  title,
  icon,
  orders,
  productType,
  onItemSelect,
  onAcceptItem,
  onRejectItem,
  emptyMessage,
}: OrderTypeColumnProps) {
  const filteredItems = useMemo(() => {
    const items: OrderItem[] = [];
    orders.forEach(order => {
      order.orderItems.forEach(item => {
          console.log(orders);
        if (item.product.productType === productType && item.status === "PENDING") {
          items.push(item);
        }
      });
    });
    return items;
  }, [orders, productType]);



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
          <Badge variant="outline">{filteredItems.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredItems.map((item) => (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  onClick={() => onItemSelect(item.id)}
                  onAccept={() => {onAcceptItem(item.id); console.log(item);
                  }}
                  onReject={() => onRejectItem(item.id, "Not available")}
                  showActions
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Order Item Card Component
interface OrderItemCardProps {
  item: OrderItem;
  onClick: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  showStatus?: boolean;
}

function OrderItemCard({ item, onClick, onAccept, onReject, showActions, showStatus }: OrderItemCardProps) {
  const getProductIcon = (productType: string) => {
    switch (productType) {
      case "FOOD": return <Utensils className="h-4 w-4" />;
      case "BEVERAGE": return <Coffee className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20";
      case "CONFIRMED": return "border-blue-200 bg-blue-50 dark:bg-blue-950/20";
      case "CANCELLED": return "border-red-200 bg-red-50 dark:bg-red-950/20";
      default: return "border-gray-200 bg-white dark:bg-gray-900";
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer",
        getStatusColor(item.status)
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getProductIcon(item.product.productType)}
            <h4 className="font-semibold">{item.product.name}</h4>
          </div>
          <div className="text-sm text-muted-foreground">
            Order #{item.orderId}
          </div>
        </div>
        {item.product.beverageSize && (
          <Badge variant="outline" className="text-xs">
            {item.product.beverageSize}
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span>Quantity:</span>
          <span className="font-medium">
            {item.quantity} {item.dozens ? `(${item.dozens} doz)` : ''}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Price:</span>
          <span className="font-medium">
            ${item.totalPrice.toFixed(2)}
          </span>
        </div>
        {item.product.temperature && (
          <div className="flex justify-between text-sm">
            <span>Temperature:</span>
            <span className="font-medium">{item.product.temperature}</span>
          </div>
        )}
      </div>

      {showStatus && (
        <Badge
          variant={
            item.status === "PENDING" ? "outline" :
            item.status === "CONFIRMED" ? "default" :
            "destructive"
          }
          className="mb-3"
        >
          {item.status}
        </Badge>
      )}

      {showActions && onAccept && onReject && (
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              onAccept();
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

// Preparing Items List Component
interface PreparingItemsListProps {
  orders: Order[];
  preparationTime: number;
  onCompleteOrder: (orderId: number) => void;
  onItemSelect: (itemId: number) => void;
}

function PreparingItemsList({ orders, preparationTime, onCompleteOrder, onItemSelect }: PreparingItemsListProps) {
  const preparingItems = useMemo(() => {
    const items: OrderItem[] = [];
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.status === "CONFIRMED") {
          items.push(item);
        }
      });
    });
    return items;
  }, [orders]);

  const groupedByOrder = useMemo(() => {
    const groups: Record<number, { order: Order; items: OrderItem[] }> = {};
    orders.forEach(order => {
      const confirmedItems = order.orderItems.filter(item => item.status === "CONFIRMED");
      if (confirmedItems.length > 0) {
        groups[order.id] = { order, items: confirmedItems };
      }
    });
    return groups;
  }, [orders]);

  if (preparingItems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Flame className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No items currently in preparation</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6">
        {Object.entries(groupedByOrder).map(([orderId, { order, items }]) => (
          <Card key={orderId} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.orderName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Placed: {new Date(order.orderedAt).toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onCompleteOrder(order.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Complete Order
                </Button>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => onItemSelect(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {item.product.productType === "FOOD" ? (
                          <Utensils className="h-4 w-4 text-orange-600" />
                        ) : (
                          <Coffee className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="font-medium">{item.product.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.quantity}x
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <Clock className="h-4 w-4" />
                        <span>~{preparationTime} min</span>
                      </div>
                      <Badge variant="secondary">
                        Preparing
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

// Ready Orders List Component
interface ReadyOrdersListProps {
  orders: Order[];
  onCompleteOrder: (orderId: number) => void;
}

function ReadyOrdersList({ orders, onCompleteOrder }: ReadyOrdersListProps) {
  const readyOrders = useMemo(() => {
    return orders.filter(order => 
      order.orderItems.every(item => 
        item.status === "CONFIRMED" || item.status === "CANCELLED"
      ) && order.status === "PENDING"
    );
  }, [orders]);

  if (readyOrders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No orders ready for pickup</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {readyOrders.map((order) => (
          <Card key={order.id} className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-lg">Order #{order.orderName}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total: ${order.totalPrice.toFixed(2)} • Items: {order.orderItems.length}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {order.orderItems.map((item) => (
                      <Badge key={item.id} variant="outline" className="text-xs">
                        {item.quantity}x {item.product.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* <Button
                  onClick={() => onCompleteOrder(order.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark as Completed
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

// Rejected Items List Component
function RejectedItemsList({ orders }: { orders: Order[] }) {
  const rejectedItems = useMemo(() => {
    const items: OrderItem[] = [];
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.status === "CANCELLED") {
          items.push(item);
        }
      });
    });
    return items;
  }, [orders]);

  if (rejectedItems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No rejected items</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {rejectedItems.map((item) => (
          <Card key={item.id} className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <h4 className="font-semibold">{item.product.name}</h4>
                  </div>
                  <p className="text-sm">
                    Order #{item.orderId} • {item.quantity} items
                  </p>
                  <p className="text-sm text-red-600">
                    Reason: Item not available
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.addedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

// Order Item Details Modal Component
interface OrderItemDetailsModalProps {
  itemId: number;
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onAccept: (itemId: number) => void;
  onReject: (itemId: number, reason: string) => void;
  preparationTime: number;
}

function OrderItemDetailsModal({
  itemId,
  orders,
  isOpen,
  onClose,
  onAccept,
  onReject,
  preparationTime,
}: OrderItemDetailsModalProps) {
  const item = useMemo(() => {
    for (const order of orders) {
      const foundItem = order.orderItems.find(item => item.id === itemId);
      if (foundItem) return foundItem;
    }
    return null;
  }, [itemId, orders]);

  const order = useMemo(() => {
    return orders.find(o => o.orderItems.some(item => item.id === itemId));
  }, [itemId, orders]);

  if (!isOpen || !item || !order) return null;

  const isPending = item.status === "PENDING";
  const isConfirmed = item.status === "CONFIRMED";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{item.product.name}</h2>
              <p className="text-muted-foreground">
                Order #{order.orderName} • {item.product.productType}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Item Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p className="text-sm">
                  Order: {order.orderName}
                </p>
                <p className="text-sm">
                  Placed: {new Date(order.orderedAt).toLocaleString()}
                </p>
                <p className="text-sm">
                  Status: <Badge variant={
                    item.status === "PENDING" ? "outline" :
                    item.status === "CONFIRMED" ? "default" :
                    "destructive"
                  }>
                    {item.status}
                  </Badge>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Item Information</h3>
                <p className="text-sm">
                  Quantity: {item.quantity} {item.dozens && `(${item.dozens} dozen)`}
                </p>
                <p className="text-sm">
                  Price: ${item.totalPrice.toFixed(2)}
                </p>
                {item.product.beverageSize && (
                  <p className="text-sm">
                    Size: {item.product.beverageSize}
                  </p>
                )}
                {item.product.temperature && (
                  <p className="text-sm">
                    Temperature: {item.product.temperature}
                  </p>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="font-semibold mb-3">Product Information</h3>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground">
                      {item.product.productType}
                    </p>
                  </div>
                  {item.product.beverageCategory && (
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {item.product.beverageCategory.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estimated Time */}
            {isConfirmed && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Estimated Preparation Time</h4>
                    <p className="text-sm">
                      This item should be ready in approximately {preparationTime} minutes
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {isPending && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    onAccept(item.id);
                    onClose();
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Item
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    onReject(item.id, "Kitchen capacity");
                    onClose();
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Item
                </Button>
              </div>
            )}

            {isConfirmed && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  This item is currently being prepared
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}