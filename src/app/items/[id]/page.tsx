"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef, flexRender, getCoreRowModel } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  PageBlock,
  BlockTextElement,
  BlockCustomElement,
  EditButton,
  BlockRow,
  DeleteButton,
  PageBlockRow,
} from "@/components/info-page/block";
import client from "@/hooks/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReactTable, createColumnHelper } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type Item = {
  id: string;
  name: string;
  description: string | null;
  variants: Variant[];
};

type Variant = {
  id: string;
  name: string;
  article: string | null;
  ean13: number | null;
};

const variantColumnHelper = createColumnHelper<Variant>();
const variantColumns = [
  variantColumnHelper.accessor("name", {
    header: "Название",
    cell: (props) => props.getValue(),
  }),
  variantColumnHelper.accessor("article", {
    header: "Артикул",
    cell: (props) => props.getValue(),
  }),
  variantColumnHelper.accessor("ean13", {
    header: "EAN13",
    cell: (props) => props.getValue(),
  }),
  variantColumnHelper.display({
    id: "actions",
    cell: (props) => (
      <div className="text-right">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:cursor-pointer"
          onClick={() => {
            alert(props.row.original.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }),
];

export default function ItemPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = client.useQuery("get", "/items/{id}", {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const [item, setItem] = useState<Item | null>(null);
  const table = useReactTable({
    data: item?.variants ?? [],
    columns: variantColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  useEffect(() => {
    if (data && data.data) {
      const variants = data.data.variants.map((variant: Variant) => ({
        id: variant.id,
        name: variant.name,
        article: variant.article,
        ean13: variant.ean13,
      }));

      setItem({
        id: data.data.id,
        name: data.data.name,
        description: data.data.description,
        variants: variants,
      });
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <PageMetadata
        title={item.name}
        breadcrumbs={[
          { href: "/items", label: "Товары" },
          { label: item.name },
        ]}
        actions={[
          <DeleteButton onClick={() => {}} />,
          <EditButton onClick={() => {}} />,
        ]}
      />
      <PageBlockRow>
        <PageBlock title="Информация о товаре">
          <BlockTextElement label="Название" value={item.name} />
          <BlockTextElement label="Описание" value={item.description ?? ""} />
          <BlockTextElement label="ID" value={item.id} />
        </PageBlock>
        <PageBlock title="Параметры упаковки">
          <BlockRow>
            <BlockTextElement label="Ширина" value="100" unitLabel="мм" />
            <BlockTextElement label="Высота" value="100" unitLabel="мм" />
            <BlockTextElement label="Длина" value="100" unitLabel="мм" />
          </BlockRow>
          <BlockTextElement label="Вес" value="0.01" unitLabel="кг" />
        </PageBlock>
      </PageBlockRow>
      <PageBlockRow>
        <PageBlock title="Варианты">
          {/* Custom Table */}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    alert(row.original.id);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PageBlock>
      </PageBlockRow>
    </div>
  );
}
