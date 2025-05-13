"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import {
  BlockedPage,
  BlockTextElement,
  Block,
} from "@/components/common-page/block";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import { Pencil } from "lucide-react";

export default function UnitPage() {
  const { id } = useParams();
  const client = useApiQueryClient();
  const { data, isPending, isError } = client.useQuery("get", "/units/{id}", {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <BlockedPage>
      <PageMetadata
        title={data.data.name ?? "Подразделение"}
        breadcrumbs={[
          { label: "Подразделения", href: "/units" },
          { label: data.data.name ?? "Подразделение", href: `/units/${data.data.id}` },
        ]}
        actions={[
          <Button asChild>
            <Link href={`/units/${data.data.id}/edit`}>
              <Pencil />
              Редактировать
            </Link>
          </Button>,
        ]}
      />
      <Block title="Информация о подразделении">
        <BlockTextElement label="Название" value={data.data.name} />
        <BlockTextElement label="Аббревиатура" value={data.data.alias} />
        <BlockTextElement label="Адрес" value={data.data.address ?? ""} />
      </Block>
        <HistoryTable objectType={ObjectType.Unit} objectId={data.data.id} />
А    </BlockedPage>
  );
}
