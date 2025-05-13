"use client";

import {
  Block,
  BlockedPage,
  BlockedPageRow,
  BlockRow,
  BlockTextElement,
} from "@/components/common-page/block";
import { useParams } from "next/navigation";
import InstancesView from "@/components/common-page/instances-view";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { PageMetadata } from "@/components/header/page-metadata";
import { useQueryClient } from "@tanstack/react-query";
import { ObjectType } from "@/components/common-page/history-table/types";
import { HistoryTable } from "@/components/common-page/history-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { PrintLabelButton } from "@/components/warehouse-structure/print-label-button";
import { getCellLabel } from "@/hooks/use-print-labels";
import PrintButton from "@/components/print-button";
import { DeleteDialog } from "@/components/dialogs/deletion";
import { toast } from "sonner";

export default function CellPage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { data } = client.useQuery("get", "/cells/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  const { mutate: deleteCell } = client.useMutation("delete", "/cells/{id}");

  return (
    <BlockedPage>
      <PageMetadata
        title={`Ячейка ${data?.data.alias}`}
        breadcrumbs={[
          {
            label: "Хранилище",
            href: "/storage",
          },
          {
            label: "Ячейки",
            // href: "/storage/cells",
          },
          {
            label: data?.data.alias ?? "...",
          },
        ]}
        actions={[
          <DeleteDialog
            buttonLabel="Удалить ячейку"
            firstText="Вы действительно желаете удалить ячейку?"
            onDelete={() => {
              deleteCell(
                {
                  params: { path: { id } },
                },
                {
                  onSuccess: () => {
                    globalClient.invalidateQueries({
                      queryKey: ["get", "/cells/{id}"],
                    });
                    toast.success("Ячейка удалена");
                  },
                  onError: (err) => {
                    toast.error("Ошибка при удалении ячейки", {
                      description: err.error.message,
                    });
                  },
                }
              );
            }}
          />,
          <PrintButton
            label={getCellLabel({
              id: data?.data.id ?? "",
              alias: data?.data.alias ?? "",
              row: data?.data.row ?? 0,
              level: data?.data.level ?? 0,
              position: data?.data.position ?? 0,
            })}
          />,
          <Button asChild>
            <Link href={`/cells-groups/${data?.data.cellsGroupId}`}>
              <Pencil />
              Редактировать в группе
            </Link>
          </Button>,
        ]}
      />
      <Block title="Информация о ячейке">
        <BlockTextElement label="ID" value={data?.data.id} copyable />
        <BlockTextElement
          label="Группа ячеек"
          value={data?.data.cellsGroupId}
          copyable
        />
        <BlockTextElement label="Название" value={data?.data.alias} />
        <BlockRow>
          <BlockTextElement label="Ряд" value={data?.data.row} />
          <BlockTextElement label="Уровень" value={data?.data.level} />
          <BlockTextElement label="Позиция" value={data?.data.position} />
        </BlockRow>
      </Block>
      <InstancesView expanded cellId={id} />
      <HistoryTable objectType={ObjectType.Cell} objectId={id} />
    </BlockedPage>
  );
}
