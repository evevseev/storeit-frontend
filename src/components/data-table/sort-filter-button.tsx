"use client";

import { Column, RowData } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SortButtonProps<TData> {
  column: Column<TData>;
  children: React.ReactNode;
}

export function SortFilterButton<TData>({
  column,
  children,
}: SortButtonProps<TData>) {
  const isSorted = column.getIsSorted();
  const filterVariant = column.columnDef.meta?.filterVariant || "text";

  const handleSort = () => {
    column.toggleSorting(undefined, true);
  };

  const renderFilter = () => {
    const columnFilterValue = column.getFilterValue();

    if (filterVariant === "range") {
      return (
        <div className="flex gap-2 w-32">
          <Input
            type="number"
            placeholder="От"
            value={(columnFilterValue as [number, number])?.[0] || ""}
            onChange={(e) => {
              const value = e.target.value
                ? parseFloat(e.target.value)
                : undefined;
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1],
              ]);
            }}
            className="h-7 px-2 py-1 text-xs"
          />
          <Input
            type="number"
            placeholder="До"
            value={(columnFilterValue as [number, number])?.[1] || ""}
            onChange={(e) => {
              const value = e.target.value
                ? parseFloat(e.target.value)
                : undefined;
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value,
              ]);
            }}
            className="h-7 px-2 py-1 text-xs"
          />
        </div>
      );
    }

    return (
      <Input
        placeholder="Поиск..."
        value={(column.getFilterValue() as string) ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="h-7 px-2 py-1 text-xs"
      />
    );
  };

  return (
    <div className="flex flex-col gap-1 py-2">
      <button
        onClick={handleSort}
        className="flex items-center justify-between w-full group hover:opacity-70"
      >
        <span>{children}</span>
        <span
          className={cn(
            "opacity-0 group-hover:opacity-70 transition-opacity",
            isSorted && "opacity-100"
          )}
        >
          {isSorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5" />
          )}
        </span>
      </button>
      {renderFilter()}
    </div>
  );
}
