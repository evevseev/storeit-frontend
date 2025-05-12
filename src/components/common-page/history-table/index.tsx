"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { HistoryTableProps } from "./types";
import { computeDiff } from "./utils";
import { Badge } from "@/components/ui/badge";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import type { components } from "@/lib/api/storeit";
import { Block } from "../block";

type AuditLog = components["schemas"]["AuditLog"];

const changeTypeLabels: Record<AuditLog["action"], string> = {
  create: "Создание",
  update: "Изменение",
  delete: "Удаление",
};

function DiffCell({
  prechange,
  postchange,
}: {
  prechange: Record<string, any> | undefined;
  postchange: Record<string, any> | undefined;
}) {
  if (!prechange && !postchange) {
    return null;
  }

  if (!prechange) {
    return (
      <div className="space-y-2">
        {Object.entries(postchange || {}).map(([key, value], index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="text-sm font-medium">{key}:</div>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary" className="text-green-500">
                {value?.toString() ?? "null"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!postchange) {
    return (
      <div className="space-y-2">
        {Object.entries(prechange).map(([key, value], index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="text-sm font-medium">{key}:</div>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary" className="text-red-500">
                {value?.toString() ?? "null"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const diffs = computeDiff(prechange, postchange);

  return (
    <div className="space-y-2">
      {diffs.map((diff, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="text-sm font-medium">{diff.path.join(".")}:</div>
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="text-red-500">
              {diff.oldValue?.toString() ?? "null"}
            </Badge>
            →
            <Badge variant="secondary" className="text-green-500">
              {diff.newValue?.toString() ?? "null"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChangeTypeBadge({ type }: { type: AuditLog["action"] }) {
  const variants: Record<
    AuditLog["action"],
    "default" | "secondary" | "destructive"
  > = {
    create: "default",
    update: "secondary",
    delete: "destructive",
  };

  return <Badge variant={variants[type]}>{changeTypeLabels[type]}</Badge>;
}

export function HistoryTable({ objectType, objectId }: HistoryTableProps) {
  const client = useApiQueryClient();
  const { data, isPending, isError } = client.useQuery("get", "/audit-logs", {
    params: {
      query: {
        object_type_id: objectType,
        object_id: objectId,
      },
    },
  });

  const columnHelper = createColumnHelper<AuditLog>();

  const columns = [
    columnHelper.accessor("time", {
      header: "Время",
      cell: (info) => info.getValue(),
      sortDescFirst: true,
    }),
    columnHelper.accessor("action", {
      header: "Действие",
      cell: (info) => <ChangeTypeBadge type={info.getValue()} />,
    }),
    columnHelper.accessor("employee", {
      header: "Пользователь",
      cell: (info) => {
        const employee = info.getValue();
        return employee
          ? `${employee.lastName} ${employee.firstName}${
              employee.middleName ? ` ${employee.middleName}` : ""
            }`
          : "";
      },
    }),
    columnHelper.display({
      id: "changes",
      header: "Изменения",
      cell: (info) => (
        <DiffCell
          prechange={info.row.original.prechangeState ?? undefined}
          postchange={info.row.original.postchangeState ?? undefined}
        />
      ),
    }),
  ];

  const historyData = data?.data
    ? data.data.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      )
    : [];

  return (
    <Block title="История изменений">
      <DataTable
        columns={columns}
        data={historyData}
        pagination={false}
        isLoading={isPending}
        isError={isError}
      />
    </Block>
  );
}
