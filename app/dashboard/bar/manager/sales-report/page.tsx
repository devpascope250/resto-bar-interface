"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { SalesTransactionColumns } from "@/components/data-table/sales-report-coumns";
import { useApi } from "@/hooks/api-hooks";
import DateTimeHelper from "@/lib/date-time";
import { useDebounce } from "@/hooks/useDebounce";
import { SalesTransaction } from "@/components/data-table/sales-report-coumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText as FileTextIcon,
  FileDown,
  Printer,
  ChevronDown,
  X,
} from "lucide-react";
import { DailyReportDialog } from "@/components/daily-report/daily-report-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "jspdf-autotable";

// Helper function to format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  } catch {
    return dateStr;
  }
};

// Helper function to format datetime
const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr || dateTimeStr.length !== 14) return "";
  try {
    const year = dateTimeStr.substring(0, 4);
    const month = dateTimeStr.substring(4, 6);
    const day = dateTimeStr.substring(6, 8);
    const hour = dateTimeStr.substring(8, 10);
    const minute = dateTimeStr.substring(10, 12);
    const second = dateTimeStr.substring(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } catch {
    return dateTimeStr;
  }
};

// Calculate transaction type summary
const calculateTransactionTypeSummary = (transactions: SalesTransaction[]) => {
  const summary = {
    NS: { count: 0, totalAmount: 0, totalTax: 0, totalItems: 0 },
    NR: { count: 0, totalAmount: 0, totalTax: 0, totalItems: 0 },
    TS: { count: 0, totalAmount: 0, totalTax: 0, totalItems: 0 },
    TR: { count: 0, totalAmount: 0, totalTax: 0, totalItems: 0 },
    PS: { count: 0, totalAmount: 0, totalTax: 0, totalItems: 0 },
  };

  transactions.forEach((transaction) => {
    const {
      salesTyCd,
      rcptTyCd,
      salesSttsCd,
      totAmt = 0,
      totTaxAmt = 0,
      totItemCnt = 0,
    } = transaction;

    if (salesSttsCd !== "02") return; // Only confirmed transactions

    let type = "";
    if (salesTyCd === "N" && rcptTyCd === "S") type = "NS";
    else if (salesTyCd === "N" && rcptTyCd === "R") type = "NR";
    else if (salesTyCd === "T" && rcptTyCd === "S") type = "TS";
    else if (salesTyCd === "T" && rcptTyCd === "R") type = "TR";
    else if (salesTyCd === "P" && rcptTyCd === "S") type = "PS";

    if (type && summary[type as keyof typeof summary]) {
      summary[type as keyof typeof summary].count++;
      summary[type as keyof typeof summary].totalAmount += totAmt;
      summary[type as keyof typeof summary].totalTax += totTaxAmt;
      summary[type as keyof typeof summary].totalItems += totItemCnt;
    }
  });

  return summary;
};

// Calculate tax category summary
const calculateTaxSummary = (transactions: SalesTransaction[]) => {
  const taxSummary = {
    A: { taxableAmount: 0, taxAmount: 0, count: 0 },
    B: { taxableAmount: 0, taxAmount: 0, count: 0 },
    C: { taxableAmount: 0, taxAmount: 0, count: 0 },
    D: { taxableAmount: 0, taxAmount: 0, count: 0 },
  };

  transactions.forEach((transaction) => {
    if (transaction.salesSttsCd !== "02") return;

    taxSummary.A.taxableAmount += transaction.taxblAmtA || 0;
    taxSummary.A.taxAmount += transaction.taxAmtA || 0;
    if ((transaction?.taxblAmtA ?? 0) > 0) taxSummary.A.count++;

    taxSummary.B.taxableAmount += transaction.taxblAmtB || 0;
    taxSummary.B.taxAmount += transaction.taxAmtB || 0;
    if ((transaction?.taxblAmtB ?? 0) > 0) taxSummary.B.count++;

    taxSummary.C.taxableAmount += transaction.taxblAmtC || 0;
    taxSummary.C.taxAmount += transaction.taxAmtC || 0;
    if ((transaction?.taxblAmtC ?? 0) > 0) taxSummary.C.count++;

    taxSummary.D.taxableAmount += transaction.taxblAmtD || 0;
    taxSummary.D.taxAmount += transaction.taxAmtD || 0;
    if ((transaction?.taxblAmtD ?? 0) > 0) taxSummary.D.count++;
  });

  return taxSummary;
};

