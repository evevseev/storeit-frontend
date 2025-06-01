import { createColumnHelper } from "@tanstack/react-table";
import { X, Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import Ean13Generator from "@/app/(user-app)/items/ean-13-generator";
import { EditedRows } from "@/lib/tanstack-table";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export type Variant = {
  id: string | null;
  name: string;
  sku: string;
  ean13: string;
};

interface VariantTableProps {
  value: Variant[];
  setValue: (variants: Variant[]) => void;
}

export function VariantTable({ value, setValue }: VariantTableProps) {
  const [editedRows, setEditedRows] = useState<EditedRows>({});
  useEffect(() => {
    console.log(value);
  }, [value]);

  function handleDelete(id: string) {
    setValue(value.filter((val) => val.id !== id));
    setEditedRows((prev) => {
      const newEditedRows = { ...prev };
      delete newEditedRows[id];
      return newEditedRows;
    });
  }

  function handleAdd() {
    const newVariant: Variant = {
      id: uuidv4(),
      name: "",
      sku: "",
      ean13: "",
    };
    setValue([...value, newVariant]);

    setEditedRows((prev) => {
      const newEditedRows = { ...prev };
      newEditedRows[newVariant.id as string] = {
        id: newVariant.id,
        name: "",
        sku: "",
        ean13: "",
      };
      return newEditedRows;
    });
  }

  function valueForTable() {
    return value.map((value) => ({
      id: value.id || "",
      name: "",
      sku: "",
      ean13: "",
    }));
  }

  useEffect(() => {
    setValue(
      Object.values(editedRows).map((editedRow) => ({
        id: editedRow.id as string,
        name: editedRow.name as string,
        sku: editedRow.sku as string,
        ean13: editedRow.ean13 as string,
      }))
    );
  }, [editedRows]);

  const columnHelper = createColumnHelper<Variant>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Название",
      size: 200,
      meta: {
        isEditable: true,
      },
    }),
    columnHelper.accessor("sku", {
      header: "Артикул",
      size: 150,
      meta: {
        isEditable: true,
      },
    }),
    columnHelper.accessor("ean13", {
      header: "EAN13",
      size: 150,
      meta: {
        isEditable: true,
        editModeButton: ({ setValue }) => {
          return (
            <Ean13Generator
              onChange={(ean13) => {
                setValue(ean13.toString());
              }}
            />
          );
        },
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
            onClick={() => handleDelete(row.original.id as string)}
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
          data={valueForTable()}
          pagination={false}
          editMode={true}
          changedRows={editedRows}
          setChangedRows={setEditedRows}
          getRowId={(row) => row.id as string}
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
