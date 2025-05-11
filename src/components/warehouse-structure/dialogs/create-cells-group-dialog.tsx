import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAppForm,
  FormBlock,
  FormBlockTitle,
} from "@/components/common-form";
import React from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PathBreadcrumb } from "./path-breadcrumb";
import { Button } from "@/components/ui/button";

const createGroupSchema = z.object({
  name: z.string().min(1, "Обязательное поле"),
  alias: z.string().min(1, "Обязательное поле"),
  rows: z.number().int().min(0),
  levels: z.number().int().min(0),
  positions: z.number().int().min(0),
});

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentPath: { id: string; name: string }[];
  parentId?: string | null;
  unitId: string;
}

export function CreateCellsGroupDialog({
  open,
  onOpenChange,
  parentPath,
  parentId,
  unitId,
}: CreateGroupDialogProps) {
  const queryClient = useApiQueryClient();
  const createGroupMutation = queryClient.useMutation("post", "/cells-groups");
  const createCellMutation = queryClient.useMutation(
    "post",
    "/cells-groups/{groupId}/cells"
  );
  const globalClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      alias: "",
      rows: 0,
      levels: 0,
      positions: 0,
    },
    validators: {
      onChange: createGroupSchema,
    },
    onSubmit: async (values) => {
      try {
        // Create the group first
        const groupResult = await createGroupMutation.mutateAsync({
          body: {
            name: values.value.name,
            alias: values.value.alias,
            storageGroupId: parentId,
            unitId: unitId,
          },
        });

        const groupId = groupResult.data.id;

        // If no cells need to be generated, we're done
        if (
          !values.value.rows ||
          !values.value.levels ||
          !values.value.positions
        ) {
          toast.success("Группа успешно создана");
          globalClient.invalidateQueries({
            queryKey: ["get", "/storage-groups"],
          });
          onOpenChange(false);
          return;
        }

        // Generate cells in batches
        const cellPromises = [];
        for (let row = 1; row <= values.value.rows; row++) {
          for (let level = 1; level <= values.value.levels; level++) {
            for (
              let position = 1;
              position <= values.value.positions;
              position++
            ) {
              cellPromises.push(
                createCellMutation.mutateAsync({
                  params: {
                    path: { groupId },
                  },
                  body: {
                    alias: `${values.value.alias}-${row}-${level}-${position}`,
                    row,
                    level,
                    position,
                  },
                })
              );
            }
          }
        }

        // Create cells in parallel with error handling
        await Promise.all(cellPromises)
          .then(() => {
            toast.success("Группа с ячейками успешно создана");
            globalClient.invalidateQueries({
              queryKey: ["get", "/storage-groups"],
            });
            onOpenChange(false);
          })
          .catch((error) => {
            toast.error("Ошибка при создании ячеек", {
              description: error.message,
            });
            // Still close the dialog but show warning
            toast.warning("Группа создана, но не все ячейки удалось создать");
            onOpenChange(false);
          });
      } catch (error: any) {
        toast.error("Ошибка при создании группы", {
          description: error.message,
        });
        onOpenChange(false);
      }
    },
  });

  const handleCreateWithoutCells = (e: React.MouseEvent) => {
    e.preventDefault();
    form.AppField({
      name: "rows",
      children: (field) => {
        field.handleChange(0);
        return null;
      },
    });
    form.AppField({
      name: "levels",
      children: (field) => {
        field.handleChange(0);
        return null;
      },
    });
    form.AppField({
      name: "positions",
      children: (field) => {
        field.handleChange(0);
        return null;
      },
    });
    form.handleSubmit();
  };

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
            <Button variant="secondary" onClick={handleCreateWithoutCells}>
              Создать группу без Ячеек
            </Button>
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
            <Button type="submit">Создать группу с Ячейками</Button>
          </FormBlock>
        </form>
      </DialogContent>
    </Dialog>
  );
}
