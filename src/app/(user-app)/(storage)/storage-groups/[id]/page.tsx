"use client";
import {
  Block,
  BlockedPage,
  BlockTextElement,
} from "@/components/common-page/block";
import { useParams } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import InstancesView from "@/components/common-page/instances-view";
import PrintButton from "@/components/print-button";
import { getGroupLabel } from "@/hooks/use-print-labels";

export default function StorageGroupPage() {
  const { id } = useParams() as { id: string };

  const client = useApiQueryClient();
  const { data: storageGroup, isPending } = client.useQuery(
    "get",
    "/storage-groups/{id}",
    {
      params: {
        path: { id: id as string },
      },
    }
  );

  return (
    <BlockedPage>
      <PageMetadata
        title={storageGroup?.data.name ?? "Группа хранения"}
        breadcrumbs={[
          {
            label: "Склад",
            href: "/storage",
          },
          {
            label: "Группы хранения",
          },
          {
            label: storageGroup?.data.name ?? "Группа хранения",
            href: `/storage-groups/${id}`,
          },
        ]}
        actions={[
          storageGroup?.data && (
            <PrintButton
              label={getGroupLabel({
                id: storageGroup.data.id,
                name: storageGroup.data.name,
                alias: storageGroup.data.alias,
              })}
            />
          ),
          <Button asChild>
            <Link href={`/storage-groups/${id}/edit`}>
              <Pencil />
              Редактировать
            </Link>
          </Button>,
        ]}
      />
      <Block title="Основная информация" isLoading={isPending}>
        <BlockTextElement label="ID" value={storageGroup?.data.id} copyable />
        <BlockTextElement label="Название" value={storageGroup?.data.name} />
        <BlockTextElement label="Алиас" value={storageGroup?.data.alias} />
      </Block>
      <InstancesView storageGroupId={id} />
      <HistoryTable
        objectType={ObjectType.StorageGroup}
        objectId={id as string}
      />
    </BlockedPage>
  );
}
