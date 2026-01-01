"use client";

import type React from "react";

import { useState } from "react";
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
import { PackagePlus } from "lucide-react";
import { useApi } from "@/hooks/api-hooks";

export default function StockInPage() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const { useApiQuery, useApiPut } = useApi();
  const {
    data: products,
    isLoading,
    refetch,
  } = useApiQuery<Product[]>(["products"], "/bar/products");
  const { mutateAsync: stockInProduct, isPending: isStockInLoading } =
    useApiPut(["products"], `/bar/products/stock-in/${selectedProduct?.id}`);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await stockInProduct({ quantity: parseInt(quantity), reason }).then(() => {
      // Handle success
      refetch();
      toast({
        title: "Stock added successfully",
        description: `Added ${quantity} units of ${selectedProduct?.name} to inventory.`,
        variant: "success",
      });
      setSelectedProduct(null);
      setQuantity("");
      setReason("");
    })
    .catch((error) => {
      // Handle error
      toast({
        title: "Error adding stock",
        description: error.message,
        variant: "destructive",
      });
    })
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Stock In</h1>
        <p className="text-muted-foreground">
          Add inventory to existing products
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5" />
              Add Stock
            </CardTitle>
            <CardDescription>
              Select a product and enter the quantity to add
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
                        {product.name} - {product.beverageCategory?.type}{" "}
                        (Current: {product.currentStock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to Add</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., New stock delivery, Restock, etc."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isStockInLoading || !selectedProduct}
              >
                {isStockInLoading ? "Adding Stock..." : "Add Stock"}
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
                    : "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Product Type
                </p>
                <p className="text-lg capitalize">
                  {selectedProduct.productType ?? "Unknown"}
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
              {quantity && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    New Stock After Addition
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedProduct.currentStock +
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
