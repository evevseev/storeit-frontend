"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { UserPlus } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search by name or email..."
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("fullName")?.setFilterValue(event.target.value)
            table.getColumn("email")?.setFilterValue(event.target.value)
          }}
          className="max-w-sm"
        />
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Employee
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => {
            // Show first page, last page, current page, and pages around current
            const pageIndex = table.getState().pagination.pageIndex;
            const shouldShow = 
              i === 0 || // First page
              i === table.getPageCount() - 1 || // Last page
              Math.abs(i - pageIndex) <= 1; // Current page and adjacent pages

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
            Next
          </Button>
        </div>
        <div className="flex-1 text-sm text-muted-foreground text-right">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} records
        </div>
      </div>
    </div>
  )
} 