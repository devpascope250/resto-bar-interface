"use client"

import { useState, useMemo } from "react"
import { dummyStockTransactions, dummyProducts } from "@/lib/dummy-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { inventoryColumns } from "@/components/data-table/inventory-columns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InventoryReportPage() {
  const [filterCategory, setFilterCategory] = useState<"all" | "bar" | "supermarket">("all")

  const currentDate = new Date()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().split("T")[0])

  const inventoryData = useMemo(() => {
    const filteredTransactions = dummyStockTransactions.filter((t) => {
      const transactionDate = new Date(t.createdAt)
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Include the entire end date
      return transactionDate >= start && transactionDate <= end
    })

    return dummyProducts.map((product) => {
      const stockInTransactions = filteredTransactions.filter((t) => t.productId === product.id && t.type === "in")
      const stockOutTransactions = filteredTransactions.filter((t) => t.productId === product.id && t.type === "out")

      const totalStockIn = stockInTransactions.reduce((sum, t) => sum + t.quantity, 0)
      const totalStockOut = stockOutTransactions.reduce((sum, t) => sum + t.quantity, 0)

      const lastStockIn =
        stockInTransactions.length > 0 ? stockInTransactions[stockInTransactions.length - 1].createdAt : null
      const lastStockOut =
        stockOutTransactions.length > 0 ? stockOutTransactions[stockOutTransactions.length - 1].createdAt : null

      let status: "in-stock" | "low-stock" | "out-of-stock"
      if (product.stock === 0) {
        status = "out-of-stock"
      } else if (product.stock < 20) {
        status = "low-stock"
      } else {
        status = "in-stock"
      }

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        businessType: product.businessType,
        price: product.price,
        currentStock: product.stock,
        totalStockIn,
        totalStockOut,
        lastStockIn,
        lastStockOut,
        status,
      }
    })
  }, [startDate, endDate])

  const filteredData = useMemo(() => {
    if (filterCategory === "all") return inventoryData
    return inventoryData.filter(
      (item) => item.businessType === (filterCategory === "bar" ? "bar-restaurant" : "supermarket"),
    )
  }, [inventoryData, filterCategory])

  const inventoryStats = useMemo(() => {
    const filteredTransactions = dummyStockTransactions.filter((t) => {
      const transactionDate = new Date(t.createdAt)
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      return transactionDate >= start && transactionDate <= end
    })

    const totalStockIn = filteredTransactions.filter((t) => t.type === "in").reduce((sum, t) => sum + t.quantity, 0)
    const totalStockOut = filteredTransactions.filter((t) => t.type === "out").reduce((sum, t) => sum + t.quantity, 0)
    const lowStockProducts = dummyProducts.filter((p) => p.stock < 20 && p.stock > 0)
    const outOfStockProducts = dummyProducts.filter((p) => p.stock === 0)

    return {
      totalStockIn,
      totalStockOut,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
    }
  }, [startDate, endDate])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Inventory Report</h1>
        <p className="text-muted-foreground">Comprehensive inventory management and stock tracking</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Date Range</CardTitle>
          <CardDescription>
            View inventory transactions within a specific period (defaults to current month)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock In</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inventoryStats.totalStockIn}</div>
            <p className="text-xs text-muted-foreground">Units added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryStats.totalStockOut}</div>
            <p className="text-xs text-muted-foreground">Units removed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Below 20 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Needs restocking</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Complete inventory with stock levels and pricing</CardDescription>
            </div>
            <Select
              value={filterCategory}
              onValueChange={(value: "all" | "bar" | "supermarket") => setFilterCategory(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="bar">Bar/Restaurant</SelectItem>
                <SelectItem value="supermarket">Supermarket</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={inventoryColumns}
            data={filteredData}
            searchKey="name"
            searchPlaceholder="Search products..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
