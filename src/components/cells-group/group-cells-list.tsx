"use client";

import {
  ColumnDef,
  createColumnHelper,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Save, X, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { components } from "@/lib/api/storeit";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "../dialogs/deletion";
import { toast } from "sonner";
import { EditedRows } from "@/lib/tanstack-table";
import { getCellLabel, Label, usePrintLabels } from "@/hooks/use-print-labels";
import CreateCellDialog from "./create-cell-dialog";
import { CopyableText } from "../ui/copyable-text";
import { useState } from "react";

type DType = components["schemas"]["Cell"];
const columnHelper = createColumnHelper<DType>();

export default function GroupCellsList({
  cellsGroupId,
}: {
  cellsGroupId: string;
}) {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();

  const { printLabels } = usePrintLabels();

  const { data: cells } = client.useQuery(
    "get",
    "/cells-groups/{groupId}/cells",
    {
      params: {
        path: {
          groupId: cellsGroupId,
        },
      },
    }
  );

  const { mutate: updateCell } = client.useMutation("put", "/cells/{id}");

  const { mutate: createCell } = client.useMutation(
    "post",
    "/cells-groups/{groupId}/cells"
  );

  const { mutate: deleteCell } = client.useMutation("delete", "/cells/{id}");

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedRows, setEditedRows] = useState<EditedRows>({});

  const selectedRowsCount = Object.keys(selectedRows).length;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedRows({});
  };

  const handleSave = () => {
    console.log(editedRows);
    const editsByCell = Object.entries(editedRows).reduce(
      (acc, [cellId, edit]) => {
        const cell = cells?.data.find((c) => c.id === cellId);
        if (!cell) return acc;

        acc[cell.id] = { ...cell, ...edit };

        return acc;
      },
      {} as Record<string, DType>
    );

    Object.entries(editsByCell).forEach(([cellId, updatedCell]) => {
      updateCell(
        {
          params: {
            path: {
              id: cellId,
            },
          },
          body: updatedCell,
        },
        {
          onSuccess: () => {
            globalClient.invalidateQueries({
              queryKey: ["get", "/cells-groups/{groupId}/cells"],
            });
          },
          onError: (err) => {
            toast.error("Ошибка при обновлении ячейки", {
              description: err.error.message,
            });
          },
        }
      );
    });

    if (Object.keys(editsByCell).length > 0) {
      toast.success("Изменения сохранены");
    }

    setIsEditing(false);
    setEditedRows({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedRows({});
    globalClient.invalidateQueries({
      queryKey: ["get", "/cells-groups/{groupId}/cells"],
    });
  };

  const handleDelete = (id: string) => {
    deleteCell(
      {
        params: {
          path: {
            id: id,
          },
        },
      },
      {
        onSuccess: () => {
          globalClient.invalidateQueries({
            queryKey: ["get", "/cells-groups/{groupId}/cells"],
          });
          toast.success("Ячейка удалена");
        },
        onError: (err) => {
          toast.error("Ошибка при удалении ячейки", {
            description: err.error.message,
          });
        },
      }
    );
  };

  const handlePrintLabels = () => {
    printLabels(
      cells?.data
        .filter((cell) => selectedRows[cell.id])
        .map((cell) =>
          getCellLabel({
            id: cell.id,
            alias: cell.alias,
            row: cell.row,
            level: cell.level,
            position: cell.position,
          })
        ) ?? []
    );
  };

  const renderTopToolbar = () => {
    return (
      <div className="flex items-center gap-4">
        <CreateCellDialog cellsGroupId={cellsGroupId} />
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Отмена
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>
        ) : (
          <>
            <Button onClick={handleEdit}>
              <Pencil />
              Редактировать
            </Button>

            <Button
              onClick={handlePrintLabels}
              disabled={selectedRowsCount === 0}
            >
              <Printer />
              Печать этикеток ({selectedRowsCount})
            </Button>
          </>
        )}
      </div>
    );
  };

  const columns = [
    columnHelper.display({
      id: "select",
      size: 20,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomeRowsSelected() && "indeterminate")
          }
          onCheckedChange={(checked) => {
            table.toggleAllRowsSelected(!!checked);
          }}
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => {
            row.toggleSelected(!!checked);
          }}
          aria-label="Выбрать ячейку"
        />
      ),
      meta: {
        isDisplay: true,
      },
    }),
    columnHelper.accessor("id", {
      header: "ID",
      size: 100,
      sortingFn: "alphanumeric",
      cell: ({ getValue }) => <CopyableText>{getValue()}</CopyableText>,
    }),
    columnHelper.accessor("alias", {
      header: "Обозначение",
      size: 150,
      sortingFn: "alphanumeric",
      meta: {
        isEditable: true,
      },
    }),
    columnHelper.accessor("row", {
      header: "№ ряда",
      size: 120,
      sortingFn: "basic",
      meta: {
        filterVariant: "range",
        isEditable: true,
        type: "number",
      },
    }),
    columnHelper.accessor("level", {
      header: "№ уровня",
      size: 120,
      sortingFn: "basic",
      meta: {
        filterVariant: "range",
        isEditable: true,
        type: "number",
      },
    }),
    columnHelper.accessor("position", {
      header: "№ позиции",
      size: 120,
      sortingFn: "basic",
      meta: {
        filterVariant: "range",
        isEditable: true,
        type: "number",
      },
    }),
    columnHelper.display({
      id: "actions",
      size: 50,
      header: () => null,
      meta: {
        isDisplay: true,
      },
      cell: ({ row }) => {
        const cell = row.original;
        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteDialog
              hideTrigger
              onDelete={() => handleDelete(cell.id)}
              buttonLabel="Удалить"
              isOpen={deleteDialogOpen}
              setIsOpen={setDeleteDialogOpen}
            />
          </div>
        );
      },
    }),
  ];

  return (
    <div className="flex flex-col">
      <div className="flex justify-end py-4">{renderTopToolbar()}</div>
      <div className="border rounded-md">
        <div className="overflow-x-auto">
          {/* {cells?.data ? ( */}
          <DataTable
            columns={columns}
            data={cells?.data ?? []}
            setRowSelection={setSelectedRows}
            rowSelection={selectedRows}
            getRowId={(row) => row.id}
            editMode={isEditing}
            getRowHref={!isEditing ? (row) => `/cells/${row.id}` : undefined}
            changedRows={editedRows}
            setChangedRows={setEditedRows}
          />
          {/* ) : (
            <div>Загрузка...</div>
          )} */}
        </div>
      </div>
    </div>
  );
}
