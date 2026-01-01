"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, Percent, Hash } from "lucide-react"
import { PurchaseSalesTransactionItem } from "@/components/data-table/purchases-items-columna"

interface ItemsDialogProps {
  items: PurchaseSalesTransactionItem[]
  trigger: React.ReactNode
  transactionId: number
  totalItems: number
}

export function ItemsDialog({ items, trigger, transactionId, totalItems }: ItemsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Transaction #{transactionId} - Items ({totalItems})
          </DialogTitle>
          <DialogDescription>
            Detailed view of all items in this transaction
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id || index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{item.itemNm || `Item ${item.itemSeq}`}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">
                        <Hash className="h-3 w-3 mr-1" />
                        Seq: {item.itemSeq}
                      </Badge>
                      <Badge variant="outline">
                        Code: {item.itemCd}
                      </Badge>
                      <Badge variant="outline">
                        Class: {item.itemClsCd}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {item.totAmt?.toLocaleString('en-US')} RWF
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.qty} × {item.prc?.toLocaleString('en-US')} RWF
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Quantity:</div>
                      <div className="text-sm">
                        {item.qty} {item.qtyUnitCd}
                      </div>
                      
                      <div className="text-sm font-medium">Package:</div>
                      <div className="text-sm">
                        {item.pkg} {item.pkgUnitCd}
                      </div>
                      
                      <div className="text-sm font-medium">Unit Price:</div>
                      <div className="text-sm">
                        {item.prc?.toLocaleString('en-US')} RWF
                      </div>
                      
                      <div className="text-sm font-medium">Supply Amount:</div>
                      <div className="text-sm">
                        {item.splyAmt?.toLocaleString('en-US')} RWF
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Tax Type:</div>
                      <div className="text-sm">
                        <Badge variant={item.taxTyCd === "A" ? "default" : "secondary"}>
                          Type {item.taxTyCd}
                        </Badge>
                      </div>
                      
                      <div className="text-sm font-medium">Taxable Amount:</div>
                      <div className="text-sm">
                        {item.taxblAmt?.toLocaleString('en-US')} RWF
                      </div>
                      
                      <div className="text-sm font-medium">Tax Amount:</div>
                      <div className="text-sm">
                        {item.taxAmt?.toLocaleString('en-US')} RWF
                      </div>
                      
                      <div className="text-sm font-medium">Discount:</div>
                      <div className="text-sm">
                        {item.dcRt}% ({item.dcAmt?.toLocaleString('en-US')} RWF)
                      </div>
                    </div>
                    
                    {item.bcd && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <div className="text-xs font-semibold">Barcode:</div>
                        <div className="font-mono text-sm">{item.bcd}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Item ID: {item.id}
                    </div>
                    <div className="text-sm font-semibold">
                      Total: {item.totAmt?.toLocaleString('en-US')} RWF
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Total Items: {totalItems}
            </div>
            <div className="text-lg font-bold">
              Transaction Total: {
                items.reduce((sum, item) => sum + (item.totAmt || 0), 0)
                  .toLocaleString('en-US')
              } RWF
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}