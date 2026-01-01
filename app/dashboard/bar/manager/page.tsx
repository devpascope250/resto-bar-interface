// "use client";
// import { useAuthStore } from "@/lib/store/auth-store";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { LoginForm } from "@/components/auth/login-form";
// import { useApi } from "@/hooks/api-hooks";
// import { Badge } from "@/components/ui/badge";
// import { keepPreviousData } from "@tanstack/react-query";
// interface OrderStats {
//   countOrders: number;
//   countProducts: number;
//   pendingOrders: number;
//   recent5Orders: Orders[];
//   qstats: SuccessRateDetails;
// }

// interface SuccessRateDetails {
//   completeOrders: number;
//   pendingOrders: number;
//   cancelledOrders: number;
//   successRate: string;
//   revenues: number;
// }
// export default function DashboardPage() {
//   const user = useAuthStore((state) => state.user);
//   const { useApiQuery } = useApi();
//   const { data: dataStats, isLoading } = useApiQuery<OrderStats>(
//     ["stats"],
//     "/bar/stats/get",
//     {
//       staleTime: 10 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
//       placeholderData: keepPreviousData,
//       retry: false
//     }
//   );

//   if (!user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background p-4">
//         <LoginForm />
//       </div>
//     );
//   }

//   const stats = [
//     {
//       title: "Total Orders",
//       value: dataStats?.countOrders || 0,
//       icon: ShoppingCart,
//       description: user?.role === "MANAGER" ? "All orders" : "Your orders",
//     },
//     {
//       title: "Products",
//       value: dataStats?.countProducts || 0,
//       icon: Package,
//       description:
//         user?.role === "MANAGER" ? "Total products" : "Available products",
//     },
//     {
//       title: "Pending Orders",
//       value: dataStats?.pendingOrders || 0,
//       icon: TrendingUp,
//       description: "Awaiting processing",
//     },
//     {
//       title: "Total Revenue",
//       value: `${dataStats?.qstats.revenues.toFixed(2) || "0.00"} Rwf`,
//       icon: DollarSign,
//       description: user?.role === "MANAGER" ? "All time" : "Your total",
//     },
//   ];

//   return (
//     <div className="p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground">
//           Welcome back, {user?.name}
//         </h1>
//         <p className="text-muted-foreground">
//           {user?.role === "MANAGER"
//             ? "Manage all orders and products across the platform"
//             : `Manage your ${
//                 user?.partnerType === "BARRESTAURANT"
//                   ? "BAR RESTAURANT"
//                   : user?.partnerType
//               } orders`}
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <Card key={stat.title} className="border-border/50">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {stat.title}
//                 </CardTitle>
//                 <Icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 {isLoading ? (
//                   <Skeleton className="h-8 w-20" />
//                 ) : (
//                   <>
//                     <div className="text-2xl font-bold text-foreground">
//                       {stat.value}
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       {stat.description}
//                     </p>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <div className="mt-8 grid gap-6 lg:grid-cols-2">
//         <Card className="border-border/50">
//           <CardHeader>
//             <CardTitle className="text-foreground">Recent Orders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-3">
//                 {[1, 2, 3].map((i) => (
//                   <Skeleton key={i} className="h-16 w-full" />
//                 ))}
//               </div>
//             ) : dataStats?.recent5Orders && dataStats.recent5Orders.length > 0 ? (
//               <div className="space-y-4">
//                 {dataStats.recent5Orders.slice(0, 5).map((order) => (
//                   <div
//                     key={order.id}
//                     className="flex items-center justify-between border-b border-border pb-3 last:border-0"
//                   >
//                     <div>
//                       <p className="font-medium text-foreground">{order.id}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {order.orderName}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                         <Badge variant={order.status === "COMPLETED" ? "default" : "destructive"}>{order.status.toLocaleLowerCase()}</Badge>
//                       <p className="font-medium text-foreground">
//                         {order.totalPrice.toFixed(2)} Rwf
//                       </p>

