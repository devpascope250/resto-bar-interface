import { DateUtils } from "@/lib/date-utils";
import React from "react";
import QRCode from "react-qr-code";
import { DisplayMessage } from "./A4/A4Receipt";
import { AmountFormat } from "@/lib/AmountFormat";

interface ReceiptProps {
  receiptData: {
    tradeName: string;
    address: string;
    tin: string;
    clientId?: string;
    customerName?: string;
    customerMobile?: string;
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
      taxType: string;
      discount?: number;
    }>;
    totals: {
      total: number;
      totalAEx: number;
      totalB: number;
      totalC: number;
      totalD: number;
      totalTaxB: number;
      totalTax: number;
    };
    payment: {
      method: string;
      amount: number;
    };
    itemsNumber: number;
    date: string;
    time: string;
    cisDate: Date;
    cisTime: Date;
    sdcId: string;
    receiptNumber: string;
    ebmReceiptNo: string;
    referenceId?: string;
    internalData: string;
    receiptSignature: string;
    mrc: string;
    thankYouMessage?: string;
    commercialMessage?: string;
  };
}

const CopyRefund: React.FC<ReceiptProps> = ({ receiptData }) => {
  const {
    tradeName,
    address,
    tin,
    clientId,
    customerName,
    customerMobile,
    items,
    totals,
    payment,
    itemsNumber,
    date,
    time,
    cisDate,
    cisTime,
    sdcId,
    referenceId,
    receiptNumber,
    ebmReceiptNo,
    internalData,
    receiptSignature,
    mrc,
    thankYouMessage,
    commercialMessage,
  } = receiptData;

  return (
    <div
      className="receipt"
      style={{
        width: "100mm",
        minHeight: "100%",
        padding: "4mm",
        fontSize: "12px",
        color: "#000",
        background: "#fff",
        fontFamily: "monospace, Courier, sans-serif",
        fontWeight: "500",
        border: "1px solid #000",
        display: "flex",
        flexDirection: "column",
        gap: "2mm",
        lineHeight: "1.2",
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center p-4 pb-4">
              {/* Left Logo */}
              <div>
                <img
                  src="/receiptLogo/logo1.png"
                  alt="Logo 1"
                  className="h-13 w-auto object-contain"
                />
              </div>
      
              {/* Center Content */}
              <div className="text-center leading-tight min-w-0">
                <DisplayMessage message={commercialMessage ?? ""} />
              </div>
      
              {/* Right Logo */}
              <div className="flex justify-end mb-3">
                <img
                  src="/receiptLogo/logo2.png"
                  alt="Logo 2"
                  className="h-13 w-auto object-contain"
                />
              </div>
            </div>

        <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>
        <div>TIN: {clientId}</div>
        <div>CLIENT NAME: {customerName}</div>
        <div>TEL: {customerMobile}</div>

      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0' }}></div>


      <div
        style={{
          textAlign: "center",
          gap: "3px",
          justifyContent: "space-around",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          <span>REFUND</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
          }}
        >
          <span>REF. NORMAL RECEIPT#:</span>
          <span>{referenceId}</span>
        </div>
      </div>

      {/* Separator */}
      <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>

      <div style={{ marginTop: "2mm", marginBottom: "3mm" }}>
        <div style={{ textAlign: "center" }}>
          <div>REFUND IS APPROVED ONLY FOR</div>
          <div>ORIGINAL SALES RECEIPT</div>
        </div>
        {/* Separator */}
      
      </div>

      <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>

      {/* Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1mm" }}>
        {items.map((item, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{item.name}</span>
              
              <span>-{AmountFormat(item.total.toString(), 2, false)} &nbsp;{item.taxType}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <span>
                {AmountFormat(item.unitPrice.toString(), 2, false)} x {item.quantity.toFixed(2)}
              </span>
            </div>
            {item.discount ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                }}
              >
                <span>discount -{item.discount}%</span>
                <span>
                  -{AmountFormat((item.total * (1 - item.discount / 100)).toString(), 2, false)}
                </span>
              </div>
            ): ""}
          </div>
        ))}
      </div>

      <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>

      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        THIS IS NOT AN OFFICIAL RECEIPT
      </div>

      {/* Separator */}
      <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>

      {/* Totals */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1mm" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          <span>TOTAL</span>
          <span>-{AmountFormat(totals.total.toString(), 2, false)}</span>
        </div>
        {totals.totalC ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>TOTAL C</span>
            <span>-{AmountFormat(totals.totalC.toString(),2, false)}</span>
          </div>
        ) : ""}
        {totals.totalD ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>TOTAL D</span>
            <span>-{AmountFormat(totals.totalD.toString(),2, false)}</span>
          </div>
        ): ""}
        {totals.totalAEx ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>TOTAL A-EX</span>
            <span>-{AmountFormat(totals.totalAEx.toString(), 2, false)}</span>
          </div>
        ) : ""}
        {totals.totalB ? <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>TOTAL B-18.00%</span>
          <span>-{AmountFormat(totals.totalB.toString(), 2,false)}</span>
        </div> : ""} 
        {totals.totalTaxB ? 
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>TOTAL TAX B</span>
          <span>-{AmountFormat(totals.totalTaxB.toString(), 2, false)}</span>
        </div> : ""
        }
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>TOTAL TAX</span>
          <span>-{AmountFormat(totals.totalTax.toString(), 2, false)}</span>
        </div>
        {/* Separator */}
        <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          <span>{payment.method}</span>
          <span>-{AmountFormat(payment.amount.toString())}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>ITEMS NUMBER</span>
          <span>{itemsNumber}</span>
        </div>
      </div>

      <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>

      <div
        style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center" }}
      >
        COPY
      </div>

      {/* Separator */}
      <div
        style={{ borderBottom: "1px dashed #000", margin: "1mm 0", gap: "1mm" }}
      ></div>

      {/* SDC Information */}
      <div style={{ fontSize: "10px" }}>
        <div
          style={{ fontWeight: "bold", textAlign: "center", fontSize: "16px" }}
        >
          SDC INFORMATION
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1mm" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>DATE: {DateUtils.parse(date).toLocaleDateString()}</span>
            <span>TIME: {DateUtils.parse(time).toLocaleTimeString()}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>SDC ID:</span>
            <span>{sdcId}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>RECEIPT NUMBER:</span>
            <span>{ebmReceiptNo}/{ebmReceiptNo}NR</span>
           
          </div>
        </div>

        <div
          style={{
            fontWeight: "normal",
            textAlign: "center",
            fontSize: "13px",
          }}
        >
          Internal Data:
        </div>
        <div style={{ wordBreak: "break-all", textAlign: "center" }}>
          {internalData
            ?.padEnd(40, "")
            ?.match(/.{1,4}/g)
            ?.join("-")}
        </div>
        <div style={{ fontWeight: "normal", textAlign: "center" }}>
          Receipt Signature:
        </div>
        <div style={{ wordBreak: "break-all", textAlign: "center" }}>
          {receiptSignature
            ?.padEnd(20, "")
            ?.match(/.{1,4}/g)
            ?.join("-")}
        </div>
      </div>
      {/* QR Code */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2mm 0' }}>
        <QRCode 
          value={`${DateUtils.parse(date).toLocaleDateString()}#${DateUtils.parse(time).toLocaleTimeString()}#${sdcId}#${ebmReceiptNo}/${ebmReceiptNo}NR#${internalData?.padEnd(40,'')?.match(/.{1,4}/g)?.join('-')}#${receiptSignature?.padEnd(20,'')?.match(/.{1,4}/g)?.join('-')}`} 
          size={60} 
        />
      </div>

      {/* Separator */}
      <div
        style={{ borderBottom: "1px dashed #000", margin: "1mm 0", gap: "1mm" }}
      ></div>

      {/* CIS Information */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1mm" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>RECEIPT NUMBER:</span>
           <span>{receiptNumber}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>DATE: {cisDate.toLocaleDateString()}</span>
          <span>TIME: {cisTime.toLocaleTimeString()}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>MRC: </span>
          <span>{mrc}</span>
        </div>
      </div>
      {/* Separator */}
      <div
        style={{ borderBottom: "1px dashed #000", margin: "1mm 0", gap: "1mm" }}
      ></div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "2mm" }}>
        <div style={{ fontWeight: "bold" }}>THANK YOU</div>
        <div>COME BACK AGAIN</div>
        <div style={{ fontWeight: "bold" }}>{thankYouMessage}</div>
      </div>
    </div>
  );
};

export default CopyRefund;
