"use client";
import WarehouseStructure from "@/components/warehouse-structure";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrganizationUnit, StorageGroup } from "@/components/warehouse-structure/types";
import { useState, useEffect } from "react";
import queryClient from "@/lib/api/client";
import type { paths } from "@/lib/api/storeit";

type ApiStorageGroup = paths["/storage-groups"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];
type ApiUnit = paths["/units"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export default function StoragePage() {
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
        (group: ApiStorageGroup) => group.unitId === unitId && group.parentId === parentId
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
      const transformedData: OrganizationUnit[] = unitsData.data.map((unit: ApiUnit) => ({
        ...unit,
        children: buildStorageGroupTree(unit.id),
      }));
      setUnits(transformedData);
    }
  }, [unitsData, storageGroupsData]);

  return (
    <>
      <PageMetadata
        title="Структура склада"
        breadcrumbs={[{ label: "Хранение" }]}
        actions={[
          <Button className="whitespace-nowrap" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Создать Подразделение
          </Button>,
        ]}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!isLoading && <WarehouseStructure units={units} />}
    </>
  );
}
