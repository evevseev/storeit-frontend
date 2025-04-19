"use client";
import WarehouseStructure from "@/components/warehouse-structure";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import {
  OrganizationUnit,
  StorageGroup,
} from "@/components/warehouse-structure/types";
import { useState, useEffect } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import type { paths } from "@/lib/api/storeit";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type ApiStorageGroup =
  paths["/storage-groups"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];
type ApiUnit =
  paths["/units"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export default function StoragePage() {
  const queryClient = useApiQueryClient();
  const {
    data: unitsData,
    error: unitsError,
    isLoading: unitsIsLoading,
  } = queryClient.useQuery("get", "/units");

  const {
    data: storageGroupsData,
    error: storageGroupsError,
    isLoading: storageGroupsIsLoading,
  } = queryClient.useQuery("get", "/storage-groups");

  const isLoading = unitsIsLoading || storageGroupsIsLoading;
  const error = unitsError || storageGroupsError;

  const [units, setUnits] = useState<OrganizationUnit[]>([]);

  // Transform storage groups into a hierarchical structure
  const buildStorageGroupTree = (
    unitId: string,
    parentId: string | null = null
  ): StorageGroup[] => {
    const groupsForParent =
      storageGroupsData?.data.filter(
        (group: ApiStorageGroup) =>
          group.unitId === unitId && group.parentId === parentId
      ) || [];

    return groupsForParent.map((group: ApiStorageGroup) => ({
      id: group.id,
      unitId: group.unitId,
      parentId: group.parentId,
      name: group.name,
      alias: group.alias,
      children: buildStorageGroupTree(unitId, group.id),
    }));
  };

  useEffect(() => {
    if (unitsData) {
      const transformedData: OrganizationUnit[] = unitsData.data.map(
        (unit: ApiUnit) => ({
          ...unit,
          children: buildStorageGroupTree(unit.id),
        })
      );
      setUnits(transformedData);
    }
  }, [unitsData, storageGroupsData]);

  useEffect(() => {
    if (error) {
      toast.error(`Ошибка загрузки: ${error.message}`);
    }
  }, [error]);

  return (
    <>
      <PageMetadata
        title="Структура склада"
        breadcrumbs={[{ label: "Хранение" }]}
        actions={[
          <Button asChild className="whitespace-nowrap" variant="default">
            <Link href="/units">Управление подразделениями</Link>
          </Button>,
        ]}
      />
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <div className="pl-6 space-y-2">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <Skeleton key={j} className="h-10 w-[95%]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <WarehouseStructure units={units} />
      )}
    </>
  );
}
