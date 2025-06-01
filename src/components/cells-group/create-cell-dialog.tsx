"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormBlock, FormBlockRow, useAppForm } from "../common-form";
import { z } from "@/lib/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  alias: z.string().min(1),
  row: z.number().min(1),
  level: z.number().min(1),
  position: z.number().min(1),
});

export default function CreateCellDialog({
  cellsGroupId,
}: {
  cellsGroupId: string;
}) {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate } = client.useMutation(
    "post",
    "/cells-groups/{groupId}/cells",
    {
      onSuccess: () => {
        globalClient.invalidateQueries({
          queryKey: ["get", "/cells-groups/{groupId}/cells"],
        });
        globalClient.invalidateQueries({
          queryKey: ["get", "/cells-groups/{groupId}"],
        });
        toast.success("Ячейка создана");
        setOpen(false);
      },
      onError: (error) => {
        if (error.error.message == "duplication error") {
          toast.warning("Ошибка при создании ячейки", {
            description: "Ячейка с таким обозначением уже существует",
          });
        } else {
          toast.error("Ошибка при создании ячейки", {
            description: error.error.message,
          });
        }
      },
    }
  );

  const form = useAppForm({
    defaultValues: {
      alias: "",
      row: 0,
      level: 0,
      position: 0,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: (data) => {
      mutate({
        params: {
          path: {
            groupId: cellsGroupId,
          },
        },
        body: data.value,
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Создать ячейку
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создание ячейки</DialogTitle>
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
              name="alias"
              children={(field) => (
                <field.TextField
                  label="Обозначение"
                  placeholder="Обозначение"
                />
              )}
            />
            <FormBlockRow>
              <form.AppField
                name="row"
                children={(field) => (
                  <field.TextField
                    label="№ ряда"
                    placeholder="№ ряда"
                    type="number"
                  />
                )}
              />
              <form.AppField
                name="level"
                children={(field) => (
                  <field.TextField
                    label="№ уровня"
                    placeholder="№ уровня"
                    type="number"
                  />
                )}
              />
              <form.AppField
                name="position"
                children={(field) => (
                  <field.TextField
                    label="№ позиции"
                    placeholder="№ позиции"
                    type="number"
                  />
                )}
              />
            </FormBlockRow>
            <form.AppForm>
              <form.SubmitButton label="Создать" />
            </form.AppForm>
          </FormBlock>
        </form>
      </DialogContent>
    </Dialog>
  );
}
