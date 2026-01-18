"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { useApi } from "@/hooks/api-hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Define the MigratedProduct interface
export interface MigratedProduct {
  id: number;
  tin: string;
  bhfId: string;
  itemCd: string;
  name: string;
  price: string;
  productType: string;
  currentStock: string;
  itemClCd: string;
  itemTyCd: string;
  taxTyCd: "A" | "B" | "C" | "";
  isMigrated: boolean;
  hasLastChanged: boolean;
  migratedAt?: string;
  lastChangedAt?: string;
  createdAt: string;
}

// Import the columns
import { MigratedProductColumns } from "@/components/products/migrated-product-columns";
import { ConfirmTaxChangeDialog } from "@/components/products/confirm-tax-change-dialog";

export default function MigratedProductPage() {
  const { useApiQuery, useApiPut } = useApi();
  const [products, setProducts] = useState<MigratedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<MigratedProduct | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTaxChange, setPendingTaxChange] = useState<{
    productId: number;
    newTaxTyCd: "A" | "B" | "C";
  } | null>(null);

  // Fetch migrated products
  const {
    data: migratedProductsData,
    isRefetching,
    isLoading,
    refetch,
  } = useApiQuery<MigratedProduct[]>(
    ["migrated-products"],
    `/bar/products/migrated`,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    }
  );

  // Mutation for updating tax type
  const { mutateAsync: updateTaxType, isPending: isUpdating } = useApiPut(
    ["update-tax-type"],
    `/bar/products/migrated/tax-type`
  );

  useEffect(() => {
    if (migratedProductsData) {
      setProducts(migratedProductsData);
    }
  }, [migratedProductsData]);

  const handleTaxTypeChange = (
    productId: number,
    newTaxTyCd: "A" | "B" | "C"
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setSelectedProduct(product);
    setPendingTaxChange({ productId, newTaxTyCd });
    setShowConfirmDialog(true);
  };

  const handleConfirmTaxChange = async() => {
    if (pendingTaxChange) {
      try {
      await updateTaxType(pendingTaxChange);
        setShowConfirmDialog(false);
        setPendingTaxChange(null);
        refetch();
      } catch (error) {
        console.error("Error updating tax type:", error);
      }
    }
  };

  // Calculate statistics
  const migratedCount = products.filter((p) => p.isMigrated).length;
  const changedCount = products.filter((p) => p.hasLastChanged).length;
  const pendingCount = products.filter(
    (p) => !p.isMigrated && !p.taxTyCd
  ).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tax Migration Console
            </h1>
            <p className="text-muted-foreground">
              Manage tax type transitions for migrated products
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Last Sync: {new Date().toLocaleTimeString()}
            </span>
          </div> */}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Migrated Items
                  </p>
                  <h3 className="text-2xl font-bold text-blue-900">
                    {migratedCount}
                  </h3>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Recently Updated
                  </p>
                  <h3 className="text-2xl font-bold text-amber-900">
                    {changedCount}
                  </h3>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Pending Assignment
                  </p>
                  <h3 className="text-2xl font-bold text-green-900">
                    {pendingCount}
                  </h3>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <AlertCircle className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-700">
            Products migrated from non-VAT to VAT system. Select tax categories
            (A, B, or C) for migrated items. Items marked as recently changed
            cannot be modified.
          </AlertDescription>
        </Alert>
      </div>

      <Card className="border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Tax Category Assignment
              </CardTitle>
              <CardDescription>
                Assign tax categories to migrated products
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              Total Records:{" "}
              <span className="font-bold">{products.length}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            columns={MigratedProductColumns({
              onTaxTypeChange: handleTaxTypeChange,
              isUpdating,
            })}
            data={products ?? []}
            searchKey="itemCd"
            searchPlaceholder="Search product code or name..."
            dateFilterPlaceholder="Filter by migration date"
            isRefetching={isRefetching}
            isLoading={isLoading}
            showDateFilter={false}
            // additionalFilters={[
            //   {
            //     key: "taxTyCd",
            //     // label: "Tax Type",
            //     options: [
            //       { label: "All", value: "" },
            //       { label: "Type A", value: "A" },
            //       { label: "Type B", value: "B" },
            //       { label: "Type C", value: "C" },
            //       { label: "Unassigned", value: "unassigned" }
            //     ]
            //   },
            //   {
            //     key: "status",
            //     label: "Status",
            //     options: [
            //       { label: "All", value: "" },
            //       { label: "Migrated", value: "migrated" },
            //       { label: "Pending", value: "pending" },
            //       { label: "Locked", value: "locked" }
            //     ]
            //   }
            // ]}
          />
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmTaxChangeDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingTaxChange(null);
        }}
        onConfirm={handleConfirmTaxChange}
        product={selectedProduct}
        newTaxType={pendingTaxChange?.newTaxTyCd}
        isUpdating={isUpdating}
      />
    </div>
  );
}