//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No orders yet</p>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="border-border/50">
//           <CardHeader>
//             <CardTitle className="text-foreground">Quick Stats</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Completed Orders
//                 </span>
//                 <span className="font-medium text-foreground">
//                   {dataStats?.qstats.completeOrders || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Processing Orders
//                 </span>
//                 <span className="font-medium text-foreground">
//                   {dataStats?.qstats.pendingOrders || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Cancelled Orders
//                 </span>
//                 <span className="font-medium text-foreground">
//                   {dataStats?.qstats.cancelledOrders || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between border-t border-border pt-4">
//                 <span className="text-sm font-medium text-foreground">
//                   Success Rate
//                 </span>
//                 <span className="font-bold text-foreground">
//                   {dataStats?.qstats.successRate}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useAuthStore } from "@/lib/store/auth-store";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Package, ShoppingCart, TrendingUp, DollarSign, Calendar } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { LoginForm } from "@/components/auth/login-form";
// import { useApi } from "@/hooks/api-hooks";
// import { Badge } from "@/components/ui/badge";
// import { keepPreviousData } from "@tanstack/react-query";
// import { useState } from "react";
// import { DateRange } from "react-day-picker";
// import { addDays, format } from "date-fns";

// // Chart components
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';

// // Date Picker Component
// import { Button } from "@/components/ui/button";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";

// interface OrderStats {
//   countOrders: number;
//   countProducts: number;
//   pendingOrders: number;
//   recent5Orders: Orders[];
//   qstats: SuccessRateDetails;
//   // Add these for chart data
//   revenueData: RevenueData[];
//   orderStatusData: OrderStatusData[];
//   dailyOrders: DailyOrderData[];
// }

// interface SuccessRateDetails {
//   completeOrders: number;
//   pendingOrders: number;
//   cancelledOrders: number;
//   successRate: string;
//   revenues: number;
// }

// interface RevenueData {
//   date: string;
//   revenue: number;
//   orders: number;
// }

// interface OrderStatusData {
//   name: string;
//   value: number;
//   color: string;
// }

// interface DailyOrderData {
//   date: string;
//   orders: number;
//   completed: number;
// }

// // Mock data for demonstration - replace with actual API data
// const mockChartData = {
//   revenueData: [
//     { date: "2024-01-01", revenue: 45000, orders: 12 },
//     { date: "2024-01-02", revenue: 52000, orders: 15 },
//     { date: "2024-01-03", revenue: 48000, orders: 21000 },
//     { date: "2024-01-04", revenue: 61000, orders: 18 },
//     { date: "2024-01-05", revenue: 55000, orders: 16 },
//     { date: "2024-01-06", revenue: 62000, orders: 20 },
//     { date: "2024-01-07", revenue: 68000, orders: 22 },
//     { date: "2024-01-08", revenue: 64000, orders: 18 },
//     { date: "2024-01-09", revenue: 58000, orders: 15 },
//     { date: "2024-01-10", revenue: 52000, orders: 12 },
//     { date: "2024-01-11", revenue: 48000, orders: 10 },
//     { date: "2024-01-12", revenue: 42000, orders: 8 },
//     { date: "2024-01-13", revenue: 36000, orders: 6 },
//     { date: "2024-01-14", revenue: 30000, orders: 4 },
//     { date: "2024-01-15", revenue: 24000, orders: 2 },
//     { date: "2024-01-16", revenue: 18000, orders: 1 },
//     { date: "2024-01-17", revenue: 12000, orders: 23 },
//     { date: "2024-01-18", revenue: 6000, orders: 5 },
//     { date: "2024-01-19", revenue: 0, orders: 12 },
//     { date: "2024-01-20", revenue: 2000, orders: 9 },
//     { date: "2024-01-21", revenue: 0, orders: 10 },
//     { date: "2024-01-22", revenue: 0, orders: 20 },
//     { date: "2024-01-23", revenue: 18000, orders: 20 },
//     { date: "2024-01-24", revenue: 24000, orders: 25 },
//     { date: "2024-01-25", revenue: 30000, orders: 30 },
//     { date: "2024-01-26", revenue: 36000, orders: 35 },
//     { date: "2024-01-27", revenue: 42000, orders: 40 },
//   ],
//   orderStatusData: [
//     { name: "Completed", value: 65, color: "#10b981" },
//     { name: "Pending", value: 20, color: "#f59e0b" },
//     { name: "Cancelled", value: 15, color: "#ef4444" },
//   ],
//   dailyOrders: [
//     { date: "2024-01-01", orders: 12, completed: 8 },
//     { date: "2024-01-02", orders: 15, completed: 12 },
//     { date: "2024-01-03", orders: 14, completed: 10 },
//     { date: "2024-01-04", orders: 18, completed: 15 },
//     { date: "2024-01-05", orders: 16, completed: 14 },
//     { date: "2024-01-06", orders: 20, completed: 17 },
//     { date: "2024-01-07", orders: 22, completed: 19 },
//     { date: "2024-01-08", orders: 18, completed: 16 },
//     { date: "2024-01-09", orders: 15, completed: 12 },
//     { date: "2024-01-10", orders: 12, completed: 10 },
//     { date: "2024-01-11", orders: 10, completed: 8 },
//     { date: "2024-01-12", orders: 8, completed: 6 },
//     { date: "2024-01-13", orders: 6, completed: 4 },
//     { date: "2024-01-14", orders: 4, completed: 2 },
//     { date: "2024-01-15", orders: 2, completed: 1 },
//     { date: "2024-01-16", orders: 1, completed: 0 },
//     { date: "2024-01-17", orders: 0, completed: 0 },
//     { date: "2024-01-18", orders: 0, completed: 0 },
//     { date: "2024-01-19", orders: 0, completed: 0 },
//     { date: "2024-01-20", orders: 0, completed: 0 },
//     { date: "2024-01-21", orders: 0, completed: 0 },
//     { date: "2024-01-22", orders: 0, completed: 0 },
//     { date: "2024-01-23", orders: 20, completed: 10 },
//     { date: "2024-01-24", orders: 25, completed: 15 },
//     { date: "2024-01-25", orders: 30, completed: 20 },
//     { date: "2024-01-26", orders: 35, completed: 25 },
//     { date: "2024-01-27", orders: 40, completed: 30 },
//   ],
// };

