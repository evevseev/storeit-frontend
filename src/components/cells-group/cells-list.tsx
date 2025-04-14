"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Save,
  X,
  Trash2,
  Plus,
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
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";

export type CellKind = {
  id: string;
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
};

export type Cell = {
  id: string;
  alias: string;
  rackNumber: number;
  levelNumber: number;
  positionNumber: number;
  cellKind: CellKind;
};

export default function CellsList() {
  const [data, setData] = useState<Cell[]>(testData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<
    Record<string, Partial<Cell>>
  >({});

  const handleEdit = () => {
    setIsEditing(true);
    const initialEdits = data.reduce(
      (acc, cell) => ({
        ...acc,
        [cell.id]: {
          alias: cell.alias,
          rackNumber: cell.rackNumber,
          levelNumber: cell.levelNumber,
          positionNumber: cell.positionNumber,
        },
      }),
      {}
    );
    setEditedValues(initialEdits);
  };

  const handleSave = () => {
    setData((prev) =>
      prev.map((cell) => ({
        ...cell,
        ...editedValues[cell.id],
      }))
    );
    setIsEditing(false);
    setEditedValues({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((cell) => cell.id !== id));
  };

  const handleChange = (
    id: string,
    key: keyof Cell,
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
    // This will be implemented later to open a dialog
    console.log("Create cell clicked");
  };

  const renderTopToolbar = () => {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleCreateCell}>
          <Plus className="mr-2 h-4 w-4" />
          Create Cell
        </Button>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Cells
          </Button>
        )}
      </div>
    );
  };

  const columns: ColumnDef<Cell>[] = [
    {
      accessorKey: "alias",
      header: "Название",
      size: 150,
      sortingFn: "alphanumeric",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              value={editedValues[cell.id]?.alias ?? cell.alias}
              className="h-8"
              onChange={(e) => handleChange(cell.id, "alias", e.target.value)}
            />
          );
        }
        return cell.alias;
      },
    },
    {
      accessorKey: "rackNumber",
      header: "№ стеллажа",
      size: 120,
      sortingFn: "basic",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editedValues[cell.id]?.rackNumber ?? cell.rackNumber}
              className="h-8"
              onChange={(e) =>
                handleChange(cell.id, "rackNumber", parseInt(e.target.value))
              }
            />
          );
        }
        return cell.rackNumber;
      },
    },
    {
      accessorKey: "levelNumber",
      header: "№ уровня",
      size: 120,
      sortingFn: "basic",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editedValues[cell.id]?.levelNumber ?? cell.levelNumber}
              className="h-8"
              onChange={(e) =>
                handleChange(cell.id, "levelNumber", parseInt(e.target.value))
              }
            />
          );
        }
        return cell.levelNumber;
      },
    },
    {
      accessorKey: "positionNumber",
      header: "№ позиции",
      size: 120,
      sortingFn: "basic",
      cell: ({ row }) => {
        const cell = row.original;
        if (isEditing) {
          return (
            <Input
              type="number"
              value={
                editedValues[cell.id]?.positionNumber ?? cell.positionNumber
              }
              className="h-8"
              onChange={(e) =>
                handleChange(
                  cell.id,
                  "positionNumber",
                  parseInt(e.target.value)
                )
              }
            />
          );
        }
        return cell.positionNumber;
      },
    },
    {
      accessorKey: "cellKind.name",
      header: "Тип ячейки",
      size: 150,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "dimensions",
      header: "Размеры (ВxШxГ)",
      size: 150,
      cell: ({ row }) => {
        const cell = row.original;
        return `${cell.cellKind.height}x${cell.cellKind.width}x${cell.cellKind.depth}`;
      },
    },
    {
      accessorKey: "maxWeight",
      header: "Макс. вес (кг)",
      size: 120,
      sortingFn: "basic",
      cell: ({ row }) => {
        const cell = row.original;
        return cell.cellKind.maxWeight;
      },
    },
    {
      id: "actions",
      size: 50,
      header: () => null,
      cell: ({ row }) => {
        const cell = row.original;

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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDelete(cell.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex justify-end py-4">{renderTopToolbar()}</div>
      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

// Test data
const testData: Cell[] = [
  {
    id: "1",
    alias: "A1",
    rackNumber: 1,
    levelNumber: 1,
    positionNumber: 1,
    cellKind: {
      id: "1",
      name: "Standard",
      height: 100,
      width: 100,
      depth: 100,
      maxWeight: 50,
    },
  },
  {
    id: "2",
    alias: "A2",
    rackNumber: 1,
    levelNumber: 1,
    positionNumber: 2,
    cellKind: {
      id: "2",
      name: "Large",
      height: 200,
      width: 200,
      depth: 200,
      maxWeight: 100,
    },
  },
  {
    id: "3",
    alias: "B1",
    rackNumber: 2,
    levelNumber: 1,
    positionNumber: 1,
    cellKind: {
      id: "1",
      name: "Standard",
      height: 100,
      width: 100,
      depth: 100,
      maxWeight: 50,
    },
  },
];
