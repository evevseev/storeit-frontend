"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { HistoryChange, ChangeType, HistoryTableProps } from "./types";
import { computeDiff } from "./utils";
import { Badge } from "@/components/ui/badge";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import type { components } from "@/lib/api/storeit";

const changeTypeLabels: Record<ChangeType, string> = {
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

  // Both prechange and postchange exist, show the diff
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

function ChangeTypeBadge({ type }: { type: ChangeType }) {
  const variants: Record<ChangeType, "default" | "secondary" | "destructive"> =
    {
      create: "default",
      update: "secondary",
      delete: "destructive",
    };

  return <Badge variant={variants[type]}>{changeTypeLabels[type]}</Badge>;
}

function transformApiData(
  entry: components["schemas"]["AuditLog"]
): HistoryChange {
  return {
    id: entry.id,
    timestamp: entry.time,
    action: entry.action as ChangeType,
    user: entry.employee
      ? {
          id: entry.employee.userId,
          name: `${entry.employee.lastName} ${entry.employee.firstName}${
            entry.employee.middleName ? ` ${entry.employee.middleName}` : ""
          }`,
        }
      : null,
    prechangeData: entry.prechangeState ?? undefined,
    postchangeData: entry.postchangeState ?? undefined,
  };
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

  const columnHelper = createColumnHelper<HistoryChange>();

  const columns = [
    columnHelper.accessor("timestamp", {
      header: "Время",
      cell: (info) => info.row.original.timestamp,
      sortDescFirst: true,
    }),
    columnHelper.accessor("action", {
      header: "Действие",
      cell: (info) => <ChangeTypeBadge type={info.row.original.action} />,
    }),
    columnHelper.accessor("user", {
      header: "Пользователь",
      cell: (info) => info.row.original.user?.name ?? "Система",
    }),
    columnHelper.display({
      id: "changes",
      header: "Изменения",
      cell: (info) => (
        <DiffCell
          prechange={info.row.original.prechangeData}
          postchange={info.row.original.postchangeData}
        />
      ),
    }),
  ];

  const historyData = data?.data 
    ? data.data
        .map(transformApiData)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  return (
    <div>
      <DataTable
        columns={columns}
        data={historyData}
        pagination={false}
        isLoading={isPending}
        isError={isError}
      />
    </div>
  );
}
