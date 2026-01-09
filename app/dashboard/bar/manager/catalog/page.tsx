"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { ProductCard } from "@/components/products/product-card";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/api-hooks";
import { useSearchParams, useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth-store";
export default function CatalogPage() {
  const addItem = useCartStore((state) => state.addItem);
  const ClearCart = useCartStore((state) => state.clearCart);
  const { user } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const { useApiQuery, api } = useApi();
  const {
    data: products,
    isLoading,
    refetch,
  } = useApiQuery<Product[]>(["products"], "/bar/products", {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 👈 Data stays fresh for 5 minutes
    placeholderData: keepPreviousData,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();
  const hasCartItems = items.length > 0;
  const [hasSynced, setHasSynced] = useState(false);
  const categories = products
    ? ["all", ...new Set(user?.taxStatus === "ENABLED" ? products.filter((p) => p.taxTyCd !== "D").map((p) => p.productType) : products.filter((p) => p.taxTyCd === "D").map((p) => p.productType))]
    : ["all"];
  const router = useRouter();
  const filteredProducts = products?.filter((product) => user?.taxStatus === "ENABLED" ? product.taxTyCd !== "D" : product.taxTyCd === "D")?.filter((product) => {
    const matchesSearch =
      product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.productType === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const searchParams = useSearchParams();
  const isCatalog = searchParams.get("orders");
  const [isLaodingAsync, setIsLoadingAsync] = useState(false);
  // Check if item already exists in cart
  const itemExistsInCart = (productId: number) => {
    return items.some((item) => item.product.id === productId);
  };
  useEffect(() => {
    const isAsynchonized = localStorage.getItem("isAsynchonized");
    if (!isCatalog && hasSynced) {
      ClearCart();
      localStorage.removeItem("isAsynchonized");
    }
    if (isAsynchonized && isCatalog) {
      setHasSynced(true);
    } else if (isAsynchonized && !isCatalog) {
      localStorage.removeItem("isAsynchonized");
    } else if (isCatalog && !hasSynced) {
      const fetchOrder = async () => {
        try {
          setIsLoadingAsync(true);
          const res = await api.get(`/bar/orders/${isCatalog}`);
          const cart = (res as { orderItems: CartItem[] }).orderItems;
          // clear first cart
          ClearCart();
          // create localStorage called is asynchonized
          const cartss = res as Orders;
          if(cartss.status !== "PENDING"){
            toast({
              title: `Order already ${cartss.status === "CANCELLED" ? "cancelled" : "paid for"}`,
              description: `This order has already ${cartss.status === "CANCELLED" ? "been cancelled" : "been paid for"}`,
              variant: "destructive",
            }
            )
            ClearCart();
            localStorage.removeItem("isAsynchonized");
            return;
          }
          const syncData = {
            id: cartss.id,
            orderName: cartss.orderName,
            orderStatus: cartss.status,
          };
          localStorage.setItem("isAsynchonized", JSON.stringify(syncData));
          // Filter out items that already exist in cart
          const newItems = cart.filter(
            (cartItem) => !itemExistsInCart(cartItem.product.id)
          );

          // Add only new items
          for (const item of newItems) {
            addItem(item.id, item.product,item.status, item.quantity);
          }

          setHasSynced(true);
          console.log(`Synced ${newItems.length} new items to cart`);
        } catch (err) {
          console.log("Sync error:", err);
          toast({
            title: "Sync failed",
            description: "Could not sync order items to cart",
            variant: "destructive",
          });
        } finally {
          setIsLoadingAsync(false);
        }
      };
      fetchOrder();
    }
  }, [isCatalog, hasSynced]);

  const handleAddToCart = (product: Product) => {
    const id = Math.floor(Math.random() * 1000000);
    addItem(id, product,"PENDING", 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  useEffect(() => {
    // only enable intercept when there are items in cart
    if (items.length === 0) return;

    let lastHref = window.location.href;
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    const confirmAndClear = (targetUrl?: string): boolean => {
      const confirmed = window.confirm(
        "You have items in your cart. Leave this page and clear the cart?"
      );
      if (!confirmed) {
        router.forward();
        return false;
      }
      setTimeout(() => {
        ClearCart();
        localStorage.removeItem("isAsynchonized");
      }, 0);
      return true;
    };

    // wrap pushState
    (history as any).pushState = function (
      data: any,
      title?: string,
      url?: string | null
    ) {
      const absoluteUrl = url
        ? new URL(url, window.location.origin).href
        : undefined;
      if (absoluteUrl === undefined || confirmAndClear(absoluteUrl)) {
        // update lastHref to the url we are actually navigating to
        lastHref = absoluteUrl ?? window.location.href;
        return origPush.apply(this, [data, title ?? "", url]);
      }
      // cancelled: do nothing (prevent navigation)
      return;
    };

    // wrap replaceState
    (history as any).replaceState = function (
      data: any,
      title?: string,
      url?: string | null
    ) {
      const absoluteUrl = url
        ? new URL(url, window.location.origin).href
        : undefined;
      if (absoluteUrl === undefined || confirmAndClear(absoluteUrl)) {
        lastHref = absoluteUrl ?? window.location.href;
        return origReplace.apply(this, [data, title ?? "", url]);
      }
      return;
    };

    const onPop = (e: PopStateEvent) => {
      // popstate occurs after the URL changes; prompt and revert if cancelled
      const proceed = confirmAndClear(document.location.href);
      if (!proceed) {
        // revert to previous location
        try {
          history.pushState(null, "", lastHref);
        } catch {
          // fallback: reload previous href
          window.location.href = lastHref;
        }
      } else {
        lastHref = document.location.href;
      }
    };

    window.addEventListener("popstate", onPop);

    return () => {
      // restore originals
      (history as any).pushState = origPush;
      (history as any).replaceState = origReplace;
      window.removeEventListener("popstate", onPop);
    };
  }, [items.length, ClearCart]);

  return (
    <div className="flex h-full">
      <div
        className={cn(
          "transition-all duration-300",
          hasCartItems ? "w-3/5 border-r" : "w-full"
        )}
      >
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Product Catalog
            </h1>
            <p className="text-muted-foreground">Browse and order products</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading || isLaodingAsync ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div
              className={cn(
                "grid gap-6",
                hasCartItems
                  ? "sm:grid-cols-2 md:grid-cols-3"
                  : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
              )}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showAddToCart
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>

      {hasCartItems && (
        <div className="fixed w-2/5 top-0 right-0 h-screen bg-muted/30">
          <div className="h-full flex flex-col">
            <CartSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
