import { DateUtils } from "@/lib/date-utils";
import React from "react";
import QRCode from "react-qr-code";

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
      itemCd?: string;
      quantity: number;
      unitPrice: number;
      total: number;
      taxType: string;
      discount?: number;
    }>;
    totals: {
      total: number;
      totalAEx: number;
      totalC: number;
      totalD: number;
      totalB: number;
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
    internalData: string;
    receiptSignature: string;
    mrc: string;
    thankYouMessage?: string;
    commercialMessage?: string;
  };
}

const A4Receipt: React.FC<ReceiptProps> = ({ receiptData }) => {
  const {
    tradeName,
    address,
    tin,
    clientId,
    customerMobile,
    customerName,
    items,
    totals,
    payment,
    itemsNumber,
    date,
    time,
    cisDate,
    cisTime,
    sdcId,
    receiptNumber,
    internalData,
    receiptSignature,
    mrc,
    thankYouMessage,
    commercialMessage,
  } = receiptData;

  // Format date and time if needed
  const MAX_ROWS = 10;
  return (
    <div className="w-full bg-white p-2 text-sm text-black">
      <div className="mx-auto max-w-1xl border-white p-4">
        {/* ================= HEADER ================= */}
        <div className="grid grid-cols-3 items-center justify-between">
          {" "}
          {/* No padding */}
          {/* Left Logo */}
          <div className="pt-1">
            {" "}
            {/* Small top padding for logo */}
            <img
              src="/receiptLogo/logo1.png"
              alt="Logo 1"
              className="h-14 w-auto object-contain"
            />
          </div>
          {/* Center Content */}
          <div className="text-center leading-tight">
            <DisplayMessage message={commercialMessage ?? ""} />
          </div>
          {/* Right Logo */}
          <div className="flex justify-end pt-1">
            <img
              src="/receiptLogo/logo2.png"
              alt="Logo 2"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        {/* ================= INVOICE INFO ================= */}
        <div className="flex justify-between mb-4 print:mb-3 mt-4">
          {/* Invoice To */}
          <div className="w-1/2 print:w-1/2">
            <p className="font-bold mb-1 print:mb-0.5 print:text-xs">
              INVOICE TO
            </p>
            <div className="border border-black p-2 print:p-1.5 text-xs print:text-[10px]">
              <p>
                <b>TIN:</b> {clientId || ""}
              </p>
              <p>
                <b>Names :</b> {customerName || "Customer"}
              </p>
              <p>
                <b>Tel :</b> {customerMobile || "N/A"}
              </p>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="w-1/3 print:w-1/3 mt-4">
            <div className="border border-black p-2 print:p-1.5 text-xs print:text-[10px]">
              <p>
                <b>INVOICE NO :</b> {receiptNumber}
              </p>
              <p>
                <b>Date :</b> {DateUtils.parse(date).toLocaleDateString()}{" "}
                <b>Time :</b> {DateUtils.parse(time).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* ================= ITEMS TABLE ================= */}
        <table className="w-full border-collapse border border-black text-xs mb-4">
          <thead>
            <tr className="border border-black">
              <th className="border border-black p-1">Item code</th>
              <th className="border border-black p-1">Item Description</th>
              <th className="border border-black p-1">Qty</th>
              <th className="border border-black p-1">Tax</th>
              <th className="border border-black p-1">Unit Price</th>
              <th className="border border-black p-1">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`item-${index}`} className="align-top">
                <td className="border-l border-r border-black p-1">
                  {item.itemCd}
                </td>

                <td className="border-l border-r border-black p-1">
                  {item.name}
                </td>

                <td className="border-l border-r border-black p-1 text-center">
                  {item.quantity.toFixed(2)}
                </td>

                <td className="border-l border-r border-black p-1 text-center">
                  {item.taxType}
                </td>

                <td className="border-l border-r border-black p-1 text-right">
                  {item.unitPrice.toFixed(2)}
                </td>

                <td className="border-l border-r border-black p-1 text-right">
                  {item.total.toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Empty filler rows */}
            {Array.from({ length: Math.max(0, MAX_ROWS - items.length) }).map(
              (_, rowIndex) => (
                <tr key={`empty-${rowIndex}`}>
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="border-l border-r border-black h-10"
                    ></td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Info */}
          <div className="text-xs mt-4">
            <p className="font-bold mb-1">SDC INFORMATION</p>
            <div
              style={{ borderBottom: "1px solid #000", margin: "2mm 0" }}
              className="w-1/2"
            ></div>
            <p>
              Date : {DateUtils.parse(date).toLocaleDateString()} Time :{" "}
              {DateUtils.parse(time).toLocaleTimeString()}
            </p>
            <p>SDC ID: {sdcId}</p>
            <p>
              RECEIPT NUMBER: {receiptNumber}/{receiptNumber} (NS)
            </p>
            <p>
              Internal Data:{" "}
              {internalData
                ?.padEnd(40, "")
                ?.match(/.{1,4}/g)
                ?.join("-")}
            </p>
            <p>
              Receipt Signature:{" "}
              {receiptSignature
                ?.padEnd(20, "")
                ?.match(/.{1,4}/g)
                ?.join("-")}
            </p>
            <div
              style={{ borderBottom: "1px solid #000", margin: "2mm 0" }}
              className="w-1/2"
            ></div>
            <p>RECEIPT NUMBER: {receiptNumber}</p>
            <p>
              Date: {DateUtils.parse(date).toLocaleDateString()} Time :{" "}
              {DateUtils.parse(time).toLocaleTimeString()}
            </p>
            <p>MRC: {mrc}</p>
            <div
              style={{ borderBottom: "1px solid #000", margin: "2mm 0" }}
              className="w-1/2"
            ></div>
            {thankYouMessage && <p className="mt-2">{thankYouMessage}</p>}
            <p className="mt-2 italic">GS VERSION Powered by RRA VSDC EBM2.1</p>
          </div>

          {/* Right Side - QR + Totals */}
          <div className="flex gap-4 justify-end mt-4">
            {/* QR Code */}
            <div className="p-2 h-fit">
              {receiptSignature ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "2mm 0",
                  }}
                >
                  <QRCode
                    value={`${DateUtils.parse(
                      date
                    ).toLocaleDateString()}#${DateUtils.parse(
                      time
                    ).toLocaleTimeString()}#${sdcId}#${receiptNumber}/${receiptNumber} NS#${internalData
                      ?.padEnd(40, "")
                      ?.match(/.{1,4}/g)
                      ?.join("-")}#${receiptSignature
                      ?.padEnd(20, "")
                      ?.match(/.{1,4}/g)
                      ?.join("-")}`}
                    size={97}
                  />
                </div>
              ) : (
                <img
                  src="/receiptLogo/qrcode.png"
                  alt="QR Code"
                  className="h-24 w-24"
                />
              )}
            </div>

            {/* Totals Table */}
            <div className="h-fit">
              <table className="border border-black text-xs">
                <tbody>
                  <tr>
                    <td className="border border-black p-1">Total Rwf</td>
                    <td className="border border-black p-1 text-right">
                      {totals.total.toFixed(2)}
                    </td>
                  </tr>
                  {totals.totalAEx ? (
                    <tr>
                      <td className="border border-black p-1">Total A Ex</td>
                      <td className="border border-black p-1 text-right">
                        {totals.totalAEx.toFixed(2)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {totals.totalC ? (
                    <tr>
                      <td className="border border-black p-1">Total C</td>
                      <td className="border border-black p-1 text-right">
                        {totals.totalC.toFixed(2)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {totals.totalD ? (
                    <tr>
                      <td className="border border-black p-1">Total D</td>
                      <td className="border border-black p-1 text-right">
                        {totals.totalD.toFixed(2)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {totals.totalB ? (
                    <tr>
                      <td className="border border-black p-1">Total B-18%</td>
                      <td className="border border-black p-1 text-right">
                        {totals.totalB.toFixed(2)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                   {totals.totalTaxB ? (
                    <tr>
                      <td className="border border-black p-1">Total Tax-B</td>
                      <td className="border border-black p-1 text-right">
                        {totals.totalTaxB.toFixed(2)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td className="border border-black p-1">Total Tax</td>
                    <td className="border border-black p-1 text-right">
                      {totals.totalTax.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">ITEM NUMBER</td>
                    <td className="border border-black p-1 text-right">
                      {itemsNumber}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">Payment Mode</td>
                    <td className="border border-black p-1 text-right">
                      {payment.method}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A4Receipt;
export const DisplayMessage = ({ message }: { message: string }) => {
  const formattedMessage = message.replace(/\\n/g, "\n");
  const lines = formattedMessage.split("\n");

  return (
    <div>
      <h2
        style={{fontWeight: "bold" }}
        className="text-[14px]"
      >
        {lines[0]}
      </h2>
      <div style={{ whiteSpace: "pre-line" }}>{lines.slice(1).join("\n")}</div>
    </div>
  );
};
