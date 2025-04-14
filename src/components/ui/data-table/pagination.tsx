"use client";

import { Table as TableInstance } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZES = [50, 100, 200, 1500] as const;

function DataTablePageSizeSelector<TData>({
  table,
}: {
  table: TableInstance<TData>;
}) {
  const currentPageSize = table.getState().pagination.pageSize;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        Записей на <br /> странице
      </span>
      <Select
        value={currentPageSize.toString()}
        onValueChange={(value) => {
          table.setPageSize(parseInt(value, 10));
        }}
      >
        <SelectTrigger className="h-8 w-[80px]">
          <SelectValue>{currentPageSize}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DataTableNavigation<TData>({
  table,
}: {
  table: TableInstance<TData>;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Назад
      </Button>
      {Array.from({ length: table.getPageCount() }, (_, i) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const shouldShow =
          i === 0 ||
          i === table.getPageCount() - 1 ||
          Math.abs(i - pageIndex) <= 1;

        if (!shouldShow && Math.abs(i - pageIndex) === 2) {
          return (
            <span key={i} className="text-sm text-muted-foreground px-2">
              ...
            </span>
          );
        }

        if (!shouldShow) return null;

        return (
          <Button
            key={i}
            variant={i === pageIndex ? "default" : "outline"}
            size="sm"
            onClick={() => table.setPageIndex(i)}
            className="w-8"
          >
            {i + 1}
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Дальше
      </Button>
    </div>
  );
}

export function DataTablePagination<TData>({
  table,
}: {
  table: TableInstance<TData>;
}) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <DataTablePageSizeSelector table={table} />
        <DataTableNavigation table={table} />
      </div>
      <div className="flex-1 text-sm text-muted-foreground text-right">
        Показано {table.getRowModel().rows.length} из{" "}
        {table.getFilteredRowModel().rows.length} записей
      </div>
    </div>
  );
}
