"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Eye, Download, ShoppingCart, TrendingUp, Receipt, CreditCard, User } from "lucide-react"
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
import { PaymentMethodCodeClassification } from "@/lib/codeDefinitions"

// Define the type for sales transactions based on your JSON
export interface SalesTransaction {
  tin?: string; // TIN
  bhfId?: string; // Branch ID
  invcNo?: number; // Invoice Number
  orgInvcNo?: number; // Original Invoice Number (for returns)
  custTin?: string; // Customer TIN
  custNm?: string; // Customer Name
  prcOrdCd?: string | null; // Price Order Code
  salesTyCd?: string; // Sales Type Code
  rcptTyCd?: string; // Receipt Type Code
  pmtTyCd?: string; // Payment Type Code
  salesSttsCd?: string; // Sales Status Code
  cfmDt?: string; // Confirmed Date
  salesDt?: string; // Sales Date
  stockRlsDt?: string | null; // Stock Release Date
  cnclReqDt?: string | null; // Cancel Request Date
  cnclDt?: string | null; // Cancel Date
  rfdDt?: string | null; // Refund Date
  rfdRsnCd?: string | null; // Refund Reason Code
  totItemCnt?: number; // Total Item Count
  taxblAmtA?: number; // Taxable Amount A
  taxblAmtB?: number; // Taxable Amount B
  taxblAmtC?: number; // Taxable Amount C
  taxblAmtD?: number; // Taxable Amount D
  taxRtA?: number; // Tax Rate A
  taxRtB?: number; // Tax Rate B
  taxRtC?: number; // Tax Rate C
  taxRtD?: number; // Tax Rate D
  taxAmtA?: number; // Tax Amount A
  taxAmtB?: number; // Tax Amount B
  taxAmtC?: number; // Tax Amount C
  taxAmtD?: number; // Tax Amount D
  totTaxblAmt?: number; // Total Taxable Amount
  totTaxAmt?: number; // Total Tax Amount
  totAmt?: number; // Total Amount
  prchrAcptcYn?: string; // Purchaser Acceptance YN
  remark?: string | null; // Remark
  regrNm?: string; // Register Name
  regrId?: string; // Register ID
  modrId?: string; // Modifier ID
  modrNm?: string; // Modifier Name
  receipt?: {
    sales_transactions_id: number;
    custTIn: string;
    custMblNo: string;
    rptNo: number;
    trdeNm: string;
    adrs: string;
    topMsg: string;
    btmMsg: string;
    prchrAcptcYn: string;
  };
  itemList?: SalesTransactionItem[];
}

export interface SalesTransactionItem {
  itemSeq?: number; // Item Sequence
  itemClsCd?: string; // Item Classification Code
  itemCd?: string; // Item Code
  itemNm?: string; // Item Name
  bcd?: string; // Barcode
  pkgUnitCd?: string; // Package Unit Code
  pkg?: number; // Package
  qtyUnitCd?: string; // Quantity Unit Code
  qty?: number; // Quantity
  prc?: number; // Price
  splyAmt?: number; // Supply Amount
  dcRt?: number; // Discount Rate
  dcAmt?: number; // Discount Amount
  isrccCd?: string | null; // ISRC Code
  isrccNm?: string | null; // ISRC Name
  isrcRt?: number | null; // ISRC Rate
  isrcAmt?: number | null; // ISRC Amount
  taxTyCd?: string; // Tax Type Code
  taxblAmt?: number; // Taxable Amount
  taxAmt?: number; // Tax Amount
  totAmt?: number; // Total Amount
}

// Helper function to parse date strings
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  
  // Handle YYYYMMDDHHmmss format
  if (dateStr.length === 14 && /^\d{14}$/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(8, 10));
    const minute = parseInt(dateStr.substring(10, 12));
    const second = parseInt(dateStr.substring(12, 14));
    return new Date(year, month, day, hour, minute, second);
  }
  
  // Handle YYYYMMDD format
  if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
  }
  
  return new Date(dateStr);
};