// export default function DashboardPage() {
//   const user = useAuthStore((state) => state.user);
//   const { useApiQuery } = useApi();

//   // Date range state
//   const [dateRange, setDateRange] = useState<DateRange | undefined>({
//     from: addDays(new Date(), -30),
//     to: new Date(),
//   });

//   const { data: dataStats, isLoading } = useApiQuery<OrderStats>(
//     ["stats", dateRange],
//     "/bar/stats/get",
//     {
//       staleTime: 10 * 60 * 1000,
//       placeholderData: keepPreviousData,
//       retry: false
//     }
//   );

//   // Combine API data with mock chart data
//   const chartData = {
//     ...dataStats,
//     revenueData: dataStats?.revenueData || mockChartData.revenueData,
//     orderStatusData: dataStats?.orderStatusData || mockChartData.orderStatusData,
//     dailyOrders: dataStats?.dailyOrders || mockChartData.dailyOrders,
//   };

//   if (!user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background p-4">
//         <LoginForm />
//       </div>
//     );
//   }

//   const stats = [
//     {
//       title: "Total Orders",
//       value: dataStats?.countOrders || 0,
//       icon: ShoppingCart,
//       description: user?.role === "MANAGER" ? "All orders" : "Your orders",
//     },
//     {
//       title: "Products",
//       value: dataStats?.countProducts || 0,
//       icon: Package,
//       description:
//         user?.role === "MANAGER" ? "Total products" : "Available products",
//     },
//     {
//       title: "Pending Orders",
//       value: dataStats?.pendingOrders || 0,
//       icon: TrendingUp,
//       description: "Awaiting processing",
//     },
//     {
//       title: "Total Revenue",
//       value: `${dataStats?.qstats.revenues.toFixed(2) || "0.00"} Rwf`,
//       icon: DollarSign,
//       description: user?.role === "MANAGER" ? "All time" : "Your total",
//     },
//   ];

//   // Custom Tooltip for charts
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
//           <p className="font-medium text-foreground">{`Date: ${label}`}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} style={{ color: entry.color }}>
//               {`${entry.name}: ${entry.value}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="p-8">
//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">
//             Welcome back, {user?.name}
//           </h1>
//           <p className="text-muted-foreground">
//             {user?.role === "MANAGER"
//               ? "Manage all orders and products across the platform"
//               : `Manage your ${
//                   user?.partnerType === "BARRESTAURANT"
//                     ? "BAR RESTAURANT"
//                     : user?.partnerType
//                 } orders`}
//           </p>
//         </div>

