"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download,
  Printer,
  FileText,
  Check,
  X,
  Receipt,
  CreditCard,
  ShoppingCart,
  Package,
  Percent,
  User
} from "lucide-react";
import { SalesTransaction } from "@/components/data-table/sales-report-coumns";
import { format } from "date-fns";

interface DailyReportDialogProps {
  reportType: "X" | "Z";
  transactions?: SalesTransaction[];
  summary: {
    totalSales: number;
    totalRefunds: number;
    totalItems: number;
    totalTax: number;
    normalSalesCount: number;
    normalRefundsCount: number;
    totalTransactions: number;
  };
  children: React.ReactNode;
}

export function DailyReportDialog({
  reportType,
  transactions = [],
  summary,
  children
}: DailyReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [includeAllReceipts, setIncludeAllReceipts] = useState(false);
  const [remarks, setRemarks] = useState("");

  const generateReportContent = () => {
    const now = new Date();
    const reportDate = format(now, "yyyy-MM-dd HH:mm:ss");
    
    // Group transactions by payment method
    const paymentMethods = transactions.reduce((acc, transaction) => {
      const method = transaction.pmtTyCd || "CASH";
      if (!acc[method]) acc[method] = { sales: 0, refunds: 0, count: 0 };
      
      if (transaction.rcptTyCd === "S") {
        acc[method].sales += transaction.totAmt || 0;
      } else if (transaction.rcptTyCd === "R") {
        acc[method].refunds += transaction.totAmt || 0;
      }
      acc[method].count++;
      
      return acc;
    }, {} as Record<string, { sales: number; refunds: number; count: number }>);

    // Calculate tax breakdown
    const taxBreakdown = transactions.reduce((acc, transaction) => {
      const taxRate = transaction.taxRtB || 0;
      const taxAmount = transaction.taxAmtB || 0;
      const taxableAmount = transaction.taxblAmtB || 0;
      
      if (transaction.rcptTyCd === "S") {
        // Sales
        if (!acc.sales[taxRate]) {
          acc.sales[taxRate] = { taxable: 0, tax: 0, count: 0 };
        }
        acc.sales[taxRate].taxable += taxableAmount;
        acc.sales[taxRate].tax += taxAmount;
        acc.sales[taxRate].count++;
      } else if (transaction.rcptTyCd === "R") {
        // Refunds
        if (!acc.refunds[taxRate]) {
          acc.refunds[taxRate] = { taxable: 0, tax: 0, count: 0 };
        }
        acc.refunds[taxRate].taxable += taxableAmount;
        acc.refunds[taxRate].tax += taxAmount;
        acc.refunds[taxRate].count++;
      }
      
      return acc;
    }, {
      sales: {} as Record<number, { taxable: number; tax: number; count: number }>,
      refunds: {} as Record<number, { taxable: number; tax: number; count: number }>
    });

    const reportContent = `
${reportType} DAILY REPORT
========================
Generated: ${reportDate}
Report Type: ${reportType} (${reportType === "X" ? "Interim" : "Final"})

1. BUSINESS INFORMATION
-----------------------
Trade Name: ${transactions[0]?.receipt?.trdeNm || "N/A"}
TIN: ${transactions[0]?.tin || "N/A"}
Branch ID: ${transactions[0]?.bhfId || "N/A"}

2. SUMMARY STATISTICS
---------------------
Total Sales (NS): ${summary.totalSales.toLocaleString()} RWF
Total Refunds (NR): ${summary.totalRefunds.toLocaleString()} RWF
Net Sales: ${(summary.totalSales - summary.totalRefunds).toLocaleString()} RWF

Number of Sales Receipts (NS): ${summary.normalSalesCount}
Number of Refund Receipts (NR): ${summary.normalRefundsCount}
Total Items Sold: ${summary.totalItems}
Total Tax Collected: ${summary.totalTax.toLocaleString()} RWF

3. TAX BREAKDOWN
----------------
${Object.entries(taxBreakdown.sales).map(([rate, data]) => `
Sales @ ${rate}%:
  Taxable Amount: ${data.taxable.toLocaleString()} RWF
  Tax Amount: ${data.tax.toLocaleString()} RWF
  Receipts: ${data.count}
`).join('')}

${Object.entries(taxBreakdown.refunds).map(([rate, data]) => `
Refunds @ ${rate}%:
  Taxable Amount: ${data.taxable.toLocaleString()} RWF
  Tax Amount: ${data.tax.toLocaleString()} RWF
  Receipts: ${data.count}
`).join('')}

4. PAYMENT METHODS
------------------
${Object.entries(paymentMethods).map(([method, data]) => `
${method}:
  Sales: ${data.sales.toLocaleString()} RWF
  Refunds: ${data.refunds.toLocaleString()} RWF
  Transactions: ${data.count}
`).join('')}

5. ADDITIONAL INFORMATION
-------------------------
Opening Deposit: 0 RWF (to be configured)
Incomplete Sales: 0
Training Mode Receipts: 0
Receipt Copies (CS/CR): 0
Advance Receipts (PS): 0

6. DISCOUNTS & ADJUSTMENTS
--------------------------
Total Discounts: 0 RWF
Other Reductions: 0 RWF

7. REMARKS
----------
${remarks || "No remarks provided."}

========================
END OF ${reportType} REPORT
Generated by: ${transactions[0]?.regrNm || "System"}
CIS Designation: ${transactions[0]?.bhfId || "N/A"}
MRC: ${transactions.length}
========================
`;

    return reportContent;
  };

  const handleDownload = () => {
    const content = generateReportContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}-Report-${format(new Date(), "yyyy-MM-dd-HHmm")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setOpen(false);
  };

  const handlePrint = () => {
    const content = generateReportContent();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportType} Report</title>
            <style>
              body { font-family: monospace; margin: 20px; }
              pre { white-space: pre-wrap; }
              .report-header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="report-header">
              <h1>${reportType} DAILY REPORT</h1>
              <p>Generated: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}</p>
            </div>
            <pre>${content}</pre>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate {reportType} Daily Report
          </DialogTitle>
          <DialogDescription>
            Configure and generate a {reportType} report containing all required information as per regulations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Report Type
              </Label>
              <div className="p-2 border rounded-lg bg-muted/50">
                <span className="font-bold">{reportType} Report</span>
                <p className="text-sm text-muted-foreground">
                  {reportType === "X" 
                    ? "Summary since last Z report" 
                    : "Complete daily sales summary"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Transaction Count
              </Label>
              <div className="p-2 border rounded-lg bg-muted/50">
                <span className="font-bold">{summary.totalTransactions}</span>
                <p className="text-sm text-muted-foreground">
                  {summary.normalSalesCount} sales, {summary.normalRefundsCount} refunds
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="breakdown" 
                checked={includeBreakdown}
                onCheckedChange={(checked) => setIncludeBreakdown(checked as boolean)}
              />
              <Label htmlFor="breakdown" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Include detailed tax breakdown (rates A, B, C, D)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="receipts" 
                checked={includeAllReceipts}
                onCheckedChange={(checked) => setIncludeAllReceipts(checked as boolean)}
              />
              <Label htmlFor="receipts" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Include all receipt details (CS, CR, TS, TR, PS)
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Remarks (Optional)
            </Label>
            <Textarea
              id="remarks"
              placeholder="Add any additional notes or remarks for this report..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Report Preview</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Trade Name & TIN: {transactions[0]?.receipt?.trdeNm || "N/A"} / {transactions[0]?.tin || "N/A"}</p>
              <p>• Date & Time: {format(new Date(), "yyyy-MM-dd HH:mm:ss")}</p>
              <p>• CIS Designation & MRC: {transactions[0]?.bhfId || "N/A"} / {transactions.length}</p>
              <p>• Total Sales (NS): {summary.totalSales.toLocaleString()} RWF</p>
              <p>• Total Refunds (NR): {summary.totalRefunds.toLocaleString()} RWF</p>
              <p>• Items Sold: {summary.totalItems}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download {reportType} Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}