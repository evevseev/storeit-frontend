import { ColumnDef } from "@tanstack/react-table";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";

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
          <Input
            value={row.original.name}
            onChange={(e) => handleChange(row.index, "name", e.target.value)}
            className="h-8"
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
          <Input
            value={row.original.sku}
            onChange={(e) => handleChange(row.index, "sku", e.target.value)}
            className="h-8"
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
          <Input
            value={row.original.ean13}
            onChange={(e) => handleChange(row.index, "ean13", e.target.value)}
            className="h-8"
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
