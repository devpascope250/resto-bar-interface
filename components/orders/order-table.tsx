"use client"

import type { Order } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { format } from "date-fns"

interface OrderTableProps {
  orders: Order[]
  onUpdateStatus?: (orderId: string, status: Order["status"]) => void
  showActions?: boolean
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function OrderTable({ orders, onUpdateStatus, showActions = false }: OrderTableProps) {
  return (
    <div className="rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-foreground">Order ID</TableHead>
            <TableHead className="text-foreground">Distributor</TableHead>
            <TableHead className="text-foreground">Business Type</TableHead>
            <TableHead className="text-foreground">Items</TableHead>
            <TableHead className="text-foreground">Total</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Date</TableHead>
            {showActions && <TableHead className="text-foreground">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium text-foreground">{order.id}</TableCell>
              <TableCell className="text-foreground">{order.distributorName}</TableCell>
              <TableCell className="capitalize text-foreground">{order.businessType.replace("-", " ")}</TableCell>
              <TableCell className="text-foreground">{order.items.length}</TableCell>
              <TableCell className="text-foreground">${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[order.status]}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground">{format(new Date(order.createdAt), "MMM dd, yyyy")}</TableCell>
              {showActions && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdateStatus?.(order.id, "processing")}>
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus?.(order.id, "completed")}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus?.(order.id, "cancelled")}>
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
