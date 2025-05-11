"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormBlock, useAppForm } from "@/components/common-form";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useState } from "react";
import { z } from "@/lib/zod";

const createOrgSchema = z.object({
  name: z.string().min(1).max(100),
  subdomain: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, {
      message:
        "Поддомен должен содержать только латинские буквы, цифры и дефисы",
    }),
});

export default function CreateOrgDialog({
  withTrigger = true,
  isOpen,
  onOpenChange,
}: {
  withTrigger?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const dialogOpen = isOpen ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;

  const globalQueryClient = useQueryClient();
  const queryClient = useApiQueryClient();
  const mutate = queryClient.useMutation("post", "/orgs");

  const form = useAppForm({
    defaultValues: {
      name: "",
      subdomain: "",
    },
    validators: {
      onChange: createOrgSchema,
    },
    onSubmit: (data) => {
      mutate.mutate(
        {
          body: {
            name: data.value.name,
            subdomain: data.value.subdomain,
          },
        },
        {
          onSuccess: () => {
            toast.success("Организация успешно создана");
            globalQueryClient.invalidateQueries({ queryKey: ["get", "/orgs"] });
            setDialogOpen(false);
          },
          onError: (error) => {
            if (error.error.message == "subdomain already exists") {
              toast.warning("Организация с таким поддоменом уже существует");
            } else {
              toast.error("Ошибка при создании организации", {
                description: error.error.message,
              });
            }
          },
        }
      );
    },
  });
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {withTrigger && (
        <DialogTrigger asChild>
          <Button>Создать организацию</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создание организации</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Создайте новую организацию, чтобы начать использовать StoreIt.
        </DialogDescription>
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
                  label="Название организации"
                  placeholder="StoreIt"
                />
              )}
            />
            <form.AppField
              name="subdomain"
              children={(field) => (
                <field.TextField label="Поддомен" placeholder="storeit" />
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
