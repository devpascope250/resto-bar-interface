// "use client"

// import type { ColumnDef } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import { ArrowUpDown, MoreHorizontal, Eye, Download, ShoppingCart, TrendingUp } from "lucide-react"
// import { format } from "date-fns"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useRouter } from "next/navigation"
// import { Badge } from "@/components/ui/badge"
// import { DateUtils } from "@/lib/date-utils"

// // Define the type for purchase/sales transactions
// export interface PurchaseSalesTransaction {
//   id?: number; // auto increment
//   tin?: string; // TIN
//   bhfId?: string;
//   spplrTin?: string; // Supplier TIN
//   spplrNm?: string; // Supplier Name
//   spplrBhfId?: string; // Supplier Branch Id
//   spplrInvcNo?: number; // Supplier Invoice Number
//   prcOrdCd?: string | null // purchase Code
//   rcptTyCd?: string // Receipt type
//   pmtTyCd?: string  // payment Type code
//   cfmDt?: string // validated date
//   salesDt?: string // Sale Date
//   stockRlsDt?: string  // Stock Release date
//   totItemCnt?: number // Total Item Count
//   taxblAmtA?: number  // Taxable Amount A
//   taxblAmtB?: number  // Taxable Amount B
//   taxblAmtC?: number  // Taxable Amount c
//   taxblAmtD?: number  // Taxable Amount D
//   taxRtA?: number   // Tax Rate A
//   taxRtB?: number   // Tax Rate B
//   taxRtC?: number   // Tax Rate C
//   taxRtD?: number   // Tax Rate D
//   taxAmtA?: number   // Tax Amount A
//   taxAmtB?: number   // Tax Amount B
//   taxAmtC?: number   // Tax Amount C
//   taxAmtD?: number   // Tax Amount C
//   totTaxblAmt?: number // Total Taxable Amount
//   totTaxAmt?: number // Total Tax Amount
//   totAmt?: number   // Total Amount
//   remark?: string   // Remark
//   createdAt?: Date;
//   itemList?: PurchaseSalesTransactionItem[];
// }

// export interface PurchaseSalesTransactionItem {
//   id?: number; // auto increment
//   purchaseSalesTransactionId?: number; // Purchase Sales Transaction Id
//   itemSeq?: number  // Item Sequence Number
//   itemClsCd?: string  // Item Classification code
//   itemCd?: string  // Item code
//   itemNm?:  string   // Item Name
//   bcd?:     string   // Barcode
//   pkgUnitCd?: string // Package unity Code
//   pkg?: number;   // package
//   qtyUnitCd?: string // Quantity Unity Code
//   qty?:   number // Quantity
//   prc?: number // unit Price
//   splyAmt?: number // supply Ammount
//   dcRt?: number  // Discount Rate
//   dcAmt?: number // Discount Amount
//   taxTyCd?: number  // Tax Type Code
//   taxblAmt?: number  // Taxable Amount
//   taxAmt?: number  // Tax Amount
//   totAmt?:  number  //total amount   // duplicate column
//   createdAt?: Date;
// }

// export const PurchaseSalesTransactionColumns: ColumnDef<PurchaseSalesTransaction>[] = [
//   {
//     accessorKey: "id",
//     header: ({ column }) => {
//       return (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Transaction ID
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const isPurchase = row.original.prcOrdCd === "PURCHASE";
//       return (
//         <div className="flex items-center gap-2">
//           <div className="font-medium">{row.getValue("id")}</div>
//           <Badge variant={isPurchase ? "default" : "secondary"} className="text-xs">
//             {isPurchase ? <ShoppingCart className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
//             {isPurchase ? "PURCHASE" : "SALES"}
//           </Badge>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "salesDt",
//     header: ({ column }) => {
//       return (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Transaction Date
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const dateStr = row.getValue("salesDt") as string;
//       // const date = dateStr ? DateUtils.parse(dateStr) : new Date();
      
//       return (
//         <div className="flex flex-col">
//           {/* <div className="font-medium">{format(date, "MMM dd, yyyy")}</div>
//           <div className="text-xs text-muted-foreground">{format(date, "HH:mm")}</div> */}
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "cfmDt",
//     header: "Confirmed Date",
//     cell: ({ row }) => {
//       const dateStr = row.original.cfmDt;
//       if (!dateStr) return <div className="text-muted-foreground">Not confirmed</div>;
      
