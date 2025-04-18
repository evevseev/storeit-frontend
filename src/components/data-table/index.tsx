"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import { DataTablePagination } from "./pagination";
import { TableHeaderComponent } from "./table-header";
import { TableBodyComponent } from "./table-body";
import { TableLoading } from "./table-loading";
import { TableError } from "./table-error";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data?: TData[];
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export function DataTable<TData>({
  columns,
  data,
  pagination = true,
  pageSize = 50,
  onRowClick,
  isLoading = false,
  isError = false,
  errorMessage,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    sortDescFirst: false,
  });

  if (isError) {
    return <TableError message={errorMessage} />;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeaderComponent table={table} />
        {isLoading ? (
          <TableLoading columns={columns.length} />
        ) : (
          <TableBodyComponent
            table={table}
            columns={columns.length}
            onRowClick={onRowClick}
          />
        )}
      </Table>
      {pagination && !isLoading && (
        <div className="mx-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}

export { DataTablePagination } from "./pagination";
export { SortButton } from "./sort-button";
