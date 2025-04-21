"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ban, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useAppForm } from "@/components/common-form";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { DataTable } from "@/components/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const createUnitFormSchema = z.interface({
  name: z.string().min(1).max(100),
  alias: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[a-zA-Z0-9]+$/),
  address: z.string().min(1).max(255),
});

type CreateUnitFormSchema = z.infer<typeof createUnitFormSchema>;

function CreateUnitDialog() {
  const globalQueryClient = useQueryClient();
  const client = useApiQueryClient();
  const mutation = client.useMutation("post", "/units");
  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      alias: "",
      address: "",
    },
    validators: {
      onChange: createUnitFormSchema,
    },
    onSubmit: (data) => {
      mutation.mutate(
        {
          body: {
            name: data.value.name,
            alias: data.value.alias,
            address: data.value.address,
          },
        },
        {
          onSuccess: () => {
            globalQueryClient.invalidateQueries({ queryKey: ["units"] });
            setOpen(false);
            toast.success("Подразделение успешно создано");
          },
          onError: (error) => {
            toast.error("Ошибка при создании подразделения", {
              description: JSON.stringify(error),
            });
          },
        }
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Создать подразделение
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Создание подразделения</DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Название подразделения"
                  placeholder="Москва"
                />
              )}
            />
            <form.AppField
              name="address"
              children={(field) => (
                <field.TextField
                  label="Адрес подразделения"
                  placeholder="Москва, ул. Ленина, 1"
                />
              )}
            />
            <form.AppField
              name="alias"
              children={(field) => (
                <field.TextField
                  label="Аббревиатура подразделения"
                  placeholder="MSK1"
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

type Unit = {
  id: string;
  name: string;
  alias: string;
  address: string;
};

const columnHelper = createColumnHelper<Unit>();

export default function UnitsPage() {
  const client = useApiQueryClient();
  const { data, isPending, isError, refetch } = client.useQuery(
    "get",
    "/units"
  );
  const mutation = client.useMutation("delete", "/units/{id}");
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    if (data) {
      setUnits(
        data.data.map((unit) => ({
          id: unit.id,
          name: unit.name,
          alias: unit.alias,
          address: unit.address ?? "",
        }))
      );
    }
  }, [data]);

  const handleRowClick = (unit: Unit) => {
    redirect(`/units/${unit.id}`, RedirectType.push);
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Название",
    }),
    columnHelper.accessor("alias", {
      header: "Аббревиатура",
    }),
    columnHelper.accessor("address", {
      header: "Адрес",
    }),
    columnHelper.display({
      id: "actions",
      meta: {
        isDisplay: true,
      },
      cell: ({ row }) => {
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
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    mutation.mutate(
                      {
                        params: {
                          path: {
                            id: row.original.id,
                          },
                        },
                      },
                      {
                        onSuccess: () => {
                          toast.success("Подразделение успешно удалено");
                          refetch();
                        },
                        onError: (error) => {
                          toast.error("Ошибка при удалении подразделения", {
                            description: JSON.stringify(error),
                          });
                        },
                      }
                    );
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  return (
    <>
      <PageMetadata
        title="Подразделения"
        breadcrumbs={[{ label: "Организация" }, { label: "Подразделения" }]}
        actions={[<CreateUnitDialog />]}
      />
      <DataTable
        columns={columns}
        data={units}
        isLoading={isPending}
        isError={isError}
      />
    </>
  );
}
