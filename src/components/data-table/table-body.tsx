import { Table, flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

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
  const router = useRouter();

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => {
          const href = getRowHref?.(row.original) || null;

          return (
            <TableRow
              key={row.id}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                const isInteractiveElement =
                  target.tagName === "BUTTON" ||
                  target.tagName === "INPUT" ||
                  target.tagName === "SELECT" ||
                  target.tagName === "TEXTAREA" ||
                  target.tagName === "A" ||
                  target.closest("button") ||
                  target.closest("input") ||
                  target.closest("select") ||
                  target.closest("textarea") ||
                  target.closest("a") ||
                  target.closest('[role="button"]') ||
                  target.closest('[role="menuitem"]') ||
                  target.closest("[data-radix-collection-item]"); // For dropdown menu items

                if (isInteractiveElement) {
                  return;
                }

                if (href) {
                  router.push(href);
                } else {
                  onRowClick?.(row.original);
                }
              }}
              className={cn(
                onRowClick || href ? "cursor-pointer hover:bg-muted/50" : "",
                row.getCanExpand() ? "bg-muted/70" : ""
              )}
            >
              {row.getVisibleCells().map((cell, index) => {
                const isDisplay = cell.column.columnDef.meta?.isDisplay;
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

                const changed = table.options.meta?.changedRows?.[row.id];
                const changedValue = changed?.[cell.column.id];
                const type =
                  (cell.column.columnDef.meta as any)?.type || "text";
                function toType(value: unknown) {
                  if (type === "number") {
                    return Number(value);
                  }
                  return String(value);
                }
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
                    {table.options.meta?.editMode &&
                    cell.column.columnDef.meta?.isEditable ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={
                            (changedValue as any) || (cell.getValue() as any)
                          }
                          onChange={(e) => {
                            table.options.meta?.setChangedRows?.({
                              ...table.options.meta?.changedRows,
                              [row.id]: {
                                ...changed,
                                [cell.column.id]: toType(e.target.value),
                              },
                            });
                          }}
                          onBlur={(e) => {
                            table.options.meta?.setChangedRows?.({
                              ...table.options.meta?.changedRows,
                              [row.id]: {
                                ...changed,
                                [cell.column.id]: toType(e.target.value),
                              },
                            });
                          }}
                          type={type}
                        />
                        {cell.column.columnDef.meta?.editModeButton?.({
                          cell,
                          value: cell.getValue(),
                          setValue: (value) => {
                            table.options.meta?.setChangedRows?.({
                              ...table.options.meta?.changedRows,
                              [row.id]: {
                                ...changed,
                                [cell.column.id]: value,
                              },
                            });
                          },
                        })}
                      </div>
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
