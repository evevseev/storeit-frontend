import { useState, useEffect, useMemo } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { OrganizationUnit, StorageGroup, CellGroup } from "../types";
// import { ApiStorageGroup, ApiUnit, ApiCellGroup } from "../api-types";

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

  const buildStorageGroupTree = useMemo(() => (
    unitId: string,
    parentId: string | null = null
  ): StorageGroup[] => {
    if (!storageGroupsData?.data || !cellsGroupsData?.data) return [];

    const storageGroupsForParent =
      storageGroupsData.data.filter(
        (group) =>
          group.unitId === unitId && group.parentId === parentId
      );


    return storageGroupsForParent.map((group) => {
      const cellGroups = cellsGroupsData.data
        .filter((cg) => cg.storageGroupId === group.id)
        .map((cg): CellGroup => ({
          id: cg.id,
          unitId: cg.unitId,
          storageGroupId: cg.storageGroupId,
          name: cg.name,
          alias: cg.alias,
          type: 'cellGroup',
        }));

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
        (unit) => ({
          id: unit.id,
          name: unit.name,
          alias: unit.alias,
          address: unit.address,
          type: "organizationUnit" as const,
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