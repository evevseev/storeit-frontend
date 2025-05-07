"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { FormBlock, useAppForm } from "@/components/common-form";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "@/lib/zod";
import { FormInputDropdown } from "@/components/common-form/text-field";

const taskItemSchema = z.object({
  instanceId: z.string().uuid(),
  targetCellId: z.string().uuid().optional(),
});

const createTaskSchema = z.object({
  name: z.string().min(1, "Обязательное поле"),
  description: z.string().nullable(),
  type: z.enum(["pick", "movement"]),
  unitId: z.string().uuid(),
  assignedTo: z.string().uuid().nullable(),
  items: z.array(taskItemSchema).min(1, "Добавьте хотя бы один элемент"),
});

type TaskFormData = z.infer<typeof createTaskSchema>;

interface InstanceListProps {
  form: ReturnType<typeof useAppForm>;
  type: "pick" | "movement";
}

function InstanceList({ form, type }: InstanceListProps) {
  const [newInstanceId, setNewInstanceId] = useState("");
  const [newTargetCellId, setNewTargetCellId] = useState("");

  const handleAddInstance = () => {
    const currentItems = form.state?.value?.items || [];
    form.handleChange("items")([
      ...currentItems,
      {
        instanceId: newInstanceId,
        ...(type === "movement" ? { targetCellId: newTargetCellId } : {}),
      },
    ]);
    setNewInstanceId("");
    setNewTargetCellId("");
  };

  const handleRemoveInstance = (index: number) => {
    const currentItems = form.state?.value?.items || [];
    form.handleChange("items")(
      currentItems.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const items = form.state?.value?.items || [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <form.AppField
                name={`items.${index}.instanceId`}
                children={(field) => (
                  <field.TextField label="ID экземпляра" />
                )}
              />
            </div>
            {type === "movement" && (
              <div className="flex-1">
                <form.AppField
                  name={`items.${index}.targetCellId`}
                  children={(field) => (
                    <field.TextField label="ID целевой ячейки" />
                  )}
                />
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveInstance(index)}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-2">ID экземпляра</div>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newInstanceId}
            onChange={(e) => setNewInstanceId(e.target.value)}
            placeholder="Введите ID экземпляра"
          />
        </div>
        {type === "movement" && (
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-2">
              ID целевой ячейки
            </div>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newTargetCellId}
              onChange={(e) => setNewTargetCellId(e.target.value)}
              placeholder="Введите ID целевой ячейки"
            />
          </div>
        )}
        <Button
          type="button"
          onClick={handleAddInstance}
          disabled={!newInstanceId || (type === "movement" && !newTargetCellId)}
        >
          Добавить
        </Button>
      </div>
    </div>
  );
}

export function CreateTaskDialog() {
  const globalQueryClient = useQueryClient();
  const client = useApiQueryClient();
  const mutation = client.useMutation("post", "/tasks");
  const [open, setOpen] = useState(false);

  const { data: units } = client.useQuery("get", "/units");
  const { data: employees } = client.useQuery("get", "/employees");

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      type: "pick" as const,
      unitId: "",
      assignedTo: null,
      items: [],
    },
    validators: {
      onChange: createTaskSchema,
    },
    onSubmit: (data) => {
      mutation.mutate(
        {
          body: data.value,
        },
        {
          onSuccess: () => {
            globalQueryClient.invalidateQueries({
              queryKey: ["get", "/tasks"],
            });
            setOpen(false);
            toast.success("Задание успешно создано");
          },
          onError: (error) => {
            toast.error("Ошибка при создании задания", {
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
          <Plus className="mr-2 h-4 w-4" />
          Создать задание
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Создание задания</DialogTitle>
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
                <field.TextField
                  label="Название задания"
                  placeholder="Подбор товаров"
                />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField
                  label="Описание"
                  placeholder="Описание задания"
                  type="nullabletext"
                />
              )}
            />
            <form.AppField
              name="type"
              children={(field) => (
                <FormInputDropdown
                  label="Тип задания"
                  options={[
                    { value: "pick", label: "Подбор" },
                    { value: "movement", label: "Перемещение" },
                  ]}
                  placeholder="Выберите тип задания"
                />
              )}
            />
            <form.AppField
              name="unitId"
              children={(field) => (
                <FormInputDropdown
                  label="Подразделение"
                  options={(units?.data || []).map((unit) => ({
                    value: unit.id,
                    label: unit.name,
                  }))}
                  placeholder="Выберите подразделение"
                />
              )}
            />
            <form.AppField
              name="assignedTo"
              children={(field) => (
                <FormInputDropdown
                  label="Назначить сотруднику"
                  options={(employees?.data || []).map((employee) => ({
                    value: employee.userId,
                    label: `${employee.firstName} ${employee.lastName}`,
                  }))}
                  placeholder="Выберите сотрудника"
                />
              )}
            />
            <form.Subscribe
              selector={(state) => state?.value?.type || "pick"}
              children={(type) => (
                <InstanceList form={form} type={type as "pick" | "movement"} />
              )}
            />
          </FormBlock>
          <DialogFooter>
            <form.AppForm>
              <form.SubmitButton label="Создать" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 