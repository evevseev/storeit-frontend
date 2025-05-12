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
import { FormBlock, useAppForm, formContext } from "@/components/common-form";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "@/lib/zod";
import {
  FormInputDropdown,
  FormInputField,
} from "@/components/common-form/text-field";
import { TaskItemsField } from "@/components/common-form/task-items-field";
import { EmployeeCombobox } from "@/components/common-form/employee-combobox";

const taskItemSchema = z.object({
  instanceId: z.uuid(),
});

const createTaskSchema = z.object({
  name: z.string().min(1, "Обязательное поле"),
  description: z.nullable(z.string()),
  type: z.literal("pick"),
  unitId: z.uuid(),
  assignedTo: z.nullable(z.uuid()),
  items: z.array(taskItemSchema).min(1, "Добавьте хотя бы один элемент"),
});

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
      type: "pickment" as const,
      unitId: "",
      assignedTo: null,
      items: [],
    },
    // validators: {
    //   onChange: createTaskSchema,
    // },
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
        <formContext.Provider value={form}>
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
                children={() => (
                  <FormInputField
                    label="Название задания"
                    placeholder="Подбор товаров"
                  />
                )}
              />
              <form.AppField
                name="description"
                children={() => (
                  <FormInputField
                    label="Описание"
                    placeholder="Описание задания"
                    type="nullabletext"
                  />
                )}
              />
              <form.AppField
                name="unitId"
                children={() => (
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
                children={() => (
                  <EmployeeCombobox
                    label="Назначить сотруднику"
                    employees={employees?.data || []}
                    placeholder="Выберите сотрудника"
                  />
                )}
              />
              <TaskItemsField />
            </FormBlock>
            <DialogFooter>
              <form.AppForm>
                <form.SubmitButton label="Создать" />
              </form.AppForm>
            </DialogFooter>
          </form>
        </formContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
