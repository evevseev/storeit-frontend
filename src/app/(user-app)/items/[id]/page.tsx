"use client";

import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
} from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
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
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
  const result: StorageNode[] = [];

  instances.forEach((instance) => {
    let currentPath: StorageNode[] = [];
    const path = instance.cell.cellPath;

    // Create or get nodes for the path
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
        } else {
          result.push(node);
        }
      }

      if (index === path.length - 1) {
        // Create a separate node for each instance
        const instanceNode: StorageNode = {
          id: `${instance.cell.id}-${instance.id}`,
          name: instance.variant.name,
          alias: instance.cell.alias,
          type: "instance",
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
        node.subRows.push(instanceNode);
      }

      node.instanceCount++;
      currentPath.push(node);
    });
  });

  return result;
};

export default function ItemPage() {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [cellUuid, setCellUuid] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isError } = client.useQuery("get", "/items/{id}", {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const createInstanceMutation = client.useMutation("post", "/items/{itemId}/instances");
  const deleteInstanceMutation = client.useMutation("delete", "/instances/{instanceId}");

  const handleDeleteInstance = async (instanceId: string) => {
    deleteInstanceMutation.mutate(
      {
        params: {
          path: {
            instanceId: instanceId,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Инстанс успешно удален");
          globalClient.invalidateQueries({ queryKey: ["get", "/items/{id}"] });
        },
        onError: (error) => {
          toast.error("Ошибка при удалении инстанса", {
            description: error.error?.message || "Неизвестная ошибка",
          });
        },
      }
    );
  };

  const handleCreateInstance = async () => {
    if (!selectedVariant || !cellUuid) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    createInstanceMutation.mutate(
      {
        params: {
          path: {
            itemId: id as string,
          },
        },
        body: {
          variantId: selectedVariant,
          cellId: cellUuid,
        },
      },
      {
        onSuccess: () => {
          toast.success("Инстанс успешно создан");
          globalClient.invalidateQueries({ queryKey: ["get", "/items/{id}"] });
          // Reset form
          setSelectedVariant("");
          setCellUuid("");
          setIsDialogOpen(false);
        },
        onError: (error) => {
          toast.error("Ошибка при создании инстанса", {
            description: error.error?.message || "Неизвестная ошибка",
          });
        },
      }
    );
  };

  const getStorageColumns = () => [
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
        if (!pos || row.original.type !== "instance") return null;
        return `${pos.row}:${pos.level}:${pos.position}`;
      },
    },
    {
      accessorKey: "instanceId",
      header: "ID объекта",
      cell: ({ row }: { row: Row<StorageNode> }) => {
        const instances = row.original.instances;
        if (!instances?.length || row.original.type !== "instance") return null;
        return instances[0].id;
      },
    },
    {
      accessorKey: "variantName",
      header: "Название варианта",
      cell: ({ row }: { row: Row<StorageNode> }) => {
        const instances = row.original.instances;
        if (!instances?.length || row.original.type !== "instance") return null;
        return instances[0].variant.name;
      },
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }: { row: Row<StorageNode> }) => {
        const instances = row.original.instances;
        if (!instances?.length || row.original.type !== "instance") return null;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteInstance(instances[0].id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

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
      </BlockedPageRow>
      <BlockedPageRow>
        <Block title="Варианты">
          <div className="flex justify-end mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать инстанс
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать инстанс товара</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="variant">Вариант</Label>
                    <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вариант" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.data.variants.map((variant: Variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cell">UUID ячейки</Label>
                    <Input
                      id="cell"
                      value={cellUuid}
                      onChange={(e) => setCellUuid(e.target.value)}
                      placeholder="Введите UUID ячейки"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreateInstance}
                    disabled={createInstanceMutation.isPending}
                  >
                    {createInstanceMutation.isPending ? "Создание..." : "Создать"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
          columns={getStorageColumns()}
          data={buildStorageTree(data.data.items)}
          getRowCanExpand={(row) => Boolean(row.original.subRows?.length)}
          getSubRows={(row) => row.subRows}
        />
      </Block>
      <HistoryTable objectType={ObjectType.Item} objectId={id as string} />
    </div>
  );
}