//       // const date = DateUtils.parse(dateStr);
//       return (
//         <div className="flex flex-col">
//           {/* <div className="font-medium">{format(date, "MMM dd, yyyy")}</div> */}
//           <Badge variant="outline" className="text-xs w-fit">
//             Confirmed
//           </Badge>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "spplrInvcNo",
//     header: "Invoice No.",
//     cell: ({ row }) => {
//       return (
//         <div className="font-mono">
//           {row.original.spplrInvcNo || "N/A"}
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "supplierInfo",
//     header: "Supplier Information",
//     cell: ({ row }) => {
//       const isPurchase = row.original.prcOrdCd === "PURCHASE";
      
//       return (
//         <div className="space-y-1">
//           <div className="font-medium">{row.original.spplrNm || "Unknown Supplier"}</div>
//           <div className="flex flex-wrap gap-2">
//             <div className="text-xs text-muted-foreground">
//               TIN: {row.original.spplrTin || "N/A"}
//             </div>
//             {row.original.spplrBhfId && (
//               <div className="text-xs text-muted-foreground">
//                 Branch: {row.original.spplrBhfId}
//               </div>
//             )}
//           </div>
//           {row.original.remark && (
//             <div className="text-xs text-muted-foreground italic">
//               Note: {row.original.remark}
//             </div>
//           )}
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "transactionType",
//     header: "Transaction Type",
//     cell: ({ row }) => {
//       const receiptType = row.original.rcptTyCd;
//       const paymentType = row.original.pmtTyCd;
      
//       return (
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="text-xs">
//               Receipt: {receiptType || "N/A"}
//             </Badge>
//             <Badge variant="outline" className="text-xs">
//               Payment: {paymentType || "N/A"}
//             </Badge>
//           </div>
//           {row.original.stockRlsDt && (
//             <div className="text-xs text-muted-foreground">
//               {/* Stock Release: {format(DateUtils.parse(row.original.stockRlsDt), "MMM dd")} */}
//             </div>
//           )}
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "itemDetails",
//     header: "Items",
//     cell: ({ row }) => {
//       const itemList = row.original.itemList || [];
//       const firstItem = itemList[0];
      
//       return (
//         <div className="space-y-2">
//           <div className="font-medium">
//             {firstItem?.itemNm || "No items"}
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Badge variant="secondary" className="text-xs">
//               Total Items: {row.original.totItemCnt || 0}
//             </Badge>
//             {firstItem && (
//               <>
//                 <Badge variant="outline" className="text-xs">
//                   Code: {firstItem.itemCd}
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   Class: {firstItem.itemClsCd}
//                 </Badge>
//               </>
//             )}
//           </div>
//           {itemList.length > 1 && (
//             <div className="text-xs text-muted-foreground">
//               +{itemList.length - 1} more items
//             </div>
//           )}
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "totTaxblAmt",
//     header: ({ column }) => {
//       return (
//         <Button variant="ghost" onClick={() => column.toggleSorting()}>
//           Taxable Amount
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const amount = row.getValue("totTaxblAmt") as number;
//       return (
//         <div className="text-right font-medium">
//           {amount?.toLocaleString()} Rwf
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "totTaxAmt",
//     header: ({ column }) => {
//       return (
//         <Button variant="ghost" onClick={() => column.toggleSorting()}>
//           Tax Amount
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const amount = row.getValue("totTaxAmt") as number;
//       const rates = [
//         { rate: row.original.taxRtA, amount: row.original.taxAmtA },
//         { rate: row.original.taxRtB, amount: row.original.taxAmtB },
//         { rate: row.original.taxRtC, amount: row.original.taxAmtC },
//         { rate: row.original.taxRtD, amount: row.original.taxAmtD }
//       ].filter(r => r.rate && r.amount);

