"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Ban, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export type Employee = {
  id: string
  fullName: string
  email: string
  status: "Administrator" | "Invited" | "Blocked"
  joiningDate: string
}

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "fullName",
    header: "Имя",
    size: 200,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 250,
  },
  {
    accessorKey: "status",
    header: "Статус",
    size: 150,
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge
          variant={
            status === "Administrator"
              ? "default"
              : status === "Invited"
              ? "secondary"
              : "destructive"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "joiningDate",
    header: "Дата присоединения",
    size: 150,
    cell: ({ row }) => {
      const date = new Date(row.getValue("joiningDate"))
      return date.toLocaleDateString('ru-RU', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => {
      const employee = row.original

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Ban className="mr-2 h-4 w-4" />
                <span className="text-black">Block</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
] 