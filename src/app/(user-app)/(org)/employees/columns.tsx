"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Employee } from "./page";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const columnHelper = createColumnHelper<Employee>();

export const columns = [
  columnHelper.accessor("email", {
    header: "Email",
    size: 250,
  }),
  columnHelper.accessor("firstName", {
    header: "Имя",
    size: 200,
  }),
  columnHelper.accessor("lastName", {
    header: "Фамилия",
    size: 200,
  }),
  columnHelper.accessor("middleName", {
    header: "Отчество",
    size: 200,
  }),
  columnHelper.accessor("role.displayName", {
    header: "Роль",
    size: 100,
    cell: ({ row }) => {
      const employee = row.original;
      const client = useApiQueryClient();
      const queryClient = useQueryClient();
      const { data: roles } = client.useQuery("get", "/app/roles");
      const { mutate: patchEmployee } = client.useMutation(
        "patch",
        "/employees/{id}"
      );
      const { user } = useAuth();

      const isCurrentUser = user?.id === employee.userId;

      if (isCurrentUser) {
        return (
          <div className="text-muted-foreground">
            {employee.role.displayName}
          </div>
        );
      }

      return (
        <Select
          value={String(employee.role.id)}
          onValueChange={(value) => {
            patchEmployee(
              {
                params: { path: { id: employee.userId } },
                body: { userId: employee.userId, roleId: Number(value) },
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["get", "/employees"],
                  });
                  toast.success("Роль успешно изменена");
                },
                onError: (error) => {
                  toast.error("Не удалось изменить роль", {
                    description: error.error.message,
                  });
                },
              }
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(roles?.data ?? []).map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    meta: {
      isDisplay: true,
    },
    cell: ({ row }) => {
      const employee = row.original;
      const client = useApiQueryClient();
      const queryClient = useQueryClient();
      const { mutate: removeEmployee } = client.useMutation(
        "delete",
        "/employees/{id}"
      );
      const { user } = useAuth();

      const isCurrentUser = user?.id === employee.userId;

      if (isCurrentUser) {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                removeEmployee(
                  { params: { path: { id: employee.userId } } },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["get", "/employees"],
                      });
                      toast.success("Сотрудник успешно удален");
                    },
                    onError: (error) => {
                      toast.error("Не удалось удалить сотрудника", {
                        description: error.error.message,
                      });
                    },
                  }
                );
              }}
              className="text-red-600"
            >
              <Ban />
              Исключить из организации
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
