"use client";

import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
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
import { CopyableText } from "@/components/ui/copyable-text";
import { defaultColumn, EditedCellValue } from "@/lib/tanstack-table";

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
  cell?: {
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

const buildStorageTree = (instances: Instance[]): StorageNode[] => {
  const nodeMap = new Map<string, StorageNode>();
  const result: StorageNode[] = [];

  instances.forEach((instance) => {
    let currentPath: StorageNode[] = [];
    const path = instance.cell?.cellPath ?? [];

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
  const [isVariantsEditing, setIsVariantsEditing] = useState(false);
  const [editedVariantValues, setEditedVariantValues] = useState<EditedCellValue[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<RowSelectionState>({});

  const { data, isLoading, isError } = client.useQuery("get", "/items/{id}", {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const createInstanceMutation = client.useMutation(
    "post",
    "/items/{itemId}/instances"
  );
  const deleteInstanceMutation = client.useMutation(
    "delete",
    "/instances/{instanceId}"
  );

  const { mutate: updateVariant } = client.useMutation(
    "put",
    "/items/{id}/variants/{variantId}"
  );

  const { mutate: deleteVariant } = client.useMutation(
    "delete",
    "/items/{id}/variants/{variantId}"
  );

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
          toast.success("Экземпляр успешно удален");
          globalClient.invalidateQueries({ queryKey: ["get", "/items/{id}"] });
        },
        onError: (error) => {
          toast.error("Ошибка при удалении экземпляра", {
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
          toast.success("Экземпляр успешно создан");
          globalClient.invalidateQueries({ queryKey: ["get", "/items/{id}"] });
          // Reset form
          setSelectedVariant("");
          setCellUuid("");
          setIsDialogOpen(false);
        },
        onError: (error) => {
          toast.error("Ошибка при создании экземпляра", {
            description: error.error?.message || "Неизвестная ошибка",
          });
        },
      }
    );
  };

  const handleEditVariants = () => {
    setIsVariantsEditing(true);
    setEditedVariantValues([]);
  };

  const handleSaveVariants = () => {
    const editsByVariant = editedVariantValues.reduce((acc, edit) => {
      const variant = data?.data?.variants[edit.rowIndex];
      if (!variant) return acc;

      if (!acc[variant.id]) {
        acc[variant.id] = { ...variant };
      }

      switch (edit.columnId) {
        case "name":
          acc[variant.id].name = edit.value as string;
          break;
        case "article":
          acc[variant.id].article = edit.value as string;
          break;
        case "ean13":
          acc[variant.id].ean13 = edit.value as number;
          break;
      }

      return acc;
    }, {} as Record<string, Variant>);

    Object.entries(editsByVariant).forEach(([variantId, updatedVariant]) => {
      updateVariant(
        {
          params: {
            path: {
              id: id as string,
              variantId,
            },
          },
          body: updatedVariant,
        },
        {
          onSuccess: () => {
            globalClient.invalidateQueries({
              queryKey: ["get", "/items/{id}"],
            });
          },
          onError: (error: { error: { message: string } }) => {
            toast.error("Ошибка при обновлении варианта", {
              description: error.error?.message || "Неизвестная ошибка",
            });
          },
        }
      );
    });

    if (Object.keys(editsByVariant).length > 0) {
      toast.success("Изменения сохранены");
    }

    setIsVariantsEditing(false);
    setEditedVariantValues([]);
  };

  const handleCancelVariants = () => {
    setIsVariantsEditing(false);
    setEditedVariantValues([]);
    globalClient.invalidateQueries({
      queryKey: ["get", "/items/{id}"],
    });
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
      meta: {
        isDisplay: true,
      },
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

  const variantColumns = [
    variantColumnHelper.accessor("name", {
      header: "Название",
    }),
    variantColumnHelper.accessor("article", {
      header: "Артикул",
    }),
    variantColumnHelper.accessor("ean13", {
      header: "EAN13",
    }),
    variantColumnHelper.display({
      id: "actions",
      meta: {
        isDisplay: true,
      },
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

  const handleDeleteVariant = (variantId: string) => {
    deleteVariant(
      {
        params: {
          path: {
            id: id as string,
            variantId,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Вариант успешно удален");
          globalClient.invalidateQueries({
            queryKey: ["get", "/items/{id}"],
          });
        },
        onError: (error: { error: { message: string } }) => {
          toast.error("Ошибка при удалении варианта", {
            description: error.error?.message || "Неизвестная ошибка",
          });
        },
      }
    );
  };

  // Update the actions column to use delete handler
  variantColumns[3].cell = (props) => (
    <div className="text-right">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteVariant(props.row.original.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const table = useReactTable({
    data: data?.data?.variants ?? [],
    columns: variantColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn,
    meta: {
      addEditedValue: (value: EditedCellValue) => {
        setEditedVariantValues((prev) => {
          const filtered = prev.filter(
            (edit) =>
              !(
                edit.rowIndex === value.rowIndex &&
                edit.columnId === value.columnId
              )
          );
          return [...filtered, value];
        });
      },
    },
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
          <BlockTextElement label="ID">
            <CopyableText>{data.data.id}</CopyableText>
          </BlockTextElement>
        </Block>
      </BlockedPageRow>
      <BlockedPageRow>
        <Block title="Варианты">
          <div className="flex justify-end py-4">
            {isVariantsEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelVariants}>
                  <X className="mr-2 h-4 w-4" />
                  Отмена
                </Button>
                <Button size="sm" onClick={handleSaveVariants}>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={handleEditVariants}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            )}
          </div>
          <div className="border rounded-md">
            <div className="overflow-x-auto">
              <DataTable
                columns={variantColumns}
                data={data?.data?.variants}
                defaultColumn={defaultColumn}
                editMode={isVariantsEditing}
                meta={{
                  addEditedValue: (value: EditedCellValue) => {
                    setEditedVariantValues((prev) => {
                      const filtered = prev.filter(
                        (edit) =>
                          !(
                            edit.rowIndex === value.rowIndex &&
                            edit.columnId === value.columnId
                          )
                      );
                      return [...filtered, value];
                    });
                  },
                }}
              />
            </div>
          </div>
        </Block>
      </BlockedPageRow>
      <Block title="Экземпляры">
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Создать экземпляр
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать экземпляр товара</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="variant">Вариант</Label>
                  <Select
                    value={selectedVariant}
                    onValueChange={setSelectedVariant}
                  >
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
                  <Label htmlFor="cell">ID ячейки</Label>
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
