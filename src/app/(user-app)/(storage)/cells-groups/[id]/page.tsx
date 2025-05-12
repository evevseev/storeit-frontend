"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import GroupInfoCard from "@/components/cells-group/group-info-card";
import { useParams } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import { Block, BlockedPage } from "@/components/common-page/block";
import GroupCellsList from "@/components/cells-group/group-cells-list";
import PrintButton from "@/components/print-button";
import { getGroupLabel } from "@/hooks/use-print-labels";

export default function CellsGroupPage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const { data: group } = client.useQuery("get", "/cells-groups/{groupId}", {
    params: {
      path: {
        groupId: id as string,
      },
    },
  });

  const breadcrumbs = [
    { label: "Склад", href: "/storage" },
    { label: "Группы ячеек" },
    {
      label: group?.data.name ?? "Группа ячеек",
      href: `/storage/cells-groups/${id}`,
    },
  ];

  return (
    <BlockedPage>
      <PageMetadata
        title={group?.data.name ?? "Группа ячеек"}
        breadcrumbs={breadcrumbs}
        actions={[
          group?.data && (
            <PrintButton
              label={getGroupLabel({
                id: group.data.id,
                name: group.data.name,
                alias: group.data.alias,
              })}
            />
          ),
        ]}
      />
      <GroupInfoCard id={id} />
      <GroupCellsList cellsGroupId={id} />
      <HistoryTable objectType={ObjectType.CellsGroup} objectId={id} />
    </BlockedPage>
  );
}
