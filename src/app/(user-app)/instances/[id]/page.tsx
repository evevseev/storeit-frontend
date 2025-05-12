"use client";

import {
  Block,
  BlockedPageRow,
  BlockTextElement,
} from "@/components/common-page/block";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useParams } from "next/navigation";

export default function InstancePage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const { data, isLoading, isError } = client.useQuery(
    "get",
    "/instances/{instanceId}",
    {
      params: {
        path: {
          instanceId: id,
        },
      },
    }
  );
  return (
    <BlockedPageRow>
      <Block title="Информация о Экземлпяре">
        <BlockTextElement label="ID" value={data?.data.id} />
        <BlockTextElement label="Статус" value={data?.data.status} />
        <BlockTextElement label="Товар" value={data?.data.item.name} />
        <BlockTextElement label="Вариант" value={data?.data.variant.name} />
        <BlockTextElement label="Ячейка" value={data?.data.cell.alias} />
      </Block>
    </BlockedPageRow>
  );
}
