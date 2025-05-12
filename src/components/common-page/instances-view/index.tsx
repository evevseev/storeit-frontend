import { DataTable } from "@/components/data-table";
import { Block } from "../block";
import { Row, createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { components } from "@/lib/api/storeit";
import { CopyableText } from "@/components/ui/copyable-text";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Instance = {
  id: string;
  status: "available" | "reserved" | "consumed";
  affectedByTaskId: string | null;

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
      objectType: "cell" | "cells_group" | "storage_group" | "unit";
    }[];
  };
};

type StorageNode = {
  id: string;
  name: string;
  alias: string;

  type: string;

  instanceCount: number;

  cellPosition?: {
    row: number;
    level: number;
    position: number;
  };

  subRows?: StorageNode[];
  instances?: components["schemas"]["InstanceFull"][];
};

const columnHelper = createColumnHelper<StorageNode>();

const filterInstances = (
  instances: components["schemas"]["InstanceFull"][],
  filters: {
    storageGroupId?: string;
    unitId?: string;
    itemId?: string;
    variantId?: string;
    instanceId?: string;
    cellId?: string;
  }
) => {
  return instances.filter((instance) => {
    if (filters.instanceId && instance.id !== filters.instanceId) return false;
    if (filters.variantId && instance.variant.id !== filters.variantId) return false;
    if (filters.cellId && instance.cell?.id !== filters.cellId) return false;
    
    // Check storage hierarchy through cellPath
    if (instance.cell?.cellPath) {
      const path = instance.cell.cellPath;
      if (filters.storageGroupId && !path.some(p => p.id === filters.storageGroupId)) return false;
      if (filters.unitId && !path.some(p => p.id === filters.unitId)) return false;
    }

    return true;
  });
};

export default function InstancesView({
  storageGroupId,
  unitId,
  itemId,
  variantId,
  instanceId,
  cellId,
  expanded = false,
}: {
  storageGroupId?: string;
  unitId?: string;
  itemId?: string;
  variantId?: string;
  instanceId?: string;
  cellId?: string;
  expanded?: boolean;
}) {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const router = useRouter();
  const { data } = client.useQuery("get", "/instances");

  const deleteInstanceMutation = client.useMutation(
    "delete",
    "/instances/{instanceId}"
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

  const columns = [
    columnHelper.accessor("name", {
      header: "Название",
      cell: ({ row, getValue }) => {
        const value = getValue();
        const indent = row.depth * 24;

        return (
          <div
            style={{ paddingLeft: `${indent}px` }}
            className="flex items-center gap-2"
          >
            {row.original.type === "instance" ? (
              <span></span>
            ) : (
              <>
                {row.original.instanceCount > 0 && (
                  <>
                    <span>{value}</span>
                    <span className="text-muted-foreground text-sm">
                      ({row.original.instanceCount})
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("alias", {
      header: "Алиас",
    }),
    columnHelper.accessor("cellPosition", {
      header: "Позиция ячейки",
      cell: ({ row }) => {
        const pos = row.original.cellPosition;
        if (!pos || row.original.type !== "instance") return null;
        return `${pos.row}:${pos.level}:${pos.position}`;
      },
    }),
    columnHelper.accessor("instances", {
      header: "ID объекта",
      cell: ({ row }) => {
        const instances = row.original.instances;
        if (!instances?.length || row.original.type !== "instance") return null;
        return <CopyableText>{instances[0].id}</CopyableText>;
      },
    }),
    columnHelper.accessor("instances", {
      id: "variantName",
      header: "Название варианта",
      cell: ({ row }) => {
        const instances = row.original.instances;
        if (!instances?.length || row.original.type !== "instance") return null;
        return instances[0].variant.name;
      },
    }),
    columnHelper.display({
      id: "actions",
      meta: {
        isDisplay: true,
      },
      cell: ({ row }) => {
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
    }),
  ];

  const buildStorageTree = (
    instances: components["schemas"]["InstanceFull"][]
  ): StorageNode[] => {
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
            id: `${instance.cell?.id}-${instance.id}`,
            name: instance.variant.name,
            alias: instance.cell?.alias ?? "",
            type: "instance",
            instanceCount: 1,
            cellPosition: {
              row: instance.cell?.row ?? 0,
              level: instance.cell?.level ?? 0,
              position: instance.cell?.position ?? 0,
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

  const handleRowClick = (row: StorageNode) => {
    if (row.type === "instance" && row.instances?.[0]) {
      router.push(`/instances/${row.instances[0].id}`);
    }
  };

  return (
    <Block title="Экземпляры">
      {/* <div className="flex justify-end mb-4">
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
      </div> */}
      <DataTable
        columns={columns}
        data={buildStorageTree(
          filterInstances(data?.data ?? [], {
            storageGroupId,
            unitId,
            itemId,
            variantId,
            instanceId,
            cellId,
          })
        )}
        getRowCanExpand={(row) => Boolean(row.original.subRows?.length)}
        getSubRows={(row) => row.subRows}
        getRowId={(row) => row.id}
        expanded
        onRowClick={handleRowClick}
      />
    </Block>
  );
}
