"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import CellsList from "@/components/cells-group/cells-list";
import GroupInfoCard from "@/components/cells-group/group-info-card";
import { useParams } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { HistoryTable } from "@/components/history-table";
import { ObjectType } from "@/components/history-table/types";
import { Block, BlockedPage } from "@/components/common-page/block";
import GroupCellsList from "@/components/cells-group/group-cells-list";

export default function CellsGroupPage() {
  const { id } = useParams();

  const breadcrumbs = [
    { label: "Хранение" },
    { label: "Москва" },
    { label: "1ый этаж" },
    { label: `Группа ячеек #${id}` },
  ];

  return (
    <BlockedPage>
      <PageMetadata title={`Группа ячеек #${id}`} breadcrumbs={breadcrumbs} />
      <GroupInfoCard id={id as string} />
      <GroupCellsList id={id as string} />
      <Block title="История изменений">
        <HistoryTable
          objectType={ObjectType.CellsGroup}
          objectId={id as string}
        />
      </Block>
    </BlockedPage>
  );
}