export default function InventoryReportPage() {
  const { useApiQuery } = useApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"x-report" | "z-report">(
    "z-report",
  );
  const [isTrackingChangeReport, setIsTrackingChangeReport] = useState<
    number | null
  >(null);
  const [filterStartDate, setFilterStartDate] = useState<Date | string | null>(
    null,
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | string | null>(
    null,
  );
  const [transactionType, setTransactionType] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const debouncedDateFilterChange = useDebounce(
    (start: Date | null, end: Date | null) => {
      if (start && end) {
        setFilterStartDate(YmdHelper(start));
        setFilterEndDate(YmdHelper(end));
      }
    },
    500,
  );

  const {
    data: ReportData,
    isRefetching: isRefetching,
    isLoading: isLoading,
    refetch: refetchReport,
  } = useApiQuery<{
    data: SalesTransaction[];
    message: string;
    status: number;
  }>(
    [
      `sales-${activeTab}-report`,
      filterStartDate,
      filterEndDate,
      isTrackingChangeReport,
    ],
    `/ebm/sales-report?reportType=${activeTab === "x-report" ? "X" : "Z"}${
      filterStartDate && filterEndDate
        ? `&start_date=${filterStartDate}&&end_date=${filterEndDate}`
        : ""
    }`,
    {
      enabled:
        isTrackingChangeReport !== null ||
        !filterStartDate ||
        !filterEndDate ||
        Boolean(filterStartDate && filterEndDate),
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (ReportData?.status === 404) {
      toast({
        title: "Inform About Reports",
        description: ReportData.message,
        variant: "info",
      });
    }
  }, [ReportData]);

  const handleChangeDate = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      debouncedDateFilterChange(startDate, endDate);
    }
  };

  const handleChangeTab = (v: any) => {
    setActiveTab(v);
    setIsTrackingChangeReport(Math.random() + new Date().getTime());
  };

  // Filter transactions based on selected type
  const filteredTransactions = useMemo(() => {
    if (!ReportData?.data) return [];

    if (transactionType === "all") return ReportData.data;

    return ReportData.data.filter((transaction) => {
      const { salesTyCd, rcptTyCd } = transaction;

      if (transactionType === "NS" && salesTyCd === "N" && rcptTyCd === "S")
        return true;
      if (transactionType === "NR" && salesTyCd === "N" && rcptTyCd === "R")
        return true;
      if (transactionType === "TS" && salesTyCd === "T" && rcptTyCd === "S")
        return true;
      if (transactionType === "TR" && salesTyCd === "T" && rcptTyCd === "R")
        return true;
      if (transactionType === "PS" && salesTyCd === "P" && rcptTyCd === "S")
        return true;

      return false;
    });
  }, [ReportData?.data, transactionType]);

  // Calculate comprehensive summaries
  const transactionTypeSummary = useMemo(
    () => calculateTransactionTypeSummary(filteredTransactions),
    [filteredTransactions],
  );

  const taxSummary = useMemo(
    () => calculateTaxSummary(filteredTransactions),
    [filteredTransactions],
  );

  const generateReportSummary = (
    transactions: SalesTransaction[] | undefined,
  ) => {
    if (!transactions || transactions.length === 0) {
      return {
        totalSales: 0,
        totalRefunds: 0,
        totalItems: 0,
        totalTransactions: 0,
        totalTax: 0,
        normalSalesCount: 0,
        trainingSalesCount: 0,
        proformaSalesCount: 0,
        normalRefundsCount: 0,
        trainingRefundsCount: 0,
        currentTypeTotalAmount: 0,
        currentTypeItemCount: 0,
        currentTypeTaxAmount: 0,
        currentTypeCount: 0,
      };
    }

    let totalSales = 0;
    let totalRefunds = 0;
    let totalItems = 0;
    let totalTax = 0;
    let normalSalesCount = 0;
    let trainingSalesCount = 0;
    let proformaSalesCount = 0;
    let normalRefundsCount = 0;
    let trainingRefundsCount = 0;
    let currentTypeTotalAmount = 0;
    let currentTypeItemCount = 0;
    let currentTypeTaxAmount = 0;
    let currentTypeCount = 0;

    transactions.forEach((transaction) => {
      const total = transaction.totAmt || 0;
      const tax = transaction.totTaxAmt || 0;
      const items = transaction.totItemCnt || 0;
      const rcptTyCd = transaction.rcptTyCd;
      const salesTyCd = transaction.salesTyCd;
      const salesSttsCd = transaction.salesSttsCd;

      // Calculate for filtered type only
      if (transactionType !== "all") {
        const matchesFilter =
          (transactionType === "NS" && salesTyCd === "N" && rcptTyCd === "S") ||
          (transactionType === "NR" && salesTyCd === "N" && rcptTyCd === "R") ||
          (transactionType === "TS" && salesTyCd === "T" && rcptTyCd === "S") ||
          (transactionType === "TR" && salesTyCd === "T" && rcptTyCd === "R") ||
          (transactionType === "PS" && salesTyCd === "P" && rcptTyCd === "S");

        if (matchesFilter && salesSttsCd === "02") {
          currentTypeCount++;
          currentTypeTotalAmount += total;
          currentTypeItemCount += items;
          currentTypeTaxAmount += tax;
        }
      }

      // Count all types (for "all" filter)
      if (salesSttsCd === "02") {
        if (salesTyCd === "N" && rcptTyCd === "S") {
          normalSalesCount++;
          totalSales += total;
          totalItems += items;
          totalTax += tax;
        } else if (salesTyCd === "T" && rcptTyCd === "S") {
          trainingSalesCount++;
          totalSales += total;
          totalItems += items;
          totalTax += tax;
        } else if (salesTyCd === "P" && rcptTyCd === "S") {
          proformaSalesCount++;
        } else if (salesTyCd === "N" && rcptTyCd === "R") {
          normalRefundsCount++;
          totalRefunds += total;
        } else if (salesTyCd === "T" && rcptTyCd === "R") {
          trainingRefundsCount++;
          totalRefunds += total;
        }
      }
    });

    return {
      totalSales,
      totalRefunds,
      totalItems,
      totalTax,
      normalSalesCount,
      trainingSalesCount,
      proformaSalesCount,
      normalRefundsCount,
      trainingRefundsCount,
      totalTransactions: transactions.length,
      currentTypeTotalAmount,
      currentTypeItemCount,
      currentTypeTaxAmount,
      currentTypeCount,
    };
  };

  const Summary = useMemo(
    () => generateReportSummary(filteredTransactions),
    [filteredTransactions, transactionType],
  );

  const currentSummary = Summary;

  // Get card configuration based on transaction type
  const getCardConfig = () => {
    if (transactionType === "all") {
      return [
        {
          title: "Sales (NS)",
          value: currentSummary.totalSales,
          count: currentSummary.normalSalesCount,
          color: "text-green-600",
          description: "RWF",
          subDescription: "Total sales amount",
          unit: "receipts",
        },
        {
          title: "Refunds (NR)",
          value: currentSummary.totalRefunds,
          count:
            currentSummary.normalRefundsCount +
            currentSummary.trainingRefundsCount,
          color: "text-red-600",
          description: "RWF",
          subDescription: "Total refunds amount",
          unit: "receipts",
        },
        {
          title: "Items Sold",
          value: currentSummary.totalItems,
          count:
            currentSummary.normalSalesCount + currentSummary.trainingSalesCount,
          color: "text-blue-600",
          description: "Units",
          subDescription: "Total quantity sold",
          unit: "transactions",
        },
        {
          title: "Total Tax",
          value: currentSummary.totalTax,
          count:
            currentSummary.normalSalesCount + currentSummary.trainingSalesCount,
          color: "text-purple-600",
          description: "RWF",
          subDescription: "Tax collected",
          unit: "transactions",
        },
        {
          title: "Transactions",
          value: currentSummary.totalTransactions,
          count: "",
          color: "text-orange-600",
          description: "Records",
          subDescription: "Total transactions",
          unit: "",
        },
      ];
    } else {
      const typeConfig = {
        NS: {
          title: "Normal Sales",
          color: "text-green-600",
          description: "RWF",
          subDescription: "Normal sales amount",
        },
        NR: {
          title: "Normal Refunds",
          color: "text-red-600",
          description: "RWF",
          subDescription: "Normal refunds amount",
        },
        TS: {
          title: "Training Sales",
          color: "text-blue-600",
          description: "RWF",
          subDescription: "Training sales amount",
        },
        TR: {
          title: "Training Refunds",
          color: "text-yellow-600",
          description: "RWF",
          subDescription: "Training refunds amount",
        },
        PS: {
          title: "Proforma Sales",
          color: "text-purple-600",
          description: "Count",
          subDescription: "Proforma transactions",
        },
      };

      const config = typeConfig[transactionType as keyof typeof typeConfig];

      return [
        {
          title: config.title,
          value: currentSummary.currentTypeTotalAmount,
          count: currentSummary.currentTypeCount,
          color: config.color,
          description: config.description,
          subDescription: config.subDescription,
          unit: "receipts",
        },
        {
          title: "Items",
          value: currentSummary.currentTypeItemCount,
          count: currentSummary.currentTypeCount,
          color: "text-blue-600",
          description: "Units",
          subDescription: "Total items",
          unit: "receipts",
        },
        {
          title: "Tax Amount",
          value: currentSummary.currentTypeTaxAmount,
          count: currentSummary.currentTypeCount,
          color: "text-purple-600",
          description: "RWF",
          subDescription: "Tax collected",
          unit: "receipts",
        },
        {
          title: "Total Receipts",
          value: currentSummary.currentTypeCount,
          count: "",
          color: "text-orange-600",
          description: "Receipts",
          subDescription: "Number of receipts",
          unit: "",
        },
        {
          title: "Transaction Type",
          value: transactionType,
          count: "",
          color: "text-gray-600",
          description: "Filter",
          subDescription: `Showing ${transactionType} only`,
          unit: "",
        },
      ];
    }
  };

  const cardConfig = getCardConfig();

  // EXPORT FUNCTIONS WITH COMPREHENSIVE SUMMARIES

  const exportToExcel = () => {
    try {
      setIsExporting(true);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // 1. COVER SHEET
      const coverData = [
        ["DAILY SALES REPORT"],
        [activeTab === "x-report" ? "X Report (Interim)" : "Z Report (Final)"],
        [],
        ["Report Information"],
        [
          "Transaction Type:",
          transactionType === "all" ? "All Types" : transactionType,
        ],
        [
          "Date Range:",
          filterStartDate && filterEndDate
            ? `${filterStartDate} to ${filterEndDate}`
            : "N/A",
        ],
        ["Generated:", new Date().toLocaleString()],
        ["Total Transactions:", filteredTransactions.length],
        [],
        ["Report Contents:"],
        ["1. Transaction Type Summary"],
        ["2. Tax Category Summary"],
        ["3. Overall Summary"],
        ["4. Transaction Details"],
        ["5. Item Level Details"],
      ];

      const coverSheet = XLSX.utils.aoa_to_sheet(coverData);
      coverSheet["!merges"] = [
        XLSX.utils.decode_range("A1:E1"),
        XLSX.utils.decode_range("A2:E2"),
        XLSX.utils.decode_range("A4:E4"),
      ];

      // 2. TRANSACTION TYPE SUMMARY SHEET
      const typeSummarySheetData: any[] = [
        ["TRANSACTION TYPE SUMMARY"],
        [],
        ["Type", "Count", "Total Amount (RWF)", "Total Tax (RWF)", "Items"],
      ];

      Object.entries(transactionTypeSummary).forEach(([type, data]) => {
        typeSummarySheetData.push([
          type,
          data.count,
          data.totalAmount,
          data.totalTax,
          data.totalItems,
        ]);
      });

      // Add totals row
      const totalCount = Object.values(transactionTypeSummary).reduce(
        (sum, data) => sum + data.count,
        0,
      );
      const totalAmount = Object.values(transactionTypeSummary).reduce(
        (sum, data) => sum + data.totalAmount,
        0,
      );
      const totalTax = Object.values(transactionTypeSummary).reduce(
        (sum, data) => sum + data.totalTax,
        0,
      );
      const totalItems = Object.values(transactionTypeSummary).reduce(
        (sum, data) => sum + data.totalItems,
        0,
      );

      typeSummarySheetData.push([
        "TOTAL",
        totalCount,
        totalAmount,
        totalTax,
        totalItems,
      ]);

      const typeSummarySheet = XLSX.utils.aoa_to_sheet(typeSummarySheetData);
      typeSummarySheet["!merges"] = [XLSX.utils.decode_range("A1:E1")];

      // 3. TAX CATEGORY SUMMARY SHEET
      const taxSummarySheetData = [
        ["TAX CATEGORY SUMMARY"],
        [],
        [
          "Tax Category",
          "Count",
          "Taxable Amount (RWF)",
          "Tax Amount (RWF)",
          "Rate",
        ],
      ];

      const taxCategories = [
        {
          key: "A",
          name: "A (0%)",
          taxable: taxSummary.A.taxableAmount,
          tax: taxSummary.A.taxAmount,
          count: taxSummary.A.count,
        },
        {
          key: "B",
          name: "B (18%)",
          taxable: taxSummary.B.taxableAmount,
          tax: taxSummary.B.taxAmount,
          count: taxSummary.B.count,
        },
        {
          key: "C",
          name: "C (0%)",
          taxable: taxSummary.C.taxableAmount,
          tax: taxSummary.C.taxAmount,
          count: taxSummary.C.count,
        },
        {
          key: "D",
          name: "D (0%)",
          taxable: taxSummary.D.taxableAmount,
          tax: taxSummary.D.taxAmount,
          count: taxSummary.D.count,
        },
      ];

      taxCategories.forEach((cat) => {
        const cats = cat as any;
        taxSummarySheetData.push([
          cat.name,
          cats.count,
          cats.taxable,
          cats.tax,
          cats.key === "B" ? "18%" : "0%",
        ]);
      });

      // Add totals
      const totalTaxable = taxCategories.reduce(
        (sum, cat) => sum + cat.taxable,
        0,
      );
      const totalTaxAmount = taxCategories.reduce(
        (sum, cat) => sum + cat.tax,
        0,
      );
      const totalTaxCount = taxCategories.reduce(
        (sum, cat) => sum + cat.count,
        0,
      ) as any;

      taxSummarySheetData.push([
        "TOTAL",
        totalTaxCount,
        totalTaxable,
        totalTaxAmount,
        "",
      ]);

      const taxSummarySheet = XLSX.utils.aoa_to_sheet(taxSummarySheetData);
      taxSummarySheet["!merges"] = [XLSX.utils.decode_range("A1:E1")];

      // 4. OVERALL SUMMARY SHEET
      const overallSummarySheetData = [
        ["OVERALL SUMMARY"],
        [],
        ["Metric", "Value", "Unit"],
      ];

      const overallMetrics = [
        ["Total Transactions", currentSummary.totalTransactions, "Count"],
        ["Total Sales", currentSummary.totalSales, "RWF"],
        ["Total Refunds", currentSummary.totalRefunds, "RWF"],
        ["Total Tax Collected", currentSummary.totalTax, "RWF"],
        ["Total Items Sold", currentSummary.totalItems, "Units"],
        [
          "Net Amount (Sales - Refunds)",
          currentSummary.totalSales - currentSummary.totalRefunds,
          "RWF",
        ],
        [
          "Average Transaction Value",
          filteredTransactions.length > 0
            ? currentSummary.totalSales / filteredTransactions.length
            : 0,
          "RWF",
        ],
        [
          "Average Items per Transaction",
          filteredTransactions.length > 0
            ? currentSummary.totalItems / filteredTransactions.length
            : 0,
          "Units",
        ],
      ];

      overallMetrics.forEach((metric) => {
        overallSummarySheetData.push(metric as any);
      });

      const overallSummarySheet = XLSX.utils.aoa_to_sheet(
        overallSummarySheetData,
      );
      overallSummarySheet["!merges"] = [XLSX.utils.decode_range("A1:C1")];

      // 5. TRANSACTION DETAILS SHEET
      const transHeader = [
        "Invoice No",
        "Type",
        "Customer Name",
        "Customer Phone",
        "Date",
        "Items",
        "Amount (RWF)",
        "Tax (RWF)",
        "Taxable A",
        "Taxable B",
        "Taxable C",
        "Taxable D",
        "Payment Method",
        "Status",
        "Confirmed Date",
      ];

      const transData = filteredTransactions.map((trans) => [
        trans.invcNo,
        `${trans.salesTyCd}${trans.rcptTyCd}`,
        trans.custNm || "",
        trans.receipt?.custMblNo || "",
        formatDate(trans.salesDt || ""),
        trans.totItemCnt || 0,
        trans.totAmt || 0,
        trans.totTaxAmt || 0,
        trans.taxblAmtA || 0,
        trans.taxblAmtB || 0,
        trans.taxblAmtC || 0,
        trans.taxblAmtD || 0,
        trans.pmtTyCd || "",
        trans.salesSttsCd || "",
        formatDateTime(trans.cfmDt || ""),
      ]);

      const transSheetData = [
        ["TRANSACTION DETAILS"],
        [],
        transHeader,
        ...transData,
      ];
      const transSheet = XLSX.utils.aoa_to_sheet(transSheetData);
      transSheet["!merges"] = [XLSX.utils.decode_range("A1:N1")];

      // 6. ITEM DETAILS SHEET
      const itemHeader = [
        "Invoice No",
        "Item Code",
        "Item Name",
        "Item Class",
        "Quantity",
        "Unit",
        "Price (RWF)",
        "Taxable Amount",
        "Tax Amount",
        "Tax Type",
        "Total Amount",
      ];

      let itemData: any[] = [];
      filteredTransactions.forEach((trans) => {
        if (trans.itemList) {
          trans.itemList.forEach((item) => {
            itemData.push([
              trans.invcNo,
              item.itemCd || "",
              item.itemNm || "",
              item.itemClsCd || "",
              item.qty || 0,
              item.qtyUnitCd || "",
              item.prc || 0,
              item.taxblAmt || 0,
              item.taxAmt || 0,
              item.taxTyCd || "",
              item.totAmt || 0,
            ]);
          });
        }
      });

      const itemSheetData =
        itemData.length > 0
          ? [["ITEM LEVEL DETAILS"], [], itemHeader, ...itemData]
          : [["ITEM LEVEL DETAILS"], [], ["No item data available"]];

      const itemSheet = XLSX.utils.aoa_to_sheet(itemSheetData);
      if (itemData.length > 0) {
        itemSheet["!merges"] = [XLSX.utils.decode_range("A1:K1")];
      } else {
        itemSheet["!merges"] = [XLSX.utils.decode_range("A1:A1")];
      }

      // Add all sheets to workbook
      XLSX.utils.book_append_sheet(workbook, coverSheet, "Cover");
      XLSX.utils.book_append_sheet(workbook, typeSummarySheet, "Type Summary");
      XLSX.utils.book_append_sheet(workbook, taxSummarySheet, "Tax Summary");
      XLSX.utils.book_append_sheet(
        workbook,
        overallSummarySheet,
        "Overall Summary",
      );
      XLSX.utils.book_append_sheet(workbook, transSheet, "Transactions");
      XLSX.utils.book_append_sheet(workbook, itemSheet, "Items");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `${activeTab}_report_${transactionType}_${new Date().getTime()}.xlsx`;
      saveAs(blob, fileName);

      toast({
        title: "Excel Export Successful",
        description: `Report with 6 detailed sheets downloaded as ${fileName}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate Excel report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    try {
      setIsExporting(true);

      // Create multiple CSV files
      const timestamp = new Date().getTime();

      // 1. Transaction Type Summary CSV
      const typeSummaryCSV = [
        ["Transaction Type Summary"],
        ["Type", "Count", "Total Amount (RWF)", "Total Tax (RWF)", "Items"],
      ];

      Object.entries(transactionTypeSummary).forEach(([type, data]) => {
        const dt = data as any;
        typeSummaryCSV.push([
          type,
          dt.count,
          dt.totalAmount,
          dt.totalTax,
          dt.totalItems,
        ]);
      });

      const typeSummaryBlob = new Blob(
        [typeSummaryCSV.map((row) => row.join(",")).join("\n")],
        { type: "text/csv;charset=utf-8;" },
      );
      saveAs(typeSummaryBlob, `transaction_type_summary_${timestamp}.csv`);

      // 2. Transaction Details CSV
      const transHeader = [
        "Invoice No",
        "Type",
        "Customer Name",
        "Customer Phone",
        "Date",
        "Items",
        "Amount (RWF)",
        "Tax (RWF)",
        "Payment Method",
        "Status",
        "Confirmed Date",
      ];

      const transRows = filteredTransactions.map((trans) => [
        trans.invcNo,
        `${trans.salesTyCd}${trans.rcptTyCd}`,
        `"${trans.custNm || ""}"`,
        trans.receipt?.custMblNo || "",
        formatDate(trans.salesDt || ""),
        trans.totItemCnt || 0,
        trans.totAmt || 0,
        trans.totTaxAmt || 0,
        trans.pmtTyCd || "",
        trans.salesSttsCd || "",
        formatDateTime(trans.cfmDt || ""),
      ]);

      const transCSV = [transHeader, ...transRows];
      const transBlob = new Blob(
        [transCSV.map((row) => row.join(",")).join("\n")],
        { type: "text/csv;charset=utf-8;" },
      );
      saveAs(transBlob, `transaction_details_${timestamp}.csv`);

      // 3. Item Details CSV
      const itemHeader = [
        "Invoice No",
        "Item Code",
        "Item Name",
        "Quantity",
        "Unit",
        "Price (RWF)",
        "Taxable Amount",
        "Tax Amount",
        "Tax Type",
        "Total Amount",
      ];

      let itemRows: any[] = [];
      filteredTransactions.forEach((trans) => {
        if (trans.itemList) {
          trans.itemList.forEach((item) => {
            itemRows.push([
              trans.invcNo,
              item.itemCd || "",
              `"${item.itemNm || ""}"`,
              item.qty || 0,
              item.qtyUnitCd || "",
              item.prc || 0,
              item.taxblAmt || 0,
              item.taxAmt || 0,
              item.taxTyCd || "",
              item.totAmt || 0,
            ]);
          });
        }
      });

      if (itemRows.length > 0) {
        const itemCSV = [itemHeader, ...itemRows];
        const itemBlob = new Blob(
          [itemCSV.map((row) => row.join(",")).join("\n")],
          { type: "text/csv;charset=utf-8;" },
        );
        saveAs(itemBlob, `item_details_${timestamp}.csv`);
      }

      // 4. Tax Summary CSV
      const taxHeader = [
        "Tax Category",
        "Count",
        "Taxable Amount (RWF)",
        "Tax Amount (RWF)",
        "Rate",
      ];
      const taxRows = [
        [
          "A (0%)",
          taxSummary.A.count,
          taxSummary.A.taxableAmount,
          taxSummary.A.taxAmount,
          "0%",
        ],
        [
          "B (18%)",
          taxSummary.B.count,
          taxSummary.B.taxableAmount,
          taxSummary.B.taxAmount,
          "18%",
        ],
        [
          "C (0%)",
          taxSummary.C.count,
          taxSummary.C.taxableAmount,
          taxSummary.C.taxAmount,
          "0%",
        ],
        [
          "D (0%)",
          taxSummary.D.count,
          taxSummary.D.taxableAmount,
          taxSummary.D.taxAmount,
          "0%",
        ],
        [
          "TOTAL",
          taxSummary.A.count +
            taxSummary.B.count +
            taxSummary.C.count +
            taxSummary.D.count,
          taxSummary.A.taxableAmount +
            taxSummary.B.taxableAmount +
            taxSummary.C.taxableAmount +
            taxSummary.D.taxableAmount,
          taxSummary.A.taxAmount +
            taxSummary.B.taxAmount +
            taxSummary.C.taxAmount +
            taxSummary.D.taxAmount,
          "",
        ],
      ];

      const taxCSV = [taxHeader, ...taxRows];
      const taxBlob = new Blob(
        [taxCSV.map((row) => row.join(",")).join("\n")],
        { type: "text/csv;charset=utf-8;" },
      );
      saveAs(taxBlob, `tax_summary_${timestamp}.csv`);

      toast({
        title: "CSV Export Successful",
        description: `Multiple CSV files downloaded with detailed summaries`,
        variant: "default",
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate CSV files",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const printReport = () => {
    try {
      setIsExporting(true);

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast({
          title: "Print Failed",
          description: "Popup blocked. Please allow popups for this site.",
          variant: "destructive",
        });
        setIsExporting(false);
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${activeTab === "x-report" ? "X Report" : "Z Report"}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { color: #333; margin-bottom: 5px; font-size: 24px; }
            .header .subtitle { color: #666; margin-bottom: 10px; font-size: 16px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section h2 { color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; }
            .summary-grid { 
              display: grid; 
              grid-template-columns: repeat(5, 1fr); 
              gap: 15px; 
              margin-bottom: 20px;
            }
            .summary-card { 
              border: 1px solid #ddd; 
              padding: 15px; 
              text-align: center;
              border-radius: 4px;
              background: #f9f9f9;
            }
            .summary-card h3 { 
              font-size: 14px; 
              color: #666; 
              margin: 0 0 10px 0;
              font-weight: bold;
            }
            .summary-card .value { 
              font-size: 20px; 
              font-weight: bold; 
              margin: 10px 0;
            }
            .table-container { overflow-x: auto; margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f4f4f4; font-weight: bold; text-align: left; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            .total-row { background-color: #f0f8ff; font-weight: bold; }
            .type-summary td { padding: 6px 8px; }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              color: #666; 
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0.5in; }
              .no-print { display: none; }
              .summary-grid { grid-template-columns: repeat(3, 1fr); }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DAILY SALES REPORT</h1>
            <div class="subtitle">
              ${activeTab === "x-report" ? "X Report (Interim)" : "Z Report (Final)"}
            </div>
            <div>
              <strong>Transaction Type:</strong> ${transactionType === "all" ? "All Types" : transactionType}<br>
              <strong>Date Range:</strong> ${filterStartDate && filterEndDate ? `${filterStartDate} to ${filterEndDate}` : "N/A"}<br>
              <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
              <strong>Total Transactions:</strong> ${filteredTransactions.length}
            </div>
          </div>
          
          <div class="section">
            <h2>Summary Overview</h2>
            <div class="summary-grid">
              ${cardConfig
                .map(
                  (card) => `
                <div class="summary-card">
                  <h3>${card.title}</h3>
                  <div class="value" style="color: ${
                    card.color === "text-green-600"
                      ? "#16a34a"
                      : card.color === "text-red-600"
                        ? "#dc2626"
                        : card.color === "text-blue-600"
                          ? "#2563eb"
                          : card.color === "text-purple-600"
                            ? "#7c3aed"
                            : card.color === "text-orange-600"
                              ? "#ea580c"
                              : card.color === "text-yellow-600"
                                ? "#ca8a04"
                                : "#6b7280"
                  }">
                    ${typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </div>
                  <div>${card.description}</div>
                  ${card.count ? `<div><small>${card.count} ${card.unit}</small></div>` : ""}
                  <div><small>${card.subDescription}</small></div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          
          <div class="section">
            <h2>Transaction Type Summary</h2>
            <div class="table-container">
              <table class="type-summary">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                    <th>Total Amount (RWF)</th>
                    <th>Total Tax (RWF)</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(transactionTypeSummary)
                    .map(
                      ([type, data]) => `
                    <tr>
                      <td>${type}</td>
                      <td>${data.count}</td>
                      <td>${data.totalAmount.toLocaleString()}</td>
                      <td>${data.totalTax.toLocaleString()}</td>
                      <td>${data.totalItems}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                  <tr class="total-row">
                    <td><strong>TOTAL</strong></td>
                    <td><strong>${Object.values(transactionTypeSummary).reduce((sum, data) => sum + data.count, 0)}</strong></td>
                    <td><strong>${Object.values(transactionTypeSummary)
                      .reduce((sum, data) => sum + data.totalAmount, 0)
                      .toLocaleString()}</strong></td>
                    <td><strong>${Object.values(transactionTypeSummary)
                      .reduce((sum, data) => sum + data.totalTax, 0)
                      .toLocaleString()}</strong></td>
                    <td><strong>${Object.values(transactionTypeSummary).reduce((sum, data) => sum + data.totalItems, 0)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="section page-break">
            <h2>Tax Category Summary</h2>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tax Category</th>
                    <th>Count</th>
                    <th>Taxable Amount (RWF)</th>
                    <th>Tax Amount (RWF)</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A (0%)</td>
                    <td>${taxSummary.A.count}</td>
                    <td>${taxSummary.A.taxableAmount.toLocaleString()}</td>
                    <td>${taxSummary.A.taxAmount.toLocaleString()}</td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>B (18%)</td>
                    <td>${taxSummary.B.count}</td>
                    <td>${taxSummary.B.taxableAmount.toLocaleString()}</td>
                    <td>${taxSummary.B.taxAmount.toLocaleString()}</td>
                    <td>18%</td>
                  </tr>
                  <tr>
                    <td>C (0%)</td>
                    <td>${taxSummary.C.count}</td>
                    <td>${taxSummary.C.taxableAmount.toLocaleString()}</td>
                    <td>${taxSummary.C.taxAmount.toLocaleString()}</td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>D (0%)</td>
                    <td>${taxSummary.D.count}</td>
                    <td>${taxSummary.D.taxableAmount.toLocaleString()}</td>
                    <td>${taxSummary.D.taxAmount.toLocaleString()}</td>
                    <td>0%</td>
                  </tr>
                  <tr class="total-row">
                    <td><strong>TOTAL</strong></td>
                    <td><strong>${taxSummary.A.count + taxSummary.B.count + taxSummary.C.count + taxSummary.D.count}</strong></td>
                    <td><strong>${(taxSummary.A.taxableAmount + taxSummary.B.taxableAmount + taxSummary.C.taxableAmount + taxSummary.D.taxableAmount).toLocaleString()}</strong></td>
                    <td><strong>${(taxSummary.A.taxAmount + taxSummary.B.taxAmount + taxSummary.C.taxAmount + taxSummary.D.taxAmount).toLocaleString()}</strong></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="section page-break">
            <h2>Transaction Details (${filteredTransactions.length} records)</h2>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Type</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Tax</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredTransactions
                    .slice(0, 50)
                    .map(
                      (trans) => `
                    <tr>
                      <td>${trans.invcNo || ""}</td>
                      <td>${trans.salesTyCd}${trans.rcptTyCd}</td>
                      <td>${trans.custNm || "N/A"}</td>
                      <td>${formatDate(trans.salesDt || "")}</td>
                      <td>${trans.totItemCnt || 0}</td>
                      <td>${(trans.totAmt || 0).toLocaleString()}</td>
                      <td>${(trans.totTaxAmt || 0).toLocaleString()}</td>
                      <td>${trans.pmtTyCd || "N/A"}</td>
                      <td>${trans.salesSttsCd || ""}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                  ${
                    filteredTransactions.length > 50
                      ? `
                    <tr>
                      <td colspan="9" style="text-align: center; font-style: italic; background: #f9f9f9;">
                        ... and ${filteredTransactions.length - 50} more records
                      </td>
                    </tr>
                  `
                      : ""
                  }
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="footer">
            <p>Report generated by Sales Management System • Page 1 of 1</p>
            <p>This is a computer-generated report, no signature required</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      toast({
        title: "Print Initiated",
        description: "Print dialog opened in new window",
        variant: "default",
      });
    } catch (error) {
      console.error("Print Error:", error);
      toast({
        title: "Print Failed",
        description: "Failed to generate print report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Daily Reports</h1>
        <p className="text-muted-foreground">
          Generate and view X (interim) and Z (final) daily reports
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleChangeTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="z-report" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />Z Report (Final)
          </TabsTrigger>
          <TabsTrigger value="x-report" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />X Report (Interim)
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Transaction Type Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transaction Types</SelectItem>
                <SelectItem value="NS">NS (Normal Sale)</SelectItem>
                <SelectItem value="NR">NR (Normal Sale Refund)</SelectItem>
                <SelectItem value="TS">TS (Training Sale)</SelectItem>
                <SelectItem value="TR">TR (Training Refund)</SelectItem>
                <SelectItem value="PS">PS (Proforma)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {transactionType !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTransactionType("all")}
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* Report Summary Cards */}
      <div
        ref={reportRef}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
      >
        {cardConfig.map((card, index) => (
          <Card key={index}>
            <CardContent className="pt-5 px-3">
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground truncate">
                  {card.title}
                </p>
                <div className="min-h-[2.5rem] flex items-center justify-center">
                  <p
                    className={`text-lg font-bold ${card.color} break-all leading-snug`}
                  >
                    {typeof card.value === "number"
                      ? card.value.toLocaleString()
                      : card.value}
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground space-y-0.5">
                  <p className="truncate">{card.description}</p>
                  <p>{card.subDescription}</p>
                  {card.count && card.unit && (
                    <p>
                      {card.count} {card.unit}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {activeTab === "x-report" ? "X Daily Report" : "Z Daily Report"}
                {transactionType !== "all" && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({transactionType} only)
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === "x-report"
                  ? "Interim summary since last Z report"
                  : "Complete daily sales summary"}
                {filteredTransactions.length !== ReportData?.data?.length && (
                  <span className="ml-2">
                    Showing {filteredTransactions.length} of{" "}
                    {ReportData?.data?.length || 0} transactions
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => refetchReport()}
                disabled={isExporting}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button disabled={isExporting || isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={exportToExcel}
                    disabled={isExporting}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as Excel
                    <span className="ml-auto text-xs text-muted-foreground">
                      .xlsx
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={exportToCSV}
                    disabled={isExporting}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as CSV
                    <span className="ml-auto text-xs text-muted-foreground">
                      .csv
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={printReport}
                    disabled={isExporting}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DailyReportDialog
                reportType={activeTab === "x-report" ? "X" : "Z"}
                transactions={filteredTransactions}
                summary={currentSummary}
                // transactionType={transactionType}
              >
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Detailed View
                </Button>
              </DailyReportDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isExporting && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating comprehensive report...</span>
                </div>
              )}
            </div>
            <div className="text-sm font-medium">
              Total: {filteredTransactions.length} transactions
            </div>
          </div>

          <DataTable
            columns={SalesTransactionColumns}
            data={filteredTransactions}
            searchKey="salesSttsCd"
            searchPlaceholder="Search transactions..."
            dateFilterPlaceholder="Filter by date range"
            isRefetching={isRefetching || isExporting}
            isLoading={isLoading}
            showDateFilter={true}
            onDateFilterChange={handleChangeDate}
            showStartEndLabels={activeTab === "x-report"}
            startLabel="Z Report Date"
            endLabel="To"
            dateFilterMode={activeTab === "z-report" ? "SINGLE" : "RANGE"}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function YmdHelper(date: Date | null) {
  if (!date) return null;
  return DateTimeHelper.getDateFormat(date);
}
