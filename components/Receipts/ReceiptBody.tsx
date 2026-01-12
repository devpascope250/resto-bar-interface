import { SalesTransaction } from "@/types/SalesTransaction";
import CopyRefund from "./CopyRefund";
import NormalRefund, { ReceiptData } from "./NormalRefund";
import NormalSale from "./NormalSale";
import ProformaSale from "./ProformaSale";
import TrainingSale from "./TrainingSale";
import CopySale from "./CopySale";
import { PaymentMethodCodeClassification } from "@/lib/codeDefinitions";
import A4Receipt from "./A4/A4Receipt";
import A4ReceiptCopy from "./A4/A4ReceiptCopy";
import A4ReceiptRefund from "./A4/A4ReceiptRefund";
import A4ReceiptRefundCopy from "./A4/A4ReceiptRefundCopy";
import Proforma from "./A4/Proforma";
import A4ReceiptTraining from "./A4/A4ReceiptTraining";
import TrainingRefund from "./TrainingRefund";
import A4ReceiptTrainingRefund from "./A4/A4ReceiptTrainingRefund";

interface ReceiptProps {
  data: {
    type: "NS" | "NR" | "CS" | "CR" | "TS" | "TR" | "PS";
    dt: any;
    status: number;
    formatTYpe: string;
  };
}
const ReceiptBody: React.FC<ReceiptProps> = ({ data }) => {
  let { dt, type, status, formatTYpe } = data;
  const dtmod = dt as SalesTransaction;
  const Newdt: ReceiptData = {
    tradeName: dtmod.receipt.trdeNm?.toUpperCase() ?? "",
    address: dtmod.receipt.adrs ?? "",
    tin: dtmod.tin ?? "",
    customerMobile: dtmod.receipt.custMblNo ?? "",
    customerName: dtmod.custNm ?? "",
    clientId: dtmod.receipt.custTIn ?? dtmod.custNm,
    totals: {
      total: dtmod.totAmt,
      totalAEx: dtmod.taxblAmtA,
      totalB: dtmod.taxblAmtB,
      totalC: dtmod.taxblAmtC,
      totalD: dtmod.taxblAmtD,
      totalTaxB: dtmod.taxAmtB,
      totalTax: dtmod.totTaxAmt,
    },
    payment: {
      method:
        PaymentMethodCodeClassification.find((x) => x.code === dtmod.pmtTyCd)
          ?.codeName ?? "",
      amount: dtmod.totAmt,
    },
    itemsNumber: dtmod.totItemCnt,
    date: dtmod.response?.vsdcRcptPbctDate ?? "",
    time: dtmod.response?.vsdcRcptPbctDate ?? "",
    cisDate: new Date(),
    cisTime: new Date(),
    sdcId: dtmod.response?.sdcId ?? "",
    receiptNumber: dtmod.invcNo?.toString() ?? "",
    ebmReceiptNo: dtmod.response?.rcptNo?.toString() ?? "",
    referenceId: dtmod.orgInvcNo.toString(),
    internalData: dtmod.response?.intrlData ?? "",
    receiptSignature: dtmod.response?.rcptSign ?? "",
    mrc: dtmod.response?.mrcNo ?? "",
    thankYouMessage: dtmod.receipt.btmMsg ?? "",
    commercialMessage: dtmod.receipt.topMsg ?? "",
    items: dtmod.itemList.map((item) => {
      return {
        name: item.itemNm,
        itemCd: item.itemCd,
        quantity: item.qty,
        unitPrice: item.prc,
        total: item.qty * item.prc,
        taxType: item.taxTyCd,
        discount: item.dcRt,
      };
    }),
  };

  return (
    <>
      {formatTYpe !== "A4" ? (
        <>
          {type === "NS" && status === 201 && (
            <NormalSale receiptData={Newdt} />
          )}
          {type === "NS" && status === 200 && <CopySale receiptData={Newdt} />}
          {type === "NR" && status === 201 && (
            <NormalRefund receiptData={Newdt} />
          )}
          {type === "NR" && status === 200 && (
            <CopyRefund receiptData={Newdt} />
          )}
          {(type === "TS") && (
            <TrainingSale receiptData={Newdt} />
          )}
          {(type === "TR") && (
            <TrainingRefund receiptData={Newdt} />
          )}

          {type === "PS" && <ProformaSale receiptData={Newdt} />}
        </>
      ) : (
        <>
        {type === "NS" && status === 201 &&<A4Receipt receiptData={Newdt} />}
        {type === "NS" && status === 200 &&<A4ReceiptCopy receiptData={Newdt} />}
        {type === "NR" && status === 201 &&<A4ReceiptRefund receiptData={Newdt} />}
        {type === "NR" && status === 200 &&<A4ReceiptRefundCopy receiptData={Newdt} />}
        {type === "PS" &&<Proforma receiptData={Newdt} />}
        {type === "TS" &&<A4ReceiptTraining receiptData={Newdt} />}
        {type === "TR" &&<A4ReceiptTrainingRefund receiptData={Newdt} />}
        </>
      )}
    </>
  );
};

export default ReceiptBody;