//       return (
//         <div className="text-right space-y-1">
//           <div className="font-bold">{amount?.toLocaleString()} Rwf</div>
//           <div className="text-xs text-muted-foreground">
//             {rates.map((r, i) => `Rate ${r.rate}%`).join(", ")}
//           </div>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "totAmt",
//     header: ({ column }) => {
//       return (
//         <Button variant="ghost" onClick={() => column.toggleSorting()}>
//           Total Amount
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const amount = row.getValue("totAmt") as number;
//       return (
//         <div className="text-right">
//           <div className="font-bold text-lg">{amount?.toLocaleString()} Rwf</div>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "tin",
//     header: "Customer TIN / Branch",
//     cell: ({ row }) => {
//       return (
//         <div className="space-y-1">
//           <div className="font-medium">TIN: {row.original.tin || "N/A"}</div>
//           <div className="text-xs text-muted-foreground">
//             Branch: {row.original.bhfId || "N/A"}
//           </div>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Created At",
//     cell: ({ row }) => {
//       const date = row.getValue("createdAt") as Date;
//       return date ? (
//         <div className="text-sm text-muted-foreground">
//           {/* {format(date, "MMM dd, yyyy HH:mm")} */}
//         </div>
//       ) : null;
//     },
//   },
//   {
//     accessorKey: "actions",
//     header: "Actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const transaction = row.original;
//       const router = useRouter();
//       const isPurchase = transaction.prcOrdCd === "PURCHASE";

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem 
//               className="cursor-pointer flex items-center gap-2"
//               onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
//             >
//               <Eye className="h-4 w-4" />
//               View Transaction Details
//             </DropdownMenuItem>
//             <DropdownMenuItem 
//               className="cursor-pointer flex items-center gap-2"
//               onClick={() => {
//                 console.log("Downloading invoice:", transaction.spplrInvcNo);
//               }}
//             >
//               <Download className="h-4 w-4" />
//               Download Invoice
//             </DropdownMenuItem>
//             {transaction.itemList?.[0]?.itemCd && (
//               <DropdownMenuItem 
//                 className="cursor-pointer"
//                 onClick={() => router.push(`/dashboard/inventory/${transaction?.itemList ? transaction?.itemList[0].itemCd : ''}`)}
//               >
//                 View Item History
//               </DropdownMenuItem>
//             )}
//             {transaction.spplrTin && (
//               <DropdownMenuItem 
//                 className="cursor-pointer"
//                 onClick={() => router.push(`/dashboard/suppliers/${transaction.spplrTin}`)}
//               >
//                 {isPurchase ? "View Supplier Profile" : "View Customer Profile"}
//               </DropdownMenuItem>
//             )}
//             {transaction.tin && transaction.spplrTin && (
//               <DropdownMenuItem 
//                 className="cursor-pointer"
//                 onClick={() => router.push(`/dashboard/taxpayers/${transaction.tin}`)}
//               >
//                 View Taxpayer Profile
//               </DropdownMenuItem>
//             )}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ];









"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Eye, Download, ShoppingCart, TrendingUp } from "lucide-react"
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
import { ItemsDialog } from "../dashboard/dialog/items-dialog"
import DateTimeHelper from "@/lib/date-time"
import { PaymentMethodCodeClassification } from "@/lib/codeDefinitions"

// Define the type for purchase/sales transactions
export interface PurchaseSalesTransaction {
  id?: number; // auto increment
  tin?: string; // TIN
  bhfId?: string;
  spplrTin?: string; // Supplier TIN
  spplrNm?: string; // Supplier Name
  spplrBhfId?: string; // Supplier Branch Id
  spplrInvcNo?: number; // Supplier Invoice Number
  prcOrdCd?: string | null // purchase Code
  rcptTyCd?: string // Receipt type
  pmtTyCd?: string  // payment Type code
  cfmDt?: string // validated date
  salesDt?: string // Sale Date
  stockRlsDt?: string  // Stock Release date
  totItemCnt?: number // Total Item Count
  taxblAmtA?: number  // Taxable Amount A
  taxblAmtB?: number  // Taxable Amount B
  taxblAmtC?: number  // Taxable Amount c
  taxblAmtD?: number  // Taxable Amount D
  taxRtA?: number   // Tax Rate A
  taxRtB?: number   // Tax Rate B
  taxRtC?: number   // Tax Rate C
  taxRtD?: number   // Tax Rate D
  taxAmtA?: number   // Tax Amount A
  taxAmtB?: number   // Tax Amount B
  taxAmtC?: number   // Tax Amount C
  taxAmtD?: number   // Tax Amount C
  totTaxblAmt?: number // Total Taxable Amount
  totTaxAmt?: number // Total Tax Amount
  totAmt?: number   // Total Amount
  remark?: string   // Remark
  createdAt?: string;
  itemList?: PurchaseSalesTransactionItem[];
}

