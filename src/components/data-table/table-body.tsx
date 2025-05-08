import { Table, flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TableBodyComponentProps<TData> {
  table: Table<TData>;
  columns: number;
  onRowClick?: (row: TData) => void;
  getRowHref?: (row: TData) => string;
}

export function TableBodyComponent<TData>({
  table,
  columns,
  onRowClick,
  getRowHref,
}: TableBodyComponentProps<TData>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => {
          const href = getRowHref?.(row.original) || "";
          const hasValidHref = !!href;

          return (
            <TableRow
              key={row.id}
              onClick={() => !hasValidHref && onRowClick?.(row.original)}
              className={cn(
                onRowClick || hasValidHref
                  ? "cursor-pointer hover:bg-muted/50"
                  : "",
                row.getCanExpand() ? "bg-muted/70" : ""
              )}
            >
              {row.getVisibleCells().map((cell, index) => {
                const isDisplay = cell.column.columnDef.meta as any;
                const expandButton =
                  index === 0 && row.getCanExpand() ? (
                    <Button
                      className="h-6 w-6"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
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
                  ) : null;

                const cellContent = (
                  <div
                    style={
                      index === 0
                        ? {
                            paddingLeft: `${row.depth * 2}rem`,
                            display: row.getCanExpand() ? "flex" : undefined,
                            gap: row.getCanExpand() ? "0.5rem" : undefined,
                            alignItems: row.getCanExpand()
                              ? "center"
                              : undefined,
                          }
                        : undefined
                    }
                  >
                    {expandButton}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                );

                return (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: isDisplay ? cell.column.getSize() : undefined,
                    }}
                    className={cn(
                      (cell.column.columnDef.meta as any)?.isDisplay &&
                        "text-center"
                    )}
                  >
                    {hasValidHref ? (
                      <Link href={href} className="block h-full py-2 px-4">
                        {cellContent}
                      </Link>
                    ) : (
                      <div className="py-2 px-4">{cellContent}</div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell colSpan={columns} className="h-24 text-center">
            Нет данных.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
