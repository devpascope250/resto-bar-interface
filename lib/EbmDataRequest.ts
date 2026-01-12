import { ApiService } from "./ApiService";

export class EbmDataRequest extends ApiService {
    constructor(BarToken: string, EbmToken: string) {
        const headers = {
            "Authorization": `Bearer ${BarToken}`,
            "EbmToken": `Bearer ${EbmToken}`
        };
        super(headers);
    }
    async getAllClassificationCodes(): Promise<any> {
        return await this.fetch('/all-classificationCodes');
    }
    async getCodesByType(type: string): Promise<any> {
        return await this.fetch(`/all-codes/${type}`);
    }

    async getALLCodesByCdClsNm(cdClsNm: string, query?: string): Promise<any> {
        return await this.fetch(`/all-codes/by-cdCls/${cdClsNm}${query ? `?query=${query}` : ""}`);
    }

    // get all item Classification

    async getAllItemClassification(query?: string): Promise<any> {
        return await this.fetch(`/selectItemsClass${query ? `?query=${query}` : ''}`);
    }

    // get all notice

    async getAllNotice(): Promise<any> {
        return await this.fetch('/selectNotices');
    }

    // get latest Item Code
    async getLatestItemCode(): Promise<any> {
        return await this.fetch('/get-latest-item-code');
    }

    // CREATE NEW SALE TRANSACTION
    async createNewSaleTransaction(data: any): Promise<any> {
        return await this.fetch('/create-sale-transaction', data);
    }

    async getStockMovement(start_date?: string, end_date?: string): Promise<any> {
        return await this.fetch(`/selectStockItems${start_date&&end_date? `?start_date=${start_date}&end_date=${end_date}` : ''}`);
    }

    async getAllImportedItems(start_date: string, end_date: string): Promise<any> {
        return await this.fetch(`/selectImportItems${start_date&&end_date? `?start_date=${start_date}&end_date=${end_date}` : ''}`);
    }
    // update imported items
    async updateImported(data: any): Promise<any> {
        return await this.fetch('/updateImportItems',"POST", data);
    }


    // list all purchased Items
    async getAllPurchasedSalesTransactions(start_date: string, end_date: string): Promise<any> {
        return await this.fetch(`/selectTrnsPurchaseSales${start_date&&end_date? `?start_date=${start_date}&end_date=${end_date}` : ''}`);
    }

    // save purchase Status

    async savePurchaseStatus(data: any): Promise<any> {
        return await this.fetch('/savePurchases', "POST", data);
    }

    async generateSalesReport(reportType: string,start_date?: string, end_date?: string): Promise<any> {
        return await this.fetch(`/generate-sales-report?${reportType ? `reportType=${reportType}&` : ''}${start_date && end_date ? `startDate=${start_date}&endDate=${end_date}&` : ''}`);
    }

    async generateSalesXreport(start_date?: string, end_date?: string): Promise<any> {
        return await this.fetch(`/generate-sales-xreport?${start_date && end_date ? `startDate=${start_date}&endDate=${end_date}&` : ''}`);
    }

     async getLatestSalesInvoiceId(): Promise<any> {
        return await this.fetch(`/get-latest-invoice-id`);
    }

    async getStockMaster(): Promise<any> {
        return await this.fetch(`/selectStockMaster`);
    }

}