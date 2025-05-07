"use client";

import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Block } from "@/components/common-page/block";
import CellsList from "./cells-list";
import { Cell } from "./cells-list";
import { toast } from "sonner";

interface GroupCellsListProps {
  id: string;
}

export default function GroupCellsList({ id }: GroupCellsListProps) {
  const client = useApiQueryClient();
  const { data: cells, isPending } = client.useQuery(
    "get",
    "/cells-groups/{groupId}/cells",
    {
      params: {
        path: {
          groupId: id,
        },
      },
    }
  );

  const mappedCells: Cell[] = (cells?.data ?? []).map(cell => ({
    id: cell.id,
    alias: cell.alias,
    rackNumber: cell.row,
    levelNumber: cell.level,
    positionNumber: cell.position,
    cellKind: {
      id: "default",
      name: "Стандартная",
      height: 100,
      width: 100,
      depth: 100,
      maxWeight: 1000
    }
  }));

  const handlePrintLabels = (selectedCells: Cell[]) => {
    // Here you can implement the actual printing logic
    // For now, we'll just show a toast message
    toast.success(`Подготовка к печати этикеток для ${selectedCells.length} ячеек`);
    
    // Example of how to prepare data for printing
    const labelsData = selectedCells.map(cell => ({
      alias: cell.alias,
      position: `${cell.rackNumber}-${cell.levelNumber}-${cell.positionNumber}`,
      dimensions: `${cell.cellKind.height}x${cell.cellKind.width}x${cell.cellKind.depth}`,
      maxWeight: cell.cellKind.maxWeight
    }));

    console.log('Labels data:', labelsData);
    // TODO: Implement actual printing logic
  };

  return (
    <Block title="Ячейки" isLoading={isPending}>
      <CellsList cells={mappedCells} onPrintLabels={handlePrintLabels} />
    </Block>
  );
}
