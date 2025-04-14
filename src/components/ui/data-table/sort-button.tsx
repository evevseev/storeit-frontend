"use client";

import { Column } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SortButtonProps<TData> {
  column: Column<TData>;
  children: React.ReactNode;
}

export function SortButton<TData>({
  column,
  children,
}: SortButtonProps<TData>) {
  const isSorted = column.getIsSorted();

  const handleSort = () => {
    column.toggleSorting(undefined, true);
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
      <Input
        placeholder="Search..."
        value={(column.getFilterValue() as string) ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="h-7 px-2 py-1 text-xs"
      />
    </div>
  );
}
