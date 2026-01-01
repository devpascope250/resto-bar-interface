import { useQuery } from "@tanstack/react-query"
import { dummyProducts } from "../dummy-data"
import type { BusinessType } from "../types"

export function useProducts(businessType?: BusinessType) {
  return useQuery({
    queryKey: ["products", businessType],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (businessType) {
        return dummyProducts.filter((p) => p.businessType === businessType)
      }

      return dummyProducts
    },
  })
}
