"use client";
import {
  Block,
  BlockedPage,
  BlockTextElement,
} from "@/components/common-page/block";
import { useParams, useRouter } from "next/navigation";
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
import { DeleteDialog } from "@/components/dialogs/deletion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function StorageGroupPage() {
  const { id } = useParams() as { id: string };

  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const router = useRouter();
  const { data: storageGroup, isPending } = client.useQuery(
    "get",
    "/storage-groups/{id}",
    {
      params: {
        path: { id: id as string },
      },
    }
  );

  const deleteStorageGroupMutation = client.useMutation(
    "delete",
    "/storage-groups/{id}"
  );

  const handleDelete = () => {
    deleteStorageGroupMutation.mutate(
      { params: { path: { id: id } } },
      {
        onSuccess: () => {
          toast.success("Группа хранения удалена");
          router.push("/storage");
        },
        onError: (error) => {
          toast.error("Ошибка при удалении группы хранения", {
            description: error.error.message,
          });
        },
      }
    );
  };

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
          <DeleteDialog
            firstText={`Вы действительно желаете удалить группу хранения ${storageGroup?.data.name}?`}
            buttonLabel="Удалить группу хранения"
            onDelete={handleDelete}
          />,
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
        <BlockTextElement
          label="Обозначение"
          value={storageGroup?.data.alias}
        />
      </Block>
      <InstancesView storageGroupId={id} />
      <HistoryTable
        objectType={ObjectType.StorageGroup}
        objectId={id as string}
      />
    </BlockedPage>
  );
}
