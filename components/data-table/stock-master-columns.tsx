"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Define the type for stock items based on your data
export interface StockItem {
  id: number;
  tin: string;
  bhfId: string;
  name: string;
  itemCd: string;
  rsdQty: number;
  regrNm: string;
  regrId: string;
  modrNm: string;
  modrId: string;
  createdAt: string;
}

export const StockMasterColumns = (): ColumnDef<StockItem>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "itemCd",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const itemCd = row.getValue("itemCd") as string;
      const name = row.original.name as string;
      return (
        <div className="space-y-2">
  <div className="flex items-center gap-2">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className="h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      </div>
      <code className="block pl-8 pr-3 py-1.5 text-sm font-mono bg-muted rounded-md border">
        {itemCd}
      </code>
    </div>
  </div>
  {name && (
    <div className="flex items-start">
      <div className="text-xs text-muted-foreground font-medium flex-shrink-0 pr-2">Name:</div>
      <div className="text-xs text-foreground truncate">{name}</div>
    </div>
  )}
</div>
      );
    },
  },
  {
    accessorKey: "rsdQty",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const qty = row.getValue("rsdQty") as number;
      return (
        <div className="text-center">
          <div
            className={`font-bold text-lg ${
              qty < 10
                ? "text-red-600"
                : qty < 50
                ? "text-amber-600"
                : "text-green-600"
            }`}
          >
            {qty?.toLocaleString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.getValue("createdAt") as string;
      const date = new Date(dateStr);

      return (
        <div className="flex flex-col">
          <div className="font-medium">{format(date, "MMM dd, yyyy")}</div>
          <div className="text-xs text-muted-foreground">
            {format(date, "HH:mm:ss")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="font-medium">{row.original.modrNm}</div>
          <div className="text-xs text-muted-foreground">
            ID: {row.original.modrId}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "registeredBy",
    header: "Registered By",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="font-medium">{row.original.regrNm}</div>
          <div className="text-xs text-muted-foreground">
            ID: {row.original.regrId}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Stock Status",
    cell: ({ row }) => {
      const qty = row.original.rsdQty;

      let status = "Normal";
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default";

      if (qty === 0) {
        status = "Out of Stock";
        variant = "destructive";
      } else if (qty < 10) {
        status = "Low Stock";
        variant = "destructive";
      } else if (qty < 50) {
        status = "Moderate";
        variant = "outline";
      } else {
        status = "Good";
        variant = "default";
      }

      return (
        <Badge variant={variant} className="font-medium whitespace-nowrap">
          {status}
        </Badge>
      );
    },
  },
];
