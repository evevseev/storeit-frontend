"use client";

import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
} from "@tanstack/react-table";
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
import { DataTable } from "@/components/data-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HistoryTable } from "@/components/history-table";
import { ObjectType } from "@/components/history-table/types";

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

type Instance = {
  id: string;
  status: "available" | "reserved" | "consumed";
  variant: {
    id: string;
    name: string;
  };
  cell: {
    id: string;
    alias: string;
    row: number;
    level: number;
    position: number;
    cellPath: {
      id: string;
      name: string;
      alias: string;
      objectType: "cell" | "cells_group" | "storage_group";
    }[];
  };
};

type StorageNode = {
  id: string;
  name: string;
  alias: string;
  type: string;
  instanceCount: number;
  cellAlias?: string;
  cellPosition?: {
    row: number;
    level: number;
    position: number;
  };
  subRows?: StorageNode[];
  instances?: Instance[];
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

const buildStorageTree = (instances: Instance[]): StorageNode[] => {
  const nodeMap = new Map<string, StorageNode>();

  instances.forEach((instance) => {
    let currentPath: StorageNode[] = [];
    // Process path from general to specific
    const path = instance.cell.cellPath;

    path.forEach((pathItem, index) => {
      const nodeId = pathItem.id;
      let node = nodeMap.get(nodeId);

      if (!node) {
        node = {
          id: nodeId,
          name: pathItem.name,
          alias: pathItem.alias,
          type: pathItem.objectType,
          instanceCount: 0,
          subRows: [],
        };
        nodeMap.set(nodeId, node);

        if (currentPath.length > 0) {
          currentPath[currentPath.length - 1].subRows?.push(node);
        }
      }

      if (index === path.length - 1) {
        const cellNode: StorageNode = {
          id: instance.cell.id,
          name: instance.cell.alias,
          alias: instance.cell.alias,
          type: "cell",
          instanceCount: 1,
          cellAlias: instance.cell.alias,
          cellPosition: {
            row: instance.cell.row,
            level: instance.cell.level,
            position: instance.cell.position,
          },
          instances: [instance],
        };
        node.subRows = node.subRows || [];

        const existingCell = node.subRows.find(
          (cell) => cell.id === cellNode.id
        );
        if (existingCell) {
          existingCell.instanceCount++;
          existingCell.instances = existingCell.instances || [];
          existingCell.instances.push(instance);
        } else {
          node.subRows.push(cellNode);
        }
      }

      node.instanceCount++;
      currentPath.push(node);
    });
  });

  // Return only root nodes (those that don't appear as children)
  const allNodes = Array.from(nodeMap.values());
  const childNodes = new Set(
    allNodes.flatMap((node) => node.subRows || []).map((node) => node.id)
  );
  return allNodes.filter((node) => !childNodes.has(node.id));
};

const storageColumns = [
  {
    accessorKey: "name",
    header: "Название",
    cell: ({
      row,
      getValue,
    }: {
      row: Row<StorageNode>;
      getValue: () => string;
    }) => {
      const value = getValue();
      const indent = row.depth * 24;

      return (
        <div
          style={{ paddingLeft: `${indent}px` }}
          className="flex items-center gap-2"
        >
          <span>{value}</span>
          {row.original.instanceCount > 0 && (
            <span className="text-muted-foreground text-sm">
              ({row.original.instanceCount})
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "alias",
    header: "Алиас",
  },
  {
    accessorKey: "cellPosition",
    header: "Позиция ячейки",
    cell: ({ row }: { row: Row<StorageNode> }) => {
      const pos = row.original.cellPosition;
      if (!pos || row.original.type !== "cell") return null;
      return `${pos.row}:${pos.level}:${pos.position}`;
    },
  },
  {
    accessorKey: "instanceId",
    header: "ID объекта",
    cell: ({ row }: { row: Row<StorageNode> }) => {
      const instances = row.original.instances;
      if (!instances?.length || row.original.type !== "cell") return null;

      return instances.map((instance: Instance) => (
        <div key={instance.id}>{instance.id}</div>
      ));
    },
  },
  {
    accessorKey: "variantName",
    header: "Название варианта",
    cell: ({ row }: { row: Row<StorageNode> }) => {
      const instances = row.original.instances;
      if (!instances?.length || row.original.type !== "cell") return null;

      return instances.map((instance: Instance) => (
        <div key={instance.id}>{instance.variant.name}</div>
      ));
    },
  },
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
        <DataTable
          columns={storageColumns}
          data={buildStorageTree(data.data.items)}
          getRowCanExpand={(row) => Boolean(row.original.subRows?.length)}
          getSubRows={(row) => row.subRows}
        />
      </Block>
      <Block title="История изменений">
        <HistoryTable objectType={ObjectType.Item} objectId={id as string} />
      </Block>
    </div>
  );
}
