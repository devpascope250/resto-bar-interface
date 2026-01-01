"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCard,
  Wallet,
  Smartphone,
  Building,
  Banknote,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PaymentMethod = "CASH" | "POS" | "MOBILEMONEY" | "BANK" | "CARD";

export interface PaymentAmount {
  method: PaymentMethod;
  amount: number;
}

export type PaymentType = "pay-now" | "pay-later";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  orderName: string;
  onConfirmPayment: (paymentData: {
    payments: PaymentAmount[];
    paymentType: PaymentType;
  }) => void;
  isProcessing?: boolean;
}

export function PaymentDialog({
  open,
  onOpenChange,
  totalAmount,
  orderName,
  onConfirmPayment,
  isProcessing = false,
}: PaymentDialogProps) {
  const { toast } = useToast();
  const [paymentType, setPaymentType] = useState<PaymentType>("pay-now");
  const [paymentMethods, setPaymentMethods] = useState<PaymentAmount[]>([
    { method: "CASH", amount: totalAmount },
  ]);

  const remainingAmount =
    totalAmount - paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);

  const addPaymentMethod = () => {
    if (paymentMethods.length >= 5) {
      toast({
        title: "Maximum payment methods reached",
        description: "You can only use up to 5 payment methods",
        variant: "error",
      });
      return;
    }
    setPaymentMethods([...paymentMethods, { method: "CASH", amount: 0 }]);
  };

  const removePaymentMethod = (index: number) => {
    if (paymentMethods.length === 1) {
      setPaymentMethods([{ method: "CASH", amount: totalAmount }]);
      return;
    }
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const updatePaymentMethod = (
    index: number,
    updates: Partial<PaymentAmount>
  ) => {
    const updated = [...paymentMethods];
    updated[index] = { ...updated[index], ...updates };
    setPaymentMethods(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentType === "pay-now") {
      const totalPaid = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);

      if (totalPaid !== totalAmount) {
        toast({
          title: "Payment amount mismatch",
          description: `Total paid (${totalPaid.toFixed(
            2
          )} Rwf) must equal order total (${totalAmount.toFixed(2)} Rwf)`,
          variant: "error",
        });
        return;
      }

      const hasInvalidAmount = paymentMethods.some((pm) => pm.amount <= 0);
      if (hasInvalidAmount) {
        toast({
          title: "Invalid payment amount",
          description: "All payment amounts must be greater than 0",
          variant: "error",
        });
        return;
      }
    }

    const validPayments =
      paymentType === "pay-now"
        ? paymentMethods.filter((pm) => pm.amount > 0)
        : [];

    onConfirmPayment({
      payments: validPayments,
      paymentType,
    });
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "CASH":
        return <Banknote className="h-4 w-4" />;
      case "POS":
        return <CreditCard className="h-4 w-4" />;
      case "MOBILEMONEY":
        return <Smartphone className="h-4 w-4" />;
      case "BANK":
        return <Building className="h-4 w-4" />;
      case "CARD":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case "CASH":
        return "Cash";
      case "POS":
        return "POS Terminal";
      case "MOBILEMONEY":
        return "Mobile Money";
      case "BANK":
        return "Bank Transfer";
      case "CARD":
        return "Credit Card";
      default:
        return method;
    }
  };

  // Reset when dialog opens or payment type changes
  useEffect(() => {
    if (open) {
      if (paymentType === "pay-now") {
        setPaymentMethods([{ method: "CASH", amount: totalAmount }]);
      } else {
        setPaymentMethods([]);
      }
    }
  }, [open, paymentType, totalAmount]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Payment Method</DialogTitle>
          <DialogDescription>
            {orderName ? `Order for ${orderName} - ` : ""}Total:{" "}
            {totalAmount.toFixed(2)} Rwf
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Payment Type Selection */}
            <RadioGroup
              value={paymentType}
              onValueChange={(value: PaymentType) => setPaymentType(value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pay-now" id="pay-now" />
                <Label
                  htmlFor="pay-now"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  Pay Now
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pay-later" id="pay-later" />
                <Label
                  htmlFor="pay-later"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  Pay Later (Add to Tab)
                </Label>
              </div>
            </RadioGroup>

            {/* Payment Methods for Pay Now */}
            {paymentType === "pay-now" && (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {paymentMethods.map((payment, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-start p-3 border rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(payment.method)}
                          <Label
                            htmlFor={`method-${index}`}
                            className="text-sm font-medium"
                          >
                            Payment Method{" "}
                            {paymentMethods.length > 1 ? index + 1 : ""}
                          </Label>
                        </div>
                        <Select
                          value={payment.method}
                          onValueChange={(e) =>
                            updatePaymentMethod(index, {
                              method: e as PaymentMethod,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="POS">POS Terminal</SelectItem>
                            <SelectItem value="MOBILEMONEY">
                              Mobile Money
                            </SelectItem>
                            <SelectItem value="BANK">Bank Transfer</SelectItem>
                            <SelectItem value="CARD">Credit Card</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="space-y-1">
                          <Label
                            htmlFor={`amount-${index}`}
                            className="text-xs text-muted-foreground"
                          >
                            Amount (Rwf)
                          </Label>
                          <Input
                            id={`amount-${index}`}
                            type="number"
                            min="0"
                            max={totalAmount}
                            step="0.01"
                            value={payment.amount === 0 ? "" : payment.amount}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseFloat(e.target.value)
                                : 0;
                              updatePaymentMethod(index, { amount: value });
                            }}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      {paymentMethods.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePaymentMethod(index)}
                          className="mt-6 h-8 w-8 p-0"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Payment Method Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPaymentMethod}
                  className="w-full"
                >
                  + Add Payment Method
                </Button>

                {/* Amount Summary */}
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="font-medium">
                      {totalAmount.toFixed(2)} Rwf
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-medium">
                      {(totalAmount - remainingAmount).toFixed(2)} Rwf
                    </span>
                  </div>
                  <div
                    className={`flex justify-between text-sm font-semibold ${
                      remainingAmount !== 0
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    <span>
                      {remainingAmount > 0
                        ? "Remaining Amount"
                        : remainingAmount < 0
                        ? "Overpayment"
                        : "Fully Paid"}
                    </span>
                    <span>{Math.abs(remainingAmount).toFixed(2)} Rwf</span>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                {remainingAmount > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Quick Amounts
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        remainingAmount,
                        totalAmount,
                        Math.ceil(remainingAmount / 2),
                      ].map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const lastIndex = paymentMethods.length - 1;
                            updatePaymentMethod(lastIndex, {
                              amount: paymentMethods[lastIndex].amount + amount,
                            });
                          }}
                          className="text-xs"
                        >
                          +{amount.toFixed(0)} Rwf
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Pay Later Information */}
            {/* Pay Later Information */}
            {paymentType === "pay-later" && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Pay Later</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  This order will be added to {orderName || "the customer's"}{" "}
                  tab. Payment can be collected later when the customer is ready
                  to checkout.
                </p>
                <div className="mt-3 p-3 bg-card rounded border">
                  <div className="flex justify-between text-sm">
                    <span>Order Total:</span>
                    <span className="font-bold">
                      {totalAmount.toFixed(2)} Rwf
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Status:</span>
                    <span className="font-medium">Pending Payment</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={paymentType === "pay-now" && remainingAmount !== 0}
              className="cursor-pointer"
            >
              {isProcessing
                ? "Processing..."
                : paymentType === "pay-now"
                ? "Confirm Payment"
                : "Confirm Order (Pay Later)"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
