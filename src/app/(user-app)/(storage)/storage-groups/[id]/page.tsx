"use client";
import {
  Block,
  BlockedPage,
  BlockTextElement,
} from "@/components/common-page/block";
import { useParams } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useQueryClient } from "@tanstack/react-query";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function StorageGroupPage() {
  const { id } = useParams();

  const client = useApiQueryClient();
  const globalClient = useQueryClient();
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
            label: "Хранение",
            href: "/storage",
          },
          {
            label: "Группы хранения",
          },
          {
            label: storageGroup?.data.name ?? "Группа хранения",
          },
        ]}
        actions={[
          <Button asChild>
            <Link href={`/storage-groups/${id}/edit`}>
              <Pencil />
              Редактировать
            </Link>
          </Button>,
        ]}
      />
      <Block title="Основная информация" isLoading={isPending}>
        <BlockTextElement label="Название" value={storageGroup?.data.name} />
        <BlockTextElement label="Алиас" value={storageGroup?.data.alias} />
      </Block>
    </BlockedPage>
  );
}
