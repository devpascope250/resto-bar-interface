import { AmountFormat } from "@/lib/AmountFormat";
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
    referenceId?: string;
    receiptNumber: string;
    internalData: string;
    ebmReceiptNo: string;
    receiptSignature: string;
    mrc: string;
    thankYouMessage?: string;
    commercialMessage?: string;
  };
}

const A4ReceiptTrainingRefund: React.FC<ReceiptProps> = ({ receiptData }) => {
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
    ebmReceiptNo,
    internalData,
    receiptSignature,
    referenceId,
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
        <div className="relative grid grid-cols-3 items-center justify-between h-32">
          {/* Left Logo - Takes column 1 */}
          <div className="pt-1 col-start-1">
            <img
              src="/receiptLogo/logo1.png"
              alt="Logo 1"
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Center Content - Absolute positioned, doesn't affect grid */}
          <div className="absolute left-[47%] transform -translate-x-1/2 top-0 text-center leading-tight">
            <DisplayMessage message={commercialMessage ?? ""} />
            <div className="text-[14px] font-bold text-center mt-5">
              TRAINING MODE
            </div>
            <div className="text-[14px] font-bold text-center mt-1">REFUND</div>
            <div className="text-[14px] mt-1">
              <p>REFUND IS APPROVED ONLY FOR </p>
              <p>ORIGINAL SALES RECEIPT</p>
            </div>
          </div>

          {/* Right Logo - Force to column 3 */}
          <div className="flex justify-end pt-1 col-start-3">
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
          <div className="w-3/8 print:w-3/8">
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
          <div className="w-2/8 print:w-3/8 mt-4">
            <div className="border border-black p-2 print:p-1.5 text-xs print:text-[10px]">
              <p>
                <span>
                  <b>REF. TRAINING RECEIPT#:</b> {referenceId}
                </span>
              </p>
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
                   {item.discount ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "10px",
                      }}
                    >
                      <span>discount -{item.discount}%</span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>

                <td className="border-l border-r border-black p-1 text-center">
                  {item.quantity.toString()}
                </td>

                <td className="border-l border-r border-black p-1 text-center">
                  {item.taxType}
                </td>

                <td className="border-l border-r border-black p-1 text-right">
                 - {AmountFormat(item.unitPrice.toString(), 2, false)}
                </td>

                <td className="border-l border-r border-black p-1 text-right">
                  - {AmountFormat(item.total.toString(), 2, false)}
                  {item.discount ? (
                    <span><br />
                     - {AmountFormat((item.total * (1 - item.discount / 100)).toString(), 2, false)}
                    </span>
                  ) : (
                    ""
                  )}
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
        <div
          style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center" }}
        >
          THIS IS NOT AN OFFICIAL RECEIPT
        </div>

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
              RECEIPT NUMBER: {ebmReceiptNo}/{ebmReceiptNo} (TR)
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
            {/* Totals Table */}
            <div className="h-fit">
              <table className="border border-black text-xs">
                <tbody>
                  <tr>
                    <td className="border border-black p-1">Total Rwf</td>
                    <td className="border border-black p-1 text-right">
                      -{AmountFormat(totals.total.toString(), 2, false)}
                    </td>
                  </tr>
                  {totals.totalAEx ? (
                    <tr>
                      <td className="border border-black p-1">Total A Ex</td>
                      <td className="border border-black p-1 text-right">
                        -{AmountFormat(totals.totalAEx.toString(), 2, false)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {totals.totalC ? (
                    <tr>
                      <td className="border border-black p-1">Total C</td>
                      <td className="border border-black p-1 text-right">
                        -{AmountFormat(totals.totalC.toString(),2, false)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {totals.totalD ? (
                    <tr>
                      <td className="border border-black p-1">Total D</td>
                      <td className="border border-black p-1 text-right">
                        -{AmountFormat(totals.totalD.toString(),2, false)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {totals.totalB ? (
                    <tr>
                      <td className="border border-black p-1">Total B-18%</td>
                      <td className="border border-black p-1 text-right">
                        -{AmountFormat(totals.totalB.toString(), 2, false)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {totals.totalTaxB ? (
                    <tr>
                      <td className="border border-black p-1">Total Tax-B</td>
                      <td className="border border-black p-1 text-right">
                        -{AmountFormat(totals.totalTaxB.toString(), 2, false)}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td className="border border-black p-1">Total Tax</td>
                    <td className="border border-black p-1 text-right">
                      -{AmountFormat(totals.totalTax.toString(), 2, false)}
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

export default A4ReceiptTrainingRefund;
export const DisplayMessage = ({ message }: { message: string }) => {
  const formattedMessage = message.replace(/\\n/g, "\n");
  const lines = formattedMessage.split("\n");

  return (
    <div>
      <h2
        style={{ marginBottom: "8px", fontWeight: "bold" }}
        className="text-[14px]"
      >
        {lines[0]}
      </h2>
      <div style={{ whiteSpace: "pre-line" }}>{lines.slice(1).join("\n")}</div>
    </div>
  );
};
