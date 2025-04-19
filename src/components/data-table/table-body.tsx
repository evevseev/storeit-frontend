import { Table as TanStackTable } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface TableBodyProps<TData> {
  table: TanStackTable<TData>;
  columns: number;
  onRowClick?: (row: TData) => void;
}

export function TableBodyComponent<TData>({
  table,
  columns,
  onRowClick,
}: TableBodyProps<TData>) {
  if (!table.getRowModel().rows?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          className={cn(
            "hover:cursor-pointer",
            onRowClick ? "hover:bg-gray-100" : ""
          )}
          data-state={row.getIsSelected() && "selected"}
          onClick={() => onRowClick?.(row.original)}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              style={{ width: cell.column.getSize() }}
              className="whitespace-nowrap"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
