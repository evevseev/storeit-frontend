"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useAppForm } from "../form";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateOrgDialog() {
  const globalQueryClient = useQueryClient();
  const queryClient = useApiQueryClient();
  const mutate = queryClient.useMutation("post", "/orgs");

  const form = useAppForm({
    defaultValues: {
      name: "",
      subdomain: "",
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
            globalQueryClient.invalidateQueries({ queryKey: ["get", "/orgs"] });
          },
        }
      );
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Создать организацию</Button>
      </DialogTrigger>
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
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField placeholder="Название организации" />
            )}
          />
          <form.AppField
            name="subdomain"
            children={(field) => <field.TextField placeholder="Поддомен" />}
          />
          <form.AppForm>
            <form.SubmitButton label="Создать" />
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
}
