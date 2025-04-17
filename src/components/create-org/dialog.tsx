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
import { useApiQueryClient } from "@/hooks/client";

export default function CreateOrgDialog() {
  const queryClient = useApiQueryClient();
  
  const form = useAppForm({
    defaultValues: {
      name: "",
      subdomain: "",
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
