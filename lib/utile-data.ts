export class UtilData {
    generateItemCode = (country: string, productType: string, packagingUnity: string, quantityUnity: string, existedItemCode?: string) => {
        const newIGeneCode = country + productType + packagingUnity + quantityUnity;

        // If we found matching items, increment the highest one
        if (existedItemCode && existedItemCode !== "0") {
            return this.IncrementItemCode(newIGeneCode+existedItemCode);
        }else{
            return newIGeneCode + '0000001';
        }  
    }

    IncrementItemCode = (itemCode: string) => {
        const prefix = itemCode.slice(0, -7);
        const numberPart = Number(itemCode.slice(-7));
        return prefix + (numberPart + 1).toString().padStart(7, '0');
    }    
}

