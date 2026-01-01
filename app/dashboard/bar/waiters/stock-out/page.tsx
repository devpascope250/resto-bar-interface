"use client";

import type React from "react";

import { useState } from "react";
import { useProducts } from "@/lib/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PackageMinus, AlertTriangle } from "lucide-react";
import { useApi } from "@/hooks/api-hooks";

export default function StockOutPage() {
  const { useApiQuery, useApiPut } = useApi();
  const {
    data: products,
    isLoading,
    refetch,
  } = useApiQuery<Product[]>(["products"], "/bar/products");

  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const { mutateAsync: stockOut, isPending: isStockingOut } = useApiPut(
    ["products"],
    `${`/bar/products/stock-out/${selectedProduct?.id}`}`
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantityNum = Number.parseInt(quantity);
    if (selectedProduct && quantityNum > selectedProduct?.currentStock) {
      toast({
        title: "Insufficient stock",
        description: `Cannot remove ${quantityNum} units. Only ${selectedProduct?.currentStock} units available.`,
        variant: "destructive",
      });
      return;
    }

    await stockOut({ quantity: quantityNum, reason })
      .then(() => {
        refetch();
        setSelectedProduct(null);
        setQuantity("");
        setReason("");
        toast({
          title: "Stock removed successfully",
          description: `Removed ${quantity} units of ${selectedProduct?.name} from inventory.`,
          variant: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        
        toast({
          title: "Error removing stock",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const isInsufficientStock = Boolean(
    selectedProduct &&
      quantity &&
      Number.parseInt(quantity) > selectedProduct.currentStock
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Stock Out</h1>
        <p className="text-muted-foreground">
          Remove inventory from products (damaged, expired, etc.)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageMinus className="h-5 w-5" />
              Remove Stock
            </CardTitle>
            <CardDescription>
              Select a product and enter the quantity to remove
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={selectedProduct?.id.toString() || ""}
                  onValueChange={(value) => {
                    const product = products?.find(
                      (p) => p.id.toString() === value
                    );
                    setSelectedProduct(product || null);
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id.toString()}
                      >
                        {product.name} - {product.productType} (Available:{" "}
                        {product.currentStock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to Remove</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct?.currentStock || undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
                {isInsufficientStock && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Insufficient stock available</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Damaged goods, Expired items, Quality issues, etc."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isStockingOut || !selectedProduct}
              >
                {isStockingOut ? "Removing Stock..." : "Remove Stock"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {selectedProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Current inventory information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Product Name
                </p>
                <p className="text-lg font-semibold">{selectedProduct.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p className="text-lg">
                  {selectedProduct.beverageCategory?.name
                    ? `${selectedProduct.beverageCategory?.name} - ${selectedProduct.beverageCategory?.description}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Product Type
                </p>
                <p className="text-lg capitalize">
                  {selectedProduct.productType}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Stock
                </p>
                <p className="text-2xl font-bold text-primary">
                  {selectedProduct.currentStock} units
                </p>
              </div>
              {quantity && !isInsufficientStock && (
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Stock After Removal
                  </p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {selectedProduct.currentStock -
                      Number.parseInt(quantity || "0")}{" "}
                    units
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
