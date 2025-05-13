import { Table as TanStackTable } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { SortFilterButton } from "./sort-filter-button";
import { cn } from "@/lib/utils";

interface TableHeaderProps<TData> {
  table: TanStackTable<TData>;
}

export function TableHeaderComponent<TData>({
  table,
}: TableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const isDisplay = (header.column.columnDef.meta as any)?.isDisplay;
            return (
              <TableHead
                key={header.id}
                style={{ width: !isDisplay ? header.getSize() : undefined }}
                className={cn("whitespace-nowrap", isDisplay && "text-center")}
              >
                {header.isPlaceholder ? null : isDisplay ? (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                ) : header.column.columnDef.sortingFn ? (
                  <SortFilterButton column={header.column}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </SortFilterButton>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
