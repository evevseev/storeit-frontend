import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { X, Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { EditedCellValue, defaultColumn } from "@/lib/tanstack-table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Ean13Generator from "@/app/(user-app)/items/ean-13-generator";

export type Variant = {
  id: string | null;
  name: string;
  sku: string;
  ean13: string;
};

interface VariantTableProps {
  value: Variant[];
  onChange: (variants: Variant[]) => void;
}

export function VariantTable({ value, onChange }: VariantTableProps) {
  const handleDelete = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newVariant: Variant = {
      id: null,
      name: "",
      sku: "",
      ean13: "",
    };
    onChange([...value, newVariant]);
  };

  const columnHelper = createColumnHelper<Variant>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Название",
      size: 200,
    }),
    columnHelper.accessor("sku", {
      header: "Артикул",
      size: 150,
    }),
    columnHelper.accessor("ean13", {
      header: "EAN13",
      size: 150,
      cell: ({ getValue, row, column, table }) => {
        const meta = table.options.meta;
        return (
          <div className="flex items-center gap-2">
            <input
              value={getValue() as string}
              onChange={(e) => {
                meta?.updateData?.(row.index, column.id, e.target.value);
              }}
              className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
            />
            <Ean13Generator
              onChange={(ean13) => {
                meta?.updateData?.(row.index, column.id, ean13);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      size: 50,
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleDelete(row.index)}
          >
            <X className="h-4 w-4" />
          </Button>
        );
      },
      meta: {
        isDisplay: true,
      },
    }),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-md">
        <DataTable
          columns={columns}
          data={value}
          pagination={false}
          editMode={true}
          defaultColumn={defaultColumn}
          meta={{
            updateData: (
              rowIndex: number,
              columnId: string,
              newValue: unknown
            ) => {
              onChange(
                value.map((variant: Variant, index: number) =>
                  index === rowIndex
                    ? { ...variant, [columnId]: newValue }
                    : variant
                )
              );
            },
            addEditedValue: (editedValue: EditedCellValue) => {
              onChange(
                value.map((variant: Variant, index: number) =>
                  index === editedValue.rowIndex
                    ? { ...variant, [editedValue.columnId]: editedValue.value }
                    : variant
                )
              );
            },
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-2"
          type="button"
        >
          <Plus className="h-4 w-4" />
          Добавить вариант
        </Button>
      </div>
    </div>
  );
}