//         {/* Date Range Picker */}
//         <div className="flex items-center gap-2">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant={"outline"}
//                 className={cn(
//                   "w-[300px] justify-start text-left font-normal",
//                   !dateRange && "text-muted-foreground"
//                 )}
//               >
//                 <Calendar className="mr-2 h-4 w-4" />
//                 {dateRange?.from ? (
//                   dateRange.to ? (
//                     <>
//                       {format(dateRange.from, "LLL dd, y")} -{" "}
//                       {format(dateRange.to, "LLL dd, y")}
//                     </>
//                   ) : (
//                     format(dateRange.from, "LLL dd, y")
//                   )
//                 ) : (
//                   <span>Pick a date range</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="end">
//               <CalendarComponent
//                 initialFocus
//                 mode="range"
//                 defaultMonth={dateRange?.from}
//                 selected={dateRange}
//                 onSelect={setDateRange}
//                 numberOfMonths={2}
//               />
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <Card key={stat.title} className="border-border/50">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {stat.title}
//                 </CardTitle>
//                 <Icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 {isLoading ? (
//                   <Skeleton className="h-8 w-20" />
//                 ) : (
//                   <>
//                     <div className="text-2xl font-bold text-foreground">
//                       {stat.value}
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       {stat.description}
//                     </p>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Charts Section */}
//       <div className="grid gap-6 lg:grid-cols-2 mb-8">
//         {/* Revenue Chart */}
//         <Card className="border-border/50">
//           <CardHeader>
//             <CardTitle className="text-foreground">Revenue Trend</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <Skeleton className="h-80 w-full" />
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={chartData.revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
//                   <XAxis
//                     dataKey="date"
//                     tick={{ fill: 'currentColor' }}
//                     axisLine={{ stroke: 'currentColor' }}
//                   />
//                   <YAxis
//                     tick={{ fill: 'currentColor' }}
//                     axisLine={{ stroke: 'currentColor' }}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="#8884d8"
//                     strokeWidth={2}
//                     name="Revenue (RWF)"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="orders"
//                     stroke="#82ca9d"
//                     strokeWidth={2}
//                     name="Number of Orders"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>

//         {/* Order Status Distribution */}
//         <Card className="border-border/50">
//           <CardHeader>
//             <CardTitle className="text-foreground">Order Status Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <Skeleton className="h-80 w-full" />
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={chartData.orderStatusData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {chartData.orderStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Additional Chart - Daily Orders */}
//       <Card className="border-border/50 mb-8">
//         <CardHeader>
//           <CardTitle className="text-foreground">Daily Orders Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <Skeleton className="h-80 w-full" />
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData.dailyOrders}>
//                 <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
//                 <XAxis
//                   dataKey="date"
//                   tick={{ fill: 'currentColor' }}
//                   axisLine={{ stroke: 'currentColor' }}
//                 />
//                 <YAxis
//                   tick={{ fill: 'currentColor' }}
//                   axisLine={{ stroke: 'currentColor' }}
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="orders" fill="#8884d8" name="Total Orders" />
//                 <Bar dataKey="completed" fill="#82ca9d" name="Completed Orders" />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </CardContent>
//       </Card>

//       {/* Existing Recent Orders and Quick Stats */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         <Card className="border-border/50">
//           <CardHeader>
//             <CardTitle className="text-foreground">Recent Orders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-3">
//                 {[1, 2, 3].map((i) => (
//                   <Skeleton key={i} className="h-16 w-full" />
//                 ))}
//               </div>
//             ) : dataStats?.recent5Orders && dataStats.recent5Orders.length > 0 ? (
//               <div className="space-y-4">
//                 {dataStats.recent5Orders.slice(0, 5).map((order) => (
//                   <div
//                     key={order.id}
//                     className="flex items-center justify-between border-b border-border pb-3 last:border-0"
//                   >
//                     <div>
//                       <p className="font-medium text-foreground">{order.id}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {order.orderName}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                         <Badge variant={order.status === "COMPLETED" ? "default" : "destructive"}>{order.status.toLocaleLowerCase()}</Badge>
//                       <p className="font-medium text-foreground">
//                         {order.totalPrice.toFixed(2)} Rwf
//                       </p>

//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No orders yet</p>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="border-border/50">
//           <CardHeader>
//             <CardTitle className="text-foreground">Quick Stats</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Completed Orders
//                 </span>
//                 <span className="font-medium text-foreground">
//                   {dataStats?.qstats.completeOrders || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Processing Orders
//                 </span>
//                 <span className="font-medium text-foreground">
//                   {dataStats?.qstats.pendingOrders || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Cancelled Orders
//                 </span>
//                 <span className="font-medium text-foreground">
//                   {dataStats?.qstats.cancelledOrders || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between border-t border-border pt-4">
//                 <span className="text-sm font-medium text-foreground">
//                   Success Rate
//                 </span>
//                 <span className="font-bold text-foreground">
//                   {dataStats?.qstats.successRate}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  TrendingDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/components/auth/login-form";
import { useApi } from "@/hooks/api-hooks";
import { Badge } from "@/components/ui/badge";
import { keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format, subDays } from "date-fns";

// Chart components
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

// Date Picker Component
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import DateTimeHelper from "@/lib/date-time";
import { useDebounce } from "@/hooks/useDebounce";

interface OrderStats {
  countOrders: number;
  countProducts: number;
  pendingOrders: number;
  recent5Orders: Orders[];
  qstats: SuccessRateDetails;
  // Add these for chart data
  revenueData: RevenueData[];
  orderStatusData: OrderStatusData[];
  dailyOrders: DailyOrderData[];
}

interface SuccessRateDetails {
  completeOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  successRate: string;
  revenues: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

interface DailyOrderData {
  date: string;
  orders: number;
  completed: number;
  cancelled: number;
}

// Color palette
const CHART_COLORS = {
  revenue: {
    primary: "#8b5cf6", // Purple
    gradient: "url(#revenueGradient)",
  },
  orders: {
    primary: "#10b981", // Green
    gradient: "url(#ordersGradient)",
  },
  aov: {
    primary: "#f59e0b", // Amber
  },
  completed: "#10b981",
  cancelled: "#ef4444",
  pending: "#f59e0b",
  processing: "#6366f1",
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { useApiQuery } = useApi();
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null
  );

  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const {
    data: dataStats,
    isLoading,
    isRefetching,
  } = useApiQuery<OrderStats>(
    ["stats", dateRange],
    `/bar/stats/get${
      filterStartDate && filterEndDate
        ? `?start=${filterStartDate}&&end=${filterEndDate}`
        : ""
    }`,
    {
      enabled: !filterStartDate ||
        !filterEndDate ||
        Boolean(filterStartDate && filterEndDate),
      staleTime: 10 * 60 * 1000,
      placeholderData: keepPreviousData,
      retry: false,
    }
  );

  // Combine API data with mock chart data
  const chartData = {
    ...dataStats,
    revenueData: dataStats?.revenueData ,
    orderStatusData:
      dataStats?.orderStatusData,
    dailyOrders: dataStats?.dailyOrders,
  };

  // Calculate some metrics for the cards
  const totalRevenue = chartData?.revenueData?.reduce(
    (sum, day) => sum + day.revenue,
    0
  );
  const totalOrders = chartData.revenueData?.reduce(
    (sum, day) => sum + day.orders,
    0
  );
  const averageOrderValue = totalRevenue&&totalOrders ? totalRevenue / totalOrders : 0;

  const debouncedDateFilterChange = useDebounce(
    (start: Date | null, end: Date | null) => {
      if (start && end) {
        console.log(YmdHelper(start), YmdHelper(end));
        setFilterStartDate(YmdHelper(start));
        setFilterEndDate(YmdHelper(end));
      }
    },
    500
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `Rwf ${totalRevenue?.toLocaleString()}`,
      icon: DollarSign,
      description: `${
        dateRange?.from ? format(dateRange.from, "MMM dd") : "Last 7 days"
      } - ${dateRange?.to ? format(dateRange.to, "MMM dd") : "today"}`,
      trend: "+12.5%",
    },
    {
      title: "Total Orders",
      value: totalOrders?.toLocaleString(),
      icon: ShoppingCart,
      description: `${chartData.dailyOrders?.reduce(
        (sum, day) => sum + day.completed,
        0
      )} completed`,
      trend: "+8.3%",
    },
    {
      title: "Avg Order Value",
      value: `Rwf ${averageOrderValue.toFixed(0)}`,
      icon: BarChart3,
      description: "Average per order",
      trend: "+4.2%",
    },
    {
      title: "Success Rate",
      value: dataStats?.qstats.successRate || "0%",
      icon: TrendingUp,
      description: "Order completion rate",
      trend: "+2.1%",
    },
  ];

  // Enhanced Custom Tooltip
  const RevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-4 rounded-lg shadow-lg min-w-[200px]">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}:</span>
              </div>
              <span className="font-medium text-foreground">
                {entry.name.includes("Revenue") || entry.name.includes("AOV")
                  ? `Rwf ${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for order status
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium text-foreground">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].payload.fill }}>
            {payload[0].value} orders (
            {((payload[0].value / (totalOrders ?? 1)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const handleDateFilterChange = (dates: DateRange | undefined) => {
    const { from, to } = dates || {};
    
    // Check if both dates are valid
    if (from && to) {
      debouncedDateFilterChange(from, to);
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header with Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}! Here's your business performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd, y")} -{" "}
                      {format(dateRange.to, "MMM dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(date) => {
                  setDateRange(date);
                  handleDateFilterChange(date);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
            {isRefetching && (
              <>
                &nbsp;
                <LoadingSpinner />
              </>
            )}
          </Popover>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith("+");
          return (
            <Card
              key={stat.title}
              className="border-border/50 bg-card hover:shadow-sm transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-full ${
                    index === 0
                      ? "bg-purple-100 dark:bg-purple-900"
                      : index === 1
                      ? "bg-green-100 dark:bg-green-900"
                      : index === 2
                      ? "bg-amber-100 dark:bg-amber-900"
                      : "bg-blue-100 dark:bg-blue-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      index === 0
                        ? "text-pur-600"
                        : index === 1
                        ? "text-green-600"
                        : index === 2
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                      <div
                        className={`flex items-center text-xs ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {stat.trend}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue vs Orders - Composed Chart */}
        <Card className="lg:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue & Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData.revenueData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.revenue.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.revenue.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="ordersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.orders.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.orders.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={(value) =>
                      `Rwf ${(value / 1000).toFixed(0)}K`
                    }
                    width={60}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    width={45}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke={CHART_COLORS.revenue.primary}
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                    name="Revenue (Rwf)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="orders"
                    fill={CHART_COLORS.orders.primary}
                    name="Number of Orders"
                    radius={[2, 2, 0, 0]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="averageOrderValue"
                    stroke={CHART_COLORS.aov.primary}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="Avg Order Value (Rwf)"
                    dot={{ fill: CHART_COLORS.aov.primary, strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Order Status & Metrics */}
        <Card className="lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Order Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pie Chart */}
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={chartData.orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.orderStatusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </RechartsPie>
              </ResponsiveContainer>
            )}

            {/* Legend & Metrics */}
            <div className="space-y-3">
              {chartData.orderStatusData?.map((status, index) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm text-foreground">
                      {status.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {status.value}
                    </span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      ({((status.value / (totalOrders || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Performance Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">
            Daily Order Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Legend />
                <Bar
                  dataKey="orders"
                  fill={CHART_COLORS.processing}
                  name="Total Orders"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  fill={CHART_COLORS.completed}
                  name="Completed Orders"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="cancelled"
                  fill={CHART_COLORS.cancelled}
                  name="Cancelled Orders"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      

      {/* Existing Recent Orders and Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : dataStats?.recent5Orders &&
              dataStats.recent5Orders.length > 0 ? (
              <div className="space-y-4">
                {dataStats.recent5Orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderName}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          order.status === "COMPLETED"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {order.status.toLocaleLowerCase()}
                      </Badge>
                      <p className="font-medium text-foreground">
                        {order.totalPrice.toFixed(2)} Rwf
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completed Orders
                </span>
                <span className="font-medium text-foreground">
                  {dataStats?.qstats.completeOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Processing Orders
                </span>
                <span className="font-medium text-foreground">
                  {dataStats?.qstats.pendingOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Cancelled Orders
                </span>
                <span className="font-medium text-foreground">
                  {dataStats?.qstats.cancelledOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-foreground">
                  Success Rate
                </span>
                <span className="font-bold text-foreground">
                  {dataStats?.qstats.successRate}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function YmdHelper(date: Date | null) {
  if (!date) return null;
  return DateTimeHelper.getDateFormat(date);
}
