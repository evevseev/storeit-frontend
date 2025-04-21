"use client";

import { DataTable } from "@/components/data-table";
import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Ban, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "@/components/common-form";
import { FormInputDropdown } from "@/components/common-form/text-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Employee = {
  userId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string;
  role: {
    id: number;
    displayName: string;
  };
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "email",
    header: "Email",
    size: 250,
  },
  {
    accessorKey: "firstName",
    header: "Имя",
    size: 200,
  },
  {
    accessorKey: "lastName",
    header: "Фамилия",
    size: 200,
  },
  {
    accessorKey: "middleName",
    header: "Отчество",
    size: 200,
  },
  {
    accessorKey: "role.displayName",
    header: "Роль",
    size: 100,
    cell: ({ row }) => {
      const employee = row.original;
      const client = useApiQueryClient();
      const queryClient = useQueryClient();
      const { data: roles } = client.useQuery("get", "/app/roles");
      const { mutate: patchEmployee } = client.useMutation("patch", "/employees/{id}");

      return (
        <Select
          value={String(employee.role.id)}
          onValueChange={(value) => {
            patchEmployee(
              {
                params: { path: { id: employee.userId } },
                body: { userId: employee.userId, roleId: Number(value) }
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
                    description: error.message,
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
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      const client = useApiQueryClient();
      const queryClient = useQueryClient();
      const { mutate: removeEmployee } = client.useMutation(
        "delete",
        "/employees/{id}"
      );
      const { mutate: patchEmployee } = client.useMutation(
        "patch",
        "/employees/{id}"
      );

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
                        description: error.message,
                      });
                    },
                  }
                );
              }}
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              <span>Исключить из организации</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: {
      isDisplay: true,
    },
  },
];

export default function EmployeesPage() {
  const client = useApiQueryClient();
  const { data, isPending, isError } = client.useQuery("get", "/employees");
  return (
    <div className="container mx-auto">
      <PageMetadata
        title="Сотрудники"
        breadcrumbs={[
          { label: "Организация", href: "/organization" },
          { label: "Сотрудники" },
        ]}
        actions={[<AddEmployeeDialog />]}
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isPending}
        isError={isError}
      />
    </div>
  );
}

function AddEmployeeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { mutate } = client.useMutation("post", "/employees/invite");
  const { data: roles } = client.useQuery("get", "/app/roles");
  const { mutate: removeEmployee } = client.useMutation(
    "delete",
    "/employees/{id}"
  );
  const form = useAppForm({
    defaultValues: {
      email: "",
      roleId: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email(),
        roleId: z.string(),
      }),
    },
    onSubmit: (data) => {
      mutate(
        {
          body: {
            email: data.value.email,
            roleId: Number(data.value.roleId),
          },
        },
        {
          onSuccess: () => {
            globalClient.invalidateQueries({
              queryKey: ["get", "/employees"],
            });
            toast.success("Сотрудник успешно добавлен");
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error("Не удалось добавить сотрудника", {
              description: error.message,
            });
          },
        }
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Добавить сотрудника
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Добавление сотрудника</DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Почта сотрудника"
                  placeholder="example@example.com"
                />
              )}
            />

            <form.AppField
              name="roleId"
              children={(field) => (
                <FormInputDropdown
                  label="Роль сотрудника"
                  placeholder="Выберите роль"
                  options={(roles?.data ?? []).map((role) => ({
                    value: String(role.id),
                    label: role.displayName,
                  }))}
                />
              )}
            />

            <DialogFooter>
              <form.AppForm>
                <form.SubmitButton label="Создать" />
              </form.AppForm>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
