export const PaymentMethodCodeClassification = [
    { code: "01", codeName: "CASH", description: "CASH" },
    { code: "02", codeName: "CREDIT", description: "CREDIT" },
    { code: "03", codeName: "CASH/CREDIT", description: "CASH/CREDIT" },
    { code: "04", codeName: "BANK CHECK", description: "BANK CHECK PAYMENT" },
    { code: "05", codeName: "DEBIT&CREDIT CARD", description: "PAYMENT USING CARD" },
    { code: "06", codeName: "MOBILE MONEY", description: "ANY TRANSACTION USING MOBILE MONEY SYSTEM" },
    { code: "07", codeName: "OTHER", description: "OTHER MEANS OF PAYMENT" }
];


export const TransactionTypeCodeClassification = [
    { code: "NS", codeName: "Normal Sale" },
    { code: "NR", codeName: "Refund After Sale" },
    { code: "TS", codeName: "Training" },
    { code: "TR", codeName: "Training Refund" },
    { code: "PS", codeName: "Proforma" },
];

export const SalesStatusesArr = [
  {
    "cd": "01",
    "cdNm": "Wait for Approval",
  },
  {
    "cd": "02",
    "cdNm": "Approved",
   
  },
  {
    "cd": "03",
    "cdNm": "Cancel Requested",
    
  },
  {
    "cd": "04",
    "cdNm": "Canceled",
   
  },
  {
    "cd": "05",
    "cdNm": "Refunded",
  },
  {
    "cd": "06",
    "cdNm": "Transferred",
  }
];


export type ReceiptType = "NS" | "NR" | "TS" | "TR" | "PS";