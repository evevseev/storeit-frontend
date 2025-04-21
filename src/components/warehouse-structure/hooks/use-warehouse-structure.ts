import { useState, useEffect } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { OrganizationUnit, StorageGroup } from "../types";
import { ApiStorageGroup, ApiUnit } from "../api-types";

export function useWarehouseStructure() {
  const queryClient = useApiQueryClient();
  const [units, setUnits] = useState<OrganizationUnit[]>([]);

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

  return {
    units,
    isLoading,
    error,
  };
} 