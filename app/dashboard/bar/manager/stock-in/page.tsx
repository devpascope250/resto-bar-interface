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
import { PackagePlus, Plus, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/api-hooks";

// Define the Item interface based on your requirements
interface ItemDt {
  itemCd: string;
  productId: string;
  itemNm: string;
  price: number;
  quantity: number;
}

interface StockInRequest {
  stockinType: string;
  items: ItemDt[];
  reason?: string;
}

export default function StockInPage() {
  const { toast } = useToast();
  const [stockinType, setStockinType] = useState("");
  const [reason, setReason] = useState("");
  const [items, setItems] = useState<ItemDt[]>([
    { itemCd: "",productId: "", itemNm: "", price: 0, quantity: 0 },
  ]);

  const { useApiQuery, useApiPost } = useApi();
  const {
    data: products,
    isLoading,
    refetch,
  } = useApiQuery<Product[]>(["products"], "/bar/products");
  const { mutateAsync: stockInProducts, isPending: isStockInLoading } =
    useApiPost(["products-stockin"], `/bar/products/stock-in`);

      const { data: stockType, isLoading: isStockType } = useApiQuery(
    ["StockI/OType"],
    `/ebm/codes/cdClsNm/StockIOType`,
    {
      staleTime: Infinity
    }
  );

  // Add a new empty item
  const addItem = () => {
    setItems([...items, { itemCd: "",productId: "", itemNm: "", price: 0, quantity: 0 }]);
  };

  // Remove an item by index
  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  // Update a specific item field
  const updateItem = (index: number, field: keyof ItemDt, value: string | number) => {
    const newItems = [...items];
    if (field === "price" || field === "quantity") {
      newItems[index][field] = Number(value);
    } else {
      newItems[index][field] = value as string;
    }
    setItems(newItems);
  };

  // When a product is selected from dropdown, populate the item fields
  const handleProductSelect = (index: number, productId: string) => {
    const product = products?.find(p => p.id.toString() === productId);
    if (product) {
      updateItem(index, "itemCd", product.itemCd || product.id.toString());
      updateItem(index, "productId", product.id.toString());
      updateItem(index, "itemNm", product.name);
      updateItem(index, "price", product.price || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = items.every(item => item.productId && item.itemNm && item.quantity > 0);
    if(!isValid){
      // getting messing fields
      const missingFields = items.filter(item => !item.productId || !item.itemNm || item.quantity <= 0);
      const missingFieldNames = missingFields.map(item => item.itemNm).join(", ");

      toast({
        title: "Invalid items",
        description: `Please fill in all fields for ${missingFieldNames}`,
        variant: "destructive",
      });
      return;
    }
    // Filter out empty items
    const validItems = items.filter(item =>
      item.itemCd && item.itemNm && item.quantity > 0
    );

    if (validItems.length === 0) {
      toast({
        title: "No valid items",
        description: "Please add at least one product with quantity",
        variant: "destructive",
      });
      return;
    }

    const stockInRequest: StockInRequest = {
      stockinType,
      items: validItems,
      reason: reason || undefined,
    };

    await stockInProducts(stockInRequest)
      .then(() => {
        toast({
          title: "Stock added successfully",
          description: `Added ${validItems.length} product(s) to inventory.`,
          variant: "success",
        });
        setItems([{ itemCd: "", productId: "", itemNm: "", price: 0, quantity: 0 }]);
        setReason("");
        refetch();
      })
      .catch((error) => {
        toast({
          title: "Error adding stock",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  // Calculate total quantity
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  // Calculate total value
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Stock In</h1>
        <p className="text-muted-foreground">
          Add inventory to products
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Card - Add Stock */}
        <div className="flex flex-col h-full">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackagePlus className="h-5 w-5" />
                Add Stock
              </CardTitle>
              <CardDescription>
                Add multiple products and enter quantities
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                {/* Stock In Type */}
                <div className="space-y-2">
                  <Label htmlFor="stockinType">Stock In Type</Label>
                  <Select
                    value={stockinType}
                    onValueChange={setStockinType}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        (stockType as any[])?.map((stock) => {
                          return (
                            <SelectItem key={stock.cd} value={stock.cd}>{stock.cdNm}</SelectItem>
                          )
                        })
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Products</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItem}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Product
                    </Button>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Product {index + 1}</h4>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Product Selection */}
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor={`product-${index}`}>Product</Label>
                          <Select
                            value={item.productId || ""}
                            onValueChange={(value) => handleProductSelect(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products?.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                >
                                  {product.name} - {product.beverageCategory?.type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Item Code */}
                        <div className="space-y-2">
                          <Label htmlFor={`itemCd-${index}`}>Item Code</Label>
                          <Input
                            id={`itemCd-${index}`}
                            value={item.itemCd}
                            onChange={(e) => updateItem(index, "itemCd", e.target.value)}
                            placeholder="Item code"
                            required
                            readOnly
                          />
                        </div>

                        {/* Item Name */}
                        <div className="space-y-2">
                          <Label htmlFor={`itemNm-${index}`}>Item Name</Label>
                          <Input
                            id={`itemNm-${index}`}
                            value={item.itemNm}
                            onChange={(e) => updateItem(index, "itemNm", e.target.value)}
                            placeholder="Item name"
                            required
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                          <Label htmlFor={`price-${index}`}>Price</Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, "price", e.target.value)}
                            placeholder="Price"
                            required
                          />
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                            placeholder="Quantity"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                      <p className="text-lg font-semibold">{items.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Quantity</p>
                      <p className="text-lg font-semibold">{totalQuantity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold text-primary">
                        ${totalValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {/* <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., New stock delivery, Restock, etc."
                  />
                </div> */}

                <Button
                  onClick={handleSubmit}
                  className="w-full cursor-pointer"
                  disabled={isStockInLoading || items.every(item => item.productId === "")}
                >
                  {isStockInLoading ? "Adding Stock..." : "Add Stock"}
                </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Card - Preview */}
        <div className="flex flex-col h-full">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Stock In Summary</CardTitle>
              <CardDescription>Preview of the stock in operation</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Stock In Type
                </p>
                <p className="text-lg font-semibold capitalize">{(stockType as any[])?.find((type) => type.cd === stockinType)?.cdNm || stockinType}</p>
              </div>

              {/* {reason && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Reason
                  </p>
                  <p className="text-lg">{reason}</p>
                </div>
              )} */}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Products to Add
                </p>
                <div className="space-y-3">
                  {items.filter(item => item.itemCd).map((item, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.itemNm}</p>
                        <p className="text-primary font-semibold">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <p>Code: {item.itemCd}</p>
                        <p>Subtotal: ${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Total Quantity</p>
                  <p className="text-xl font-bold">{totalQuantity} units</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-primary">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}