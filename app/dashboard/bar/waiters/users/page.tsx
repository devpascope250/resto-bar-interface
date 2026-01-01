"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { AddUserDialog } from "@/components/users/add-user-dialog"
import { useApi } from "@/hooks/api-hooks"
import { User } from "@prisma/client"
import { getUserColumns } from "@/components/data-table/user-columns"
import { toast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { useApiQuery, api } = useApi();
const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null)
 const handleOpen = (open: boolean) => {
 setIsAddDialogOpen(open)
   if (!open) setSelectedUser(null)
  }
  const { data: usersss, refetch } = useApiQuery<Partial<User[]>>(['users'], '/auth/users');
  const columns = getUserColumns((user) => {
    setSelectedUser(user ?? null)
    setIsAddDialogOpen(true)
  }, async(user) => {
    await api.delete(`/auth/users/${user?.id}`)
    .then(() => {
      refetch();
      toast({
        title: "User deleted successfully",
        description: "The user has been deleted successfully",
        variant: "success",
      })
    })
    .catch((err) => {console.error(err);
      toast({
        title: "Error deleting user",
        description: "There was an error deleting the user",
        variant: "error",
      })
    })
  })

  const users = usersss?.filter((u) => u?.role !== "MANAGER");
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage system users and distributors</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{users?.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Waiters</CardDescription>
            <CardTitle className="text-3xl">{users?.filter((u) => u?.role === "WAITER").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Chef</CardDescription>
            <CardTitle className="text-3xl">{users?.filter((u) => u?.role === "CHEF").length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={users ?? []} searchKey="firstName" searchPlaceholder="Search users..." />
        </CardContent>
      </Card>

      {isAddDialogOpen && (
        <AddUserDialog
          open={isAddDialogOpen}
          onOpenChange={handleOpen}
          selectedUser={selectedUser}
          onUserSaved={() => {
            handleOpen(false)
            refetch()
          }}
        />
      )}
    </div>
  )
}
