"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MigratedProduct } from "./migrated-product-columns";

interface ConfirmTaxChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: MigratedProduct | null;
  newTaxType?: "A" | "B" | "C";
  isUpdating: boolean;
}

export function ConfirmTaxChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  product,
  newTaxType,
  isUpdating
}: ConfirmTaxChangeDialogProps) {
  if (!product || !newTaxType) return null;
  
  const getTaxTypeLabel = (type: string) => {
    switch(type) {
      case "A": return { label: "Category A", color: "bg-blue-100 text-blue-800" };
      case "B": return { label: "Category B", color: "bg-purple-100 text-purple-800" };
      case "C": return { label: "Category C", color: "bg-indigo-100 text-indigo-800" };
      default: return { label: "Unassigned", color: "bg-gray-100 text-gray-800" };
    }
  };
  
  const oldTax = getTaxTypeLabel(product.taxTyCd || "");
  const newTax = getTaxTypeLabel(newTaxType);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDialogTitle>Confirm Tax Category Change</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 font-medium">
                You are about to change the tax category for this product.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <div className="font-mono text-sm font-bold">{product.itemCd}</div>
                  <div className="text-sm text-gray-600">{product.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-bold">${parseFloat(product.price).toFixed(2)}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Current Tax:</div>
                <Badge className={`${oldTax.color} font-bold`}>
                  {oldTax.label}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">New Tax:</div>
                <Badge className={`${newTax.color} font-bold`}>
                  {newTax.label}
                </Badge>
              </div>
              
              <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  This change will be recorded in the audit log. The product will be locked from further changes after this update.
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isUpdating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Change"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}