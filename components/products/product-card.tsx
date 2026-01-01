// "use client";

// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ShoppingCart, Package } from "lucide-react";
// import Image from "next/image";

// interface ProductCardProps {
//   product: Product;
//   onAddToCart?: (product: Product) => void;
//   showAddToCart?: boolean;
// }

// export function ProductCard({
//   product,
//   onAddToCart,
//   showAddToCart = false,
// }: ProductCardProps) {
//   return (
//     <Card className="overflow-hidden border-border/50 transition-all hover:border-border">
//       <div className="relative aspect-square overflow-hidden bg-muted">
//         <Image
//           src={product.image || "/placeholder.svg"}
//           alt={product.name}
//           fill
//           className="object-cover"
//           crossOrigin="anonymous"
//         />
//         {product?.beverageCategory?.name && (
//           <Badge className="absolute right-2 top-2 bg-background/80 text-foreground backdrop-blur-sm">
//             {product?.beverageCategory?.name}
//           </Badge>
//         )}
//       </div>
//       <CardContent className="p-4">
//         <h3 className="mb-1 font-semibold text-foreground">{product.name}</h3>
//         <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
//           {product.description ?? product.beverageCategory?.description ?? ""}
//         </p>
//         <div className="flex items-center justify-between">
//           <span className="text-l font-bold text-foreground flex">
//             {product.price.toFixed(0)} Rwf
//           </span>
//           <div className="flex items-center gap-1 text-sm text-muted-foreground">
//             <Package className="h-4 w-4" />
//             <span>{product.currentStock} in stock</span>
//           </div>
//         </div>
//       </CardContent>
//       {showAddToCart && (
//         <CardFooter className="p-4 pt-0">
//           <Button
//             className="w-full"
//             onClick={() => onAddToCart?.(product)}
//             disabled={product.currentStock === 0}
//           >
//             <ShoppingCart className="mr-2 h-4 w-4" />
//             Add to Cart
//           </Button>
//         </CardFooter>
//       )}
//     </Card>
//   );
// }

"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Package,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Image from "next/image";
import { useApi } from "@/hooks/api-hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { LoadingSpinner } from "../ui/loading-spinner";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  // onDelete?: (product: Product) => void;
  onUpdateStock?: (product: Product, newStock: number) => void;
  showAddToCart?: boolean;
  showAdminOptions?: boolean;
}

export function ProductCard({
  product,
  onEdit,
  // onDelete,
  onUpdateStock,
  showAdminOptions = false,
  onAddToCart,
  showAddToCart = false,
}: ProductCardProps) {
  const { useApiDelete, queryClient } = useApi();
  const handleQuickStockUpdate = (increment: number) => {
    if (onUpdateStock) {
      const newStock = Math.max(0, product.currentStock + increment);
      onUpdateStock(product, newStock);
    }
  };

  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);
  const { mutateAsync: deleteProduct, isPending: isDeletePending } =
    useApiDelete(["products"], "/bar/products");
  const onDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        setLoadingButtonId(product.id.toString());
        await deleteProduct({ id: product.id.toString() });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast({
          title: "Product deleted",
          description: "The product has been deleted successfully.",
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error deleting product",
          description:
            "An error occurred while deleting the product. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoadingButtonId(null);
      }
    }
  };

  return (
    <Card className="overflow-hidden border-border/50 transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          crossOrigin="anonymous"
        />
        {product?.beverageCategory?.name && (
          <Badge className="absolute right-2 top-2 bg-background/80 text-foreground backdrop-blur-sm">
            {product?.beverageCategory?.name}
          </Badge>
        )}

        {/* Admin options dropdown - always visible */}
        {showAdminOptions && (
          <div className="absolute left-2 top-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {isDeletePending &&
                loadingButtonId === product.id.toString() ? (
                  <LoadingSpinner size="md" className="text-blue-500" />
                ) : (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onEdit?.(product)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(product)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1 font-semibold text-foreground">{product.name}</h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {product.description ?? product.beverageCategory?.description ?? ""}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.discount && product.discount !== null ? (
              <>
                <span className="text-md font-bold text-foreground flex items-center gap-2">
                  <span className="text-red-600 ">
                    {(product.price * (1 - product.discount.rate / 100)).toFixed(0)}{" "}
                    Rwf
                  </span>
                  <span className="text-sm font-normal text-muted-foreground line-through">
                    {product.price.toFixed(0)} Rwf
                  </span>
                  <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    -{product.discount.rate}%
                  </span>
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                {product.price.toFixed(0)} Rwf
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>
              {product.itemTyCd === "3"
                ? "Service"
                : product.currentStock + " in stock"}
            </span>
          </div>
        </div>

        {/* Quick stock management for admin - always visible */}
        {showAdminOptions && onUpdateStock && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Quick update:
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleQuickStockUpdate(-1)}
                  disabled={product.currentStock <= 0}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleQuickStockUpdate(1)}
                >
                  +
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newStock = prompt(
                  "Enter new stock quantity:",
                  product.currentStock.toString()
                );
                if (newStock !== null) {
                  const stock = parseInt(newStock);
                  if (!isNaN(stock) && stock >= 0) {
                    onUpdateStock(product, stock);
                  }
                }
              }}
            >
              Set Stock
            </Button>
          </div>
        )}
      </CardContent>

      {showAddToCart && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={() => onAddToCart?.(product)}
            disabled={
              product.itemTyCd === "3" ? false : product.currentStock === 0
            }
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
