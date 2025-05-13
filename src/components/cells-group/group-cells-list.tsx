"use client";

import {
  ColumnDef,
  createColumnHelper,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Save,
  X,
  Trash2,
  Plus,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { components } from "@/lib/api/storeit";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "../dialogs/deletion";
import { toast } from "sonner";
import {
  defaultColumn,
  useSkipper,
  EditedCellValue,
} from "@/lib/tanstack-table";
import { Label, usePrintLabels } from "@/hooks/use-print-labels";
import CreateCellDialog from "./create-cell-dialog";
import { CopyableText } from "../ui/copyable-text";
interface CellsListProps {
  cellsGroupId: string;
}

type DType = components["schemas"]["Cell"];
const columnHelper = createColumnHelper<DType>();

export default function GroupCellsList({ cellsGroupId }: CellsListProps) {
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

  const { mutate: updateCell } = client.useMutation(
    "put",
    "/cells/{id}"
  );

  const { mutate: createCell } = client.useMutation(
    "post",
    "/cells-groups/{groupId}/cells"
  );

  const { mutate: deleteCell } = client.useMutation(
    "delete",
    "/cells/{id}"
  );

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<EditedCellValue[]>([]);
  // const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const selectedRowsCount = Object.keys(selectedRows).length;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues([]);
  };

  const handleSave = () => {
    const editsByCell = editedValues.reduce((acc, edit) => {
      const cell = cells?.data[edit.rowIndex];
      if (!cell) return acc;

      if (!acc[cell.id]) {
        acc[cell.id] = { ...cell };
      }

      switch (edit.columnId) {
        case "alias":
          acc[cell.id].alias = edit.value as string;
          break;
        case "row":
          acc[cell.id].row = edit.value as number;
          break;
        case "level":
          acc[cell.id].level = edit.value as number;
          break;
        case "position":
          acc[cell.id].position = edit.value as number;
          break;
      }

      return acc;
    }, {} as Record<string, DType>);

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
    setEditedValues([]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues([]);
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

  const handleCreateCell = () => {
    console.log("Create cell clicked");
  };

  const handlePrintLabels = () => {
    const labels =
      cells?.data
        .filter((cell) => selectedRows[cell.id])
        .map((cell) => ({
          id: cell.id,
          name: cell.alias,
          description: "Ячейка",
          url:
            process.env.NEXT_PUBLIC_API_URL +
            "/cells-groups/" +
            cellsGroupId +
            "/cells/" +
            cell.id +
            "/label",
        })) ?? [];
    printLabels(labels);
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
            <Button size="sm" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Редактировать
            </Button>

            <Button
              size="sm"
              onClick={handlePrintLabels}
              disabled={selectedRowsCount === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Печать этикеток ({selectedRowsCount})
            </Button>
          </>
        )}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
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
        enableSorting: false,
        enableHiding: false,
        meta: {
          isDisplay: true,
        },
      }),
      columnHelper.accessor("id", {
        header: "ID",
        size: 100,
        sortingFn: "alphanumeric",
        cell: ({ getValue }) => (
          <CopyableText className="cursor-pointer">{getValue()}</CopyableText>
        ),
        // enableEditing: false,
      }),
      columnHelper.accessor("alias", {
        header: "Обозначение",
        size: 150,
        sortingFn: "alphanumeric",
        // enableEditing: true,
      }),
      columnHelper.accessor("row", {
        header: "№ ряда",
        size: 120,
        sortingFn: "basic",
        meta: {
          filterVariant: "range",
        },
        // enableEditing: true,
      }),
      columnHelper.accessor("level", {
        header: "№ уровня",
        size: 120,
        sortingFn: "basic",
        meta: {
          filterVariant: "range",
        },
        // enableEditing: true,
      }),
      columnHelper.accessor("position", {
        header: "№ позиции",
        size: 120,
        sortingFn: "basic",
        meta: {
          filterVariant: "range",
        },
        // enableEditing: true,
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
    ],
    []
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-end py-4">{renderTopToolbar()}</div>
      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={cells?.data}
            setRowSelection={setSelectedRows}
            rowSelection={selectedRows}
            getRowId={(row) => row.id}
            defaultColumn={defaultColumn}
            editMode={isEditing}
            getRowHref={(row) => `/cells/${row.id}`}
            meta={{
              updateData: (rowIndex: number, columnId: string, value: unknown) => {
                setEditedValues((prev) => {
                  const filtered = prev.filter(
                    (edit) =>
                      !(
                        edit.rowIndex === rowIndex &&
                        edit.columnId === columnId
                      )
                  );
                  return [...filtered, { rowIndex, columnId, value }];
                });
              },
              addEditedValue: (value: EditedCellValue) => {
                setEditedValues((prev) => {
                  const filtered = prev.filter(
                    (edit) =>
                      !(
                        edit.rowIndex === value.rowIndex &&
                        edit.columnId === value.columnId
                      )
                  );
                  return [...filtered, value];
                });
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
