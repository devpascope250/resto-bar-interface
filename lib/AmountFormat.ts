export function AmountFormat(Enteramount: string, decimals?: number, currency=true) {
    const amount = Number.parseFloat(Enteramount);
      if (isNaN(amount)) {
        return '0.00 RWF';
    }
    const numberFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals ?? 2,  // Always show at least 2 decimals
        maximumFractionDigits: 20, // Allow more decimals if present
        useGrouping: true,
    });
    
    return currency ? `${numberFormatter.format(amount)} RWF` : numberFormatter.format(amount);
    // Output: "100.00 RWF"
}