// Status mapping
const getStatusBadge = (salesSttsCd: string) => {
  switch (salesSttsCd) {
    case "01": // Pending
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Wait for Approval</Badge>;
    case "02": // Confirmed
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    case "03": // Cancelled
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancel Requested</Badge>;
    case "04": // Cancelled
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    case "05": // Refunded
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
    case "06": // Refunded
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Transferred</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Receipt Type mapping
const getReceiptType = (rcptTyCd: string) => {
  switch (rcptTyCd) {
    case "S": return { label: "Sale", icon: Receipt, variant: "default" };
    case "R": return { label: "Refund", icon: TrendingUp, variant: "secondary" };
    case "P": return { label: "Purchase", icon: ShoppingCart, variant: "outline" };
    default: return { label: "Unknown", icon: Receipt, variant: "outline" };
  }
};

// Payment Type mapping
const getPaymentType = (pmtTyCd: string) => {
  return PaymentMethodCodeClassification.find((py) => py.code === pmtTyCd)?.codeName;
};

// Sales Type mapping
const getSalesType = (salesTyCd: string) => {
  switch (salesTyCd) {
    case "N": return "Normal Sale";
    case "P": return "Proforma";
    case "R": return "Refund";
    default: return "Other";
  }
};

export const SalesTransactionColumns: ColumnDef<SalesTransaction>[] = [
  {
    accessorKey: "invcNo",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Invoice #
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invoiceNo = row.getValue("invcNo") as number;
      const rcptTyCd = row.original.rcptTyCd;
      const rcptType = getReceiptType(rcptTyCd || "");
      const Icon = rcptType.icon;
      
      return (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-lg">#{invoiceNo}</div>
            {row.original.orgInvcNo && row.original.orgInvcNo > 0 ?(
              <div className="text-xs text-muted-foreground">
                Refund for: #{row.original.orgInvcNo}
              </div>
            ) : ""}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "salesSttsCd",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("salesSttsCd") as string;
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "salesDt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date & Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue("salesDt") as string;
      const cfmDateStr = row.original.cfmDt;
      const date = parseDate(dateStr);
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{format(date, "MMM dd, yyyy")}</div>
          <div className="text-sm text-muted-foreground">
            {format(date, "HH:mm:ss")}
          </div>
          {cfmDateStr && (
            <div className="text-xs text-green-600 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              Confirmed
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "custNm",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.custNm || "Walk-in Customer";
      const mobile = row.original.receipt?.custMblNo;
      const tin = row.original.custTin;
      
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{customer}</span>
          </div>
          {mobile && (
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              📱 {mobile}
            </div>
          )}
          {tin && tin.trim() !== "" && (
            <Badge variant="outline" className="text-xs">
              TIN: {tin}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Details",
    cell: ({ row }) => {
      const rcptTyCd = row.original.rcptTyCd;
      const pmtTyCd = row.original.pmtTyCd;
      const salesTyCd = row.original.salesTyCd;
      const rfdRsnCd = row.original.rfdRsnCd;
      
      const rcptType = getReceiptType(rcptTyCd || "");
      const paymentType = getPaymentType(pmtTyCd || "");
      const salesType = getSalesType(salesTyCd || "");
      
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={rcptType.variant as any} className="text-xs">
              {rcptType.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {salesType}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-3 w-3" />
            <span className="text-muted-foreground">{paymentType}</span>
          </div>
          {rfdRsnCd && (
            <div className="text-xs text-red-600">
              Refund Reason: {rfdRsnCd}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "itemDetails",
    header: "Items",
    cell: ({ row }) => {
      const itemList = row.original.itemList || [];
      const totalItems = row.original.totItemCnt || 0;
      const totalAmount = row.original.totAmt || 0;
      
      if (itemList.length === 0) {
        return <div className="text-muted-foreground">No items</div>;
      }
      
      const trigger = (
        <div className="space-y-2 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors">
          <div className="font-medium">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </div>
          <div className="flex flex-wrap gap-2">
            {itemList.slice(0, 3).map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs whitespace-nowrap line-clamp-1 max-w-[250px]">
                {item.itemNm || `Item ${index + 1}`}
              </Badge>
            ))}
            {itemList.length > 3 && (
              <Badge variant="secondary" className="text-xs whitespace-nowrap">
                +{itemList.length - 3} more
              </Badge>
            )}
          </div>
          <div className="text-xs text-primary font-medium">
            Click to view details →
          </div>
        </div>
      );

      return (
        <ItemsDialog
          items={itemList}
          trigger={trigger}
          transactionId={row.original.invcNo || 0}
          totalItems={totalItems}
        />
      );
    },
  },
  {
    accessorKey: "taxDetails",
    header: "Tax Breakdown",
    cell: ({ row }) => {
      const taxRate = row.original.taxRtB || 0;
      const taxAmount = row.original.taxAmtB || 0;
      const taxableAmount = row.original.taxblAmtB || 0;
      const totalTax = row.original.totTaxAmt || 0;
      
      return (
        <div className="space-y-1 text-right">
          <div className="text-sm">
            <span className="text-muted-foreground">Rate: </span>
            <span className="font-medium">{taxRate}%</span>
          </div>
          <div className="text-sm whitespace-nowrap">
            <span className="text-muted-foreground">Tax: </span>
            <span className="font-medium">{taxAmount.toLocaleString()} RWF</span>
          </div>
          {totalTax > taxAmount && (
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Total Tax: {totalTax.toLocaleString()} RWF
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totAmt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Total Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const total = row.getValue("totAmt") as number;
      const taxable = row.original.totTaxblAmt || 0;
      const tax = row.original.totTaxAmt || 0;
      
      return (
        <div className="text-right">
          <div className="font-bold text-lg">
            {total.toLocaleString()} RWF
          </div>
          <div className="text-xs text-muted-foreground">
            Taxable: {taxable.toLocaleString()} RWF
          </div>
          <div className="text-xs text-muted-foreground">
            Tax: {tax.toLocaleString()} RWF
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "receiptInfo",
    header: "Receipt Info",
    cell: ({ row }) => {
      const receipt = row.original.receipt;
      const prchrAcptcYn = row.original.prchrAcptcYn;
      
      if (!receipt) return <div className="text-muted-foreground">No receipt</div>;
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{receipt.trdeNm}</div>
          <div className="text-xs text-muted-foreground">{receipt.adrs}</div>
          {/* <div className="flex items-center gap-2 mt-1">
            <Badge variant={prchrAcptcYn === "Y" ? "default" : "outline"} className="text-xs">
              {prchrAcptcYn === "Y" ? "Accepted" : "Not Accepted"}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Copy #{receipt.rptNo}
            </Badge>
          </div> */}
        </div>
      );
    },
  },
  {
    accessorKey: "regrNm",
    header: "Processed By",
    cell: ({ row }) => {
      const regrNm = row.original.regrNm;
      const modrNm = row.original.modrNm;
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{regrNm}</div>
          {modrNm && modrNm !== regrNm && (
            <div className="text-xs text-muted-foreground">
              Modified by: {modrNm}
            </div>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "actions",
  //   header: "Actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const transaction = row.original;
  //     const router = useRouter();
      
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem
  //             className="cursor-pointer flex items-center gap-2"
  //             onClick={() => {
  //               // Navigate to transaction details
  //               router.push(`/dashboard/sales/${transaction.invcNo}`);
  //             }}
  //           >
  //             <Eye className="h-4 w-4" />
  //             View Details
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             className="cursor-pointer flex items-center gap-2"
  //             onClick={() => {
  //               console.log("Downloading receipt for invoice:", transaction.invcNo);
  //               // Implement download logic here
  //             }}
  //           >
  //             <Download className="h-4 w-4" />
  //             Download Receipt
  //           </DropdownMenuItem>
  //           {transaction.rcptTyCd === "S" && transaction.salesSttsCd === "02" && (
  //             <DropdownMenuItem
  //               className="cursor-pointer text-red-600"
  //               onClick={() => {
  //                 console.log("Processing return for invoice:", transaction.invcNo);
  //               }}
  //             >
  //               Process Re
  //             </DropdownMenuItem>
  //           )}
  //           {transaction.custNm && (
  //             <DropdownMenuItem
  //               className="cursor-pointer"
  //               onClick={() => {
  //                 router.push(`/dashboard/customers?search=${encodeURIComponent(transaction.custNm || '')}`);
  //               }}
  //             >
  //               View Customer History
  //             </DropdownMenuItem>
  //           )}
  //           <DropdownMenuItem
  //             className="cursor-pointer"
  //             onClick={() => {
  //               // Print receipt
  //               window.print();
  //             }}
  //           >
  //             Print Receipt
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];