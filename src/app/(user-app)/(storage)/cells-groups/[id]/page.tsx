"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import GroupInfoCard from "@/components/cells-group/group-info-card";
import { useParams, useRouter } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import { Block, BlockedPage } from "@/components/common-page/block";
import GroupCellsList from "@/components/cells-group/group-cells-list";
import PrintButton from "@/components/print-button";
import { getGroupLabel } from "@/hooks/use-print-labels";
import { DeleteDialog } from "@/components/dialogs/deletion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import InstancesView from "@/components/common-page/instances-view";

export default function CellsGroupPage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const router = useRouter();
  const { data: group } = client.useQuery("get", "/cells-groups/{groupId}", {
    params: {
      path: {
        groupId: id as string,
      },
    },
  });

  const deleteCellsGroupMutation = client.useMutation(
    "delete",
    "/cells-groups/{groupId}"
  );

  const handleDelete = () => {
    deleteCellsGroupMutation.mutate(
      { params: { path: { groupId: id } } },
      {
        onSuccess: () => {
          toast.success("Группа ячеек удалена");
          globalClient.invalidateQueries({
            queryKey: ["get", "/cells-groups"],
          });
          router.push("/storage");
        },
        onError: (error) => {
          toast.error("Ошибка при удалении группы ячеек", {
            description: error.error.message,
          });
        },
      }
    );
  };

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
          <DeleteDialog
            firstText={`Вы действительно желаете удалить группу ячеек ${group?.data.name}?`}
            buttonLabel="Удалить группу ячеек"
            onDelete={handleDelete}
          />,
          group?.data && (
            <PrintButton
              label={getGroupLabel({
                id: group.data.id,
                name: group.data.name,
                alias: group.data.alias,
              })}
            />
          ),
          <Button asChild>
            <Link href={`/cells-groups/${id}/edit`}>
              <Pencil />
              Редактировать
            </Link>
          </Button>,
        ]}
      />
      <GroupInfoCard id={id} />
      <GroupCellsList cellsGroupId={id} />
      <InstancesView cellsGroupId={id} />
      <HistoryTable objectType={ObjectType.CellsGroup} objectId={id} />
    </BlockedPage>
  );
}
