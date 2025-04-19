import { Table as TanStackTable } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { SortButton } from "./sort-button";

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
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              style={{ width: header.getSize() }}
              className="whitespace-nowrap"
            >
              {header.isPlaceholder ? null : header.column.columnDef
                  .sortingFn ? (
                <SortButton column={header.column}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </SortButton>
              ) : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
