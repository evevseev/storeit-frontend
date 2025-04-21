"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
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
  getRowCanExpand?: (row: Row<TData>) => boolean;
  getSubRows?: (row: TData) => TData[] | undefined;
  getRowHref?: (row: TData) => string;
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
  getRowCanExpand,
  getSubRows,
  getRowHref,
}: Readonly<DataTableProps<TData>>) {
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
    getExpandedRowModel: getExpandedRowModel(),
    filterFromLeafRows: true,
    getRowCanExpand,
    getSubRows,
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    sortDescFirst: false,
    enableColumnFilters: true,
    enableFilters: true,
    getColumnCanGlobalFilter: (column) => {
      return !(column.columnDef.meta as any)?.isDisplay;
    },
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
            getRowHref={getRowHref}
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
