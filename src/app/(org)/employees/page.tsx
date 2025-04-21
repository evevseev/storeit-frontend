"use client";

import { DataTable } from "@/components/data-table";
import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import z from "zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "@/components/common-form";
import { FormInputDropdown } from "@/components/common-form/text-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { columns } from "./columns";

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
          <Plus className="mr-2 h-4 w-4" />
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
