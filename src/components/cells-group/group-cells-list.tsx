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
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { components } from "@/lib/api/storeit";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "../dialogs/deletion";
import { toast } from "sonner";
interface CellsListProps {
  cellsGroupId: string;
}

type DType = components["schemas"]["Cell"];
const columnHelper = createColumnHelper<DType>();

export default function GroupCellsList({ cellsGroupId }: CellsListProps) {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();

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
    "/cells-groups/{groupId}/cells/{cellId}"
  );

  const { mutate: createCell } = client.useMutation(
    "post",
    "/cells-groups/{groupId}/cells"
  );

  const { mutate: deleteCell } = client.useMutation(
    "delete",
    "/cells-groups/{groupId}/cells/{cellId}"
  );

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  useEffect(() => {
    console.log(JSON.stringify(selectedRows, null, 2));
  }, [selectedRows]);

  const selectedRowsCount = Object.keys(selectedRows).length;

  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, DType>>({});

  const handleEdit = () => {
    setIsEditing(true);
    if (cells?.data) {
      const initialEdits = cells.data.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as Record<string, DType>);
      setEditedValues(initialEdits);
    }
  };

  const handleSave = () => {
    if (cells?.data) {
      const updatedCells = cells.data.map((cell) => ({
        ...cell,
        ...editedValues[cell.id],
      }));

      updatedCells.forEach((cell) => {
        try {
          updateCell({
            params: {
              path: {
                groupId: cellsGroupId,
                cellId: cell.id,
              },
            },
            body: cell,
          });
        } catch (error) {
          toast.error("Не удалось обновить ячейки");
        }
      });
    }
    setIsEditing(false);
    setEditedValues({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
  };

  const handleDelete = (id: string) => {
    deleteCell(
      {
        params: {
          path: {
            groupId: cellsGroupId,
            cellId: id,
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

  const handleChange = (
    id: string,
    key: keyof DType,
    value: string | number
  ) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const handleCreateCell = () => {
    console.log("Create cell clicked");
  };

  const handlePrintLabels = () => {
    if (selectedRowsCount > 0) {
      console.log("Print labels clicked");
    }
  };

  const renderTopToolbar = () => {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleCreateCell}>
          <Plus className="mr-2 h-4 w-4" />
          Создать ячейку
        </Button>
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

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomeRowsSelected() && "indeterminate")
          }
          onCheckedChange={table.getToggleAllRowsSelectedHandler()}
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={row.getToggleSelectedHandler()}
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
    }),
    columnHelper.accessor("alias", {
      header: "Обозначение",
      size: 150,
      sortingFn: "alphanumeric",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              value={cell?.alias}
              className="h-8"
              onChange={(e) => handleChange(cell.id, "alias", e.target.value)}
            />
          );
        }
        return cell.alias;
      },
    }),
    columnHelper.accessor("row", {
      header: "№ ряда",
      size: 120,
      sortingFn: "basic",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editedValues[cell.id]?.row ?? cell.row}
              className="h-8"
              onChange={(e) =>
                handleChange(cell.id, "row", parseInt(e.target.value))
              }
            />
          );
        }
        return cell.row;
      },
      meta: {
        filterVariant: "range",
      },
    }),
    columnHelper.accessor("level", {
      header: "№ уровня",
      size: 120,
      sortingFn: "basic",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editedValues[cell.id]?.level ?? cell.level}
              className="h-8"
              onChange={(e) =>
                handleChange(cell.id, "level", parseInt(e.target.value))
              }
            />
          );
        }
        return cell.level;
      },
      meta: {
        filterVariant: "range",
      },
    }),
    columnHelper.accessor("position", {
      header: "№ позиции",
      size: 120,
      sortingFn: "basic",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editedValues[cell.id]?.position ?? cell.position}
              className="h-8"
              onChange={(e) =>
                handleChange(cell.id, "position", parseInt(e.target.value))
              }
            />
          );
        }
        return cell.position;
      },
      meta: {
        filterVariant: "range",
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
          <DataTable
            columns={columns}
            data={cells?.data}
            setRowSelection={setSelectedRows}
            rowSelection={selectedRows}
            getRowId={(row) => row.id}
          />
        </div>
      </div>
    </div>
  );
}
