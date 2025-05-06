"use client";
import { PageMetadata } from "@/components/header/page-metadata";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import {
  useReactTable,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
type Task = {
  id: string;
  name: string;
  type: "order" | "movement";
  status: "pending" | "completed" | "failed";
  createdAt: string;
};
import { redirect } from "next/navigation";

const columnHelper = createColumnHelper<Task>();
const columns = [
  columnHelper.accessor("name", {
    header: "Название",
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Тип",
    cell: (props) => {
      return <Badge variant="outline">{props.getValue()}</Badge>;
    },
  }),
  columnHelper.accessor("status", {
    header: "Статус",
    cell: (props) => {
      return <Badge variant="outline">{props.getValue()}</Badge>;
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Дата создания",
    cell: (props) => {
      return props.getValue();
    },
  }),
];

const data: Task[] = [
  {
    id: "1",
    name: "Задание 1",
    type: "order",
    status: "pending",
    createdAt: "2021-01-01",
  },
  {
    id: "2",
    name: "Задание 2",
    type: "movement",
    status: "completed",
    createdAt: "2021-01-02",
  },
  {
    id: "3",
    name: "Задание 3",
    type: "order",
    status: "failed",
    createdAt: "2021-01-03",
  },
];

export default function TasksPage() {
  return (
    <>
      <PageMetadata title="Задания" breadcrumbs={[{ label: "Задания" }]} />
      <DataTable
        columns={columns}
        data={data}
        onRowClick={(row) => redirect(`/tasks/${row.id}`)}
      />
    </>
  );
}
