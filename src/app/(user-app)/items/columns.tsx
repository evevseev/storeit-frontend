"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
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

const columnHelper = createColumnHelper<Item | ItemVariant>();

export const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ row }) => (
      <CopyableText>
        <span className="text-muted-foreground">{row.original.id}</span>
      </CopyableText>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: "Наименование",
    cell: ({ row }) => <strong>{row.original.name}</strong>,
  }),
  columnHelper.accessor("description", {
    header: "Описание",
  }),
  columnHelper.accessor("article", {
    header: "Артикул",
    cell: ({ row }) => {
      const isVariant = "article" in row.original;
      if (!isVariant) return null;
      return (
        <CopyableText>{(row.original as ItemVariant).article}</CopyableText>
      );
    },
  }),
  columnHelper.accessor("ean", {
    header: "EAN",
    cell: ({ row }) => {
      const isVariant = "ean" in row.original;
      if (!isVariant) return null;
      return <CopyableText>{(row.original as ItemVariant).ean}</CopyableText>;
    },
  }),
  columnHelper.display({
    id: "actions",
    meta: {
      isDisplay: true,
    },
    cell: () => (
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
    ),
  }),
];
