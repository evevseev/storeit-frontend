"use client";
import { PageMetadata } from "@/components/header/page-metadata";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import {
  useReactTable,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { redirect } from "next/navigation";
import type { components } from "@/lib/api/storeit";
import { CreateTaskDialog } from "./create-task-dialog";
import { CopyableText } from "@/components/ui/copyable-text";

type Task = components["schemas"]["TaskBase"];

const columnHelper = createColumnHelper<Task>();
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (props) => <CopyableText>{props.getValue()}</CopyableText>,
  }),
  columnHelper.accessor("name", {
    header: "Название",
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Тип",
    cell: (props) => {
      const type = props.getValue();
      return (
        <Badge
          variant="outline"
          className={
            type === "pickment"
              ? "bg-blue-500 text-white"
              : "bg-green-500 text-white"
          }
        >
          {type === "pickment" ? "Подбор" : "Перемещение"}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Статус",
    cell: (props) => {
      const status = props.getValue();
      const statusColors = {
        pending: "bg-yellow-500",
        in_progress: "bg-blue-500",
        awaiting_to_collect: "bg-purple-500",
        completed: "bg-green-500",
        failed: "bg-red-500",
      };
      const statusLabels = {
        pending: "Ожидает",
        in_progress: "В работе",
        awaiting_to_collect: "Ожидает сбора",
        completed: "Завершено",
        failed: "Ошибка",
      };
      return (
        <Badge
          variant="outline"
          className={`${statusColors[status]} text-white`}
        >
          {statusLabels[status]}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("assignedTo", {
    header: "Сотрудник",
    cell: (props) => {
      const employee = props.getValue();
      return employee ? `${employee.firstName} ${employee.lastName}` : "-";
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Дата создания",
    cell: (props) => {
      return new Date(props.getValue()).toLocaleString("ru-RU");
    },
  }),
  columnHelper.accessor("completedAt", {
    header: "Дата завершения",
    cell: (props) => {
      const date = props.getValue();
      return date ? new Date(date).toLocaleString("ru-RU") : "-";
    },
  }),
];

export default function TasksPage() {
  const client = useApiQueryClient();
  const { data, isPending } = client.useQuery("get", "/tasks");

  const tasks = data?.data || [];

  return (
    <>
      <PageMetadata
        title="Задания"
        breadcrumbs={[{ label: "Задания" }]}
        actions={[<CreateTaskDialog key="create" />]}
      />
      <DataTable
        columns={columns}
        data={tasks}
        onRowClick={(row) => redirect(`/dct/tasks/${row.id}`)}
        isLoading={isPending}
      />
    </>
  );
}
