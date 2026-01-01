"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DateUtils } from "@/lib/date-utils";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Define the type for imported items
export interface ImportedItem {
  id?: number; // auto increment
  tin?: string;
  bhfId?: string;
  taskCd?: string;
  dclDe?: string;
  itemSeq?: number;
  dclNo?: string;
  hsCd?: string; // HS Code
  itemNm?: string;
  itemClCd?: string;
  itemClsCd?: string;
  itemCd?: string;
  imptItemSttsCd?: string;
  orgnNatCd?: string;
  exptNatCd?: string;
  pkg?: number;
  pkgUnitCd?: string;
  qty?: number;
  qtyUnitCd?: string;
  totWt?: number;
  netWt?: number; // Gross Weight
  spplrNm?: string; // Net Weight
  agntNm?: string;
  invcFcurAmt?: number; // Agent Name
  invcFcurCd?: string; // Invoice Foreign Currency Amount
  invcFcurExcrt?: number; // Invoice Foreign Currency
  createdAt?: Date;
}

export const ImportedItemsColumns = ({
  setSelectedItems,
  selectedItems,
  setDialogItem,
  importstatsCd,
}: {
  setSelectedItems: (items: ImportedItem[]) => void;
  selectedItems: ImportedItem[];
  setDialogItem: (id: number) => void;
  importstatsCd: Array<{ cd: string; cdNm: string }>;
}): ColumnDef<ImportedItem>[] => [
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
    accessorKey: "dclDe",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Declaration Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.getValue("dclDe") as string;
      const date = dateStr ? DateUtils.parse(dateStr) : new Date();

      return (
        <div className="flex flex-col">
          <div className="font-medium">{format(date, "MMM dd, yyyy")}</div>
          <div className="text-xs text-muted-foreground">
            {format(date, "EEEE")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dclNo",
    header: "Declaration No.",
    cell: ({ row }) => {
      return (
        <div className="font-mono whitespace-nowrap">
          {row.getValue("dclNo")}
        </div>
      );
    },
  },
  {
    accessorKey: "itemCd",
    header: ({ column }) => {
      return <Button variant="ghost">Item&nbsp;Code</Button>;
    },
    cell: ({ row }) => {
      const itemCd = row.getValue("itemCd") as string;
      const id = row.getValue("id") as number;
      return (
        <div className="space-y-1">
          <Button variant={"outline"} onClick={() => setDialogItem(id)}>
            {itemCd ?? "No Item Code"}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "imptItemSttsCd",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("imptItemSttsCd") as string;
      return (
        <Badge
          className="font-medium flex whitespace-nowrap"
          variant={status === "" || status === null ? "destructive" : "default"}
        >
          {status === "" || status === null
            ? "No Status"
            : importstatsCd?.find((st) => st.cd === status)?.cdNm ?? status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "itemNm",
    header: "Item Name",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="font-medium">{row.getValue("itemNm")}</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              HS: {row.original.hsCd}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Seq: {row.original.itemSeq}
            </Badge>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "qty",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const qty = row.getValue("qty") as number;
      const unit = row.original.qtyUnitCd;

      return (
        <div className="font-bold">
          {qty?.toLocaleString()} {unit}
        </div>
      );
    },
  },
  {
    accessorKey: "pkg",
    header: "Package",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <div className="font-medium">{row.original.pkg}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.pkgUnitCd}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "netWt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Net Weight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const weight = row.getValue("netWt") as number;
      return <div className="text-right">{weight?.toLocaleString()} kg</div>;
    },
  },
  {
    accessorKey: "totWt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Total Weight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const weight = row.getValue("totWt") as number;
      return <div className="text-right">{weight?.toLocaleString()} kg</div>;
    },
  },
  {
    accessorKey: "invcFcurAmt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Invoice Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("invcFcurAmt") as number;
      const currency = row.original.invcFcurCd;
      const rate = row.original.invcFcurExcrt;

      return (
        <div className="text-right space-y-1">
          <div className="font-medium">
            {amount?.toLocaleString()} {currency}
          </div>
          {rate && (
            <div className="text-xs text-muted-foreground">
              Rate: {rate.toLocaleString()}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "originDestination",
    header: "Origin / Export",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Origin:</span>
            <span className="font-medium">{row.original.orgnNatCd}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Export:</span>
            <span className="font-medium">{row.original.exptNatCd}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "supplierAgent",
    header: "Supplier / Agent",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          {row.original.spplrNm && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Supplier:</span>
              <span className="font-medium">{row.original.spplrNm}</span>
            </div>
          )}
          {row.original.agntNm && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Agent:</span>
              <span className="font-medium">{row.original.agntNm}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "tin",
    header: "TIN / Branch",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="font-medium">TIN: {row.original.tin}</div>
          <div className="text-xs text-muted-foreground">
            Branch: {row.original.bhfId}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date ? (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {format(date, "MMM dd, yyyy HH:mm")}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      const isSelected = selectedItems.some(
        (selected) => selected.id === item.id
      );
      const status = row.getValue("imptItemSttsCd") as string;
      return (
        <Checkbox
          className="size-5 border-blue-500"
          checked={isSelected}
          disabled={status === "3" || status === "4"}
          onCheckedChange={() => {
            if (isSelected) {
              const newSelectedItems = selectedItems.filter(
                (selected) => selected.id !== item.id
              );
              setSelectedItems(newSelectedItems);
            } else {
              setSelectedItems([...selectedItems, item]);
            }
          }}
        />
      );
    },
  },
];
