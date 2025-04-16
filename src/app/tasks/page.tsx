import { PageMetadata } from "@/components/header/page-metadata";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { useReactTable, createColumnHelper } from "@tanstack/react-table";

type Task = {
  id: string;
  name: string;
  type: "order" | "movement";
  status: "pending" | "completed" | "failed";
  createdAt: string;
};

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

export default function TasksPage() {
  return (
    <>
      <PageMetadata title="Задания" breadcrumbs={[{ label: "Задания" }]} />
      <DataTable columns={columns} data={[]} />
    </>
  );
}
