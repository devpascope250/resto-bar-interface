"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import DateTimeHelper from "@/lib/date-time"
export const inventoryColumns: ColumnDef<MonthlyRemport>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground">{row.original.productType}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "currentStock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Left Qty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = row.getValue("currentStock") as string;
      // const status = row.original.status

      // let colorClass = "text-green-600"
      // if (status === "low-stock") colorClass = "text-yellow-600"
      // if (status === "out-of-stock") colorClass = "text-red-600"

      return <div className={`font-bold`}>{stock} units</div>
    },
  },
  {
    accessorKey: "totalIn",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total In
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-green-600">+{row.getValue("totalIn") as number}</div>
    },
  },
  {
    accessorKey: "totalOut",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total&nbsp;Out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-red-600">-{row.getValue("totalOut")}</div>
    },
  },
  {
    accessorKey: "soldAmount",
    header: "Revenue",
    cell: ({ row }) => {
      const total = row.getValue("soldAmount") as string
      return <div className="text-sm">{total} Rwf</div>
    },
  },{
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          In&nbsp;Stock&nbsp;Value
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = row.getValue("totalAmount") as number
      return <div className="text-sm text-center">{total} Rwf</div>
    },
  },{
    accessorKey: "openingStock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Opening&nbsp;Stock
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = row.getValue("openingStock") as number
      return <div className="text-sm text-center">{total} Qty</div>
    },
  },{
    accessorKey: "closingStock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Closing&nbsp;Stock
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = row.getValue("closingStock") as number
      return <div className="text-sm text-center">{total} Qty</div>
    },
  },
  
 {
  accessorKey: "date",
  header: "Date",
  cell: ({ row }) => {
    const date = row.getValue("date") as Date | null
    return (
      <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {format(date ?? new Date(), "MMM dd, yyyy")}
      </div>
    )
  },
},
{
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;
      const date = new Date(order.date);
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
           
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={() => onUpdateStatus(order.id.toString(), OrderStatus.PENDING)}>Mark as Pending</DropdownMenuItem> */}
            
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/bar/manager/inventory-report/${order.productId.toString()}/${DateTimeHelper.getDateFormat(date)}`)}>View More</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
