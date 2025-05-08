"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CopyableText } from "@/components/ui/copyable-text";

export type Item = {
  id: string;
  name: string;
  description: string;
  variants: ItemVariant[];
};

export type ItemVariant = {
  id: string;
  name: string;
  ean: string | null;
  article: string | null;
};

export const columns: ColumnDef<Item | ItemVariant>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <CopyableText>
          <span className="text-muted-foreground">{row.original.id}</span>
        </CopyableText>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Наименование",
    cell: ({ row }) => {
      return <strong>{row.original.name}</strong>;
    },
  },
  {
    accessorKey: "description",
    header: "Описание",
  },
  {
    accessorKey: "article",
    header: "Артикул",
  },
  {
    accessorKey: "ean",
    header: "EAN",
  },
  {
    id: "actions",
    size: 50,
    meta: {
      isDisplay: true,
    },
    cell: () => {
      return (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Действия</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
