// "use client"
// import { ProductCard } from "@/components/products/product-card"
// import { AddProductDialog } from "@/components/products/add-product-dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useApi } from "@/hooks/api-hooks"
// import { useState } from "react"
// export default function ProductsPage() {
//   const { useApiQuery } = useApi();
//   const { data: products, isLoading , refetch} = useApiQuery<Product[]>(["products"], '/bar/products');

//   const barProducts = products?.filter((p) => p.businessType === "bar-restaurant")
//   const supermarketProducts = products?.filter((p) => p.businessType === "supermarket")
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
//   const handleEditProduct = async (product: Product) => {
//     setSelectedProduct(product)
//   }
//   return (
//     <div className="p-8">
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
//           <p className="text-muted-foreground">View and manage all products across business types</p>
//         </div>
//         <AddProductDialog onProductAdded={refetch} selectedProduct={selectedProduct} />
//       </div>

//       <Tabs defaultValue="all" className="w-full">
//         <TabsList className="mb-6">
//           <TabsTrigger value="all">All Products ({products?.length || 0})</TabsTrigger>
//           <TabsTrigger value="bar">Bar/Restaurant ({barProducts?.length || 0})</TabsTrigger>
//           <TabsTrigger value="supermarket">Supermarket ({supermarketProducts?.length || 0})</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all">
//           {isLoading ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//                 <div key={i} className="space-y-3">
//                   <Skeleton className="aspect-square w-full" />
//                   <Skeleton className="h-4 w-3/4" />
//                   <Skeleton className="h-4 w-1/2" />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {(products as Product[])?.map((product) => (
//                 <ProductCard key={product.id} product={product} onEdit={handleEditProduct} />
//               ))}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="bar">
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {barProducts?.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="supermarket">
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {supermarketProducts?.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }




"use client"
import { ProductCard } from "@/components/products/product-card"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useApi } from "@/hooks/api-hooks"
import { useState, useMemo } from "react"
import { Search } from "lucide-react"

export default function ProductsPage() {
  const { useApiQuery } = useApi();
  const { data: products, isLoading, refetch } = useApiQuery<Product[]>(["products"], '/bar/products');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter products based on search query and active tab
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === "beverage") {
      filtered = filtered.filter(product => product.productType === "BEVERAGE");
    } else if (activeTab === "food") {
      filtered = filtered.filter(product => product.productType === "FOOD");
    }
    // "all" tab shows all products without additional filtering

    return filtered;
  }, [products, searchQuery, activeTab]);

  // Count products for each tab (considering search)
  const allProductsCount = useMemo(() => {
    if (!products) return 0;
    return products.filter(product => 
      !searchQuery || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productType?.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
  }, [products, searchQuery]);

  const beverageProductsCount = useMemo(() => {
    if (!products) return 0;
    return products.filter(product => 
      product.productType as ProductType === "BEVERAGE" &&
      (!searchQuery || 
       product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    ).length;
  }, [products, searchQuery]);

  const foodProductsCount = useMemo(() => {
    if (!products) return 0;
    return products.filter(product => 
      product.productType as ProductType === "FOOD" &&
      (!searchQuery || 
       product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    ).length;
  }, [products, searchQuery]);

  const handleEditProduct = async (product: Product) => {
    setSelectedProduct(product)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const clearSearch = () => {
    setSearchQuery("");
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground">View and manage all products</p>
        </div>
        <AddProductDialog onProductAdded={refetch} selectedProduct={selectedProduct} />
      </div>

      {/* Search Field */}
      <div className="mb-6 relative">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products by name, description, or type..."
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All Products ({allProductsCount})
          </TabsTrigger>
          <TabsTrigger value="beverage">
            Beverage ({beverageProductsCount})
          </TabsTrigger>
          <TabsTrigger value="food">
            Food ({foodProductsCount})
          </TabsTrigger>
        </TabsList>

        {/* All Products Tab */}
        <TabsContent value="all">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchQuery ? (
                  <>
                    <p className="text-lg font-medium">No products found</p>
                    <p>Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">No products available</p>
                    <p>Add your first product to get started</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onEdit={handleEditProduct} 
                  showAdminOptions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Beverage Tab */}
        <TabsContent value="beverage">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchQuery ? (
                  <>
                    <p className="text-lg font-medium">No beverage products found</p>
                    <p>Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">No beverage products</p>
                    <p>Add beverage products to see them here</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onEdit={handleEditProduct} showAdminOptions={true} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Food Tab */}
        <TabsContent value="food">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchQuery ? (
                  <>
                    <p className="text-lg font-medium">No food products found</p>
                    <p>Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">No food products</p>
                    <p>Add food products to see them here</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onEdit={handleEditProduct} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}