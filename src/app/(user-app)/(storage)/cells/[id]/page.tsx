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
