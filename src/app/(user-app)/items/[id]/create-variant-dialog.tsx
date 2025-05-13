import { FormBlock, FormBlockRow, useAppForm } from "@/components/common-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { components } from "@/lib/api/storeit";

import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { itemVariantSchema } from "@/lib/zod/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Ean13Generator from "../ean-13-generator";
export default function CreateVariantDialog({ itemId }: { itemId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const client = useApiQueryClient();
  const globalClient = useQueryClient();

  const { mutate: createVariant } = client.useMutation(
    "post",
    "/items/{id}/variants"
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      article: null,
      ean13: null,
    } as {
      name: string;
      article: string | null;
      ean13: number | null;
    },
    validators: {
      onChange: itemVariantSchema,
    },
    onSubmit: (data) => {
      createVariant(
        {
          params: {
            path: {
              id: itemId,
            },
          },
          body: data.value,
        },
        {
          onSuccess: () => {
            toast.success("Вариант успешно создан");
            globalClient.invalidateQueries({
              queryKey: [
                "get",
                "/items/{id}",
                {
                  params: {
                    path: { id: itemId },
                  },
                },
              ],
            });
            setIsOpen(false);
          },
          onError: (err) => {
            toast.error("Ошибка при создании варианта", {
              description: err.error.message,
            });
          },
        }
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Создать вариант
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать вариант</DialogTitle>
        </DialogHeader>
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
                <field.TextField label="Название" placeholder="Черный" />
              )}
            />
            <form.AppField
              name="article"
              children={(field) => (
                <field.TextField label="Артикул" placeholder="1234567890" />
              )}
            />
            <form.AppField
              name="ean13"
              children={(field) => (
                <field.TextField
                  label="EAN13"
                  placeholder="1234567890"
                  type="number"
                  actionButton={
                    <Ean13Generator
                      onChange={(ean13) => {
                        field.setValue(ean13);
                      }}
                    />
                  }
                />
              )}
            />
            <form.AppForm>
              <form.SubmitButton label="Создать" />
            </form.AppForm>
          </FormBlock>
        </form>
      </DialogContent>
    </Dialog>
  );
}
