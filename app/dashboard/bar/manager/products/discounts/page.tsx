"use client";

import { ProductCard } from "@/components/products/product-card";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/hooks/api-hooks";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Percent,
  Tag,
  Package,
} from "lucide-react";
import { keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Select from 'react-select';
// Types
interface Discount {
  id: string;
  discountName: string;
  rate: number;
  productId: string;
  productName?: string;
  startDate: Date | string;
  endDate: Date | string;
  createdAt: Date | string;
  isActive?: boolean;
}

interface DiscountFormData {
  discountName: string;
  rate: number;
  productId: string;
  startDate: Date;
  endDate: Date;
}

export default function ProductsDiscounts() {
  const { useApiQuery, useApiDelete, useApiPost } = useApi();
  const { toast } = useToast();
  // Products query
  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useApiQuery<Product[]>(["products"], "/bar/products", {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<DiscountFormData>({
    discountName: "",
    rate: 0,
    productId: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default: 7 days from now
  });

  // Mutations
  const { mutateAsync: createDiscountMutation, isPending: isCreatePending } =
    useApiPost<Discount, DiscountFormData>(["discounts"], "/bar/products/discount", {
      onSuccess: () => {
        refetchProducts(); // Refresh products to get updated discounts
        setIsAddDialogOpen(false);
        resetForm();
      },
    });

  const { mutateAsync: deleteDiscountMutation, isPending: isDeletePending } =
    useApiDelete(["discounts"], "/bar/products/discount", {
      onSuccess: () => {
        refetchProducts(); // Refresh products to get updated discounts
      },
    });

  // Extract and enhance discounts from products
  const enhancedDiscounts = useMemo(() => {
    if (!products) return [];

    const now = new Date();
    const discounts: (Discount & { isActive: boolean })[] = [];

    // Loop through products to extract discounts
    products.forEach((product) => {
      if (product.discount && product.discount !== null) {
        const discount = product.discount;
        const startDate = new Date(discount.startDate);
        const endDate = new Date(discount.endDate);
        const isActive = (startDate <= now || startDate >= now) && endDate >= now;

        discounts.push({
          ...discount,
          productName: product.name || "Unknown Product",
          productId: discount.productId || product.id.toString(),
          isActive,
          startDate: startDate,
          endDate: endDate,
          createdAt: new Date(discount.createdAt),
        });
      }
    });

    // Sort by creation date (newest first)
    return discounts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [products]);

  // Filter products based on search query and active tab
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.productType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === "beverage") {
      filtered = filtered.filter(
        (product) => product.productType === "BEVERAGE"
      );
    } else if (activeTab === "food") {
      filtered = filtered.filter((product) => product.productType === "FOOD");
    }

    return filtered;
  }, [products, searchQuery, activeTab]);

  // Filter discounts based on search
  const filteredDiscounts = useMemo(() => {
    if (!enhancedDiscounts) return [];

    if (!searchQuery) return enhancedDiscounts;

    return enhancedDiscounts.filter(
      (discount) =>
        discount.discountName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        discount.productName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enhancedDiscounts, searchQuery]);

  // Counts for tabs
  const allProductsCount = useMemo(() => {
    if (!products) return 0;
    return products.filter(
      (product) =>
        !searchQuery ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.productType?.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
  }, [products, searchQuery]);

  const beverageProductsCount = useMemo(() => {
    if (!products) return 0;
    return products.filter(
      (product) =>
        product.productType === "BEVERAGE" &&
        (!searchQuery ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()))
    ).length;
  }, [products, searchQuery]);

  const foodProductsCount = useMemo(() => {
    if (!products) return 0;
    return products.filter(
      (product) =>
        product.productType === "FOOD" &&
        (!searchQuery ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()))
    ).length;
  }, [products, searchQuery]);

  // Handle form changes
  const handleFormChange = (field: keyof DiscountFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      discountName: "",
      rate: 0,
      productId: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  };

  const handleCreateDiscount = () => {
    if (!formData.discountName || !formData.productId || formData.rate <= 0) {
     toast({
       title: "Missing fields",
       description: "Please fill in all required fields",
       variant: "destructive",
       duration: 5000,
     })
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "Invalid dates",
        description: "Start date must be before end date",
        variant: "destructive",
        duration: 5000,
      })
      return;
    }

    createDiscountMutation(formData);
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setDiscountToDelete(discount);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDiscount = () => {
    if (discountToDelete) {
      deleteDiscountMutation({ id: discountToDelete.id });
      setIsDeleteDialogOpen(false);
      setDiscountToDelete(null);
    }
  };

  const handleEditProduct = async (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Check discount status
  const getDiscountStatus = (discount: Discount & { isActive?: boolean }) => {
    if (!discount.isActive) return "expired";

    const daysLeft = Math.ceil(
      (new Date(discount.endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 3) return "ending-soon";
    return "active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "ending-soon":
        return "bg-yellow-500";
      case "expired":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "ending-soon":
        return "Ending Soon";
      case "expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  // Get products without discounts for the dropdown
  const productsWithoutDiscounts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => !product.discount);
  }, [products]);

  
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Products & Discounts Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all products and discounts
          </p>
        </div>
        <div className="flex gap-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Discount</DialogTitle>
                <DialogDescription>
                  Add a new discount for your products. All fields are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="discountName">Discount Name</Label>
                  <Input
                    id="discountName"
                    placeholder="Summer Sale, Black Friday, etc."
                    value={formData.discountName}
                    onChange={(e) =>
                      handleFormChange("discountName", e.target.value)
                    }
                  />
                </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rate">Discount Rate (%)</Label>
                    <div className="relative">
                      <Input
                        id="rate"
                        type="number"
                        min="1"
                        max="100"
                        placeholder="10"
                        value={formData.rate}
                        onChange={(e) =>
                          handleFormChange(
                            "rate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                      <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product">Product</Label>
                    <Select
                    onChange={(value) => {
                      handleFormChange("productId", value?.value)
                    }}
                    isSearchable
                    options={
                      productsWithoutDiscounts?.map((product) => ({
                        value: product.id.toString(),
                        label: product.name+ " - " + product.itemCd,
                      }))
                    }
                    />
                  </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="startDate"
                        type="date"
                        className="pl-10"
                        value={format(formData.startDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : new Date();
                          handleFormChange("startDate", date);
                        }}
                        min={format(new Date(), "yyyy-MM-dd")}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="endDate"
                        type="date"
                        className="pl-10"
                        value={format(formData.endDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : new Date();
                          handleFormChange("endDate", date);
                        }}
                        min={format(formData.startDate, "yyyy-MM-dd")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDiscount}
                  disabled={
                    isCreatePending || productsWithoutDiscounts.length === 0
                  }
                >
                  {isCreatePending ? "Creating..." : "Create Discount"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AddProductDialog
            onProductAdded={refetchProducts}
            selectedProduct={selectedProduct}
          />
        </div>
      </div>

      {/* Search Field */}
      <div className="mb-6 relative">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products or discounts by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products ({allProductsCount})
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Discounts ({filteredDiscounts.length})
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({allProductsCount})</TabsTrigger>
              <TabsTrigger value="beverage">
                Beverage ({beverageProductsCount})
              </TabsTrigger>
              <TabsTrigger value="food">Food ({foodProductsCount})</TabsTrigger>
            </TabsList>

            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    showAdminOptions
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </Tabs>
        </TabsContent>

        {/* Discounts Tab */}
        <TabsContent value="discounts" className="space-y-6">
          {isLoadingProducts ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredDiscounts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discount Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiscounts.map((discount) => {
                    const status = getDiscountStatus(discount);
                    return (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">
                          {discount.discountName}
                        </TableCell>
                        <TableCell>{discount.productName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <Percent className="h-3 w-3" />
                            {discount.rate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(discount.startDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(discount.endDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn("text-white", getStatusColor(status))}
                          >
                            {getStatusText(status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(discount.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDiscount(discount)}
                            disabled={isDeletePending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Discounts Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first discount to get started"}
              </p>
              {!searchQuery && productsWithoutDiscounts.length > 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Discount
                </Button>
              )}
              {!searchQuery && productsWithoutDiscounts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  All products already have discounts
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the discount "
              {discountToDelete?.discountName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeletePending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteDiscount}
              disabled={isDeletePending}
            >
              {isDeletePending ? "Deleting..." : "Delete Discount"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
