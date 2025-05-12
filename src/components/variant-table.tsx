import { ColumnDef } from "@tanstack/react-table";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { memo } from "react";

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

const InputCell = memo(({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8"
    />
  );
});

InputCell.displayName = "InputCell";

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

  const handleChange = (
    index: number,
    field: keyof Variant,
    newValue: string
  ) => {
    onChange(
      value.map((variant, i) =>
        i === index ? { ...variant, [field]: newValue } : variant
      )
    );
  };

  const columns: ColumnDef<Variant>[] = [
    {
      accessorKey: "name",
      header: "Название",
      size: 200,
      cell: ({ row }) => {
        return (
          <InputCell
            value={row.original.name}
            onChange={(value) => handleChange(row.index, "name", value)}
          />
        );
      },
    },
    {
      accessorKey: "sku",
      header: "Артикул",
      size: 150,
      cell: ({ row }) => {
        return (
          <InputCell
            value={row.original.sku}
            onChange={(value) => handleChange(row.index, "sku", value)}
          />
        );
      },
    },
    {
      accessorKey: "ean13",
      header: "EAN13",
      size: 150,
      cell: ({ row }) => {
        return (
          <InputCell
            value={row.original.ean13}
            onChange={(value) => handleChange(row.index, "ean13", value)}
          />
        );
      },
    },
    {
      id: "actions",
      size: 50,
      header: () => null,
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
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-md">
        <DataTable columns={columns} data={value} pagination={false} />
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
