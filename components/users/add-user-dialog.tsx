"use client"

import { useToast } from "@/hooks/use-toast"
import { ReusableFormDialog } from "../ReusableFormDialog"
import { Role, User } from "@prisma/client"
import { useApi } from "@/hooks/api-hooks"
import { useRouter } from "next/navigation"
interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUser?: Partial<User> | null
  onUserSaved?: () => void
}

export function AddUserDialog({ open, onOpenChange, selectedUser = null, onUserSaved }: AddUserDialogProps) {
  const { toast } = useToast()
  const { useApiPost, useApiPut } = useApi();
  const { mutateAsync: createUser } = useApiPost(['users'],'/auth/users');
  const { mutateAsync: updateUser } = useApiPut(['users'],`/auth/users/${selectedUser?.id}`);

const handleSubmit = async (data: Partial<User>) => {
  try {
    if (selectedUser && selectedUser.id) {
      // update existing user
      await updateUser(data);
      toast({ title: "User updated", description: "User updated successfully.", variant: "success" })
    } else {
      // create new
      await createUser(data)
      toast({ title: "User created", description: "The user has been created successfully.", variant: "success" })
    }
    onUserSaved?.()
  } catch (error: any) {
    toast({
      title: selectedUser ? "Error updating user" : "Error creating user",
      description: error?.message || String(error),
      variant: "destructive",
    })
  }
}

const userRoles = [
  {
    label: 'Waiter',
    value: Role.WAITER
  }, 
  {
    label: 'Chef',
    value: Role.CHEF
  },
  {
    label: 'Manager',
    value: Role.MANAGER
  },
  {
    label: "Kichen",
    value: Role.KITCHEN
  }
]

const initialValues = selectedUser
    ? {
        firstName: selectedUser.firstName ?? "",
        lastName: selectedUser.lastName ?? "",
        email: selectedUser.email ?? "",
        phone: selectedUser.phone ?? "",
        role: selectedUser.role ?? Role.WAITER,
        password: "",
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: Role.WAITER,
        password: ""
      }


  return (
    <ReusableFormDialog
      size="xxl"
      open={open}
      onOpenChange={onOpenChange}
      dialogDescription={selectedUser ? "Edit user account." : "Create a new user account for the system."}
      formTitle={selectedUser ? "Edit User" : "Create New User"}
      fields={[
        {
          label: 'First Name',
          type: 'text',
          name: 'firstName',
          placeholder: 'John',
          required: true
        },
        {
          label: 'Last Name',
          type: 'text',
          name: 'lastName',
          placeholder: 'Doe',
          required: true
        },
        {
          label: 'Email',
          type: 'email',
          name: 'email',
          placeholder: 'john@example.com',
          required: true
        },
        {
          label: 'Phone',
          type: 'text',
          name: 'phone',
          placeholder: '1234567890',
          required: true
        },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          options: userRoles,
          required: true,
          colSpan: 2
        },
        {
          label: 'Password',
          type: 'password',
          name: 'password',
          placeholder: '********',
          required: selectedUser ? false : true,
          colSpan: 2
        }
      ]}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  )
}
