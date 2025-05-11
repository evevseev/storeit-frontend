import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { FormBlock, useAppForm } from "@/components/common-form";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { z } from "@/lib/zod";
import { aliasRegex } from "./types";

const createUnitFormSchema = z.object({
  name: z.string().min(1).max(100),
  alias: aliasRegex,
  address: z.nullable(z.string().min(1).max(100)),
});

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
            globalQueryClient.invalidateQueries({
              queryKey: ["get", "/units"],
            });
            setOpen(false);
            toast.success("Подразделение успешно создано");
          },
          onError: (error) => {
            toast.error("Ошибка при создании подразделения", {
              description: error.error.message,
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
        <DialogTitle>Создание подразделения</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FormBlock>
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
                  type="nullabletext"
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
          </FormBlock>
        </form>
      </DialogContent>
    </Dialog>
  );
}
