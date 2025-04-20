"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef, flexRender, getCoreRowModel } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  Block,
  BlockTextElement,
  BlockCustomElement,
  BlockRow,
  BlockedPageRow,
} from "@/components/common-page/block";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReactTable, createColumnHelper } from "@tanstack/react-table";
import { useApiQueryClient } from "@/hooks/use-api-query-client";

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
  const client = useApiQueryClient();
  const { id } = useParams();

  const { data, isLoading, isError } = client.useQuery("get", "/items/{id}", {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const table = useReactTable({
    data: data?.data?.variants ?? [],
    columns: variantColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  useEffect(() => {
    if (data && data.data) {
      const variants = data.data.variants?.map((variant: Variant) => ({
        id: variant.id,
        name: variant.name,
        article: variant.article,
        ean13: variant.ean13,
      }));
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!data) {
    return <div>Data not found</div>;
  }

  if (!data.data) {
    return <div>Data not found</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <PageMetadata
        title={data.data.name}
        breadcrumbs={[
          { href: "/items", label: "Товары" },
          { label: data.data.name },
        ]}
        // actions={[
        //   <DeleteButton onClick={() => {}} />,
        //   <EditButton onClick={() => {}} />,
        // ]}
      />
      <BlockedPageRow>
        <Block title="Информация о товаре">
          <BlockTextElement label="Название" value={data.data.name} />
          <BlockTextElement
            label="Описание"
            value={data.data.description ?? ""}
          />
          <BlockTextElement label="ID" value={data.data.id} />
        </Block>
        <Block title="Параметры упаковки">
          <BlockRow>
            <BlockTextElement label="Ширина" value="100" unitLabel="мм" />
            <BlockTextElement label="Высота" value="100" unitLabel="мм" />
            <BlockTextElement label="Длина" value="100" unitLabel="мм" />
          </BlockRow>
          <BlockTextElement label="Вес" value="0.01" unitLabel="кг" />
        </Block>
      </BlockedPageRow>
      <BlockedPageRow>
        <Block title="Варианты">
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
        </Block>
      </BlockedPageRow>
      <Block title="Инстансы">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Объекты склада</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.instances.map((instance) => (
              <TableRow key={instance.id}>
                <TableCell>
                  {instance.cellPath.map((cell) => cell.name).join(" / ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Block>
    </div>
  );
}
