import { PurchaseSalesTransaction } from "@/components/data-table/purchases-items-columna";
import { DateUtils } from "../date-utils";
export interface PurchaseSalesTransactionSave {
    tin: string;
    bhfId: string;
    spplrTin?: string;
    invcNo: number;
    orgInvcNo: number;
    spplrBhfId?: string;
    spplrNm?: string;
    spplrInvcN?: number;
    spplrSdcId?: string;
    regTyCd: string;
    pchsTyCd: string;
    rcptTyCd: string;
    pmtTyCd: string;
    pchsSttsCd: string;
    cfmDt?: string;
    pchsDt: string;
    wrhsDt?: string;
    cnclReqDt?: string;
    cnclDt?: string;
    rfdDt?: string;
    totItemCnt: number;
    taxblAmtA: number;
    taxblAmtB: number;
    taxblAmtC: number;
    taxblAmtD: number;
    taxRtA: number;
    taxRtB: number;
    taxRtC: number;
    taxRtD: number;
    taxAmtA: number;
    taxAmtB: number;
    taxAmtC: number;
    taxAmtD: number;
    totTaxblAmt: number;
    totTaxAmt: number;
    totAmt: number;
    remark?: string;
    regrNm: string;
    regrId: string;
    modrNm: string;
    modrId: string;
    itemList: PurchaseSalesTransactionItemSave[];
}

export interface PurchaseSalesTransactionItemSave{
    itemSeq: number;
    itemCd?: string;
    itemClsCd: string;
    itemNm: string;
    bcd?:  string;
    spplrItemClsCd?:  string | null;
    spplrItemCd?: string | null;
    spplrItemNm?: string | null;
    pkgUnitCd?: string;
    pkg: number;
    qtyUnitCd: string;
    qty: number;
    prc: number;
    splyAmt: number;
    dcRt: number;
    dcAmt: number;
    taxblAmt: number;
    taxTyCd: string;
    taxAmt: number; 
    totAmt: number // duplicate column
    itemExprDt?: string | null; 
}
export class PurchaseTransactionSettings {
    public getAllPayloads(data: PurchaseSalesTransaction, pchsSttsCd: string): PurchaseSalesTransactionSave {
        const payload: PurchaseSalesTransactionSave = {
            tin: data.tin ?? "",
            bhfId: data.bhfId ?? "",
            spplrTin: data.spplrTin ?? "",
            invcNo:  1,
            orgInvcNo:  0,
            spplrBhfId: data.spplrBhfId ?? "",
            spplrNm: data.spplrNm ?? "",
            spplrInvcN: data.spplrInvcNo ?? 0,
            spplrSdcId: "",
            regTyCd: "A",
            pchsTyCd: "N",
            rcptTyCd: "P",
            pmtTyCd: data.pmtTyCd ?? "",
            pchsSttsCd: pchsSttsCd ?? "",
            cfmDt: DateUtils.format(new Date(data.cfmDt ?? "")) ?? "",
            pchsDt: DateUtils.formatDay(new Date()),
            wrhsDt: "",
            cnclReqDt: "",
            cnclDt: "",
            rfdDt:  "",
            totItemCnt: data.totItemCnt ?? 0,
            taxblAmtA: data.taxblAmtA ?? 0,
            taxblAmtB: data.taxblAmtB ?? 0,
            taxblAmtC: data.taxblAmtC ?? 0,
            taxblAmtD: data.taxblAmtD ?? 0,
            taxRtA: data.taxRtA ?? 0,
            taxRtB: data.taxRtB ?? 0,
            taxRtC: data.taxRtC ?? 0,
            taxRtD: data.taxRtD ?? 0,
            taxAmtA: data.taxAmtA ?? 0,
            taxAmtB: data.taxAmtB ?? 0,
            taxAmtC: data.taxAmtC ?? 0,
            taxAmtD: data.taxAmtD ?? 0,
            totTaxblAmt: data.totTaxblAmt ?? 0,
            totTaxAmt: data.totTaxAmt ?? 0,
            totAmt: data.totAmt ?? 0,
            remark: data.remark ?? "",
            regrNm: 'admin',
            regrId: 'admin',
            modrNm: 'admin',
            modrId: 'admin',
            itemList: data?.itemList?.map((item) => {
                return {
                    itemSeq: item.itemSeq ?? 0,
                    itemCd: item.itemCd ?? "",
                    itemClsCd: item.itemClsCd ?? "",
                    itemNm: item.itemNm ?? "",
                    bcd: item.bcd ?? "",
                    spplrItemClsCd: null,
                    spplrItemCd: null,
                    spplrItemNm: null,
                    pkgUnitCd: item.pkgUnitCd ?? "",
                    pkg: item.pkg ?? 0,
                    qtyUnitCd: item.qtyUnitCd ?? "",
                    qty: item.qty ?? 0,
                    prc: item.prc ?? 0,
                    splyAmt: item.splyAmt ?? 0,
                    dcRt: item.dcRt ?? 0,
                    dcAmt: item.dcAmt ?? 0,
                    taxblAmt: item.taxblAmt ?? 0,
                    taxTyCd: item.taxTyCd ?? "",
                    taxAmt: item.taxAmt ?? 0,
                    totAmt: item.totAmt ?? 0,
                    itemExprDt: null
                }
            }) ?? []

        }

        return payload;
    }
}