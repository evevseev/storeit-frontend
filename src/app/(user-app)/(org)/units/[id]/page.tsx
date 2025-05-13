"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import {
  BlockedPage,
  BlockTextElement,
  Block,
} from "@/components/common-page/block";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import { Pencil } from "lucide-react";
import InstancesView from "@/components/common-page/instances-view";
import PrintButton from "@/components/print-button";
import { getUnitLabel } from "@/hooks/use-print-labels";
import { DeleteDialog } from "@/components/dialogs/deletion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function UnitPage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const router = useRouter();

  const { data, isPending, isError } = client.useQuery("get", "/units/{id}", {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const deleteUnitMutation = client.useMutation("delete", "/units/{id}");

  const handleDelete = () => {
    deleteUnitMutation.mutate(
      {
        params: {
          path: { id: id as string },
        },
      },
      {
        onSuccess: () => {
          toast.success("Подразделение удалено");
          globalClient.invalidateQueries({ queryKey: ["get", "/units"] });
          router.push("/units");
        },
        onError: (error) => {
          toast.error("Ошибка при удалении подразделения", {
            description: error.error.message,
          });
        },
      }
    );
  };

  if (isError) {
    return <div>Ошибка при загрузке подразделения</div>;
  }

  return (
    <BlockedPage>
      <PageMetadata
        title={data?.data.name ?? "Подразделение"}
        breadcrumbs={[
          { label: "Подразделения", href: "/units" },
          {
            label: data?.data.name ?? "Подразделение",
            href: `/units/${data?.data.id}`,
          },
        ]}
        actions={[
          <DeleteDialog
            firstText={`Вы действительно желаете удалить подразделение ${data?.data.name}?`}
            buttonLabel="Удалить подразделение"
            onDelete={handleDelete}
          />,
          <PrintButton
            label={getUnitLabel({
              id: data?.data.id ?? "",
              name: data?.data.name ?? "",
              alias: data?.data.alias ?? "",
              address: data?.data.address ?? "",
            })}
          />,
          <Button asChild>
            <Link href={`/units/${data?.data.id}/edit`}>
              <Pencil />
              Редактировать
            </Link>
          </Button>,
        ]}
      />
      <Block title="Информация о подразделении" isLoading={isPending}>
        <BlockTextElement label="ID" value={data?.data.id} copyable />
        <BlockTextElement label="Название" value={data?.data.name} />
        <BlockTextElement label="Аббревиатура" value={data?.data.alias} />
        <BlockTextElement label="Адрес" value={data?.data.address ?? ""} />
      </Block>
      <InstancesView unitId={id} />
      <HistoryTable
        objectType={ObjectType.Unit}
        objectId={data?.data.id ?? ""}
      />
    </BlockedPage>
  );
}
