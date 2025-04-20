import { Table, flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TableBodyComponentProps<TData> {
  table: Table<TData>;
  columns: number;
  onRowClick?: (row: TData) => void;
}

export function TableBodyComponent<TData>({
  table,
  columns,
  onRowClick,
}: TableBodyComponentProps<TData>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            onClick={() => onRowClick?.(row.original)}
            className={cn(
              onRowClick ? "cursor-pointer" : "",
              row.getCanExpand() ? "bg-muted/70" : ""
            )}
          >
            {row.getVisibleCells().map((cell, index) => (
              <TableCell key={cell.id}>
                <div
                  style={
                    index === 0
                      ? {
                          paddingLeft: `${row.depth * 2}rem`,
                          display: row.getCanExpand() ? "flex" : undefined,
                          gap: row.getCanExpand() ? "0.5rem" : undefined,
                          alignItems: row.getCanExpand() ? "center" : undefined,
                        }
                      : undefined
                  }
                >
                  {index === 0 && row.getCanExpand() ? (
                    <Button
                      className="h-6 w-6"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        row.toggleExpanded();
                      }}
                    >
                      {row.getIsExpanded() ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  ) : null}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
