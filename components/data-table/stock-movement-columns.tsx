"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { DateUtils } from "@/lib/date-utils"

// Define the type for stock movement
export interface StockMovement {
  custTin: string;
  custBhfId: string;
  sarNo: number;
  ocrnDt: string; // Date in string format (YYYYMMDD)
  totItemCnt: number;
  totTaxblAmt: number;
  totTaxAmt: number;
  totAmt: number;
  remark: string | null;
  itemList: Array<{
    itemSeq: number;
    itemCd: string;
    itemClsCd: string;
    itemNm: string;
    bcd: string;
    pkgUnitCd: string;
    pkg: number;
    qtyUnitCd: string;
    qty: number;
    itemExprDt: string | null;
    prc: number;
    splyAmt: number;
    totDcAmt: number;
    taxblAmt: number;
    taxTyCd: string;
    taxAmt: number;
    totAmt: number;
  }>;
}

export const StockMovementColumns: ColumnDef<StockMovement>[] = [
  {
    accessorKey: "sarNo",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SAR No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("sarNo")}</div>
    },
  },
  {
    accessorKey: "ocrnDt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateStr = row.getValue("ocrnDt") as string;

      const date = dateStr ? DateUtils.parse(dateStr): new Date();
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{format(date, "MMM dd, yyyy")}</div>
          <div className="text-xs text-muted-foreground">{format(date, "EEEE")}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    cell: ({ row }) => {
      // Assuming positive quantities are "IN" and negative are "OUT"
      // You might need to adjust this logic based on your actual data
      const item = row?.original?.itemList ? row?.original?.itemList[0] : null;
      const isInbound = item? item.qty > 0 : false;
      
      return (
        <Badge variant={isInbound ? "default" : "destructive"} className="uppercase">
          {isInbound ? (
            <div className="flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              <span>IN</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <span>OUT</span>
            </div>
          )}
        </Badge>
      )
    },
  },
  {
    accessorKey: "itemDetails",
    header: "Product Details",
    cell: ({ row }) => {
      const item = row.original.itemList ? row.original.itemList[0] : null;
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{item?.itemNm}</div>
          <div className="flex flex-wrap gap-2">
            <div className="text-xs text-muted-foreground">
              Code: {item?.itemCd}
            </div>
            <div className="text-xs text-muted-foreground">
              Barcode: {item?.bcd}
            </div>
            <div className="text-xs text-muted-foreground">
              Class: {item?.itemClsCd}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const item = row.original.itemList ?  row.original.itemList[0] : null;
      const isInbound = item ? item.qty > 0 : false;
      
      return (
        <div className={`font-bold ${isInbound ? 'text-green-600' : 'text-red-600'}`}>
          {isInbound ? '+' : ''}{item?.qty} {item?.qtyUnitCd}
        </div>
      )
    },
  },
  {
    accessorKey: "itemList.0.prc",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Unit Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = row.original.itemList ? row.original.itemList[0].prc : 0;
      return <div className="text-right">{price.toLocaleString()} Rwf</div>
    },
  },
  {
    accessorKey: "itemList.0.splyAmt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Supply Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.original.itemList ? row.original.itemList[0].splyAmt : 0;
      return <div className="text-right font-medium">{amount.toLocaleString()} Rwf</div>
    },
  },
  {
    accessorKey: "itemList.0.taxAmt",
    header: "Tax Amount",
    cell: ({ row }) => {
      const tax = row.original.itemList ? row.original.itemList[0].taxAmt : 0;
      return (
        <div className="text-right">
          <div className="font-medium">{tax.toLocaleString()} Rwf</div>
          <div className="text-xs text-muted-foreground">
            ({row.original.itemList ? row.original.itemList[0].taxTyCd : ''})
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "totAmt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = row.getValue("totAmt") as number;
      return (
        <div className="text-right">
          <div className="font-bold">{total} Rwf</div>
          <div className="text-xs text-muted-foreground">
            Items: {row.original.totItemCnt}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="font-medium">TIN: {row.original.custTin}</div>
          <div className="text-xs text-muted-foreground">
            Branch ID: {row.original.custBhfId}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const movement = row.original;
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
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => router.push(`/dashboard/stock-movement/${movement.sarNo}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => {
                // You can add download functionality here
                console.log("Downloading SAR:", movement.sarNo);
              }}
            >
              Download SAR
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/inventory/${movement.itemList[0].itemCd}`)}
            >
              View Product History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];