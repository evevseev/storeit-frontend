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
  RowSelectionState,
  OnChangeFn,
  TableOptions,
  ExpandedState,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import { DataTablePagination } from "./pagination";
import { TableHeaderComponent } from "./table-header";
import { TableBodyComponent } from "./table-body";
import { TableLoading } from "./table-loading";
import { TableError } from "./table-error";
import { Block } from "../common-page/block";
import { EditedRows } from "@/lib/tanstack-table";

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
  getRowId?: (row: TData) => string;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  defaultColumn?: Partial<ColumnDef<TData, unknown>>;
  meta?: TableOptions<TData>["meta"];
  editMode?: boolean;
  expanded?: boolean;
  changedRows?: EditedRows;
  setChangedRows?: (changedRows: EditedRows) => void;
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
  getRowId,
  setRowSelection,
  rowSelection,
  defaultColumn,
  meta,
  editMode = false,
  expanded = false,
  changedRows,
  setChangedRows,
}: Readonly<DataTableProps<TData>>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const effectiveDefaultColumn = editMode ? defaultColumn : undefined;

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
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnFilters,
    },
    initialState: {
      expanded: expanded ? true : {},
    },
    sortDescFirst: false,
    enableColumnFilters: true,
    enableFilters: true,
    getColumnCanGlobalFilter: (column) => {
      const meta = column.columnDef.meta as any;
      return !(meta?.isDisplay || meta?.isSelector);
    },
    getRowId,
    defaultColumn: effectiveDefaultColumn,
    meta: {
      editMode: editMode,
      changedRows,
      setChangedRows,
    },
  });

  if (isError) {
    return <TableError message={errorMessage} />;
  }

  return (
    <Block>
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
    </Block>
  );
}

export { DataTablePagination } from "./pagination";
export { SortFilterButton as SortButton } from "./sort-filter-button";
