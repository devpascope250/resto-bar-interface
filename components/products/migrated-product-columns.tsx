"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Lock, Unlock, Package, DollarSign, Tag } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the type for migrated products
export interface MigratedProduct {
  id: number;
  name: string;
  itemCd: string;
  price: string;
  productType: string;
  currentStock: string;
  itemClCd: string;
  itemTyCd: string;
  taxTyCd: "A" | "B" | "C" | "";
  isMigrated: boolean;
  hasLastChanged: boolean;
  migratedAt?: string;
  lastChangedAt?: string;
  createdAt: string;
}

interface MigratedProductColumnsProps {
  onTaxTypeChange: (productId: number, newTaxTyCd: "A" | "B" | "C") => void;
  isUpdating: boolean;
}

export const MigratedProductColumns = ({
  onTaxTypeChange,
  isUpdating
}: MigratedProductColumnsProps): ColumnDef<MigratedProduct>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isLocked = row.original.hasLastChanged && row.original.isMigrated;
      return (
        <div className="flex items-center gap-2">
          <div className={`font-mono font-bold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
            {row.getValue("id")}
          </div>
          {isLocked && <Lock className="h-3 w-3 text-gray-400" />}
        </div>
      );
    },
  },
  {
    accessorKey: "itemCd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Product Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const itemCd = row.getValue("itemCd") as string;
      const name = row.original.name;
      const productType = row.original.productType;
      
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Tag className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <code className="block pl-9 pr-3 py-2 text-sm font-mono bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                {itemCd}
              </code>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">{productType}</span>
            </div>
            <div className="text-xs text-gray-700 truncate flex-1">
              {name}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") as string);
      return (
        <div className="flex items-center gap-2">
          <div className="font-bold text-green-700">
            {price.toLocaleString('Rwf', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currency: 'Rwf',
              currencyDisplay: 'code',
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "currentStock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Stock Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = parseInt(row.getValue("currentStock") as string);
      const getStockColor = (qty: number) => {
        if (qty === 0) return "text-red-700 bg-red-50 border-red-200";
        if (qty < 10) return "text-amber-700 bg-amber-50 border-amber-200";
        if (qty < 50) return "text-orange-700 bg-orange-50 border-orange-200";
        return "text-green-700 bg-green-50 border-green-200";
      };
      
      return (
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg border font-bold text-center ${getStockColor(stock)}`}>
            {stock.toLocaleString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "taxTyCd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Tax Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      const isLocked = product.hasLastChanged && product.isMigrated;
      const currentTax = product.taxTyCd || "";
      
      const getTaxTypeDetails = (type: string) => {
        switch(type) {
          case "A": return { label: "Category A", color: "bg-blue-100 text-blue-800 border-blue-300" };
          case "B": return { label: "Category B", color: "bg-purple-100 text-purple-800 border-purple-300" };
          case "C": return { label: "Category C", color: "bg-indigo-100 text-indigo-800 border-indigo-300" };
          default: return { label: "Unassigned", color: "bg-gray-100 text-gray-800 border-gray-300" };
        }
      };
      
      if (isLocked) {
        const taxDetails = getTaxTypeDetails(currentTax);
        return (
          <div className="flex items-center gap-2">
            <Badge className={`${taxDetails.color} border font-medium`}>
              {taxDetails.label}
            </Badge>
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Locked</span>
          </div>
        );
      }
      
      return (
        <div className="w-40">
          <Select
            value={currentTax}
            onValueChange={(value: "A" | "B" | "C") => {
              if (value !== currentTax) {
                onTaxTypeChange(product.id, value);
              }
            }}
            disabled={isUpdating}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select tax type">
                {currentTax ? (
                  <Badge className={getTaxTypeDetails(currentTax).color}>
                    {getTaxTypeDetails(currentTax).label}
                  </Badge>
                ) : (
                  "Select category"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Category A</span>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Category B</span>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>Category C</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    accessorKey: "migrationStatus",
    header: "Migration Status",
    cell: ({ row }) => {
      const { isMigrated, hasLastChanged, migratedAt } = row.original;
      
      let status = "Pending";
      let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
      let icon = <Unlock className="h-3 w-3" />;
      
      if (isMigrated && hasLastChanged) {
        status = "Completed & Locked";
        variant = "default";
        icon = <Lock className="h-3 w-3" />;
      } else if (isMigrated) {
        status = "Migrated";
        variant = "default";
        icon = <div className="h-3 w-3 rounded-full bg-green-500"></div>;
      } else {
        status = "Pending";
        variant = "outline";
      }
      
      return (
        <div className="flex flex-col gap-1">
          <Badge variant={variant} className="font-medium gap-1">
            {icon}
            {status}
          </Badge>
          {migratedAt && (
            <div className="text-xs text-gray-500">
              {format(new Date(migratedAt), "MMM dd, yyyy")}
            </div>
          )}
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
          className="font-semibold"
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lastChangedAt = row.original.lastChangedAt;
      
      if (!lastChangedAt) {
        return (
          <div className="text-gray-400 text-sm italic">
            No updates
          </div>
        );
      }
      
      const date = new Date(lastChangedAt);
      return (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            {format(date, "MMM dd, HH:mm")}
          </div>
        </div>
      );
    },
  },
];