export interface PurchaseSalesTransactionItem {
  id?: number; // auto increment
  purchaseSalesTransactionId?: number; // Purchase Sales Transaction Id
  itemSeq?: number  // Item Sequence Number
  itemClsCd?: string  // Item Classification code
  itemCd?: string  // Item code
  itemNm?:  string   // Item Name
  bcd?:     string   // Barcode
  pkgUnitCd?: string // Package unity Code
  pkg?: number;   // package
  qtyUnitCd?: string // Quantity Unity Code
  qty?:   number // Quantity
  prc?: number // unit Price
  splyAmt?: number // supply Ammount
  dcRt?: number  // Discount Rate
  dcAmt?: number // Discount Amount
  taxTyCd?: string  // Tax Type Code
  taxblAmt?: number  // Taxable Amount
  taxAmt?: number  // Tax Amount
  totAmt?:  number  //total amount   // duplicate column
  createdAt?: string;
}

export const PurchaseSalesTransactionColumns = (
  handleChangeStatus: (purchaseSalesTransaction: PurchaseSalesTransaction) => void,
  pchsSttsCd: Array<{cd: string, cdNm: string}>
): ColumnDef<PurchaseSalesTransaction>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isPurchase = row.original.prcOrdCd === "PURCHASE";
      const receiptType = row.original.rcptTyCd;
      
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono font-medium">#{row.getValue("id")}</div>
          <Badge 
            variant={receiptType === "S" ? "default" : "secondary"} 
            className="text-xs"
          >
            {receiptType === "S" ? "SALE" : "PURCHASE"}
          </Badge>
        </div>
      )
    },
  },

  {
    accessorKey: "regTyCd",
    header: 'Reg Type',
    cell: ({ row }) => {
      const regTyCd = row.getValue("regTyCd") as string;
      
      return (
        <div className="flex items-center gap-2">
          <Badge 
            variant={regTyCd === "A" ? "outline" : "secondary"} 
            className="text-xs"
          >
            {(regTyCd !== null && regTyCd !== "") ? (regTyCd === "A" ? "Automatic" : "Manual") : "No type"}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "pchsSttsCd",
    header: 'Status',
    cell: ({ row }) => {
      const pchsStt = row.getValue("pchsSttsCd") as string;
      
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Badge 
            variant={(pchsStt !== "" || pchsStt !== null) ? "default" : "destructive"} 
            className="text-xs"
          >
            {
              (pchsStt !== null && pchsStt !== "") ? pchsSttsCd.find((st) => st.cd === pchsStt)?.cdNm : "Not Set"
            }
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "salesDt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Transaction Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateStr = row.getValue("salesDt") as string;
      const date = dateStr ? new Date(dateStr) : null;
      
      return (
        <div className="flex flex-col">
          {date ? (
            <>
              <div className="font-medium">{DateTimeHelper.formatInZone(date, 'MMM dd, yyyy')}</div>
              <div className="text-xs text-muted-foreground">{format(date, "HH:mm")}</div>
            </>
          ) : (
            <div className="text-muted-foreground">N/A</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "cfmDt",
    header: "Confirmed Date",
    cell: ({ row }) => {
      const dateStr = row.original.cfmDt;
      if (!dateStr) return <div className="text-muted-foreground">Not confirmed</div>;
      
      const date = new Date(dateStr);
      return (
        <div className="flex flex-col">
          <div className="font-medium whitespace-nowrap">{format(date, "MMM dd, yyyy")}</div>
          <Badge variant="outline" className="text-xs w-fit">
            Confirmed
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "spplrInvcNo",
    header: "Invoice No.",
    cell: ({ row }) => {
      const invoiceNo = row.original.spplrInvcNo;
      return (
        <div className="font-mono">
          {invoiceNo ? `#${invoiceNo}` : "N/A"}
        </div>
      )
    },
  },
  {
    accessorKey: "supplierInfo",
    header: "Supplier Information",

    cell: ({ row }) => {
      const receiptType = row.original.rcptTyCd;      
      return (
        <div className="space-y-1">
          <div className="font-medium">{row.original.spplrNm || "Unknown"}</div>
          <div className="flex flex-wrap gap-2">
            <div className="text-xs text-muted-foreground">
              TIN: {row.original.spplrTin || "N/A"}
            </div>
            {row.original.spplrBhfId && row.original.spplrBhfId !== "00" && (
              <div className="text-xs text-muted-foreground">
                Branch: {row.original.spplrBhfId}
              </div>
            )}
          </div>
          {row.original.remark && (
            <div className="text-xs text-muted-foreground italic">
              Note: {row.original.remark}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
    cell: ({ row }) => {
      const receiptType = row.original.rcptTyCd;
      const paymentType = row.original.pmtTyCd;
      
      const receiptTypeLabels: Record<string, string> = {
        "S": "Sale",
        "P": "Purchase"
      };
      
      
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Type: {receiptTypeLabels[receiptType || ""] || receiptType || "N/A"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Payment: {PaymentMethodCodeClassification.find((py) => py.code === paymentType)?.codeName || paymentType || "N/A"}
            </Badge>
          </div>
          {row.original.stockRlsDt && (
            <div className="text-xs text-muted-foreground">
              Stock Release: {format(new Date(row.original.stockRlsDt), "MMM dd")}
            </div>
          )}
        </div>
      )
    },
  },
  {
  accessorKey: "itemDetails",
  header: "Items",
  cell: ({ row }) => {
    const itemList = row.original.itemList || [];
    const itemCount = row.original.totItemCnt || 0;
    const transactionId = row.original.id || 0;
    
    const trigger = (
      <div className="space-y-2 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors">
        <div className="font-medium">
          {itemCount} Item{itemCount !== 1 ? 's' : ''}
        </div>
        {itemList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {itemList.slice(0, 2).map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {item.itemNm || `Item ${index + 1}`}
              </Badge>
            ))}
            {itemList.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{itemList.length - 2} more
              </Badge>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No item details
          </div>
        )}
        {itemList.length > 0 && (
          <div className="text-xs text-primary font-medium">
            Click to view all items →
          </div>
        )}
      </div>
    );

    return (
      <ItemsDialog
        items={itemList}
        trigger={trigger}
        transactionId={transactionId}
        totalItems={itemCount}
      />
    )
  },
},
  {
    accessorKey: "totTaxblAmt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Taxable Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("totTaxblAmt") as number;
      return (
        <div className="text-right font-medium">
          {amount?.toLocaleString('en-US')} RWF
        </div>
      )
    },
  },
  {
    accessorKey: "totTaxAmt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tax Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("totTaxAmt") as number;
      const rates = [
        { rate: row.original.taxRtA, amount: row.original.taxAmtA },
        { rate: row.original.taxRtB, amount: row.original.taxAmtB },
        { rate: row.original.taxRtC, amount: row.original.taxAmtC },
        { rate: row.original.taxRtD, amount: row.original.taxAmtD }
      ].filter(r => r.rate !== undefined && r.amount !== undefined);

      return (
        <div className="text-right space-y-1">
          <div className="font-bold">{amount?.toLocaleString('en-US')} RWF</div>
          {rates.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {rates.map((r, i) => `${r.rate}%`).join(", ")}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "totAmt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("totAmt") as number;
      const taxAmount = row.original.totTaxAmt || 0;
      const taxableAmount = row.original.totTaxblAmt || 0;
      
      return (
        <div className="text-right">
          <div className="font-bold text-lg">{amount?.toLocaleString('en-US')} RWF</div>
          <div className="text-xs text-muted-foreground">
            Tax: {taxAmount.toLocaleString('en-US')} RWF
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "tin",
    header: "Customer TIN / Branch",
    cell: ({ row }) => {
      const receiptType = row.original.rcptTyCd;
      const label = receiptType === "S" ? "Customer" : "Buyer";
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{label} <span className="whitespace-nowrap"> TIN: {row.original.tin || "N/A"}</span></div>
          <div className="text-xs text-muted-foreground">
            Branch: {row.original.bhfId || "00"}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const dateStr = row.original.createdAt;
      if (!dateStr) return null;
      
      const date = new Date(dateStr);
      return (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {format(date, "MMM dd, yyyy HH:mm aa")}
        </div>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;
      const router = useRouter();
      const receiptType = transaction.rcptTyCd;
      const isSale = receiptType === "S";

      return (
        <Button variant={"default"} size={"sm"} className="cursor-pointer " onClick={()=>handleChangeStatus(row.original)}>Change Status</Button>
      )
    },
  },
];