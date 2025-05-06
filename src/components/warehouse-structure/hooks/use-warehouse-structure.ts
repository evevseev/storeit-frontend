import { useState, useEffect, useMemo } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { OrganizationUnit, StorageGroup, CellGroup } from "../types";
import { ApiStorageGroup, ApiUnit, ApiCellGroup } from "../api-types";

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

  const {
    data: cellsGroupsData,
    error: cellsGroupsError,
    isLoading: cellsGroupsIsLoading,
  } = queryClient.useQuery("get", "/cells-groups");

  const isLoading = unitsIsLoading || storageGroupsIsLoading || cellsGroupsIsLoading;
  const error = unitsError || storageGroupsError || cellsGroupsError;

  // Transform storage groups into a hierarchical structure
  const buildStorageGroupTree = useMemo(() => (
    unitId: string,
    parentId: string | null = null
  ): StorageGroup[] => {
    if (!storageGroupsData?.data || !cellsGroupsData?.data) return [];

    // Get storage groups for this parent
    const storageGroupsForParent =
      storageGroupsData.data.filter(
        (group: ApiStorageGroup) =>
          group.unitId === unitId && group.parentId === parentId
      );

    // Transform storage groups
    return storageGroupsForParent.map((group: ApiStorageGroup) => {
      // Get cells groups for this storage group
      const cellGroups = cellsGroupsData.data
        .filter((cg: ApiCellGroup) => cg.storageGroupId === group.id)
        .map((cg: ApiCellGroup): CellGroup => ({
          id: cg.id,
          unitId: cg.unitId,
          storageGroupId: cg.storageGroupId,
          name: cg.name,
          alias: cg.alias,
          type: 'cellGroup',
        }));

      // Recursively build the tree for nested storage groups
      const childStorageGroups = buildStorageGroupTree(unitId, group.id);

      return {
        id: group.id,
        unitId: group.unitId,
        parentId: group.parentId,
        name: group.name,
        alias: group.alias,
        type: 'storageGroup',
        children: [...childStorageGroups, ...cellGroups],
      };
    });
  }, [storageGroupsData?.data, cellsGroupsData?.data]);

  useEffect(() => {
    if (unitsData?.data && storageGroupsData?.data && cellsGroupsData?.data) {
      const transformedData: OrganizationUnit[] = unitsData.data.map(
        (unit: ApiUnit) => ({
          id: unit.id,
          name: unit.name,
          alias: unit.alias,
          address: unit.address,
          children: buildStorageGroupTree(unit.id),
        })
      );
      setUnits(transformedData);
    }
  }, [unitsData?.data, storageGroupsData?.data, cellsGroupsData?.data, buildStorageGroupTree]);

  useEffect(() => {
    if (error) {
      toast.error(`Ошибка загрузки: ${(error as any)?.error?.message || 'Неизвестная ошибка'}`);
    }
  }, [error]);

  return {
    units,
    isLoading,
    error,
  };
} 