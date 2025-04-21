import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useAppForm } from "@/components/common-form";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { createUnitFormSchema } from "./types";

export function CreateUnitDialog() {
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