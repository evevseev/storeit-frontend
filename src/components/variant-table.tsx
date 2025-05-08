import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { EditedCellValue, defaultColumn } from "@/lib/tanstack-table";

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
            updateData: (rowIndex: number, columnId: string, newValue: unknown) => {
              onChange(
                value.map((variant: Variant, index: number) =>
                  index === rowIndex ? { ...variant, [columnId]: newValue } : variant
                )
              );
            },
            addEditedValue: (editedValue: EditedCellValue) => {
              onChange(
                value.map((variant: Variant, index: number) =>
                  index === editedValue.rowIndex ? { ...variant, [editedValue.columnId]: editedValue.value } : variant
                )
              );
            }
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
