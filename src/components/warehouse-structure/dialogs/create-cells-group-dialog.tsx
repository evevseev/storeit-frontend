import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAppForm,
  FormBlock,
  FormBlockRow,
  FormBlockTitle,
} from "@/components/common-form";
import React from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PathBreadcrumb } from "./path-breadcrumb";
import { Button } from "@/components/ui/button";

const createGroupSchema = z.interface({
  name: z.string().min(1, "Обязательное поле"),
  alias: z.string().min(1, "Обязательное поле"),
});

// type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  parentPath: { id: string; name: string }[];
  parentId: string;
}

export function CreateCellsGroupDialog({
  open,
  onOpenChange,
  parentPath,
  parentId,
}: CreateGroupDialogProps) {
  const queryClient = useApiQueryClient();
  const mutation = queryClient.useMutation("post", "/cells-groups");
  const globalClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      alias: "",
      rows: 0,
      levels: 0,
      positions: 0,
    },
    // validators: {
    //   onChange: createGroupSchema,
    // },
    onSubmit: async (values) => {
      // await mutation.mutate({
      //   body: {
      //     storage_group_id: parentId,
      //     name: values.value.name,
      //     alias: values.value.alias,
      //   },
      // });
      toast.success("Группа успешно создана");
      globalClient.invalidateQueries({
        queryKey: ["get", "/storage-groups"],
      });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Новая Группа Ячеек</DialogTitle>
          <PathBreadcrumb path={parentPath} />
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
              children={(field) => <field.TextField label="Название" />}
            />
            <form.AppField
              name="alias"
              children={(field) => <field.TextField label="Сокращение" />}
            />
            <Button variant="secondary">Создать группу без Ячеек</Button>
          </FormBlock>
          <FormBlockTitle title="Предгенерация Ячеек" />
          <FormBlock>
            <form.AppField
              name="rows"
              children={(field) => (
                <field.TextField label="Количество рядов" type="number" />
              )}
            />
            <form.AppField
              name="levels"
              children={(field) => (
                <field.TextField label="Количество уровней" type="number" />
              )}
            />
            <form.AppField
              name="positions"
              children={(field) => (
                <field.TextField
                  label="Количество позиций в секции"
                  type="number"
                />
              )}
            />
            <Button>Создать группу с Ячейками</Button>
          </FormBlock>
          {/* <form.AppForm>
            <form.SubmitButton label="Создать" />
          </form.AppForm> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
